export default () => (
  <div className="wrapper">
    <img src="/static/boxing.png" width="300px" />
    <div className="title-wrapper">
      <div className="title">Duelour</div>
    </div>
    <div className="sub-title">Coming Soon...</div>
    <style jsx>{`
      .wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: -50px;
      }

      .sub-title {
        font-size: 30px;
        margin-top: 30px;
        color: #cc4b46;
      }

      .title {
        font-weight: bold;
        font-size: 60px;
        color: #cc4b46;
      }

      .title-wrapper {
        margin-top: -15px;
      }
    `}</style>
  </div>
)
