import { Form, Formik } from "formik";
import ModalWrapper from "./ModalWrapper";
import * as Yup from "yup";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ILoginInitialValues } from "./LoginForm";
import { registerInFirebase } from "../../firebase/firebaseService";
import { useModalStore } from "../../store/modalStore";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import MyTextField from "./formElements/MyTextField";

export interface IRegisterInitialValues extends ILoginInitialValues {
  displayName: string;
}

const initialValues: IRegisterInitialValues = {
  displayName: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  displayName: Yup.string().required("Please enter name"),
  email: Yup.string().required("Please enter email").email(),
  password: Yup.string().required("Please enter password"),
});

function RegisterForm() {
  const closeModal = useModalStore((state) => state.closeModal);
  const signIn = useAuthStore((state) => state.signIn);

  return (
    <ModalWrapper header="Sign up">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const payload = await registerInFirebase(values);
            closeModal();
            signIn(payload.user);
            toast.success(`You are signed up and logged in ${values.email}`);
          } catch (error: any) {
            setErrors({ auth: error.message });
          } finally {
            setSubmitting(false);
          }
        }}
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
              <MyTextField name="displayName" label="Name" {...basicProps} />
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
                Register
              </LoadingButton>
            </Form>
          );
        }}
      </Formik>
    </ModalWrapper>
  );
}

export default RegisterForm;
