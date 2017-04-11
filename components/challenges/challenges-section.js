import { Row, Col, Well } from 'react-bootstrap';

const ChallengesSection = ({ challenges, title }) => {
  return (
    <div>
      <Row>
        <Col xs={12}>
          <h3>{title}</h3>
        </Col>
      </Row>
      <Row>
        {
          challenges && challenges.map(challenge =>
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
        .challenge-name {
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

ChallengesSection.propTypes = {
  challenges: React.PropTypes.array.isRequired,
  title: React.PropTypes.string.isRequired
};

export default ChallengesSection;
