import Router from "next/router";
import isEmpty from "lodash/isEmpty";
import LoadingIcon from "../components/common/loading-icon";
import { auth } from "./data/firebase";
import { getPlayerInStorage } from "./data/players";
import { getUserInStorage, setUserInStorage } from "./data/user";
import { clear } from "./data/storage";

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
      const user = getUserInStorage();
      const player = getPlayerInStorage();
      this.setState({ user, player });
      this.unsubscribe = auth().onAuthStateChanged(this.updateUserState);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    async updateUserState(user) {
      setUserInStorage(user);
      await this.setState({ user });
      if (!this.state.user && opts.isProtected) {
        clear();
        await Router.push("/login");
      }
    }

    render() {
      const { user, player } = this.state;
      if ((isEmpty(user) || isEmpty(player)) && opts.isProtected) {
        return (
          <div style={{ textAlign: "center", marginTop: "70px" }}>
            <LoadingIcon color="#ed5f59" width="100" />
          </div>
        );
      }
      return <WrappedComponent user={user} player={player} {...this.props} />;
    }
  };
};
