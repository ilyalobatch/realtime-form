import * as Yup from "yup";
import dayjs from "dayjs";

interface IInitialObject {
  [key: string]: any;
}

export const generateValidationSchema = (fields: any) => {
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

export const generateInitialValues: any = (fields: any) => {
  const values: IInitialObject = {};
  fields.forEach(({ name, type }: any) => {
    if (type === "date") {
      values[name] = dayjs().format("MM-DD-YYYY");
    } else {
      values[name] = "";
    }
  });

  return values;
};

export const generateInitialFormEdits: any = (fields: any) => {
  const edits: IInitialObject = {};
  fields.forEach(({ name }: any) => {
    edits[name] = "";
  });

  return edits;
};
