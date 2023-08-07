import { Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useModalStore } from "../../store/modalStore";

interface IModalWrapperProps {
  children: JSX.Element | JSX.Element[];
  header: string;
  open?: boolean;
}

function ModalWrapper({ children, header, open = true }: IModalWrapperProps) {
  const closeModal = useModalStore((state) => state.closeModal);
  return (
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <Box className="modal">
        {header && (
          <Typography
            className="modal-header"
            id="modal-title"
            variant="h6"
            component="h2"
          >
            {header}
          </Typography>
        )}
        <Box id="modal-description">{children}</Box>
      </Box>
    </Modal>
  );
}

export default ModalWrapper;
