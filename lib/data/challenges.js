import { database } from './firebase';
import { set, get } from './storage';

// DB Refs
export const challengesDb = database.child('challenges');

export const challengesDbByCustom = custom =>
  database.child(`challenges${custom}`);

// DB CRUD
export const findChallengeByChallengeIdOnce = challengeId =>
  challengesDbByCustom(`/${challengeId}`).once('value');

export const findChallengeByChallengeId = (
  challengeId,
  listenStatus = 'on',
  cb
) =>
  (cb
    ? challengesDbByCustom(`/${challengeId}`)[listenStatus]('value', cb)
    : challengesDbByCustom(`/${challengeId}`)[listenStatus]('value'));

// Local Storage
export const getChallengesFromStorage = () => get('challenges');

export const setChallengesInStorage = challenges =>
  set('challenges', challenges);
