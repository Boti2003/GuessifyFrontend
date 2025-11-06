import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApplicationPage } from "../enums/application_page.enum";
import { applicationStateService } from "../services/ApplicationStateService";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type BackButtonComponentProps = {
   targetPage: ApplicationPage;
};

export function BackButton({ targetPage }: BackButtonComponentProps) {
   return (
      <button
         className="scale-125 md:place-self-start btn btn-ghost btn-circle"
         onClick={(e) => applicationStateService.setApplicationPage(targetPage)}
      >
         <FontAwesomeIcon icon={faArrowLeft} />
      </button>
   );
}
