import { createRoot } from "react-dom/client";
import SolarSystem from "../app/SolarSystem";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Orbitder Lab root element was not found.");
}

createRoot(root).render(<SolarSystem />);
