import PropTypes from 'prop-types';
import { Row, Col, Well, OverlayTrigger, Popover } from 'react-bootstrap';
import pull from 'lodash/pull';
import LoadingIcon from '../common/loading-icon';

const stringifyOpponents = (allPlayers, myPlayer) => {
  const opponents = Object.values(allPlayers);
  const opponentNames = pull(
    opponents.map(player => player.displayName),
    myPlayer
  );
  return opponentNames.join(', ');
};

const pendingPopover = (allPlayers, myPlayer) => {
  const opponents = stringifyOpponents(allPlayers, myPlayer);
  return (
    <Popover id="pending-popover">
      <strong>{opponents}</strong> wants to challenge you!
    </Popover>
  );
};

const warningPopover = (allPlayers, myPlayer) => {
  const opponents = stringifyOpponents(allPlayers, myPlayer);
  return (
    <Popover id="pending-popover">
      <strong>{opponents}</strong> has not accepted their challenge yet!
    </Popover>
  );
};

class ChallengesSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false, loadingKey: null };
    this.handleAcceptChallenge = this.handleAcceptChallenge.bind(this);
  }

  handleAcceptChallenge(challengeKey) {
    return async () => {
      const { onClickAcceptChallenge } = this.props;
      this.setState({ isLoading: true, loadingKey: challengeKey });
      try {
        await onClickAcceptChallenge(challengeKey);
        this.setState({ isLoading: false, loadingKey: null });
      } catch (err) {
        this.setState({ isLoading: false, loadingKey: null });
      }
    };
  }

  render() {
    const { challenges, onClickChallenge, player, type, title } = this.props;
    const { isLoading, loadingKey } = this.state;
    return (
      <div>
        <Row>
          <Col xs={12}>
            <h3>{title}</h3>
          </Col>
        </Row>
        <Row>
          {challenges &&
            challenges.map(challenge => (
              <Col key={challenge.key} lg={3} md={4} sm={6} xs={12}>
                <Well className="challenge-well">
                  {type === 'active' &&
                    challenge.status === 'pending' &&
                    <OverlayTrigger
                      rootClose
                      trigger={['hover', 'click']}
                      placement="top"
                      overlay={warningPopover(
                        challenge.players,
                        player.displayName
                      )}
                    >
                      <i className="error material-icons">error</i>
                    </OverlayTrigger>}
                  {type === 'pending' &&
                    <OverlayTrigger
                      rootClose
                      trigger={['hover', 'click']}
                      placement="top"
                      overlay={pendingPopover(
                        challenge.players,
                        player.displayName
                      )}
                    >
                      <i className="warning material-icons">warning</i>
                    </OverlayTrigger>}
                  <div
                    className="challenge-name text-center"
                    onClick={onClickChallenge(challenge.key)}
                  >
                    <strong>{challenge.displayName}</strong><br />
                    (vs.
                    {' '}
                    {stringifyOpponents(challenge.players, player.displayName)}
                    )
                  </div>
                  {type === 'pending' &&
                    <div
                      className={
                        isLoading && loadingKey === challenge.key
                          ? 'accept-button disabled-button'
                          : 'accept-button'
                      }
                      onClick={this.handleAcceptChallenge(challenge.key)}
                    >
                      {isLoading && loadingKey === challenge.key
                        ? <LoadingIcon width={24} />
                        : <i className="accept material-icons">check</i>}
                    </div>}
                </Well>
              </Col>
            ))}
        </Row>
        <style jsx>{`
          i {
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .warning {
            color: #f39c12;
            margin-left: 15px;
          }
          .error {
            color: #ed5f59;
            margin-left: 15px;
          }
          .accept-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #2ecc71;
            cursor: pointer;
            width: 40px;
          }
          .accept-button:hover {
            background-color: #27ae60;
          }
          .accept-button:active {
            background-color: #259f59;
          }
          .disabled-button {
            background-color: #83c7a0;
            cursor: not-allowed;
          }
          .disabled-button:hover {
            background-color: #83c7a0;
          }
          .accept {
            padding-right: 15px;
            padding-left: 15px;
            color: white;
          }
          .challenge-name {
            padding-top: 10px;
            padding-bottom: 10px;
            font-size: 20px;
            flex-grow: 1;
          }
        `}</style>
        <style global jsx>{`
          .challenge-well {
            padding: 0 !important;
            display: flex !important;
          }
          .challenge-well:hover {
            background-color: #f7f7f7;
            cursor: pointer;
          }
          .challenge-well:active {
            background-color: #e8e8e8;
          }
        `}</style>
      </div>
    );
  }
}

ChallengesSection.propTypes = {
  challenges: PropTypes.array.isRequired,
  onClickAcceptChallenge: PropTypes.func,
  onClickChallenge: PropTypes.func,
  player: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

ChallengesSection.defaultProps = {
  onClickAcceptChallenge: null,
  onClickChallenge: null
};

export default ChallengesSection;
