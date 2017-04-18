import { auth, cloudFunctions } from '../data/firebase';
import { findChallengeByChallengeIdOnce } from '../data/challenges';
import { listPlayerChallengesByStatus } from '../data/players';

export const acceptChallengeForPlayer = async (challengeKey, playerKey) => {
  const token = await auth().currentUser.getToken();
  return cloudFunctions.post(
    'acceptChallengeForPlayer',
    {
      challengeKey,
      playerKey
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const createChallengeForPlayer = async (
  challengeDisplayName,
  players,
  creator
) => {
  const token = await auth().currentUser.getToken();
  return cloudFunctions.post(
    'createChallengeForPlayer',
    {
      challengeDisplayName,
      players,
      creator
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
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
