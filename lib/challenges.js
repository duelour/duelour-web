import { database } from './firebase';
import { listPlayerChallengesByStatusOnce, setPlayerWithPriority } from './players';
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
  newChallengeRef.set(
    {
      displayName,
      players: playerDisplayNames.map(name => ({ [name]: true }))
    },
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
export const createChallengeForPlayer = async (challengeDisplayName, playerDisplayNames, creator) => {
  const challenge = await createChallenge({ displayName: challengeDisplayName, playerDisplayNames });

  const opponentsHaveAccepted = playerDisplayNames.reduce((res, playerDisplayName) => {
    if (playerDisplayName === creator) {
      return {};
    }
    res[playerDisplayName] = false;
    return res;
  }, {});

  const requests = playerDisplayNames.map(playerDisplayName => {
    const challengeChild = (playerDisplayName === creator) ? 'active' : 'pending';
    return setPlayerWithPriority(playerDisplayName, `challenges/${challengeChild}/${challenge.key}`, {
      acceptedPlayers: {
        [creator]: true,
        ...opponentsHaveAccepted
      }
    });
  });
  return Promise.all(requests);
};

export const getPlayerChallenges = async (playerDisplayName, status = 'active') => {
  const challengesKeysSnapshot = await listPlayerChallengesByStatusOnce(playerDisplayName, status);
  if (!challengesKeysSnapshot.val()) {
    return [];
  }

  const challengeKeys = Object.keys(challengesKeysSnapshot.val());
  const requests = challengeKeys.map(challengeKey => findChallengeByChallengeIdOnce(challengeKey));
  const challengesRefs = await Promise.all(requests);
  return challengesRefs.map(challengeRef => Object.assign(challengeRef.exportVal(), { key: challengeRef.key }));
};
