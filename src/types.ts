export type SheetRow = Record<string, string>;

export type ArchiveRow = SheetRow & {
  ID_archive?: string;
  Nom_fichier?: string;
  Lien_Drive?: string;
  Date_document?: string;
  Type_document?: string;
  Transcription_brute?: string;
  Transcription_corrigee?: string;
  Resume?: string;
  Personnes?: string;
  Lieux?: string;
  Organisations?: string;
  Themes_mots_cles?: string;
  Evenement?: string;
  Niveau_confiance?: string;
  Passages_incertains?: string;
  A_verifier?: string;
};

export type ChronologyRow = SheetRow & {
  Ordre?: string;
  Date_ou_periode?: string;
  Evenement?: string;
  Lieu?: string;
  Source_image?: string;
  Confiance?: string;
  A_verifier?: string;
  Commentaire?: string;
};

export type VerificationRow = SheetRow & {
  ID?: string;
  Point_a_verifier?: string;
  Hypotheses?: string;
  Sources_images?: string;
  Priorite?: string;
  Methode_de_verification?: string;
  Statut?: string;
  Commentaire?: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
