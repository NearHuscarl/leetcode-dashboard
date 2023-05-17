import React from "react";
import ReactDOM from "react-dom/client";
import App from "app/App.tsx";
import { ThemeProvider } from "app/provider/ThemeProvider.tsx";
import { QueryProvider } from "app/provider/QueryProvider";
import { StoreProvider } from "app/provider/StoreProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  </React.StrictMode>
);
