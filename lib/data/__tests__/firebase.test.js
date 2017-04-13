import fb from 'firebase';
import { normalizeFbObject, auth, database } from '../firebase';

jest.mock('firebase', () => ({
  initializeApp: jest.fn(),
  auth: jest.fn(),
  database: jest.fn().mockReturnValue({ ref: jest.fn() })
}));

describe('init', () => {
  it('should initialize the firebase instance', () => {
    expect(fb.initializeApp).toBeCalled();
  });
});

describe('normalizeFbObject', () => {
  it('should correctly normalize a firebase object', () => {
    const fbObject = { mockKey: { key1: 'value1', key2: 'value2' } };

    const normalizedObject = normalizeFbObject(fbObject);

    expect(normalizedObject).toEqual({
      key: 'mockKey',
      key1: 'value1',
      key2: 'value2'
    });
  });
});

describe('auth', () => {
  it('should return with the auth function', () => {
    expect(auth).toBe(fb.auth);
  });
});

describe('database', () => {
  it('should return with the database ref', () => {
    expect(database).toBe(fb.database().ref());
  });
});
