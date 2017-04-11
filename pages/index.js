import withFirebase from '../lib/with-firebase';
import { getPlayerChallenges, getChallengesFromStorage, setChallengesInStorage } from '../lib/challenges';
import LoadingIcon from '../components/common/loading-icon';
import PageWithHeader from '../components/common/page-with-header';
import Challenges from '../components/challenges/index';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isFetching: true, challenges: [] };
  }

  async componentDidMount() {
    const { player } = this.props;

    const challengesFromStorage = getChallengesFromStorage();
    if (challengesFromStorage.active || challengesFromStorage.pending) {
      this.setState({ isFetching: false, challenges: challengesFromStorage });
    }

    const [activeChallenges, pendingChallenges] = await Promise.all([
      getPlayerChallenges(player.displayName),
      getPlayerChallenges(player.displayName, 'pending')
    ]);
    const challenges = { active: activeChallenges, pending: pendingChallenges };
    setChallengesInStorage(challenges);
    this.setState({ isFetching: false, challenges });
  }

  render() {
    const { isFetching, challenges } = this.state;
    const { player } = this.props;
    return (
      <PageWithHeader title={challenges.length > 0 ? <div>Your challenges</div> : <div/>}>
        {
          isFetching ?
            <div className="text-center"><LoadingIcon color="#ed5f59" width="100"/></div> :
            <Challenges challenges={challenges} player={player}/>
        }
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
