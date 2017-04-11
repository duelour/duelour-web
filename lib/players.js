import { database } from './firebase';
import { get, set } from './storage';

// DB Refs
export const playersDb = database().ref('players');

export const playersDbByCustom = custom => database().ref(`players${custom}`);

// DB CRUD
export const findPlayerByDisplayNameOnce = async displayName => playersDbByCustom(`/${displayName.toLowerCase()}`).once('value');

export const findPlayerByUidOnce = async uid => playersDb.orderByChild('uid').equalTo(uid).once('value');

export const createPlayer = (uid, displayName) => {
  if (!uid) {
    throw new Error('uid not provided!');
  }
  if (!displayName) {
    throw new Error('displayName not provided!');
  }

  return playersDbByCustom(`/${displayName.toLowerCase()}`).set({
    uid,
    displayName
  }, err => {
    if (err) {
      throw new Error(err);
    }
  });
};

export const listPlayerChallengesByStatus = (displayName, cb, status = 'active', listenStatus = 'on') => {
  if (!displayName) {
    throw new Error('displayName not provided!');
  }

  // TODO: paginate this!
  if (cb) {
    return playersDbByCustom(`/${displayName.toLowerCase()}/challenges/${status}`)[listenStatus]('value', cb);
  }
  return playersDbByCustom(`/${displayName.toLowerCase()}/challenges/${status}`)[listenStatus]('value');
};

export const setPlayerWithPriority = (displayName, ref, body, priority = (0 - Date.now())) => {
  if (!displayName) {
    throw new Error('displayName not provided!');
  }
  if (!ref) {
    throw new Error('ref not provided!');
  }
  if (!body) {
    throw new Error('body not provided!');
  }

  return playersDbByCustom(`/${displayName.toLowerCase()}/${ref}`).setWithPriority(body, priority, err => {
    if (err) {
      throw new Error(err);
    }
  });
};

// Local Storage
export const getPlayerInStorage = () => get('player');

export const setPlayerInStorage = player => set('player', player);
