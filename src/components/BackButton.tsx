import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApplicationPage } from "../enums/application_page.enum";
import { applicationStateService } from "../services/ApplicationStateService";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type BackButtonComponentProps = {
   delegate: (e) => void;
};

export function BackButton({ delegate }: BackButtonComponentProps) {
   return (
      <button
         className="scale-125 md:place-self-start btn btn-ghost btn-circle"
         onClick={delegate}
      >
         <FontAwesomeIcon icon={faArrowLeft} />
      </button>
   );
}
