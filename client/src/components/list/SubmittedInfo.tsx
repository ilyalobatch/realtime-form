import { List, ListItem, ListItemText } from "@mui/material";
import ModalWrapper from "../modals/ModalWrapper";

export interface ILoginInitialValues {
  email: string;
  password: string;
  auth?: string;
}

function SubmittedInfo({ item }: any) {
  const unnecessaryData = [
    "createdAt",
    "createdByUser",
    "createdByUserId",
    "id",
  ];

  return (
    <ModalWrapper header="Submitted Info">
      <List>
        {Object.keys(item)
          .filter((data) => !unnecessaryData.includes(data))
          .map((info) => {
            return (
              <ListItem>
                <ListItemText
                  primary={`${info}: `}
                  primaryTypographyProps={{
                    display: "inline",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                  secondary={`${item[info]}`}
                  secondaryTypographyProps={{
                    display: "inline",
                    color: "000",
                    fontSize: "16px",
                  }}
                />
              </ListItem>
            );
          })}
      </List>
    </ModalWrapper>
  );
}

export default SubmittedInfo;
