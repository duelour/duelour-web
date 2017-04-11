import Router from 'next/router';
import debounce from 'lodash/debounce';
import withFirebase from '../lib/with-firebase';
import { createChallengeForPlayer } from '../lib/challenges';
import { findPlayerByDisplayNameOnce } from '../lib/players';
import PageWithHeader from '../components/common/page-with-header';
import CreateChallengeForm from '../components/challenges/create-challenge-form';

class CreateChallenge extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateChallenge = this.handleCreateChallenge.bind(this);
  }

  async handleCreateChallenge({ displayName, opponentDisplayName }) {
    const { player } = this.props;
    try {
      await createChallengeForPlayer(displayName, [player.displayName, opponentDisplayName], player.key);
      Router.push('/');
    } catch (err) {
      console.log('Error creating challenge ', err);
    }
  }

  async handleOpponentDisplayNameChange(displayName, callback) {
    if (displayName && displayName.length > 0) {
      const snapshot = await findPlayerByDisplayNameOnce(displayName);
      if (snapshot) {
        callback(snapshot.val());
      }
    }
  }

  render() {
    const { player } = this.props;
    return (
      <PageWithHeader title={<div>Create a challenge</div>}>
        <CreateChallengeForm
          myPlayerKey={player.key}
          onOpponentDisplayNameChange={debounce(this.handleOpponentDisplayNameChange, 500)}
          onSubmit={this.handleCreateChallenge}
          />
      </PageWithHeader>
    );
  }
}

CreateChallenge.propTypes = {
  player: React.PropTypes.object.isRequired
};

export default withFirebase(CreateChallenge, { isProtected: true });
