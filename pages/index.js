import { Button } from 'react-bootstrap';
import { withFirebase } from '../lib/firebase';
import { getMember } from '../lib/members';
import { signOut } from '../lib/user';
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
        Welcome, { member && member.displayName }
        <Button onClick={this.handleLogout}>Logout</Button>
      </Page>
    );
  }
}

export default withFirebase(Index, { isProtected: true });
