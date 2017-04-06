import { database } from './firebase';
import { findPlayerByDisplayNameOnce } from './players'

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

  findPlayerByDisplayNameOnce(playerDisplayNames[0])
};
export const findChallengesByPlayerDisplayName = (displayName, cb) => {
  console.log(displayName);
  challengesDb.orderByChild('players').on('child_added', cb);
};
