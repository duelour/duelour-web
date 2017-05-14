import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import getVal from 'lodash/get';
import ChallengesSection from './challenges-section';
import NoChallenges from './no-challenges';

const Challenges = ({
  challenges,
  onClickAcceptChallenge,
  onClickChallenge,
  player
}) => {
  if (
    getVal(challenges, 'active.length', 0) === 0 &&
    getVal(challenges, 'pending.length', 0) === 0
  ) {
    return <NoChallenges />;
  }
  return (
    <div className="challenges-wrapper">
      <Row>
        <Col xs={12}>
          <Link href="create-challenge">
            <a><strong>Create challenge...</strong></a>
          </Link>
        </Col>
      </Row>
      {getVal(challenges, 'pending.length', 0) > 0 &&
        <ChallengesSection
          title="Challenges pending approval"
          type="pending"
          challenges={challenges.pending}
          player={player}
          onClickAcceptChallenge={onClickAcceptChallenge}
          onClickChallenge={onClickChallenge}
        />}
      {getVal(challenges, 'active.length', 0) > 0 &&
        <ChallengesSection
          title="Active challenges"
          type="active"
          challenges={challenges.active}
          player={player}
          onClickChallenge={onClickChallenge}
        />}
      <style jsx>{`
        a {
          font-size: 20px;
        }
        @media screen and (max-width: 768px) {
          .challenges-wrapper {
            position: absolute;
            top: 30px;
          }
        }
      `}</style>
    </div>
  );
};

Challenges.propTypes = {
  challenges: PropTypes.object.isRequired,
  onClickAcceptChallenge: PropTypes.func.isRequired,
  onClickChallenge: PropTypes.func.isRequired,
  player: PropTypes.object.isRequired
};

export default Challenges;
