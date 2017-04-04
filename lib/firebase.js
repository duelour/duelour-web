import firebase from 'firebase';
import Router from 'next/router';

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

export const auth = firebase.auth;

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
      const user = JSON.parse(window.localStorage.getItem('duelour.user'));
      this.setState({ user });
      this.unsubscribe = firebase.auth().onAuthStateChanged(this.updateUserState);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    async updateUserState(user) {
      window.localStorage.setItem('duelour.user', JSON.stringify(user));
      await this.setState({ user });
      if (!this.state.user && opts.isProtected) {
        await Router.push('/login');
      }
    }

    render() {
      const { user } = this.state;
      if (!user && opts.isProtected) {
        return null;
      }
      return <WrappedComponent user={user} {...this.props}/>;
    }
  };
};

export default firebase;
