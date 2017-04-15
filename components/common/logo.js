const Logo = ({ imageWidth, fontSize }) => (
  <div className="center-align">
    <img src="/static/boxing.png" width={imageWidth} />
    <div className="title-wrapper">
      <div className="title"><span style={{ fontSize }}>Duelour</span></div>
    </div>
    <style jsx>{`
      .center-align {
        text-align: center;
      }

      .title {
        font-weight: bold;
        color: #cc4b46;
      }
    `}</style>
  </div>
);

Logo.propTypes = {
  imageWidth: React.PropTypes.string,
  fontSize: React.PropTypes.string
};

Logo.defaultProps = {
  imageWidth: "300px",
  fontSize: "50px"
};

export default Logo;
