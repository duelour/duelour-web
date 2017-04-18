import { createPlayer, listPlayerChallengesByStatus } from '../players';
import { database } from '../firebase';

jest.mock('../firebase', () => ({
  database: {
    child: jest.fn().mockReturnValue({
      push: jest.fn().mockReturnValue({
        set: jest.fn()
      }),
      on: jest.fn(),
      setWithPriority: jest.fn()
    })
  }
}));

describe('createPlayer', () => {
  it('should throw an error if no uid is specified', () => {
    try {
      createPlayer(null);
    } catch (err) {
      expect(err.message).toBe('uid not provided!');
    }
  });

  it('should throw an error if no displayName is specified', () => {
    try {
      createPlayer('uid', null);
    } catch (err) {
      expect(err.message).toBe('displayName not provided!');
    }
  });

  it('should push and set the player', () => {
    createPlayer('uid', 'displayName');

    expect(database.child().push).toBeCalled();
    expect(database.child().push().set).toBeCalledWith(
      {
        uid: 'uid',
        displayName: 'displayName',
        normalizedDisplayName: 'displayname'
      },
      jasmine.any(Function)
    );
  });
});

describe('listPlayerChallengesByStatus', () => {
  it('should throw an error if no playerKey is specified', () => {
    try {
      listPlayerChallengesByStatus(null);
    } catch (err) {
      expect(err.message).toBe('playerKey not provided!');
    }
  });

  it('should call players database', () => {
    listPlayerChallengesByStatus('playerKey');

    expect(database.child).toBeCalled();
  });
});
