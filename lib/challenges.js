import { database } from './firebase';
import {
  listPlayerChallengesByStatus,
  setPlayerWithPriority
} from './players';
import { set, get } from './storage';

// DB Refs
export const challengesDb = database().ref('challenges');

export const challengesDbByCustom = custom => database().ref(`challenges${custom}`);

// DB CRUD
export const createChallenge = async ({ displayName, playerDisplayNames, ...body }) => {
  if (!playerDisplayNames || playerDisplayNames.length === 0) {
    throw new Error('Must have at least one player to create a challenge!');
  }
  const newChallengeRef = challengesDb.push();
  newChallengeRef.set(
    {
      displayName,
      players: playerDisplayNames.reduce((res, name) => {
        res[name.toLowerCase()] = name;
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

export const findChallengeByChallengeIdOnce = challengeId =>
  challengesDbByCustom(`/${challengeId}`).once('value');

// Local Storage
export const getChallengesFromStorage = () => get('challenges');

export const setChallengesInStorage = challenges => set('challenges', challenges);

// Flows
export const createChallengeForPlayer = async (challengeDisplayName, playerDisplayNames, creator) => {
  const opponentsHaveAccepted = playerDisplayNames.reduce((res, playerDisplayName) => {
    if (playerDisplayName.toLowerCase() === creator) {
      return {};
    }
    res[playerDisplayName.toLowerCase()] = false;
    return res;
  }, {});
  const havePlayersAccepted = {
    [creator]: true,
    ...opponentsHaveAccepted
  };
  const challenge = await createChallenge({
    displayName: challengeDisplayName,
    playerDisplayNames,
    havePlayersAccepted,
    status: 'pending'
  });

  const requests = playerDisplayNames.map(playerDisplayName => {
    const challengeChild = (playerDisplayName.toLowerCase() === creator) ? 'active' : 'pending';
    return setPlayerWithPriority(playerDisplayName, `challenges/${challengeChild}/${challenge.key}`, true);
  });
  return Promise.all(requests);
};

export const getPlayerChallengesByChallengesKeys = cb => async challengesKeys => {
  if (!challengesKeys || !challengesKeys.val()) {
    return cb([]);
  }
  const challengeKeys = Object.keys(challengesKeys.val());
  const requests = challengeKeys.map(challengeKey => findChallengeByChallengeIdOnce(challengeKey));
  const challengesRefs = await Promise.all(requests);
  return cb(challengesRefs.map(challengeRef => Object.assign(challengeRef.exportVal(), { key: challengeRef.key })));
};

export const getPlayerChallenges = {
  on: (playerKey, cb, status = 'active') => {
    listPlayerChallengesByStatus(playerKey, getPlayerChallengesByChallengesKeys(cb), status);
  },
  off: (playerKey, status = 'active') => {
    listPlayerChallengesByStatus(playerKey, null, status, 'off');
  }
};
