import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "app/provider/ThemeProvider.tsx";
import { QueryProvider } from "app/provider/QueryProvider";
import { StoreProvider } from "app/provider/StoreProvider";
import { GlobalStyle } from "app/provider/GlobalStyle";
import App from "app/App.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StoreProvider>
      <QueryProvider>
        <ThemeProvider>
          <GlobalStyle />
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryProvider>
    </StoreProvider>
  </React.StrictMode>
);
