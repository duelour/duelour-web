import { Grid, Row, Col } from 'react-bootstrap';
import { withFirebase } from '../lib/firebase';
import Logo from '../components/common/logo';
import LoginForm from '../components/login/login-form';
import Page from '../document/page';

class Login extends React.Component {
  render() {
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
              <LoginForm/>
            </Col>
          </Row>
        </Grid>
      </Page>
    );
  }
}

export default withFirebase(Login, { redirectIfLoggedIn: true });
