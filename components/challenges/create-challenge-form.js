import { Button, ControlLabel, Form, FormGroup, FormControl, HelpBlock, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import getVal from 'lodash/get';
import LoadingIcon from '../common/loading-icon';

const VALIDATION = {
  displayName: ['isNotEmpty'],
  opponentDisplayName: ['isNotEmpty']
};

class CreateChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      validationState: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpponentDisplayNameChange = this.handleOpponentDisplayNameChange.bind(this);
  }

  checkIfValid(name, value, defaultState = 'success') {
    const { validationState } = this.state;
    const validators = VALIDATION[name];

    if (validators && validators.includes('isNotEmpty') && value.length === 0) {
      this.setState({ validationState: Object.assign(validationState, {
        [name]: {
          state: 'error',
          description: 'Please enter a name!'
        }
      }) });
      return;
    }
    this.setState({ validationState: Object.assign(validationState, {
      [name]: {
        state: defaultState,
        description: null
      }
    }) });
  }

  async handleSubmit(e) {
    const { displayName, opponentDisplayName, validationState } = this.state;
    const { onSubmit } = this.props;
    let isErrors = false;

    e.preventDefault();
    this.setState({ isFetching: true });

    if (!displayName) {
      this.setState({ validationState: Object.assign(validationState, {
        displayName: {
          state: 'error',
          description: 'Please enter a name!'
        }
      }) });
      isErrors = true;
    }
    if (!opponentDisplayName) {
      this.setState({ validationState: Object.assign(validationState, {
        opponentDisplayName: {
          state: 'error',
          description: 'Please enter your opponents name!'
        }
      }) });
      isErrors = true;
    }
    if (isErrors) {
      this.setState({ isFetching: false });
      return;
    }

    await onSubmit({ displayName, opponentDisplayName });
  }

  handleChange(name, defaultState = 'success') {
    return e => {
      this.checkIfValid(name, e.target.value, defaultState);
      this.setState({ [name]: e.target.value });
    };
  }

  handleOpponentDisplayNameChange(e) {
    const { validationState } = this.state;
    const { onOpponentDisplayNameChange, myPlayerDisplayName } = this.props;
    const value = e.target.value;

    this.handleChange('opponentDisplayName', null)(e);

    onOpponentDisplayNameChange(value, player => {
      if (myPlayerDisplayName === value.toLowerCase()) {
        this.setState({ validationState: Object.assign(validationState, {
          opponentDisplayName: {
            state: 'error',
            description: 'You cannot challenge yourself, silly!'
          }
        }) });
      } else if (player) {
        this.setState({ validationState: Object.assign(validationState, {
          opponentDisplayName: {
            state: 'success',
            description: <span>Player <strong>{value}</strong> found!</span>
          }
        }) });
      } else {
        this.setState({ validationState: Object.assign(validationState, {
          opponentDisplayName: {
            state: 'error',
            description: <span>Player <strong>{value}</strong> not found!</span>
          }
        }) });
      }
    });
  }

  render() {
    const { isFetching, validationState } = this.state;
    return (
      <Form horizontal id="form-large" onSubmit={this.handleSubmit}>
        <FormGroup
          className="create-challenge-form-group"
          validationState={getVal(validationState, 'displayName.state')}
          >
          <Col lg={5} sm={4} xs={12} className="text-right" componentClass={ControlLabel}>
            <div className="form-label">Name your challenge</div>
          </Col>
          <Col lg={4} sm={6} xs={12}>
            <FormControl
              type="text"
              placeholder="Cool challenge"
              onChange={this.handleChange('displayName')}
              />
            <HelpBlock>{getVal(validationState, 'displayName.description')}</HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup
          className="create-challenge-form-group"
          validationState={getVal(validationState, 'opponentDisplayName.state')}
          >
          <Col lg={5} sm={4} xs={12} className="text-right" componentClass={ControlLabel}>
            <div className="form-label">Type your opponent&quot;s name</div>
          </Col>
          <Col lg={4} sm={6} xs={12}>
            <FormControl type="text" placeholder="Bill" onChange={this.handleOpponentDisplayNameChange}/>
            <HelpBlock>{getVal(validationState, 'opponentDisplayName.description')}</HelpBlock>
          </Col>
        </FormGroup>
        <Row className="text-center margin-top-40">
          <Col sm={8} smOffset={2} lg={4} lgOffset={4}>
            <Button
              bsStyle="primary"
              className={classNames('btn-lg', isFetching ? 'disabled' : '')}
              type="submit"
              >
              {
                isFetching ?
                  <LoadingIcon/> :
                  'Create'
              }
            </Button>
          </Col>
        </Row>
        <style jsx>{`
          .form-label {
            font-size: 20px;
            margin-top: 10px;
          }
          @media screen and (max-width: 768px) {
            #form-large {
              margin-top: 30px;
            }
            .form-label {
              text-align: left;
              margin-top: 0px;
            }
          }
        `}</style>
        <style jsx global>{`
          .create-challenge-form-group {
            margin-bottom: 0px !important;
          }
        `}</style>
      </Form>
    );
  }
}

CreateChallengeForm.propTypes = {
  myPlayerDisplayName: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onOpponentDisplayNameChange: React.PropTypes.func.isRequired
};

export default CreateChallengeForm;
