import { database } from './firebase';
import { get, set } from './storage';

// DB Refs
export const playersDb = database.child('players');

export const playersDbByCustom = custom => database.child(`players${custom}`);

// DB CRUD
export const findPlayerByDisplayNameOnce = async displayName =>
  playersDb.orderByChild('normalizedDisplayName').equalTo(displayName.toLowerCase()).once('value');

export const findPlayerByUidOnce = async uid => playersDb.orderByChild('uid').equalTo(uid).once('value');

export const createPlayer = (uid, displayName) => {
  if (!uid) {
    throw new Error('uid not provided!');
  }
  if (!displayName) {
    throw new Error('displayName not provided!');
  }

  const playerRef = playersDb.push();
  return playerRef.set({
    uid,
    normalizedDisplayName: displayName.toLowerCase(),
    displayName
  }, err => {
    if (err) {
      throw new Error(err);
    }
  });
};

export const listPlayerChallengesByStatus = (playerKey, cb, status = 'active', listenStatus = 'on') => {
  if (!playerKey) {
    throw new Error('playerKey not provided!');
  }

  // TODO: paginate this!
  if (cb) {
    return playersDbByCustom(`/${playerKey}/challenges/${status}`)[listenStatus]('value', cb);
  }
  return playersDbByCustom(`/${playerKey}/challenges/${status}`)[listenStatus]('value');
};

export const setPlayerWithPriority = (playerKey, ref, body, priority = (0 - Date.now())) => {
  if (!playerKey) {
    throw new Error('playerKey not provided!');
  }
  if (!ref) {
    throw new Error('ref not provided!');
  }
  if (!body) {
    throw new Error('body not provided!');
  }

  return playersDbByCustom(`/${playerKey}/${ref}`).setWithPriority(body, priority, err => {
    if (err) {
      throw new Error(err);
    }
  });
};

// Local Storage
export const getPlayerInStorage = () => get('player');

export const setPlayerInStorage = player => set('player', player);
