import { Grid } from 'react-bootstrap';
import { withFirebase } from '../lib/firebase';
import { getMember } from '../lib/members';
import { signOut } from '../lib/user';
import Header from '../components/common/header';
import Challenges from '../components/challenges/index';
import Page from '../document/page';

class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { member: {} };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.setState({ member: getMember() });
  }

  async handleLogout() {
    await signOut();
  }

  render() {
    const { member } = this.state;
    return (
      <Page>
        <Grid>
          <Header
            member={member}
            onClickLogout={this.handleLogout}
            />
          <Challenges/>
        </Grid>
      </Page>
    );
  }
}

export default withFirebase(Index, { isProtected: true });
