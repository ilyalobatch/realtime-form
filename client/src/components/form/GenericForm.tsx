import { Form, Formik } from "formik";
import { Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormField from "./formElements/FormField";
import { toast } from "react-toastify";
import { addSubmittedInfoToFirebase } from "../../firebase/firebaseService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import {
  generateInitialFormEdits,
  generateInitialValues,
  generateValidationSchema,
} from "./helpers/initialData";

function GenericForm({
  formDefinition = { title: "", fields: [] },
  socket,
}: any) {
  const { title, fields } = formDefinition;

  const currentUser = useAuthStore((state) => state.currentUser);
  const formikRef = useRef<any>(null);

  const [formTouched, setFormTouched] = useState<any>({});
  const [formEdits, setFormEdits] = useState<any>(
    generateInitialFormEdits(fields)
  );

  const resetDataForAllUsers = () => {
    socket.emit("formValues", null);
    socket.emit("formEdits", null);
    socket.emit("touchedFields", null);
  };

  const handleFormSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      addSubmittedInfoToFirebase(values);
      resetForm();
      resetDataForAllUsers();
      toast.success("Successfully submitted");
    } catch (error: any) {
      console.log(formikRef.current);
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormReset = () => {
    formikRef.current?.resetForm();
    resetDataForAllUsers();
  };

  const handleFormInputChange = (formikHandler: any) => (event: any) => {
    const {
      target: { name, value },
    } = event;

    socket.emit("formValues", {
      ...formikRef.current?.values,
      [name]: value,
    });

    formikHandler(event);
  };

  const handleUpdateFormEdits = () => {
    const newFormEdits = { ...formEdits };

    Object.keys(newFormEdits).forEach((key: string) => {
      if (newFormEdits[key]?.uid === currentUser?.uid) {
        newFormEdits[key] = "";
      }
    });

    return newFormEdits;
  };

  const handleFormInputFocus = (event: any) => {
    socket.emit("formEdits", {
      ...handleUpdateFormEdits(),
      [event.target.name || event.target?.id]: currentUser,
    });
  };

  const handleFormInputBlur = (formikHandler: any) => (event: any) => {
    socket.emit("formEdits", {
      ...handleUpdateFormEdits(),
      [event.target.name]: "",
    });

    formikHandler(event);
  };

  const isDisabledFieldForCurrentUser = useCallback(
    (name: string): boolean => {
      return formEdits[name] && formEdits[name]?.uid !== currentUser?.uid;
    },
    [formEdits, currentUser]
  );

  useEffect(() => {
    socket.on("listen_to_formValues", (newFormValues: any) => {
      if (!newFormValues) {
        return formikRef.current?.setValues(generateInitialValues(fields));
      }

      return formikRef.current?.setValues({
        ...formikRef.current?.values,
        ...newFormValues,
      });
    });

    socket.on("listen_to_touchedFields", (newFormTouchedFields: any) => {
      if (!newFormTouchedFields) {
        return setFormTouched({});
      }

      return setFormTouched({ ...newFormTouchedFields });
    });

    socket.on("listen_to_formEdits", (newFormEdits: any) => {
      if (!newFormEdits) {
        return setFormEdits(generateInitialFormEdits(fields));
      }

      return setFormEdits({ ...newFormEdits });
    });

    return () => {
      socket.removeAllListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    socket.emit("touchedFields", formikRef.current?.touched);
  }, [formikRef.current?.touched, socket]);

  return (
    fields && (
      <Formik
        innerRef={formikRef}
        initialValues={generateInitialValues(fields)}
        validationSchema={generateValidationSchema(fields)}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          isSubmitting,
          setFieldValue,
        }) => {
          const basicProps = {
            handleChange: handleFormInputChange(handleChange),
            handleBlur: handleFormInputBlur(handleBlur),
            handleFocus: handleFormInputFocus,
            setFieldValue,
          };

          return (
            <Form className="contact-form" autoComplete="off" noValidate>
              <Box>
                <Typography
                  sx={{ fontSize: "30px", fontWeight: "bold" }}
                  variant="h2"
                  align="center"
                >
                  {title}
                </Typography>
              </Box>
              {fields.map(({ name, label, type, options }: any) => (
                <FormField
                  key={name}
                  name={name}
                  label={label}
                  value={values[name]}
                  error={errors[name]}
                  touched={formTouched[name]}
                  type={type}
                  options={options}
                  formEdits={formEdits}
                  formikRef={formikRef}
                  socket={socket}
                  disabled={isDisabledFieldForCurrentUser(name)}
                  {...basicProps}
                />
              ))}
              <Box sx={{ mt: 3, display: "flex", gap: "20px" }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Submit
                </LoadingButton>
                <LoadingButton
                  type="button"
                  variant="contained"
                  color="error"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onClick={() => handleFormReset()}
                >
                  Reset
                </LoadingButton>
              </Box>
            </Form>
          );
        }}
      </Formik>
    )
  );
}

export default GenericForm;
