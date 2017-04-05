import { Alert, Button, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';
import classNames from 'classnames';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import LoadingIcon from '../common/loading-icon';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayName: '', email: '', password: '', isRegister: false, isFetching: false, validationErrors: {} };
    this.handleToggleRegisterForm = this.handleToggleRegisterForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  async handleSubmit(e) {
    const { displayName, email, password, reenterPassword, isRegister } = this.state;
    const { onSubmit } = this.props;

    e.preventDefault();
    this.setState({ isFetching: true });

    if (!email) {
      this.setState({ validationErrors: Object.assign(this.state.validationErrors, { email: 'Please enter an email!' }) });
    }
    if (isRegister && !displayName) {
      this.setState({ validationErrors: Object.assign(this.state.validationErrors, { displayName: 'Please enter a display name!' }) });
    }
    if (!password) {
      this.setState({ validationErrors: Object.assign(this.state.validationErrors, { password: 'Please enter a password!' }) });
    }
    if (isRegister && !reenterPassword) {
      this.setState({ validationErrors: Object.assign(this.state.validationErrors, { reenterPassword: 'Please re-enter your password!' }) });
    }
    if (isRegister && password && (password !== reenterPassword)) {
      this.setState({ validationErrors: Object.assign(this.state.validationErrors, { reenterPassword: 'Passwords do not match!' }) });
    }
    if (!isEmpty(omitBy(this.state.validationErrors, isEmpty))) {
      this.setState({ isFetching: false });
      return;
    }

    if (onSubmit) {
      await onSubmit(email, password, displayName, isRegister);
    }

    this.setState({ isFetching: false });
  }

  render() {
    const { isRegister, isFetching, validationErrors } = this.state;
    const { error } = this.props;

    const submitText = isRegister ? 'Create account' : 'Login';
    const loginOrRegister = isRegister ? 'Back to login...' : 'Create an account...';

    return (
      <div>
        {
          error.message &&
          <Alert bsStyle="danger">{error.message}</Alert>
        }
        <form id="login-form" onSubmit={this.handleSubmit}>
          <FormGroup validationState={validationErrors.email ? 'error' : null}>
            <FormControl type="text" placeholder="Email" onChange={this.onChange('email')}/>
            <HelpBlock>{validationErrors.email}</HelpBlock>
          </FormGroup>
          {
            isRegister &&
            <FormGroup validationState={validationErrors.displayName ? 'error' : null}>
              <FormControl type="text" placeholder="Display name" onChange={this.onChange('displayName')}/>
              <HelpBlock>{validationErrors.displayName}</HelpBlock>
            </FormGroup>
          }
          <FormGroup validationState={validationErrors.password ? 'error' : null}>
            <FormControl type="password" placeholder="Password" onChange={this.onChange('password')}/>
            <HelpBlock>{validationErrors.password}</HelpBlock>
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
            type="submit"
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

LoginForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  error: React.PropTypes.object
};

LoginForm.defaultProps = {
  error: {}
};

export default LoginForm;
