import { database } from './firebase';
import { get, set } from './storage';

// DB Refs
export const membersDb = database().ref('members');
export const membersDbByCustom = custom => database().ref(`members${custom}`);

// DB CRUD
export const findMemberByDisplayNameOnce = async displayName => membersDbByCustom(`/${displayName}`).once('value');
export const findMemberByUidOnce = async uid => membersDb.orderByChild('uid').equalTo(uid).once('value');
export const createMember = async (uid, displayName) => {
  return membersDbByCustom(`/${displayName}`).set({
    uid,
    displayName
  });
};

// Local Storage
export const getMember = () => get('member');
export const setMember = member => set('member', member);
