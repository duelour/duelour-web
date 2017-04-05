import { withFirebase } from '../lib/firebase';
import PageWithHeader from '../components/common/page-with-header';

class CreateChallenge extends React.Component {
  render() {
    return (
      <PageWithHeader title="Create a challenge">
        ye boiii
      </PageWithHeader>
    );
  }
}

export default withFirebase(CreateChallenge, { isProtected: true });
