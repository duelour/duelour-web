import { database } from './firebase';
import { listPlayerChallengesOnce, updatePlayer } from './players';
import { set, get } from './storage';

// DB Refs
export const challengesDb = database().ref('challenges');

export const challengesDbByCustom = custom => database().ref(`challenges${custom}`);

// DB CRUD
export const createChallenge = async ({ displayName, playerDisplayNames }) => {
  if (!playerDisplayNames || playerDisplayNames.length === 0) {
    throw new Error('Must have at least one player to create a challenge!');
  }

  const newChallengeRef = challengesDb.push();
  newChallengeRef.setWithPriority(
    {
      displayName,
      players: playerDisplayNames.map(name => ({ [name]: true }))
    },
    0 - Date.now(),
    err => {
      if (err) {
        throw new Error(err);
      }
    }
  );
  return newChallengeRef;
};

export const findChallengeByChallengeIdOnce = challengeId =>
  challengesDbByCustom(`/${challengeId}`).once('value');

// Local Storage
export const getChallengesFromStorage = () => get('challenges');

export const setChallengesInStorage = challenges => set('challenges', challenges);

// Flows
export const createChallengeForPlayer = async (challengeDisplayName, playerDisplayName) => {
  const challenge = await createChallenge({ displayName: challengeDisplayName, playerDisplayNames: [playerDisplayName] });
  return updatePlayer(`${playerDisplayName}/challenges`, { [challenge.key]: true });
};

export const getPlayerChallenges = async playerDisplayName => {
  const challengesKeysSnapshot = await listPlayerChallengesOnce(playerDisplayName);
  if (!challengesKeysSnapshot.val()) {
    return [];
  }

  const challengeKeys = Object.keys(challengesKeysSnapshot.val()).reverse();
  const requests = challengeKeys.map(challengeKey => findChallengeByChallengeIdOnce(challengeKey));
  const challengesRefs = await Promise.all(requests);
  return challengesRefs.map(challengeRef => Object.assign(challengeRef.val(), { key: challengeRef.key }));
};
