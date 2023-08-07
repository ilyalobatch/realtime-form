import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useAuthStore } from "../../store/authStore";
import SignInMenu from "./menu/SignInMenu";
import SignOutMenu from "./menu/SignOutMenu";

function Navbar() {
  const authenticated = useAuthStore((state) => state.authenticated);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Collaborative Form
          </Typography>
          {authenticated ? <SignInMenu /> : <SignOutMenu />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
