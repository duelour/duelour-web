import { auth } from './firebase';

export const signIn = (email, password) => auth().signInWithEmailAndPassword(email, password);
export const signOut = () => auth().signOut();
export const createUser = (email, password) => auth().createUserWithEmailAndPassword(email, password);
