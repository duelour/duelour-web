import {
  acceptChallengeForPlayer,
  createChallengeForPlayer,
  getPlayerChallengesByChallengesKeys
} from '../challenges';
import {
  createChallenge,
  findChallengeByChallengeIdOnce,
  updateChallenge
} from '../../data/challenges';
import { setPlayerWithPriority, playersDbByCustom } from '../../data/players';

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
  it('should call createChallenge() with the correct parameters', () => {
    const challengeDisplayName = 'mockChallengeDisplayName';
    const players = [
      {
        key: 'mockPlayerKey1'
      },
      {
        key: 'mockPlayerKey2'
      }
    ];
    const creator = 'mockPlayerKey1';

    createChallengeForPlayer(challengeDisplayName, players, creator);

    expect(createChallenge).toBeCalledWith({
      displayName: challengeDisplayName,
      players,
      havePlayersAccepted: {
        [players[0].key]: true,
        [players[1].key]: false
      },
      status: 'pending'
    });
  });

  it('should call setPlayerWithPriority() twice for two players', async () => {
    const challengeDisplayName = 'mockChallengeDisplayName';
    const players = [
      {
        key: 'mockPlayerKey1'
      },
      {
        key: 'mockPlayerKey2'
      }
    ];
    const creator = 'mockPlayerKey1';

    await createChallengeForPlayer(challengeDisplayName, players, creator);

    expect(setPlayerWithPriority).toBeCalledWith(
      'mockPlayerKey1',
      'challenges/active/mockKey',
      true
    );
    expect(setPlayerWithPriority).toBeCalledWith(
      'mockPlayerKey2',
      'challenges/pending/mockKey',
      true
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
