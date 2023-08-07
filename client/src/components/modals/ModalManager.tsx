import { useModalStore } from "../../store/modalStore";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import SubmittedInfo from "../list/SubmittedInfo";

function ModalManager() {
  const modalLookup: any = {
    LoginForm,
    RegisterForm,
    SubmittedInfo,
  };
  const modalType = useModalStore((state) => state.modalType);
  const modalProps = useModalStore((state) => state.modalProps);
  let renderedModal = null;

  if (modalType) {
    const ModalComponent = modalLookup[modalType];
    renderedModal = <ModalComponent {...modalProps} />;
  }

  return <span>{renderedModal}</span>;
}

export default ModalManager;
