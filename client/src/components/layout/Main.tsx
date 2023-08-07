import { Container, Typography } from "@mui/material";
import { useState } from "react";
import UnauthModal from "../modals/UnauthModal";
import SubmittedInfoList from "../list/SubmittedInfoList";
import GenericForm from "../contactForm/GenericForm";
import { contactForm } from "../../api/formConfig";
import { useAuthStore } from "../../store/authStore";

function Main({ socket }: any) {
  const authenticated = useAuthStore((state) => state.authenticated);
  const [openUnauthModal, setUnauthOpenModal] = useState(false);

  return (
    <>
      {openUnauthModal && (
        <UnauthModal setUnauthOpenModal={setUnauthOpenModal} />
      )}
      <div style={{ display: "flex" }}>
        <SubmittedInfoList />
        <Container
          sx={{
            marginLeft: "0 auto",
            marginRight: "0 auto",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          {!authenticated ? (
            <Typography sx={{ textAlign: "center", color: "#fff" }}>
              Please Sign in or Register to use the form
            </Typography>
          ) : (
            <GenericForm formDefinition={contactForm} socket={socket} />
          )}
        </Container>
      </div>
    </>
  );
}

export default Main;
