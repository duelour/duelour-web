import { Button } from 'react-bootstrap';
import { withFirebase } from '../lib/firebase';
import { signOut } from '../lib/user';
import Page from '../document/page';

class Index extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    await signOut();
  }

  render() {
    const { user } = this.props;
    return (
      <Page>
        Welcome, { user.email }
        <Button onClick={this.handleLogout}>Logout</Button>
      </Page>
    );
  }
}

Index.propTypes = {
  user: React.PropTypes.object.isRequired
};

export default withFirebase(Index, { isProtected: true });
