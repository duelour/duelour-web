import { database } from './firebase';
import { set, get } from './storage';

// DB Refs
export const challengesDb = database.child('challenges');

export const challengesDbByCustom = custom => database.child(`challenges${custom}`);

// DB CRUD
export const createChallenge = async ({ displayName, players, ...body }) => {
  if (!players || players.length === 0) {
    throw new Error('Must have at least one player to create a challenge!');
  }
  const newChallengeRef = challengesDb.push();
  newChallengeRef.set(
    {
      displayName,
      players: players.reduce((res, player) => {
        res[player.key] = player.displayName;
        return res;
      }, {}),
      ...body
    },
    err => {
      if (err) {
        throw new Error(err);
      }
    }
  );
  return newChallengeRef;
};

export const findChallengeByChallengeIdOnce = challengeId => challengesDbByCustom(`/${challengeId}`).once('value');

// Local Storage
export const getChallengesFromStorage = () => get('challenges');

export const setChallengesInStorage = challenges => set('challenges', challenges);
