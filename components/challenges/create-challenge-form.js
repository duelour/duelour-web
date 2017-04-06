import { Button, FormGroup, FormControl, HelpBlock, Row, Col } from 'react-bootstrap';
import classNames from 'classnames';
import LoadingIcon from '../common/loading-icon';

class CreateChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayName: '', isFetching: false, validationErrors: {} };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    const { displayName } = this.state;
    const { onSubmit } = this.props;
    e.preventDefault();
    this.setState({ isFetching: true });

    if (!displayName) {
      this.setState({ isFetching: false, validationErrors: Object.assign(this.state.validationErrors, { displayName: 'Please enter a name!' }) });
      return;
    }

    await onSubmit(displayName);
  }

  onChange(name) {
    return e => {
      this.setState({ [name]: e.target.value, validationErrors: { [name]: null } });
    };
  }

  render() {
    const { isFetching, validationErrors } = this.state;
    return (
      <form id="form-large" onSubmit={this.handleSubmit}>
        <Row className="create-challenge-wrapper">
          <Col lg={5} sm={4} xs={12} className="text-right">
            <div className="form-label">Name your challenge</div>
          </Col>
          <Col lg={4} sm={6} xs={12}>
            <FormGroup className="create-challenge-form-group" validationState={validationErrors.displayName ? 'error' : null}>
              <FormControl type="text" placeholder="Cool challenge" onChange={this.onChange('displayName')}/>
              <HelpBlock>{validationErrors.displayName}</HelpBlock>
            </FormGroup>
          </Col>
        </Row>
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
            margin-top: 15px;
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
      </form>
    );
  }
}

CreateChallengeForm.propTypes = {
  onSubmit: React.PropTypes.func.isRequired
};

export default CreateChallengeForm;
