import {
  createChallenge,
  findChallengeByChallengeIdOnce
} from '../data/challenges';
import {
  setPlayerWithPriority,
  listPlayerChallengesByStatus
} from '../data/players';

export const createChallengeForPlayer = async (challengeDisplayName, players, creator) => {
  const opponentsHaveAccepted = players.reduce((res, player) => {
    if (player.key === creator) {
      return {};
    }
    res[player.key] = false;
    return res;
  }, {});
  const havePlayersAccepted = {
    [creator]: true,
    ...opponentsHaveAccepted
  };
  const challenge = await createChallenge({
    displayName: challengeDisplayName,
    players,
    havePlayersAccepted,
    status: 'pending'
  });

  const requests = players.map(player => {
    const challengeChild = (player.key === creator) ? 'active' : 'pending';
    return setPlayerWithPriority(player.key, `challenges/${challengeChild}/${challenge.key}`, true);
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
  const challenges = challengesRefs.map(challengeRef => Object.assign({}, challengeRef.exportVal(), { key: challengeRef.key }));
  return cb(challenges);
};

export const getPlayerChallenges = {
  on: (playerKey, cb, status = 'active') => {
    listPlayerChallengesByStatus(playerKey, getPlayerChallengesByChallengesKeys(cb), status);
  },
  off: (playerKey, status = 'active') => {
    listPlayerChallengesByStatus(playerKey, null, status, 'off');
  }
};
