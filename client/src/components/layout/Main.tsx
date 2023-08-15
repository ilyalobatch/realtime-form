import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SubmittedInfoList from "../list/SubmittedInfoList";
import GenericForm from "../form/GenericForm";
import { useAuthStore } from "../../store/authStore";

function Main({ socket }: any) {
  const authenticated = useAuthStore((state) => state.authenticated);
  const [formConfig, setFormConfig] = useState();

  useEffect(() => {
    socket.on("formConfig", (config: any) => {
      setFormConfig(config);
    });
    console.log(formConfig);
  }, [socket, formConfig]);

  return (
    <>
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
            <GenericForm formDefinition={formConfig} socket={socket} />
          )}
        </Container>
      </div>
    </>
  );
}

export default Main;
