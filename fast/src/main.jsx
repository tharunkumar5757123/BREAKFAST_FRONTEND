import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";


ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <CartProvider>
        <App/>
      </CartProvider>
    </BrowserRouter>
);
