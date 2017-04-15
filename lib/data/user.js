import { auth } from "./firebase";
import { get, set } from "./storage";

// DB Auth
export const signIn = (email, password) =>
  auth().signInWithEmailAndPassword(email, password);

export const signOut = () => auth().signOut();

export const createUser = (email, password) =>
  auth().createUserWithEmailAndPassword(email, password);

// Local Storage
export const getUserInStorage = () => get("user");

export const setUserInStorage = user => set("user", user);
