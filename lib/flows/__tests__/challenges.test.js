import axios from 'axios';
import {
  acceptChallengeForPlayer,
  createChallengeForPlayer,
  getPlayerChallengesByChallengesKeys
} from '../challenges';
import {
  findChallengeByChallengeIdOnce,
  updateChallenge
} from '../../data/challenges';

jest.mock('axios', () => ({
  post: jest.fn()
}));
jest.mock('../../data/firebase', () => ({
  auth: jest.fn().mockReturnValue({
    currentUser: { getToken: jest.fn().mockReturnValue('mockToken') }
  })
}));
jest.mock('../../data/challenges', () => ({
  createChallenge: jest.fn().mockReturnValue({ key: 'mockKey' }),
  findChallengeByChallengeIdOnce: jest.fn().mockReturnValue({
    exportVal: jest.fn().mockReturnValue({ mockKey: 'mockVal' }),
    key: 'mockChallengeKey'
  }),
  updateChallenge: jest.fn().mockReturnValue({
    child: jest.fn().mockReturnValue({
      set: jest.fn()
    })
  })
}));
jest.mock('../../data/players', () => ({
  setPlayerWithPriority: jest.fn(),
  playersDbByCustom: jest.fn().mockReturnValue({
    remove: jest.fn()
  })
}));

describe('acceptChallengeForPlayer', () => {
  it('should update challenge status to active', async () => {
    const challengeKey = 'mockChallengeKey';
    const playerKey = 'mockPlayerKey';

    await acceptChallengeForPlayer(challengeKey, playerKey);

    expect(updateChallenge).toBeCalledWith('mockChallengeKey', {
      status: 'active'
    });
  });
});

describe('createChallengeForPlayer', () => {
  it('should make a post request to the createChallengeForPlayer cloud function', async () => {
    const challengeDisplayName = 'mockDisplayName';
    const players = [
      {
        key: 'mockPlayerKey1',
        displayName: 'mockPlayerDisplayName1'
      },
      {
        key: 'mockPlayerKey2',
        displayName: 'mockPlayerDisplayName2'
      }
    ];
    const creator = 'mockPlayerKey2';

    await createChallengeForPlayer(challengeDisplayName, players, creator);

    expect(axios.post).toBeCalledWith(
      'https://us-central1-duelour.cloudfunctions.net/createChallengeForPlayer',
      {
        challengeDisplayName,
        players,
        creator
      },
      {
        headers: {
          Authorization: 'Bearer mockToken'
        }
      }
    );
  });
});

describe('getPlayerChallengesByChallengesKeys', () => {
  it('should return with an empty array if no challengesKeys', () => {
    const cb = jest.fn();

    getPlayerChallengesByChallengesKeys(cb)(null);

    expect(cb).toBeCalledWith([]);
  });

  it('should call findChallengeByChallengeIdOnce twice if two challenge keys', () => {
    const challengesKeys = {
      val: jest
        .fn()
        .mockReturnValue({ mockChallengeKey1: true, mockChallengeKey2: true })
    };

    getPlayerChallengesByChallengesKeys()(challengesKeys);

    expect(findChallengeByChallengeIdOnce).toBeCalledWith('mockChallengeKey1');
    expect(findChallengeByChallengeIdOnce).toBeCalledWith('mockChallengeKey2');
  });

  it('should return with player challenges', async () => {
    const challengesKeys = {
      val: jest
        .fn()
        .mockReturnValue({ mockChallengeKey1: true, mockChallengeKey2: true })
    };
    const cb = jest.fn();

    await getPlayerChallengesByChallengesKeys(cb)(challengesKeys);

    expect(cb).toBeCalledWith([
      {
        key: 'mockChallengeKey',
        mockKey: 'mockVal'
      },
      {
        key: 'mockChallengeKey',
        mockKey: 'mockVal'
      }
    ]);
  });
});
