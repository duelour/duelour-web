import PropTypes from 'prop-types';
import Link from 'next/link';
import { Row, Col, Label } from 'react-bootstrap';
import { acceptChallengeForPlayer } from '../lib/controllers/challenges';
import withFirebase from '../lib/with-firebase';
import { findChallengeByChallengeId } from '../lib/data/challenges';
import Notification from '../components/common/notification';
import LoadingIcon from '../components/common/loading-icon';
import PageWithHeader from '../components/common/page-with-header';
import PlayerScore from '../components/challenges/player-score';

class Challenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Challenge',
      players: {},
      challengeKey: null,
      status: null,
      isFetching: true
    };
    this.handleAcceptChallenge = this.handleAcceptChallenge.bind(this);
  }

  componentDidMount() {
    const { url: { query } } = this.props;

    findChallengeByChallengeId(query.key, 'on', challengeSnapshot => {
      const challenge = challengeSnapshot.val();
      const newTitle = challenge.displayName;
      const status = challenge.status;
      this.setState({
        challengeKey: challengeSnapshot.key,
        title: newTitle,
        players: challenge.players,
        status,
        isFetching: false,
        isAccepting: false
      });
    });
  }

  componentWillUnmount() {
    const { url: { query } } = this.props;

    findChallengeByChallengeId(query.key, 'off');
  }

  async handleAcceptChallenge() {
    const { player } = this.props;
    const { challengeKey } = this.state;

    this.setState({ isAccepting: true });
    try {
      await acceptChallengeForPlayer(challengeKey, player.key);
      this.setState({ isAccepting: false });
      return this.notification.success('GAME ON! good luck! 🔥🔥');
    } catch (err) {
      this.setState({ isAccepting: false });
      return this.notification.error(
        "Error! Can't accept this challenge right now"
      );
    }
  }

  render() {
    const { title, players, status, isFetching, isAccepting } = this.state;
    const { player } = this.props;
    const challengePlayer = players[player.key] || {};

    const playerKeys = Object.keys(players);
    const player1 = players[playerKeys[0]];
    const player2 = players[playerKeys[1]];
    let player1Status = 'draw';
    let player2Status = 'draw';
    if (player1 && player2) {
      if (player1.totalScore > player2.totalScore) {
        player1Status = 'winning';
        player2Status = 'losing';
      } else if (player2.totalScore > player1.totalScore) {
        player1Status = 'losing';
        player2Status = 'winning';
      }
    }

    if (isFetching) {
      return (
        <div style={{ textAlign: 'center', marginTop: '70px' }}>
          <LoadingIcon color="#ed5f59" width="100" />
        </div>
      );
    }
    return (
      <PageWithHeader
        title={
          <div>
            <div>{title}</div>
            <div>
              <Label
                bsStyle={status === 'active' ? 'success' : 'primary'}
                className="status-label"
              >
                {status && status.toUpperCase()}
              </Label>
            </div>
            {challengePlayer.hasPlayerAccepted &&
              <div className="action">
                <a>Add draw</a>
              </div>}
            {!challengePlayer.hasPlayerAccepted &&
              <div>
                {isAccepting
                  ? <LoadingIcon color="#ed5f59" width="30" />
                  : <a
                      className="accept-challenge"
                      onClick={this.handleAcceptChallenge}
                    >
                      Accept challenge...
                    </a>}
              </div>}
          </div>
        }
        goBackPath="/"
      >
        <Notification
          ref={notification => {
            this.notification = notification;
          }}
        />
        <Link href="/">
          <a className="go-back hidden-xs">
            <i className="material-icons big-ass-icon">chevron_left</i>
          </a>
        </Link>
        <Row className="scores-wrapper">
          <Col md={5} className="text-center">
            {player1 &&
              <PlayerScore
                enableAddWin={challengePlayer.hasPlayerAccepted}
                hasAccepted={player1.hasPlayerAccepted}
                playerName={player1.displayName}
                totalWins={player1.totalWins}
                totalLosses={player1.totalLosses}
                totalDraws={player1.totalDraws}
                totalScore={player1.totalScore}
                status={player1Status}
              />}
          </Col>
          <Col md={2} className="text-center">
            <h3>VS</h3>
          </Col>
          <Col md={5} className="text-center">
            {player2 &&
              <PlayerScore
                enableAddWin={challengePlayer.hasPlayerAccepted}
                hasAccepted={player2.hasPlayerAccepted}
                playerName={player2.displayName}
                totalWins={player2.totalWins}
                totalLosses={player2.totalLosses}
                totalDraws={player2.totalDraws}
                totalScore={player2.totalScore}
                status={player2Status}
              />}
          </Col>
        </Row>
        <style jsx>{`
          h3 {
            margin-top: 5px !important;
          }
          .accept-challenge {
            font-size: 24px !important;
          }
          .action {
            font-size: 20px;
            margin-top: 20px;
            font-weight: 300 !important;
          }
        `}</style>
        <style jsx global>{`
          .status-label {
            font-size: 20px !important;
          }
          @media screen and (min-width: 768px) {
            .scores-wrapper {
              display: flex;
              align-items: center;
              margin-left: 80px !important;
              margin-right: 80px !important;
            }
          }
        `}</style>
      </PageWithHeader>
    );
  }
}

Challenges.propTypes = {
  url: PropTypes.object,
  player: PropTypes.object
};

Challenges.defaultProps = {
  url: {},
  player: {}
};

export default withFirebase(Challenges, { isProtected: true });
