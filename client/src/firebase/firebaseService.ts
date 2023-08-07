import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ref, push, query, orderByKey, remove } from "@firebase/database";
import { ILoginInitialValues } from "../components/modals/LoginForm";
import { auth, database } from "./firebaseConfig";
import dayjs from "dayjs";
import { IRegisterInitialValues } from "../components/modals/RegisterForm";

export const firebaseObjectToArray = (snapshot: any) => {
  if (snapshot) {
    return Object.entries(snapshot).map((element) =>
      Object.assign({}, element[1], { id: element[0] })
    );
  }
};

export async function signInWithEmail(credentials: ILoginInitialValues) {
  return await signInWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password
  );
}

export async function registerInFirebase(credentials: IRegisterInitialValues) {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );

    await updateProfile(result.user, {
      displayName: credentials.displayName,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

export function signOutFirebase() {
  return signOut(auth);
}

export function addSubmittedInfoToFirebase(values: any) {
  const user = auth.currentUser;
  const newSubmitInfo = {
    ...values,
    createdByUser: user?.displayName,
    createdByUserId: user?.uid,
    createdAt: dayjs().format("DD/MM/YYYY, HH:mm"),
  };

  return push(ref(database, `submitInfo`), newSubmitInfo);
}

export function getSubmittedInfoRef() {
  return query(ref(database, `submitInfo`), orderByKey());
}

export async function deleteSubmittedInfo(candidateId: string) {
  try {
    remove(ref(database, `submitInfo/${candidateId}`));
  } catch (error) {
    throw error;
  }
}
