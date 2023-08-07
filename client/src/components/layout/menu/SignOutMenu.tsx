import { Button, ButtonGroup } from "@mui/material";
import { useModalStore } from "../../../store/modalStore";

function SignOutMenu() {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <ButtonGroup>
      <Button onClick={() => openModal("LoginForm")} color="inherit">
        Login
      </Button>
      <Button onClick={() => openModal("RegisterForm")} color="inherit">
        Register
      </Button>
    </ButtonGroup>
  );
}

export default SignOutMenu;
