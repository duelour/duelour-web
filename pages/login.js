import { Grid, Row, Col } from 'react-bootstrap';
import Logo from '../components/common/logo';
import LoginForm from '../components/login/login-form';
import Page from '../document/page';

export default () => (
  <Page>
    <Grid>
      <Row>
        <Col xs={12}>
          <Logo/>
        </Col>
      </Row>
      <Row>
        <Col md={6} mdOffset={3} sm={8} smOffset={2}>
          <LoginForm/>
        </Col>
      </Row>
    </Grid>
    <style jsx>{`
      .center-align {
        text-align: center;
      }

      .login-form-wrapper {
        margin-top: 20px;
      }
    `}</style>
  </Page>
);
