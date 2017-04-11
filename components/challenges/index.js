import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import getVal from 'lodash/get';
import ChallengesSection from './challenges-section';
import NoChallenges from './no-challenges';

const Challenges = ({ challenges, player }) => {
  if (getVal(challenges, 'active.length', 0) === 0 && getVal(challenges, 'pending.length', 0) === 0) {
    return <NoChallenges/>;
  }
  return (
    <div>
      <Row>
        <Col xs={12}>
          <Link href="create-challenge"><a><strong>Create challenge...</strong></a></Link>
        </Col>
      </Row>
      {
        getVal(challenges, 'pending.length', 0) > 0 &&
        <ChallengesSection
          title="Challenges pending approval"
          type="pending"
          challenges={challenges.pending}
          player={player}
          />
      }
      {
        getVal(challenges, 'active.length', 0) > 0 &&
        <ChallengesSection
          title="Active challenges"
          type="active"
          challenges={challenges.active}
          player={player}
          />
      }
      <style jsx>{`
        a {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

Challenges.propTypes = {
  challenges: React.PropTypes.object.isRequired,
  player: React.PropTypes.object.isRequired
};

export default Challenges;
