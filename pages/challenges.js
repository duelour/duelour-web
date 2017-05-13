import Link from 'next/link';
import { Row, Col, Label } from 'react-bootstrap';
import withFirebase from '../lib/with-firebase';
import { findChallengeByChallengeIdOnce } from '../lib/data/challenges';
import PageWithHeader from '../components/common/page-with-header';
import PlayerScore from '../components/challenges/player-score';

class Challenges extends React.Component {
  static async getInitialProps({ query }) {
    const snapshot = await findChallengeByChallengeIdOnce(query.key);
    const challenge = snapshot.val();
    return { challenge };
  }

  constructor(props) {
    super(props);
    this.state = { title: 'Challenge' };
  }

  componentDidMount() {
    const { challenge } = this.props;
    const newTitle = challenge.displayName;
    const status = challenge.status;
    const playerKeys = Object.keys(challenge.players);
    const player1 = challenge.players[playerKeys[0]];
    const player2 = challenge.players[playerKeys[1]];
    this.setState({ title: newTitle, player1, player2, status });
  }

  render() {
    const { title, player1, player2, status } = this.state;

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
          </div>
        }
        goBackPath="/"
      >
        <Link href="/">
          <a className="go-back hidden-xs">
            <i className="material-icons big-ass-icon">chevron_left</i>
          </a>
        </Link>
        <Row className="scores-wrapper">
          <Col md={5} className="text-center">
            {player1 &&
              <PlayerScore
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
  challenge: React.PropTypes.object
};

Challenges.defaultProps = {
  challenge: {}
};

export default withFirebase(Challenges, { isProtected: true });
