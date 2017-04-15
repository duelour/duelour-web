import Logo from '../common/logo';

export default () => (
  <div className="wrapper">
    <Logo />
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
    `}</style>
  </div>
);
