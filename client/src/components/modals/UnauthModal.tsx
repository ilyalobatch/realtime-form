import { ButtonGroup, Button, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { useModalStore } from "../../store/modalStore";
import ModalWrapper from "./ModalWrapper";

interface IUnauthModalProps {
  setUnauthOpenModal: Dispatch<SetStateAction<boolean>>;
}

function UnauthModal({ setUnauthOpenModal }: IUnauthModalProps) {
  const openModal = useModalStore((state) => state.openModal);
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    setUnauthOpenModal(false);
  };

  const handleOpenLoginModal = (modalType: string) => {
    openModal(modalType);
    setOpen(false);
    setUnauthOpenModal(false);
  };

  return (
    <ModalWrapper header="You need to be signed in!" open={open}>
      <div className="modal-wrapper" style={{ marginTop: "15px" }}>
        <Typography>Please either login or register to use the form</Typography>

        <ButtonGroup className="modal-button-group">
          <Button
            onClick={() => handleOpenLoginModal("LoginForm")}
            color="success"
            variant="contained"
          >
            Login
          </Button>
          <Button
            onClick={() => handleOpenLoginModal("RegisterForm")}
            color="primary"
            variant="contained"
          >
            Register
          </Button>
        </ButtonGroup>

        <Typography
          sx={{
            width: "100%",
            paddingTop: "20px",
            borderTop: "1px solid #000",
          }}
        >
          Or click cancel to close this window
        </Typography>
        <Button onClick={handleClose} color="error" variant="contained">
          Cancel
        </Button>
      </div>
    </ModalWrapper>
  );
}

export default UnauthModal;
