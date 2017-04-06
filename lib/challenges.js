import { database } from './firebase';
import { updatePlayer } from './players';

// DB Refs
export const challengesDb = database().ref('challenges');

export const challengesDbByCustom = custom => database().ref(`challenges${custom}`);

// DB CRUD
export const createChallenge = async ({ displayName, playerDisplayNames }) => {
  if (!playerDisplayNames || playerDisplayNames.length === 0) {
    throw new Error('Must have at least one player to create a challenge!');
  }

  const newChallengeRef = challengesDb.push();
  newChallengeRef.set({
    displayName,
    players: playerDisplayNames.map(name => ({ [name]: true }))
  }, err => {
    if (err) {
      throw new Error(err);
    }
  });
  return newChallengeRef;
};

export const findChallengeByChallengeIdOnce = challengeId =>
  challengesDbByCustom(`/${challengeId}`).once('value');

// Flows
export const createChallengeForPlayer = async (challengeDisplayName, playerDisplayName) => {
  const challenge = await createChallenge({ displayName: challengeDisplayName, playerDisplayNames: [playerDisplayName] });
  return updatePlayer(`${playerDisplayName}/challenges`, { [challenge.key]: true });
};

export const getChallengesByChallengeKeys = async challengeKeys => {
  const requests = challengeKeys.map(challengeKey => findChallengeByChallengeIdOnce(challengeKey));
  const challengesRefs = await Promise.all(requests);
  return challengesRefs.map(challengeRef => Object.assign(challengeRef.val(), { key: challengeRef.key })).reverse();
};
