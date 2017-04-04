import { Grid, Row, Col } from 'react-bootstrap';
import Router from 'next/router';
import { withFirebase } from '../lib/firebase';
import { signIn, createUser } from '../lib/user';
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

  async handleAuthUser(email, password, isRegister) {
    try {
      if (isRegister) {
        await createUser(email, password);
      } else {
        await signIn(email, password);
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
              <Logo width="150px"/>
            </Col>
          </Row>
          <Row>
            <Col md={6} mdOffset={3} sm={8} smOffset={2}>
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
