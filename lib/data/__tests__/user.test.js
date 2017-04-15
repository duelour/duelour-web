import { auth } from '../firebase';
import { signIn, signOut, createUser } from '../user';

jest.mock('../firebase', () => ({
  auth: jest.fn().mockReturnValue({
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    createUserWithEmailAndPassword: jest.fn()
  })
}));

describe('signIn', () => {
  it('should call signInWithEmailAndPassword()', () => {
    const email = 'mockEmail';
    const password = 'mockPassword';

    signIn(email, password);

    expect(auth().signInWithEmailAndPassword).toBeCalled();
  });
});

describe('signOut', () => {
  it('should call signOut()', () => {
    signOut();
    expect(auth().signOut).toBeCalled();
  });
});

describe('createUser', () => {
  it('should call createUserWithEmailAndPassword()', () => {
    const email = 'mockEmail';
    const password = 'mockPassword';

    createUser(email, password);

    expect(auth().createUserWithEmailAndPassword).toBeCalled();
  });
});
