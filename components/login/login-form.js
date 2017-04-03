import { Button, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';
import classNames from 'classnames';
import Router from 'next/router';
import firebase from '../../lib/firebase';
import LoadingIcon from '../common/loading-icon';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', isRegister: false, isFetching: false, validationErrors: {} };
    this.handleAuthUser = this.handleAuthUser.bind(this);
    this.handleToggleRegisterForm = this.handleToggleRegisterForm.bind(this);
  }

  async handleAuthUser() {
    const { email, password, reenterPassword, isRegister } = this.state;
    this.setState({ isFetching: true });

    if (password && reenterPassword && (password !== reenterPassword)) {
      this.setState({ isFetching: false, validationErrors: { reenterPassword: 'Passwords do not match!' } });
      return;
    }

    if (email && password) {
      try {
        if (isRegister) {
          await firebase.auth().createUserWithEmailAndPassword(email, password);
        } else {
          await firebase.auth().signInWithEmailAndPassword(email, password);
        }
        await Router.push('/');
      } catch (err) {
        this.setState({ err });
      }
    }
    this.setState({ isFetching: false });
  }

  handleToggleRegisterForm() {
    const { isRegister } = this.state;
    this.setState({ isRegister: !isRegister });
  }

  onChange(name) {
    return e => {
      this.setState({ [name]: e.target.value, validationErrors: { [name]: null } });
    };
  }

  render() {
    const { isRegister, isFetching, validationErrors } = this.state;

    const submitText = isRegister ? 'Create account' : 'Login';
    const loginOrRegister = isRegister ? 'Back to login...' : 'Create an account...';

    return (
      <div>
        <form id="login-form">
          <FormGroup>
            <FormControl type="text" placeholder="Email" onChange={this.onChange('email')}/>
          </FormGroup>
          <FormGroup>
            <FormControl type="password" placeholder="Password" onChange={this.onChange('password')}/>
          </FormGroup>
          {
            isRegister &&
            <FormGroup validationState={validationErrors.reenterPassword ? 'error' : null}>
              <FormControl type="password" placeholder="Re-enter password" onChange={this.onChange('reenterPassword')}/>
              <HelpBlock>{validationErrors.reenterPassword}</HelpBlock>
            </FormGroup>
          }
          <Button
            bsStyle="primary"
            className={classNames('btn-lg', isFetching ? 'disabled' : '')}
            type="button"
            onClick={this.handleAuthUser}
            >
            {
              isFetching ?
                <LoadingIcon/> :
                submitText
            }
          </Button>
        </form>
        <div className="center-align create-account">
          <a href="#" onClick={this.handleToggleRegisterForm}>{loginOrRegister}</a>
        </div>
        <style jsx>{`
          .create-account {
            margin-top: 20px;
            font-size: 22px;
          }
        `}</style>
      </div>
    );
  }
}

export default LoginForm;
