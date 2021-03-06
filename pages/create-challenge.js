import PropTypes from 'prop-types';
import Router from 'next/router';
import Link from 'next/link';
import debounce from 'lodash/debounce';
import withFirebase from '../lib/with-firebase';
import { normalizeFbObject } from '../lib/data/firebase';
import { createChallengeForPlayer } from '../lib/controllers/challenges';
import { findPlayerByDisplayNameOnce } from '../lib/data/players';
import PageWithHeader from '../components/common/page-with-header';
import CreateChallengeForm
  from '../components/challenges/create-challenge-form';

class CreateChallenge extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateChallenge = this.handleCreateChallenge.bind(this);
  }

  async handleCreateChallenge({
    displayName,
    opponentKey,
    opponentDisplayName
  }) {
    const { player } = this.props;
    const players = [
      {
        key: player.key,
        displayName: player.displayName
      },
      {
        key: opponentKey,
        displayName: opponentDisplayName
      }
    ];

    try {
      const res = await createChallengeForPlayer(
        displayName,
        players,
        player.key
      );
      Router.push(`/challenges?key=${res.data.key}`);
    } catch (err) {
      console.log('Error creating challenge ', err);
    }
  }

  async handleOpponentDisplayNameChange(displayName, callback) {
    if (displayName && displayName.length > 0) {
      const snapshot = await findPlayerByDisplayNameOnce(displayName);
      if (snapshot && snapshot.val()) {
        callback(normalizeFbObject(snapshot.val()));
      } else {
        callback(null);
      }
    }
  }

  render() {
    const { player } = this.props;
    return (
      <PageWithHeader title={<div>Create a challenge</div>} goBackPath="/">
        <Link href="/">
          <a className="go-back hidden-xs">
            <i className="material-icons big-ass-icon">chevron_left</i>
          </a>
        </Link>
        <CreateChallengeForm
          myNormalizedDisplayName={player.normalizedDisplayName}
          onOpponentDisplayNameChange={debounce(
            this.handleOpponentDisplayNameChange,
            500
          )}
          onSubmit={this.handleCreateChallenge}
        />
      </PageWithHeader>
    );
  }
}

CreateChallenge.propTypes = {
  player: PropTypes.object.isRequired
};

export default withFirebase(CreateChallenge, { isProtected: true });
