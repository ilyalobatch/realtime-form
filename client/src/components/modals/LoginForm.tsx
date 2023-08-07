import { Form, Formik } from "formik";
import ModalWrapper from "./ModalWrapper";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useModalStore } from "../../store/modalStore";
import { signInWithEmail } from "../../firebase/firebaseService";
import { toast } from "react-toastify";
import MyTextField from "../formElements/MyTextField";

export interface ILoginInitialValues {
  email: string;
  password: string;
  auth?: string;
}

const initialValues: ILoginInitialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().required("Please enter email").email(),
  password: Yup.string().required("Please enter password"),
});

function LoginForm() {
  const closeModal = useModalStore((state) => state.closeModal);

  const handleSubmit = async (
    values: ILoginInitialValues,
    { setSubmitting, setErrors }: any
  ) => {
    try {
      await signInWithEmail(values);
      closeModal();
      toast.success(`You are logged in ${values.email}`);
    } catch (error: any) {
      setErrors({ auth: "Incorrect email or password" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper header="Sign in">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            isValid,
            dirty,
          } = formik;

          const basicProps = {
            handleChange,
            handleBlur,
            values,
            errors,
            touched,
          };

          return (
            <Form className="modal-form" autoComplete="off">
              <MyTextField name="email" label="Email" {...basicProps} />
              <MyTextField
                type="password"
                name="password"
                label="Password"
                {...basicProps}
              />
              {errors.auth && (
                <Typography sx={{ color: "red" }}>{errors.auth}</Typography>
              )}
              <LoadingButton
                disabled={isSubmitting || !isValid || !dirty}
                loading={isSubmitting}
                type="submit"
                color="primary"
                variant="contained"
                size="large"
              >
                Login
              </LoadingButton>
            </Form>
          );
        }}
      </Formik>
    </ModalWrapper>
  );
}

export default LoginForm;
