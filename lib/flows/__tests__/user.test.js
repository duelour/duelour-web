import { signInPlayer } from '../user';
import { normalizeFbObject } from '../../data/firebase';
import { findPlayerByUidOnce } from '../../data/players';
import { signIn } from '../../data/user';

jest.mock('../../data/firebase');
jest.mock('../../data/players', () => ({
  findPlayerByUidOnce: jest.fn().mockReturnValue({
    val: jest.fn().mockReturnValue({ mockKey: 'mockVal' })
  })
}));
jest.mock('../../data/user', () => ({
  signIn: jest.fn().mockReturnValue({ uid: 'mockUid' })
}));

describe('signInPlayer', () => {
  it('should call signIn()', () => {
    signInPlayer('email', 'password');
    expect(signIn).toBeCalledWith('email', 'password');
  });

  it('should call findPlayerByUidOnce()', async () => {
    await signInPlayer('email', 'password');
    expect(findPlayerByUidOnce).toBeCalledWith('mockUid');
  });

  it('should call normalizeFbObject', async () => {
    await signInPlayer('email', 'password');
    expect(normalizeFbObject).toBeCalledWith({ mockKey: 'mockVal' });
  });
});
