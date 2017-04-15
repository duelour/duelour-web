import {
  Button,
  ControlLabel,
  Form,
  FormGroup,
  FormControl,
  HelpBlock,
  Row,
  Col
} from "react-bootstrap";
import classNames from "classnames";
import find from "lodash/find";
import getVal from "lodash/get";
import LoadingIcon from "../common/loading-icon";

const VALIDATION = {
  displayName: ["isNotEmpty"],
  opponentDisplayName: ["isNotEmpty"]
};

class CreateChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      validationState: {},
      opponentKey: ""
    };
    this.checkIfValid = this.checkIfValid.bind(this);
    this.doesFormHaveErrors = this.doesFormHaveErrors.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpponentDisplayNameChange = this.handleOpponentDisplayNameChange.bind(
      this
    );
  }

  checkIfValid(name, value, defaultState = "success") {
    const { validationState } = this.state;
    const validators = VALIDATION[name];

    if (validators && validators.includes("isNotEmpty") && value.length === 0) {
      this.setState({
        validationState: Object.assign(validationState, {
          [name]: {
            state: "error",
            description: "Please enter a name!"
          }
        })
      });
      return;
    }
    this.setState({
      validationState: Object.assign(validationState, {
        [name]: {
          state: defaultState,
          description: null
        }
      })
    });
  }

  doesFormHaveErrors() {
    const { validationState } = this.state;
    return find(validationState, s => s.state === "error");
  }

  async handleSubmit(e) {
    const {
      displayName,
      opponentDisplayName,
      opponentKey,
      validationState
    } = this.state;
    const { onSubmit } = this.props;

    e.preventDefault();
    this.setState({ isFetching: true });

    if (!displayName) {
      this.setState({
        validationState: Object.assign(validationState, {
          displayName: {
            state: "error",
            description: "Please enter a name!"
          }
        })
      });
    }
    if (!opponentDisplayName || !opponentKey) {
      this.setState({
        validationState: Object.assign(validationState, {
          opponentDisplayName: {
            state: "error",
            description: "Please enter your opponents name!"
          }
        })
      });
    }
    if (this.doesFormHaveErrors()) {
      this.setState({ isFetching: false });
      return;
    }

    await onSubmit({ displayName, opponentKey, opponentDisplayName });
  }

  handleChange(name, defaultState = "success") {
    return e => {
      this.checkIfValid(name, e.target.value, defaultState);
      this.setState({ [name]: e.target.value });
    };
  }

  handleOpponentDisplayNameChange(e) {
    const { validationState } = this.state;
    const { onOpponentDisplayNameChange, myNormalizedDisplayName } = this.props;
    const value = e.target.value;

    this.handleChange("opponentDisplayName", null)(e);

    onOpponentDisplayNameChange(value, player => {
      if (myNormalizedDisplayName === value.toLowerCase()) {
        this.setState({
          validationState: Object.assign(validationState, {
            opponentDisplayName: {
              state: "error",
              description: "You cannot challenge yourself, silly!"
            }
          })
        });
      } else if (player) {
        this.setState({
          opponentKey: player.key,
          opponentDisplayName: player.displayName,
          validationState: Object.assign(validationState, {
            opponentDisplayName: {
              state: "success",
              description: (
                <span>Player <strong>{player.displayName}</strong> found!</span>
              )
            }
          })
        });
      } else {
        this.setState({
          validationState: Object.assign(validationState, {
            opponentDisplayName: {
              state: "error",
              description: (
                <span>Player <strong>{value}</strong> not found!</span>
              )
            }
          })
        });
      }
    });
  }

  render() {
    const { isFetching, validationState } = this.state;
    return (
      <Form horizontal id="form-large" onSubmit={this.handleSubmit}>
        <FormGroup
          className="create-challenge-form-group"
          validationState={getVal(validationState, "displayName.state")}
        >
          <Col
            lg={5}
            sm={4}
            xs={12}
            className="text-right"
            componentClass={ControlLabel}
          >
            <div className="form-label">Name your challenge</div>
          </Col>
          <Col lg={4} sm={6} xs={12}>
            <FormControl
              type="text"
              placeholder="Cool challenge"
              onChange={this.handleChange("displayName")}
            />
            <HelpBlock>
              {getVal(validationState, "displayName.description")}
            </HelpBlock>
          </Col>
        </FormGroup>
        <FormGroup
          className="create-challenge-form-group"
          validationState={getVal(validationState, "opponentDisplayName.state")}
        >
          <Col
            lg={5}
            sm={4}
            xs={12}
            className="text-right"
            componentClass={ControlLabel}
          >
            <div className="form-label">Type your opponent's name</div>
          </Col>
          <Col lg={4} sm={6} xs={12}>
            <FormControl
              type="text"
              placeholder="Bill"
              onChange={this.handleOpponentDisplayNameChange}
            />
            <HelpBlock>
              {getVal(validationState, "opponentDisplayName.description")}
            </HelpBlock>
          </Col>
        </FormGroup>
        <Row className="text-center margin-top-40">
          <Col sm={8} smOffset={2} lg={4} lgOffset={4}>
            <Button
              bsStyle="primary"
              className={classNames("btn-lg", isFetching ? "disabled" : "")}
              type="submit"
            >
              {isFetching ? <LoadingIcon /> : "Create"}
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
  myNormalizedDisplayName: React.PropTypes.string.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onOpponentDisplayNameChange: React.PropTypes.func.isRequired
};

export default CreateChallengeForm;
