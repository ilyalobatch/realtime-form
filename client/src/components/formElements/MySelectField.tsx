import { MenuItem, TextField } from "@mui/material";

function MySelectField(props: any) {
  const {
    name,
    label,
    options,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
  } = props;
  return (
    <TextField
      fullWidth
      select
      id={name}
      name={name}
      label={label}
      onChange={handleChange}
      onBlur={handleBlur}
      value={values[name]}
      error={touched[name] && Boolean(errors[name])}
      helperText={touched[name] && errors[name]}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {options.map((option: any) => (
        <MenuItem value={option[name]} key={option[name]}>
          {option[name]}
        </MenuItem>
      ))}
    </TextField>
  );
}

export default MySelectField;
