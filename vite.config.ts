import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function createDevResponse(res: ServerResponse) {
  return {
    status(code: number) {
      res.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(payload));
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "local-vercel-api",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== "/api/chat") {
            next();
            return;
          }

          const { default: handler } = await import("./api/chat");
          const body = await readBody(req);
          await handler(
            Object.assign(req, { body, query: {}, cookies: {} }) as never,
            createDevResponse(res) as never,
          );
        });
      },
    },
  ],
});
