import { Row, Col, Well } from 'react-bootstrap';
import Link from 'next/link';
import NoChallenges from './no-challenges';

const Challenges = ({ challenges }) => {
  if (challenges.length === 0) {
    return <NoChallenges/>;
  }
  return (
    <div>
      <Row style={{ marginBottom: '20px' }}>
        <Col xs={12}>
          <Link href="create-challenge"><a><strong>Create another challenge...</strong></a></Link>
        </Col>
      </Row>
      <Row>
        {
          challenges.map(challenge =>
            <Col
              key={challenge.key}
              className="text-center"
              lg={3}
              md={4}
              sm={6}
              xs={12}
              >
              <Well>
                <div className="challenge-name">{ challenge.displayName }</div>
              </Well>
            </Col>
          )
        }
      </Row>
      <style jsx>{`
        a {
          font-size: 20px;
        }

        .challenge-name {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

Challenges.propTypes = {
  challenges: React.PropTypes.array.isRequired
};

export default Challenges;
