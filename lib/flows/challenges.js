import axios from 'axios';
import { auth } from '../data/firebase';
import {
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
    `players/${playerKey}/hasPlayerAccepted`
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
  const token = await auth().currentUser.getToken();
  return axios.post(
    'https://us-central1-duelour.cloudfunctions.net/createChallengeForPlayer',
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
