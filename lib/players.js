import { database } from './firebase';
import { get, set } from './storage';

// DB Refs
export const playersDb = database().ref('players');
export const playersDbByCustom = custom => database().ref(`players${custom}`);

// DB CRUD
export const findPlayerByDisplayNameOnce = async displayName => playersDbByCustom(`/${displayName}`).once('value');
export const findPlayerByUidOnce = async uid => playersDb.orderByChild('uid').equalTo(uid).once('value');
export const createPlayer = async (uid, displayName) => {
  return playersDbByCustom(`/${displayName}`).set({
    uid,
    displayName
  }, err => {
    throw new Error(err);
  });
};

// Local Storage
export const getPlayer = () => get('player');
export const setPlayer = player => set('player', player);
