import Router from 'next/router';
import withFirebase from '../lib/with-firebase';
import {
  getChallengesFromStorage,
  setChallengesInStorage
} from '../lib/data/challenges';
import {
  getPlayerChallenges,
  acceptChallengeForPlayer
} from '../lib/controllers/challenges';
import LoadingIcon from '../components/common/loading-icon';
import Notification from '../components/common/notification';
import PageWithHeader from '../components/common/page-with-header';
import Challenges from '../components/challenges/index';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isFetching: true, challenges: [] };
    this.handleAcceptChallenge = this.handleAcceptChallenge.bind(this);
  }

  async componentDidMount() {
    const { player } = this.props;

    const challengesFromStorage = getChallengesFromStorage();
    if (challengesFromStorage.active || challengesFromStorage.pending) {
      this.setState({ isFetching: false, challenges: challengesFromStorage });
    }

    getPlayerChallenges.on(
      player.key,
      pendingChallenges => {
        this.setState({
          isFetching: false,
          challenges: Object.assign({}, this.state.challenges, {
            pending: pendingChallenges
          })
        });
      },
      'pending'
    );

    getPlayerChallenges.on(
      player.key,
      activeChallenges => {
        setChallengesInStorage(
          Object.assign({}, challengesFromStorage, { active: activeChallenges })
        );
        this.setState({
          isFetching: false,
          challenges: Object.assign({}, this.state.challenges, {
            active: activeChallenges
          })
        });
      },
      'active'
    );
  }

  componentWillUnmount() {
    const { player } = this.props;
    getPlayerChallenges.off(player.key, 'pending');
    getPlayerChallenges.off(player.key, 'active');
  }

  async handleAcceptChallenge(challengeKey) {
    const { player } = this.props;
    try {
      await acceptChallengeForPlayer(challengeKey, player.key);
      return this.notification.success('GAME ON! good luck! 🔥🔥');
    } catch (err) {
      return this.notification.error(
        "Error! Can't accept that challenge right now"
      );
    }
  }

  handleGoToChallenge(challengeKey) {
    return () => {
      Router.push({
        pathname: '/challenges',
        query: { key: challengeKey }
      });
    };
  }

  render() {
    const { isFetching, challenges } = this.state;
    const { player } = this.props;
    return (
      <PageWithHeader
        title={challenges.length > 0 ? <div>Your challenges</div> : <div />}
      >
        <Notification
          ref={notification => {
            this.notification = notification;
          }}
        />
        {isFetching
          ? <div className="text-center">
              <LoadingIcon color="#ed5f59" width="100" />
            </div>
          : <Challenges
              challenges={challenges}
              player={player}
              onClickAcceptChallenge={this.handleAcceptChallenge}
              onClickChallenge={this.handleGoToChallenge}
            />}
      </PageWithHeader>
    );
  }
}

Index.propTypes = {
  player: React.PropTypes.object
};

Index.defaultProps = {
  player: {}
};

export default withFirebase(Index, { isProtected: true });
