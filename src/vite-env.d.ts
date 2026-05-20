/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RESERVATIONS_SHEET_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
