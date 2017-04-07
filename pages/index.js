import { withFirebase } from '../lib/firebase';
import { getChallengesByChallengeKeys } from '../lib/challenges';
import { listPlayerChallenges, getPlayer } from '../lib/players';
import LoadingIcon from '../components/common/loading-icon';
import PageWithHeader from '../components/common/page-with-header';
import Challenges from '../components/challenges/index';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isFetching: true, challenges: [] };
    this.handleListChallenges = this.handleListChallenges.bind(this);
  }

  componentDidMount() {
    const player = getPlayer();
    listPlayerChallenges(player.displayName, this.handleListChallenges);
  }

  componentWillUnmount() {
    const player = getPlayer();
    listPlayerChallenges(player.displayName, this.handleListChallenges, { detatch: true });
  }

  async handleListChallenges(challengesKeysSnapshot) {
    if (!challengesKeysSnapshot.val()) {
      this.setState({ isFetching: false });
      return;
    }
    const challengeKeys = Object.keys(challengesKeysSnapshot.val()).reverse();
    const challenges = await getChallengesByChallengeKeys(challengeKeys);
    this.setState({ isFetching: false, challenges });
  }

  render() {
    const { isFetching, challenges } = this.state;
    return (
      <PageWithHeader title={challenges.length > 0 ? <div>Your challenges</div> : <div/>}>
        {
          isFetching ?
            <div className="text-center"><LoadingIcon color="#ed5f59" width="100"/></div> :
            <Challenges challenges={challenges}/>
        }
      </PageWithHeader>
    );
  }
}

export default withFirebase(Index, { isProtected: true });
