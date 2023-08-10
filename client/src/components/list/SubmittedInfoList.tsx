import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import DeleteIcon from "@mui/icons-material/Delete";
import { useModalStore } from "../../store/modalStore";
import { useAuthStore } from "../../store/authStore";
import {
  deleteSubmittedInfo,
  firebaseObjectToArray,
  getSubmittedInfoRef,
} from "../../firebase/firebaseService";
import { useEffect } from "react";
import { off, onValue } from "@firebase/database";
import { useSubmittedInfoStore } from "../../store/submittedInfoStore";

const drawerWidth = 350;

function CandidateList() {
  const openModal = useModalStore((state) => state.openModal);
  const submittedInfo = useSubmittedInfoStore((state) => state.submittedInfo);
  const listenToSubmittedInfo = useSubmittedInfoStore(
    (state) => state.listenToSubmittedInfo
  );
  const authenticated = useAuthStore((state) => state.authenticated);
  const currentUser = useAuthStore((state) => state.currentUser);

  useEffect(() => {
    onValue(getSubmittedInfoRef(), (snapshot) => {
      if (!snapshot.exists() || !authenticated) {
        listenToSubmittedInfo(null);

        return;
      }
      listenToSubmittedInfo(firebaseObjectToArray(snapshot.val())?.reverse());
    });
    return () => {
      off(getSubmittedInfoRef());
    };
  }, [listenToSubmittedInfo, authenticated]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        marginTop: "2px",
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          color: "#fff",
          backgroundColor: "#0779CC",
          position: "relative",
          minHeight: "95vh",
        },
      }}
    >
      <Box>
        {!authenticated ? (
          <Typography
            sx={{
              marginTop: "30px",
              textAlign: "center",
              wordWrap: "break-word",
            }}
          >
            In order to see all submissions <br /> Sign in or Register
          </Typography>
        ) : (
          <List>
            <ListItem>
              <ListItemText
                primary="List of submitted data"
                sx={{ textAlign: "center" }}
              />
            </ListItem>
            {submittedInfo?.map((item: any, index: number) => (
              <div key={item.id}>
                <Divider />
                <ListItem
                  key={item.id}
                  sx={{ width: "100%" }}
                  secondaryAction={
                    <>
                      {currentUser?.uid === item.createdByUserId && (
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => deleteSubmittedInfo(item.id)}
                        >
                          <DeleteIcon style={{ color: "#d9d9d9" }} />
                        </IconButton>
                      )}
                    </>
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => openModal("SubmittedInfo", { item })}
                    role={undefined}
                    sx={{ padding: "10px 15px" }}
                    dense
                  >
                    <ListItemIcon>
                      <AccessibilityNewIcon style={{ color: "#d9d9d9" }} />
                    </ListItemIcon>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <Typography
                        variant="h3"
                        className="candidate-list-primary-text"
                      >
                        Data
                      </Typography>
                      <div>
                        <Typography
                          variant="h4"
                          className="candidate-list-secondary-text"
                        >
                          {`created by`} <b>{`${item.createdByUser}`}</b>
                        </Typography>
                        <Typography
                          variant="h4"
                          className="candidate-list-secondary-text"
                        >
                          {`on ${item.createdAt}`}
                        </Typography>
                      </div>
                    </div>
                  </ListItemButton>
                </ListItem>
                {submittedInfo.length - 1 === index && <Divider />}
              </div>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
}

export default CandidateList;
