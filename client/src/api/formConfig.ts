import { positions } from "./positions";

export const contactForm = {
  title: "Contact Form",

  fields: [
    {
      name: "firstName",
      label: "First name",
    },
    {
      name: "lastName",
      label: "Last name",
    },
    {
      name: "position",
      type: "select",
      label: "Position",
      options: positions,
    },
    {
      name: "age",
      type: "number",
      label: "Age",
    },
    {
      name: "email",
      type: "email",
      label: "E-mail",
    },
    {
      name: "password",
      type: "password",
      label: "Password",
    },
    {
      name: "dateInput",
      type: "date",
      label: "Date input",
    },
  ],
};
