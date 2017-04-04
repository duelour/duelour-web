import { Grid } from 'react-bootstrap';
import { withFirebase } from '../lib/firebase';
import { getPlayer } from '../lib/players';
import { signOut } from '../lib/user';
import Header from '../components/common/header';
import Challenges from '../components/challenges/index';
import Page from '../document/page';

class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { player: {} };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.setState({ player: getPlayer() });
  }

  async handleLogout() {
    await signOut();
  }

  render() {
    const { player } = this.state;
    return (
      <Page>
        <Grid>
          <Header
            player={player}
            onClickLogout={this.handleLogout}
            />
          <Challenges/>
        </Grid>
      </Page>
    );
  }
}

export default withFirebase(Index, { isProtected: true });
