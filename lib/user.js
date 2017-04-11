import { auth, normalizeFbObject } from './firebase';
import { createPlayer, findPlayerByUidOnce } from './players';
import { get, set } from './storage';

// DB Auth
export const signIn = (email, password) => auth().signInWithEmailAndPassword(email, password);

export const signOut = () => auth().signOut();

export const createUser = (email, password) => auth().createUserWithEmailAndPassword(email, password);

// Local Storage
export const getUserInStorage = () => get('user');

export const setUserInStorage = user => set('user', user);

// Flows
export const signInPlayer = async (email, password) => {
  const user = await signIn(email, password);
  const player = await findPlayerByUidOnce(user.uid);
  const normalizedPlayer = normalizeFbObject(player.val());
  return normalizedPlayer;
};

export const registerPlayer = async (email, password, displayName) => {
  // Create a user and player
  const user = await createUser(email, password);
  await createPlayer(user.uid, displayName);

  // Get the player details
  const player = await findPlayerByUidOnce(user.uid);
  const normalizedPlayer = normalizeFbObject(player.val());
  return normalizedPlayer;
};
