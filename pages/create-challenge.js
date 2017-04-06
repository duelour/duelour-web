import Router from 'next/router';
import { withFirebase } from '../lib/firebase';
import { createChallengeForPlayer } from '../lib/challenges';
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
    try {
      await createChallengeForPlayer(displayName, myPlayer.displayName);
      await Router.push('/');
    } catch (err) {
      console.log('Error creating challenge ', err);
    }
  }

  render() {
    return (
      <PageWithHeader title={<div>Create a challenge</div>}>
        <CreateChallengeForm onSubmit={this.handleCreateChallenge}/>
      </PageWithHeader>
    );
  }
}

export default withFirebase(CreateChallenge, { isProtected: true });
