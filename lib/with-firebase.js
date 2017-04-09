import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';
import LoadingIcon from '../components/common/loading-icon';
import { auth } from './firebase';
import { getPlayer } from './players';
import { getUser, setUser } from './user';
import { clear } from './storage';

export default (WrappedComponent, opts = {}) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: null,
        player: null
      };
      this.updateUserState = this.updateUserState.bind(this);
    }

    componentDidMount() {
      const user = getUser();
      const player = getPlayer();
      this.setState({ user, player });
      this.unsubscribe = auth().onAuthStateChanged(this.updateUserState);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    async updateUserState(user) {
      setUser(user);
      await this.setState({ user });
      if (!this.state.user && opts.isProtected) {
        clear();
        await Router.push('/login');
      }
    }

    render() {
      const { user, player } = this.state;
      if ((isEmpty(user) || isEmpty(player)) && opts.isProtected) {
        return (
          <div style={{ textAlign: 'center', marginTop: '70px' }}>
            <LoadingIcon color="#ed5f59" width="100"/>
          </div>
        );
      }
      return <WrappedComponent user={user} player={player} {...this.props}/>;
    }
  };
};
