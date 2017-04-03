const Logo = ({ width }) => (
  <div className="center-align">
    <img src="/static/boxing.png" width={width}/>
    <div className="title-wrapper">
      <div className="title"><span>Duelour</span></div>
    </div>
    <style jsx>{`
      .center-align {
        text-align: center;
      }

      .title {
        font-weight: bold;
        font-size: 50px;
        color: #cc4b46;
        height: 100px;
      }
    `}</style>
  </div>
);

Logo.propTypes = {
  width: React.PropTypes.string
};

Logo.defaultProps = {
  width: '300px'
};

export default Logo;
