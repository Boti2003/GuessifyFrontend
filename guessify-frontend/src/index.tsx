import { render } from "preact";

import preactLogo from "./assets/preact.svg";
import "./style.css";
import { MainPage } from "./pages/MainPage";
import { useEffect } from "preact/hooks";
import { hubService } from "./services/HubService";

export function App() {
   return <MainPage />;
}

render(<App />, document.getElementById("app"));
