import { render } from "preact";

import "./style.css";
import { MainPage } from "./pages/MainPage";
import { useEffect } from "preact/hooks";
import { hubService } from "./services/HubService";

export function App() {
   useEffect(() => {
      const initApp = async () => {
         try {
            await hubService.initializeConnections();
         } catch (error) {
            console.error("Error initializing hub connections:", error);
         }
      };
      initApp();
   }, []);
   return <MainPage />;
}

render(<App />, document.getElementById("app"));
