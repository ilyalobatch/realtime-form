import { TextField } from "@mui/material";

function MyTextField(props: any) {
  const {
    name,
    label,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    type = "text",
  } = props;
  return (
    <TextField
      fullWidth
      type={type}
      id={name}
      name={name}
      label={label}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values[name]}
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
    />
  );
}

export default MyTextField;
