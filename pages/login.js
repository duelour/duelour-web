import { Grid, Row, Col } from 'react-bootstrap';
import Router from 'next/router';
import { withFirebase, normalizeFbObject } from '../lib/firebase';
import { signIn, createUser } from '../lib/user';
import { createPlayer, findPlayerByUidOnce, findPlayerByDisplayNameOnce, setPlayer } from '../lib/players';
import Logo from '../components/common/logo';
import LoginForm from '../components/login/login-form';
import Page from '../document/page';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: {} };
    this.handleAuthUser = this.handleAuthUser.bind(this);
  }

  async componentWillReceiveProps({ user: nextUser }) {
    const { user } = this.props;
    if (user !== nextUser && user) {
      await Router.push('/');
    }
  }

  async handleAuthUser(email, password, displayName, isRegister) {
    try {
      if (isRegister) {
        const snapshot = await findPlayerByDisplayNameOnce(displayName);
        if (snapshot.val()) {
          throw new Error('Display name already exists!');
        }

        // Create a user and player
        const user = await createUser(email, password);
        await createPlayer(user.uid, displayName);

        // Get the player details and set player in local storage
        const player = await findPlayerByUidOnce(user.uid);
        const normalizedPlayer = normalizeFbObject(player.val());
        setPlayer(normalizedPlayer);
      } else {
        // Sign user in, find player and set player in local storage
        const user = await signIn(email, password);
        const player = await findPlayerByUidOnce(user.uid);
        const normalizedPlayer = normalizeFbObject(player.val());
        setPlayer(normalizedPlayer);
      }
      await Router.push('/');
    } catch (err) {
      this.setState({ err });
    }
  }

  render() {
    const { err } = this.state;
    return (
      <Page>
        <Grid>
          <Row className="login-form-wrapper">
            <Col xs={12}>
              <Logo imageWidth="150px"/>
            </Col>
          </Row>
          <Row>
            <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
              <LoginForm
                error={err}
                onSubmit={this.handleAuthUser}
                />
            </Col>
          </Row>
        </Grid>
      </Page>
    );
  }
}

export default withFirebase(Login);
