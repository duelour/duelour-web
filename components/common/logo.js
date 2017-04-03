export default () => (
  <div className="center-align">
    <img src="/static/boxing.png" width="300px"/>
    <div className="title-wrapper">
      <div className="title"><span>Duelour</span></div>
    </div>
    <style jsx>{`
      .center-align {
        text-align: center;
      }

      .title {
        font-weight: bold;
        font-size: 60px;
        color: #cc4b46;
        height: 100px;
        margin-top: -20px;
      }
    `}</style>
  </div>
);
