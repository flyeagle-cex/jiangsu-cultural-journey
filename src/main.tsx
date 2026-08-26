import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "@/App";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserSavedStateProvider } from "@/context/UserSavedStateContext";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <UserSavedStateProvider>
          <App />
        </UserSavedStateProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
