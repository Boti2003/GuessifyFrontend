import { useState } from "preact/hooks";
import { ApplicationMode } from "../enums/application_mode.enum";
import { ApplicationPage } from "../enums/application_page.enum";
import { hubService } from "../services/HubService";
import { lobbyService } from "../services/LobbyService";
import { useApplicationState } from "../hooks/useApplicationState";
import { applicationStateService } from "../services/ApplicationStateService";
import { UserMode } from "../enums/user_mode.enum";
import { GameMode } from "../enums/game_mode.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { BackButton } from "../components/BackButton";

/*export type CreateLobbyPageProps = {
   setPage: (window: ApplicationPage) => void;
   setApplicationMode: (mode: ApplicationMode) => void;
};*/

export function CreateLobbyPage() {
   const [lobbyName, setLobbyName] = useState<string>("");
   const [capacity, setCapacity] = useState<number>(4);
   const [roundCount, setRoundCount] = useState<number>(5);
   const [gameMode, setGameMode] = useState<GameMode>(GameMode.LOCAL);
   return (
      <div className="md:border-5 md:border-double md:rounded-xl p-5 grid grid-cols-1 gap-4 bg-base-200">
         <BackButton targetPage={ApplicationPage.MAIN_PAGE} />
         <h1 className="text-3xl md:text-4xl font-bold">
            Create a new lobby for game!
         </h1>

         <h3 className="text-lg md:text-xl md:place-self-start font-semibold">
            Lobby name:
         </h3>
         <input
            className="md:place-self-end input input-secondary"
            value={lobbyName}
            onChange={(e) => setLobbyName(e.currentTarget.value)}
         />
         <h3 className="text-lg md:text-xl md:place-self-start font-semibold">
            Capacity:
         </h3>
         <input
            className="input input-secondary md:place-self-end"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.currentTarget.value))}
         />
         <h3 className="text-lg md:text-xl md:place-self-start font-semibold">
            Rounds in game:
         </h3>
         <select
            className="select select-primary md:place-self-end"
            value={roundCount}
            onChange={(e) => setRoundCount(parseInt(e.currentTarget.value))}
         >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
            <option value={9}>9</option>
         </select>
         <h3 className="text-lg md:text-xl md:place-self-start font-semibold">
            Game mode:
         </h3>
         <div className="md:place-self-center">
            <div>
               <input
                  className="radio radio-sm radio-neutral"
                  type="radio"
                  id="local"
                  value={GameMode.LOCAL}
                  checked={gameMode === GameMode.LOCAL}
                  onChange={(e) =>
                     setGameMode(e.currentTarget.value as GameMode)
                  }
               />
               <label for="local">Local</label>
            </div>

            <div>
               <input
                  className="radio radio-sm radio-neutral"
                  type="radio"
                  id="remote"
                  name="remote"
                  value={GameMode.REMOTE}
                  checked={gameMode === GameMode.REMOTE}
                  onChange={(e) =>
                     setGameMode(e.currentTarget.value as GameMode)
                  }
               />
               <label for="remote">Remote</label>
            </div>
         </div>

         <button
            className="btn btn-accent "
            disabled={lobbyName === ""}
            onClick={(e) => {
               lobbyService.createLobby(
                  lobbyName,
                  capacity,
                  gameMode,
                  roundCount
               );
            }}
         >
            Create
         </button>
      </div>
   );
}
