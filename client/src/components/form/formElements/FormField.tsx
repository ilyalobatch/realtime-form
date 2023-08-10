import { MenuItem, TextField, Tooltip } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

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
  setFieldValue,
  formikRef,
  socket,
  type = "text",
}: any) {
  return (
    <Tooltip
      title={formEdits[name] ? `${formEdits[name].displayName} editing` : null}
      placement="left"
      open={disabled && formEdits[name]}
      disableHoverListener
    >
      {(() => {
        switch (type) {
          case "select":
            return (
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
            );

          case "date":
            return (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Tooltip
                  title={
                    formEdits[name]
                      ? `${formEdits[name].displayName} editing`
                      : ""
                  }
                  placement="left"
                  open={disabled && formEdits[name]}
                  disableHoverListener
                >
                  <DesktopDatePicker
                    label={label}
                    value={dayjs(value)}
                    format={"DD-MMM-YYYY"}
                    onOpen={() => handleFocus({ target: { name, value } })}
                    onClose={() => handleBlur({ target: { name, value } })}
                    disabled={disabled}
                    onChange={(value) => {
                      setFieldValue(name, value);

                      formikRef.current?.setValues({
                        ...formikRef.current?.values,
                        [name]: value?.format("MM-DD-YYYY"),
                      });

                      socket.emit("formValues", {
                        ...formikRef.current?.values,
                        [name]: value?.format("MM-DD-YYYY"),
                      });
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        onBlur: handleBlur,
                        onFocus: handleFocus,
                        name,
                        id: name,
                        error: touched && !!error,
                        helperText: touched && !!error,
                      },
                    }}
                  />
                </Tooltip>
              </LocalizationProvider>
            );

          default:
            return (
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
            );
        }
      })()}
    </Tooltip>
  );
}

export default FormField;
