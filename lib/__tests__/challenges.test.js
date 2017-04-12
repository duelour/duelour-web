import { database } from '../firebase';
import {
  challengesDb,
  challengesDbByCustom,
  createChallenge,
  getChallengesFromStorage,
  setChallengesInStorage,
  createChallengeForPlayer,
  getPlayerChallengesByChallengesKeys
} from '../challenges';
import { set } from '../storage';

jest.mock('Promise', () => ({
  all: jest.fn()
}));
jest.mock('../firebase', () => ({
  database: {
    child: jest.fn().mockReturnValue({
      push: jest.fn().mockReturnValue({
        set: jest.fn()
      }),
      setWithPriority: jest.fn(),
      once: jest.fn().mockReturnValue(new Promise(resolve =>
        resolve({ key: 'mockKey', exportVal: jest.fn().mockReturnValue({ mockKey: 'mockVal' }) })
      ))
    }
  ) }
}));
jest.mock('../storage', () => ({
  get: jest.fn().mockReturnValue({
    fakeChallenge1: {
      displayName: 'Uber cool challenge'
    },
    fakeChallenge2: {
      displayName: 'I am cool'
    }
  }),
  set: jest.fn()
}));

describe('challengesDb', () => {
  it('should call return the challenges snapshot', () => {
    expect(challengesDb.push).toEqual(jasmine.any(Function));
  });
});

describe('challengesDbByCustom', () => {
  it('should call return the custom challenges snapshot', () => {
    const customPath = '/mockPath';

    const customSnapshot = challengesDbByCustom(customPath);

    expect(database.child).toBeCalledWith(`challenges${customPath}`);
    expect(customSnapshot.push).toEqual(jasmine.any(Function));
  });
});

describe('createChallenge', () => {
  it('should throw an error if no players are specified', async () => {
    const players = [];

    try {
      await createChallenge({ players });
    } catch (err) {
      expect(err.message).toEqual('Must have at least one player to create a challenge!');
    }
  });

  it('should push and set the challenge data', async () => {
    const displayName = 'mockChallengeName';
    const players = [
      {
        key: 'mockKey1',
        displayName: 'mockDisplayName1'
      },
      {
        key: 'mockKey2',
        displayName: 'mockDisplayName2'
      }
    ];
    const body = { mockKey: 'mockVal' };

    const challengeRef = await createChallenge({ displayName, players, ...body });

    expect(database.child().push).toBeCalled();
    expect(database.child().push().set.mock.calls[0][0]).toEqual({
      displayName: 'mockChallengeName',
      players: {
        mockKey1: 'mockDisplayName1',
        mockKey2: 'mockDisplayName2'
      },
      mockKey: 'mockVal'
    });
    expect(challengeRef).toEqual({ set: jasmine.any(Function) });
  });
});

describe('getChallengesFromStorage', () => {
  it('should return with the challenges', () => {
    const challenges = getChallengesFromStorage();

    expect(challenges).toEqual({
      fakeChallenge1: {
        displayName: 'Uber cool challenge'
      },
      fakeChallenge2: {
        displayName: 'I am cool'
      }
    });
  });
});

describe('setChallengesInStorage', () => {
  it('should set the challenges in storage', () => {
    const challenges = { challenge1: 'mockChallenge' };

    setChallengesInStorage(challenges);

    expect(set).toBeCalledWith('challenges', { challenge1: 'mockChallenge' });
  });
});

describe('createChallengeForPlayer', () => {
  it('should call createChallenge()', async () => {
    const challengeDisplayName = 'mockChallengeName';
    const players = [
      {
        key: 'mockKey1',
        displayName: 'mockDisplayName1'
      },
      {
        key: 'mockKey2',
        displayName: 'mockDisplayName2'
      }
    ];
    const creator = 'mockKey1';

    await createChallengeForPlayer(challengeDisplayName, players, creator);

    expect(database.child().push().set.mock.calls[1][0]).toEqual({
      displayName: 'mockChallengeName',
      havePlayersAccepted: {
        mockKey1: true,
        mockKey2: false
      },
      players: {
        mockKey1: 'mockDisplayName1',
        mockKey2: 'mockDisplayName2'
      },
      status: 'pending'
    });
  });

  it('should resolve all requests', async () => {
    const challengeDisplayName = 'mockChallengeName';
    const players = [
      {
        key: 'mockKey1',
        displayName: 'mockDisplayName1'
      },
      {
        key: 'mockKey2',
        displayName: 'mockDisplayName2'
      }
    ];
    const creator = 'mockKey1';

    await createChallengeForPlayer(challengeDisplayName, players, creator);

    expect(database.child().setWithPriority).toBeCalled();
  });
});

describe('getPlayerChallengesByChallengesKeys', () => {
  it('should return with an empty array if no challengeKeys', () => {
    const challengeKeys = null;
    const cb = jest.fn();

    getPlayerChallengesByChallengesKeys(cb)(challengeKeys);

    expect(cb).toBeCalledWith([]);
  });

  it('should return with challenges if challengeKeys given', async () => {
    const challengeKeys = {
      val: jest.fn().mockReturnValue({ challengeKey1: true, challengeKey2: true })
    };
    const cb = jest.fn();

    await getPlayerChallengesByChallengesKeys(cb)(challengeKeys);

    expect(cb).toBeCalledWith([{ key: 'mockKey', mockKey: 'mockVal' }, { key: 'mockKey', mockKey: 'mockVal' }]);
  });
});
