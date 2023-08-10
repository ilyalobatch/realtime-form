const positions = require("./options/positions");
const nationalities = require("./options/nationalities");

const contactForm = {
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
      name: "nationality",
      type: "select",
      label: "Nationality",
      options: nationalities,
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

module.exports = contactForm;
