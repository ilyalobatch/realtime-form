import { Form, Formik } from "formik";
import { Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import FormField from "./formElements/FormField";
import { toast } from "react-toastify";
import { addSubmittedInfoToFirebase } from "../../firebase/firebaseService";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store/authStore";

interface IInitialObject {
  [key: string]: any;
}

function GenericForm({ formDefinition, socket }: any) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const formikRef = useRef<any>(null);
  const { title, fields } = formDefinition;

  const generateInitialValues: any = () => {
    const values: IInitialObject = {};
    fields.forEach(({ name }: any) => {
      values[name] = "";
    });

    return values;
  };

  const [formEdits, setFormEdits] = useState<any>(generateInitialValues());

  const generateValidationSchema = () => {
    const schema: IInitialObject = {};
    fields.forEach(({ name, label, type }: any) => {
      const basicTextValidation = Yup.string().required(
        `Please provide ${label}`
      );
      const basicSelectValidation = Yup.mixed().required(
        `Please provide ${label}`
      );
      const basicNumberValidation = Yup.number()
        .min(1)
        .required(`Please provide ${label}`);

      if (type === "email") {
        schema[name] = basicTextValidation.email();
      } else if (type === "number") {
        schema[name] = basicNumberValidation;
      } else if (type === "select") {
        schema[name] = basicSelectValidation;
      } else {
        schema[name] = basicTextValidation;
      }
    });

    return Yup.object().shape({ ...schema });
  };

  const handleFormSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      addSubmittedInfoToFirebase(values);
      resetForm();
      socket.emit("formEdits", null);
      socket.emit("formValues", null);
      socket.emit("touchedFields", null);
      toast.success("Successfully submitted");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormReset = () => {
    formikRef.current?.resetForm();

    socket.emit("touchedFields", null);
    socket.emit("formEdits", null);
    socket.emit("formValues", null);
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
    (name: string) => {
      return formEdits[name] && formEdits[name]?.uid !== currentUser?.uid;
    },
    [formEdits, currentUser]
  );

  useEffect(() => {
    socket.on("listen_to_formValues", (newFormValues: any) => {
      if (!newFormValues) {
        return formikRef.current?.setValues(generateInitialValues());
      }

      return formikRef.current?.setValues({
        ...formikRef.current?.values,
        ...newFormValues,
      });
    });

    socket.on("listen_to_touchedFields", (newFormTouchedFields: any) => {
      if (!newFormTouchedFields) {
        return formikRef.current?.setTouched({});
      }

      return formikRef.current?.setTouched({
        ...formikRef.current?.touched,
        ...newFormTouchedFields,
      });
    });

    socket.on("listen_to_formEdits", (newFormEdits: any) => {
      if (!newFormEdits) {
        return setFormEdits(generateInitialValues());
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
        initialValues={generateInitialValues()}
        validationSchema={generateValidationSchema()}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => {
          const basicProps = {
            handleChange: handleFormInputChange(handleChange),
            handleBlur: handleFormInputBlur(handleBlur),
            handleFocus: handleFormInputFocus,
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
                  touched={touched[name]}
                  type={type}
                  options={options}
                  formEdits={formEdits}
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
