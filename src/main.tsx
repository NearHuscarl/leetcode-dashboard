import React from "react";
import ReactDOM from "react-dom/client";
import App from "app/App.tsx";
import { ThemeProvider } from "app/provider/ThemeProvider.tsx";
import { QueryProvider } from "app/provider/QueryProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
);
