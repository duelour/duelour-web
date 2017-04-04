import { Row, Col } from 'react-bootstrap';
import Logo from './logo';

const Header = ({ member, onClickLogout }) => {
  return (
    <Row className="margin-top-20">
      <Col xsHidden sm={4}>
        <div className="logo">
          <Logo imageWidth="80px" fontSize="25px"/>
        </div>
      </Col>
      <Col sm={4}/>
      <Col sm={4} className="text-right">
        <div className="user">
          <div className="hidden-xs"><strong className="welcome">Welcome, {member.displayName}!</strong></div>
          <div className="user-link"><a href="#" onClick={onClickLogout}>Logout</a></div>
        </div>
      </Col>
      <style jsx>{`
        .logo {
          margin-top: 10px;
          width: 130px;
        }

        .user {
          margin-right: 20px;
        }

        .welcome {
          font-size: 30px;
        }

        .user-link {
          font-size: 20px;
        }
        @media screen and (max-width: 768px) {
          .user-link {
            font-size: 16px;
          }
        }
      `}</style>
    </Row>
  );
};

Header.propTypes = {
  member: React.PropTypes.object,
  onClickLogout: React.PropTypes.func.isRequired
};

Header.defaultProps = {
  member: {}
};

export default Header;
