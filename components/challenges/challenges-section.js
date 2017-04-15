import { Row, Col, Well, OverlayTrigger, Popover } from 'react-bootstrap';
import pull from 'lodash/pull';

const stringifyOpponents = (allPlayers, myPlayer) => {
  const opponents = pull(Object.values(allPlayers), myPlayer);
  return opponents.join(', ');
};

const pendingPopover = (allPlayers, myPlayer) => {
  const opponents = pull(Object.values(allPlayers), myPlayer);
  return (
    <Popover id="pending-popover">
      <strong>{opponents[0]}</strong> wants to challenge you!
    </Popover>
  );
};

const warningPopover = (allPlayers, myPlayer) => {
  const opponents = pull(Object.values(allPlayers), myPlayer);
  return (
    <Popover id="pending-popover">
      <strong>{opponents[0]}</strong> has not accepted their challenge yet!
    </Popover>
  );
};

const ChallengesSection = ({
  challenges,
  onClickAcceptChallenge,
  player,
  type,
  title
}) => {
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
              <Well style={{ padding: 0, display: 'flex' }}>
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
                <div className="challenge-name text-center">
                  <strong>{challenge.displayName}</strong><br />
                  (vs.
                  {' '}
                  {stringifyOpponents(challenge.players, player.displayName)}
                  )
                </div>
                {type === 'pending' &&
                  <div
                    className="accept-button"
                    onClick={onClickAcceptChallenge(challenge.key)}
                  >
                    <i className="material-icons accept">check</i>
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
          background-color: #2ecc71;
          cursor: pointer;
        }
        .accept-button:hover {
          background-color: #27ae60;
        }
        .accept-button:active {
          background-color: #259f59;
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
    </div>
  );
};

ChallengesSection.propTypes = {
  challenges: React.PropTypes.array.isRequired,
  onClickAcceptChallenge: React.PropTypes.func,
  player: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired
};

ChallengesSection.defaultProps = {
  onClickAcceptChallenge: () => {}
};

export default ChallengesSection;
