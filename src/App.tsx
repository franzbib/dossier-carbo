import { NavLink, Route, Routes } from "react-router-dom";
import ArchivesPage from "./pages/ArchivesPage";
import ChatPage from "./pages/ChatPage";
import ChronologyPage from "./pages/ChronologyPage";
import HomePage from "./pages/HomePage";
import MethodPage from "./pages/MethodPage";
import VerificationPage from "./pages/VerificationPage";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/archives", label: "Archives" },
  { to: "/chronologie", label: "Chronologie" },
  { to: "/points-a-verifier", label: "Points à vérifier" },
  { to: "/interroger", label: "Interroger la base" },
  { to: "/methode", label: "Méthode" },
];

export default function App() {
  return (
    <div className="app-shell">
      <div className="notice-bar">
        Base expérimentale — transcriptions à vérifier sur les images originales.
      </div>
      <header className="site-header">
        <NavLink to="/" className="brand">
          Archives Carbonnier-Clément
        </NavLink>
        <nav className="main-nav" aria-label="Navigation principale">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/archives" element={<ArchivesPage />} />
          <Route path="/chronologie" element={<ChronologyPage />} />
          <Route path="/points-a-verifier" element={<VerificationPage />} />
          <Route path="/interroger" element={<ChatPage />} />
          <Route path="/methode" element={<MethodPage />} />
        </Routes>
      </main>
    </div>
  );
}
