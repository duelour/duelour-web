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
      players: playerDisplayNames.map(name => ({ [name.toLowerCase()]: true })),
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
    if (playerDisplayName === creator) {
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
    const challengeChild = (playerDisplayName === creator) ? 'active' : 'pending';
    return setPlayerWithPriority(playerDisplayName, `challenges/${challengeChild}/${challenge.key}`, {
      havePlayersAccepted,
      status: 'pending'
    });
  });
  return Promise.all(requests);
};

export const getPlayerChallengesByChallengesKeys = cb => async challengesKeys => {
  const challengeKeys = Object.keys(challengesKeys.val());
  const requests = challengeKeys.map(challengeKey => findChallengeByChallengeIdOnce(challengeKey));
  const challengesRefs = await Promise.all(requests);
  cb(challengesRefs.map(challengeRef => Object.assign(challengeRef.exportVal(), { key: challengeRef.key })));
};

export const getPlayerChallenges = {
  on: (playerDisplayName, cb, status = 'active') => {
    listPlayerChallengesByStatus(playerDisplayName, getPlayerChallengesByChallengesKeys(cb), status);
  },
  off: (playerDisplayName, status = 'active') => {
    listPlayerChallengesByStatus(playerDisplayName, null, status, 'off');
  }
};
