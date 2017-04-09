import { database } from './firebase';
import { get, set } from './storage';

// DB Refs
export const playersDb = database().ref('players');

export const playersDbByCustom = custom => database().ref(`players${custom}`);

// DB CRUD
export const findPlayerByDisplayNameOnce = async displayName => playersDbByCustom(`/${displayName}`).once('value');

export const findPlayerByUidOnce = async uid => playersDb.orderByChild('uid').equalTo(uid).once('value');

export const createPlayer = (uid, displayName) => {
  if (!uid) {
    throw new Error('uid not provided!');
  }
  if (!displayName) {
    throw new Error('displayName not provided!');
  }

  return playersDbByCustom(`/${displayName}`).set({
    uid,
    displayName
  }, err => {
    if (err) {
      throw new Error(err);
    }
  });
};

export const listPlayerChallengesOnce = displayName => {
  if (!displayName) {
    throw new Error('displayName not provided!');
  }

  // TODO: paginate this!
  return playersDbByCustom(`/${displayName}/challenges`).once('value');
};

export const updatePlayer = (ref, body) => {
  if (!ref) {
    throw new Error('ref not provided!');
  }
  if (!body) {
    throw new Error('body not provided!');
  }

  return playersDbByCustom(`/${ref}`).update(body, err => {
    if (err) {
      throw new Error(err);
    }
  });
};

// Local Storage
export const getPlayer = () => get('player');

export const setPlayer = player => set('player', player);
