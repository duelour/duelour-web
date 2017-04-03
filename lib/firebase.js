import firebase from 'firebase';
import Router from 'next/router';
import reactCookie from 'react-cookie';
import cookie from 'cookie';

try {
  firebase.initializeApp({
    apiKey: 'AIzaSyCSPOPxJuFa_QVSKqyA78_WCwW0TMy0EmI',
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

export const withFirebase = (WrappedComponent, opts = {}) => {
  return class extends React.Component {
    static async getInitialProps({ req }) {
      if (req) {
        const c = cookie.parse(req.headers.cookie);
        if (!c['duelour.user']) {
          Router.push('/login');
        }
      }
      return {};
    }

    constructor(props) {
      super(props);
      this.state = {
        user: null
      };
      this.updateUserState = this.updateUserState.bind(this);
    }

    componentDidMount() {
      const user = reactCookie.load('duelour.user');
      this.setState({ user });
      this.unsubscribe = firebase.auth().onAuthStateChanged(this.updateUserState);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    async updateUserState(user) {
      reactCookie.save('duelour.user', user);
      await this.setState({ user });
      if (!this.state.user && opts.isProtected) {
        Router.push('/login');
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
