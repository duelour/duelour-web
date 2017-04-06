import Router from 'next/router';
import { withFirebase } from '../lib/firebase';
import { createChallenge } from '../lib/challenges';
import { getPlayer } from '../lib/players';
import PageWithHeader from '../components/common/page-with-header';
import CreateChallengeForm from '../components/challenges/create-challenge-form';

class CreateChallenge extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateChallenge = this.handleCreateChallenge.bind(this);
  }

  async handleCreateChallenge(displayName) {
    const myPlayer = getPlayer();
    await createChallenge(myPlayer.displayName, { displayName });
    await Router.push('/');
  }

  render() {
    return (
      <PageWithHeader title="Create a challenge">
        <CreateChallengeForm onSubmit={this.handleCreateChallenge}/>
      </PageWithHeader>
    );
  }
}

export default withFirebase(CreateChallenge, { isProtected: true });
