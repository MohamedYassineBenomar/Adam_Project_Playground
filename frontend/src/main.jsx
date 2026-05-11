// Punt d'entrada de l'aplicació React. Munta el component App al div #root.
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
