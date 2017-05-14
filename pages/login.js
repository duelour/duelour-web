import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap';
import Router from 'next/router';
import isEmpty from 'lodash/isEmpty';

import withFirebase from '../lib/with-firebase';
import { signInPlayer, registerPlayer } from '../lib/controllers/user';
import {
  findPlayerByDisplayNameOnce,
  setPlayerInStorage
} from '../lib/data/players';
import Logo from '../components/common/logo';
import LoginForm from '../components/login/login-form';
import Page from '../document/page';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: {} };
    this.handleAuthUser = this.handleAuthUser.bind(this);
  }

  componentWillReceiveProps({ user: nextUser }) {
    const { user } = this.props;
    if (user !== nextUser && !isEmpty(user) && !isEmpty(nextUser)) {
      Router.push('/');
    }
  }

  async handleAuthUser(email, password, displayName, isRegister) {
    try {
      if (isRegister) {
        const snapshot = await findPlayerByDisplayNameOnce(displayName);
        if (snapshot.val()) {
          throw new Error('Display name already exists!');
        }

        const normalizedPlayer = await registerPlayer(
          email,
          password,
          displayName
        );
        setPlayerInStorage(normalizedPlayer);
      } else {
        const normalizedPlayer = await signInPlayer(email, password);
        setPlayerInStorage(normalizedPlayer);
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
          <Row className="login-form-wrapper" style={{ marginBottom: '20px' }}>
            <Col xs={12}>
              <Logo imageWidth="150px" />
            </Col>
          </Row>
          <Row>
            <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
              <LoginForm error={err} onSubmit={this.handleAuthUser} />
            </Col>
          </Row>
        </Grid>
      </Page>
    );
  }
}

Login.propTypes = {
  user: PropTypes.object
};

Login.defaultProps = {
  user: {}
};

export default withFirebase(Login);
