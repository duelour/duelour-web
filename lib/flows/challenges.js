import {
  createChallenge,
  findChallengeByChallengeIdOnce,
  updateChallenge
} from '../data/challenges';
import {
  setPlayerWithPriority,
  listPlayerChallengesByStatus,
  playersDbByCustom
} from '../data/players';

export const acceptChallengeForPlayer = async (challengeKey, playerKey) => {
  // Update challenge
  const challengeRef = await updateChallenge(challengeKey, {
    status: 'active'
  });
  const playerAcceptedRef = await challengeRef.child(
    `havePlayersAccepted/${playerKey}`
  );
  playerAcceptedRef.set(true, err => {
    if (err) {
      throw new Error(err);
    }
  });

  // Update player (remove pending challenge, append active challenge)
  playersDbByCustom(
    `/${playerKey}/challenges/pending/${challengeKey}`
  ).remove();
  const playerRef = setPlayerWithPriority(
    playerKey,
    `challenges/active/${challengeKey}`,
    true
  );

  return { challengeRef, playerRef };
};

export const createChallengeForPlayer = async (
  challengeDisplayName,
  players,
  creator
) => {
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
    const challengeChild = player.key === creator ? 'active' : 'pending';
    return setPlayerWithPriority(
      player.key,
      `challenges/${challengeChild}/${challenge.key}`,
      true
    );
  });
  return Promise.all(requests);
};

export const getPlayerChallengesByChallengesKeys = cb => async challengesKeys => {
  // Return empty array if no keys
  if (!challengesKeys || !challengesKeys.val()) {
    return cb([]);
  }

  // Get the player challenges keys and map the keys to requests
  const challengeKeys = Object.keys(challengesKeys.val());
  const requests = challengeKeys.map(challengeKey =>
    findChallengeByChallengeIdOnce(challengeKey)
  );

  // Get the player challenges and map the snapshots to results
  const challengesSnapshots = await Promise.all(requests);
  const challenges = challengesSnapshots.map(challengeSnapshot =>
    Object.assign({}, challengeSnapshot.exportVal(), {
      key: challengeSnapshot.key
    })
  );

  // Return the mapped result
  return cb(challenges);
};

export const getPlayerChallenges = {
  on: (playerKey, cb, status = 'active') => {
    listPlayerChallengesByStatus(
      playerKey,
      getPlayerChallengesByChallengesKeys(cb),
      status
    );
  },
  off: (playerKey, status = 'active') => {
    listPlayerChallengesByStatus(playerKey, null, status, 'off');
  }
};
