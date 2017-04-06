import firebase from 'firebase';
import Router from 'next/router';
import LoadingIcon from '../components/common/loading-icon';
import { getUser, setUser } from './user';

try {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY || 'firebase_api_key',
    authDomain: 'duelour.firebaseapp.com',
    databaseURL: 'https://duelour.firebaseio.com',
    projectId: 'duelour',
    storageBucket: 'duelour.appspot.com',
    messagingSenderId: '205349926131'
  });
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack);
  }
}

export const normalizeFbObject = fbObject => {
  const objectKey = Object.keys(fbObject)[0];
  return fbObject[objectKey];
};

export const withFirebase = (WrappedComponent, opts = {}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: null
      };
      this.updateUserState = this.updateUserState.bind(this);
    }

    componentDidMount() {
      const user = getUser();
      this.setState({ user });
      this.unsubscribe = firebase.auth().onAuthStateChanged(this.updateUserState);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    async updateUserState(user) {
      setUser(user);
      await this.setState({ user });
      if (!this.state.user && opts.isProtected) {
        await Router.push('/login');
      }
    }

    render() {
      const { user } = this.state;
      if (!user && opts.isProtected) {
        return (
          <div style={{ textAlign: 'center', marginTop: '70px' }}>
            <LoadingIcon color="#ed5f59" width="100"/>
          </div>
        );
      }
      return <WrappedComponent user={user} {...this.props}/>;
    }
  };
};

export const auth = firebase.auth;
export const database = firebase.database;
export default firebase;
