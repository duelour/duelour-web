import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import ChallengesSection from './challenges-section';
import NoChallenges from './no-challenges';

const Challenges = ({ challenges }) => {
  if (challenges.length === 0) {
    return <NoChallenges/>;
  }
  return (
    <div>
      <Row>
        <Col xs={12}>
          <Link href="create-challenge"><a><strong>Create challenge...</strong></a></Link>
        </Col>
      </Row>
      <ChallengesSection title="Challenges pending approval" challenges={challenges.pending}/>
      <ChallengesSection title="Active challenges" challenges={challenges.active}/>
      <style jsx>{`
        a {
          font-size: 20px;
        }
      `}</style>
    </div>
  );
};

Challenges.propTypes = {
  challenges: React.PropTypes.array.isRequired
};

export default Challenges;
