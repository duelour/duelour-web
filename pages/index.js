import { withFirebase } from '../lib/firebase';
import { getPlayer } from '../lib/players';
import PageWithHeader from '../components/common/page-with-header';
import Challenges from '../components/challenges/index';

class Index extends React.Component {
  componentDidMount() {
    const player = getPlayer();
  }
  render() {
    return (
      <PageWithHeader>
        <Challenges/>
      </PageWithHeader>
    );
  }
}

export default withFirebase(Index, { isProtected: true });
