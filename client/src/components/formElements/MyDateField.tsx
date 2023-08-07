import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function MyDateField(props: any) {
  const { name, label, values, errors, touched, setFieldValue } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        value={values[name]}
        onChange={(value) => setFieldValue(name, value)}
        slotProps={{
          textField: {
            fullWidth: true,
            name: name,
            id: name,
            error: touched[name] && Boolean(errors[name]),
            helperText: !!touched[name] && <>{errors[name]}</>,
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default MyDateField;
