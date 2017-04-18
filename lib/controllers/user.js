import { normalizeFbObject } from '../data/firebase';
import { signIn, createUser } from '../data/user';
import { createPlayer, findPlayerByUidOnce } from '../data/players';

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
