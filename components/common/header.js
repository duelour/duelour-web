import { Row, Col } from "react-bootstrap";
import Logo from "./logo";

const Header = ({ player, onClickLogout, title }) => {
  return (
    <div>
      <Row
        className="hidden-lg hidden-md hidden-sm text-right"
        style={{ marginTop: "10px" }}
      >
        <Col xs={12}>
          <a href="#" onClick={onClickLogout}>Logout</a>
        </Col>
      </Row>
      <Row className="margin-top-20 margin-bottom-40">
        <Col xsHidden sm={4}>
          <div className="logo">
            <Logo imageWidth="80px" fontSize="25px" />
          </div>
        </Col>
        <Col sm={4} className="text-center">
          <div className="header-title">
            <strong className="header-title-text">{title}</strong>
          </div>
        </Col>
        <Col xsHidden sm={4} className="text-right">
          <div className="user">
            <div>
              <strong className="welcome">
                Welcome, {player.displayName}!
              </strong>
            </div>
            <div className="user-link">
              <a href="#" onClick={onClickLogout}>Logout</a>
            </div>
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .logo {
          margin-top: 10px;
          width: 130px;
        }

        .header-title {
          margin-top: 10px !important;
        }
        .header-title-text {
          font-size: 40px;
        }
        @media screen and (max-width: 768px) {
          .header-title {
            margin-top: 10px !important;
          }
          .header-title-text {
            font-size: 30px;
          }
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
    </div>
  );
};

Header.propTypes = {
  player: React.PropTypes.object,
  onClickLogout: React.PropTypes.func.isRequired,
  title: React.PropTypes.object.isRequired
};

Header.defaultProps = {
  player: {}
};

export default Header;
