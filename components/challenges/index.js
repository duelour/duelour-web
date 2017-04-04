const Challenges = () => {
  return (
    <div className="no-active">
      <strong className="no-active-text">You have no active challenges!</strong>
      <style jsx>{`
        .no-active-text {
          font-size: 50px;
        }
        .no-active {
          text-align: center;
          margin-top: 100px;
        }
        @media screen and (max-width: 768px) {
          .no-active-text {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
};

Challenges.propTypes = {
};

export default Challenges;
