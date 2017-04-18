import { database } from './firebase';
import { set, get } from './storage';

// DB Refs
export const challengesDb = database.child('challenges');

export const challengesDbByCustom = custom =>
  database.child(`challenges${custom}`);

// DB CRUD
export const findChallengeByChallengeIdOnce = challengeId =>
  challengesDbByCustom(`/${challengeId}`).once('value');

// Local Storage
export const getChallengesFromStorage = () => get('challenges');

export const setChallengesInStorage = challenges =>
  set('challenges', challenges);
