import { MenuItem, TextField, Tooltip } from "@mui/material";

function FormField({
  name,
  label,
  options,
  value,
  error,
  touched,
  disabled,
  formEdits,
  handleChange,
  handleBlur,
  handleFocus,
  type = "text",
}: any) {
  return (
    <Tooltip
      title={formEdits[name] ? `${formEdits[name].displayName} editing` : null}
      placement="left"
      open={disabled && formEdits[name]}
      // arrow
      disableHoverListener
    >
      {type === "select" ? (
        <TextField
          fullWidth
          select
          id={name}
          name={name}
          label={label}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          value={value}
          disabled={disabled}
          error={touched && !!error}
          helperText={touched && error}
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
      ) : (
        <TextField
          fullWidth
          type={type}
          id={name}
          name={name}
          label={label}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          disabled={disabled}
          error={touched && !!error}
          helperText={touched && error}
        />
      )}
    </Tooltip>
  );
}

export default FormField;
