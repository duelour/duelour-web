import { Row, Col, Well, OverlayTrigger, Popover } from 'react-bootstrap';
import pull from 'lodash/pull';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import mapValues from 'lodash/mapValues';

const stringifyOpponents = (allPlayers, myPlayer) => {
  const opponents = pull(allPlayers, myPlayer);
  return opponents.join(', ');
};

const pendingPopover = (havePlayersAccepted, myPlayer) => {
  const opponents = pull(Object.keys(havePlayersAccepted), myPlayer);
  return (
    <Popover id="pending-popover"><strong>{opponents}</strong> wants to challenge you!</Popover>
  );
};

const warningPopover = (havePlayersAccepted, myPlayer) => {
  const unacceptedPlayers = Object.values(omitBy(mapValues(havePlayersAccepted, (hasAccepted, player) => {
    if (player !== myPlayer && !hasAccepted) {
      return player;
    }
    return null;
  }), isEmpty)).join(', ');

  return (
    <Popover id="warning-popover"><strong>{unacceptedPlayers}</strong> has not accepted their challenge </Popover>
  );
};

const ChallengesSection = ({ challenges, player, type, title }) => {
  return (
    <div>
      <Row>
        <Col xs={12}>
          <h3>{title}</h3>
        </Col>
      </Row>
      <Row>
        {
          challenges && challenges.map(challenge =>
            <Col
              key={challenge.key}
              lg={3}
              md={4}
              sm={6}
              xs={12}
              >
              <Well>
                {
                  type === 'active' && challenge.status === 'pending' &&
                  <OverlayTrigger
                    rootClose
                    trigger={['hover', 'click']}
                    placement="top"
                    overlay={warningPopover(challenge.havePlayersAccepted, player.displayName)}
                    >
                    <i className="error material-icons">error</i>
                  </OverlayTrigger>
                }
                {
                  type === 'pending' &&
                  <OverlayTrigger
                    rootClose
                    trigger={['hover', 'click']}
                    placement="top"
                    overlay={pendingPopover(challenge.havePlayersAccepted, player.displayName)}
                    >
                    <i className="warning material-icons">warning</i>
                  </OverlayTrigger>
                }
                <div className="challenge-name text-center">
                  <strong>{ challenge.displayName }</strong><br/>
                  (vs. {stringifyOpponents(Object.keys(challenge.havePlayersAccepted), player.displayName)})
                </div>
              </Well>
            </Col>
          )
        }
      </Row>
      <style jsx>{`
        i {
          position: absolute;
          margin-top: 15px;
          margin-left: 5px;
          cursor: pointer;
        }
        .warning {
          color: #f39c12;
        }
        .error {
          color: #ed5f59;
        }
        .challenge-name {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

ChallengesSection.propTypes = {
  challenges: React.PropTypes.array.isRequired,
  player: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired
};

export default ChallengesSection;
