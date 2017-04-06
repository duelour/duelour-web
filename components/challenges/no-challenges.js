import Link from 'next/link';

const NoChallenges = () => {
  return (
    <div className="no-active">
      <strong className="no-active-text">You have no active challenges!</strong>
      <div className="create-challenge">
        <Link prefetch href="/create-challenge"><a>Create a challenge</a></Link>
      </div>
      <style jsx>{`
        .no-active-text {
          font-size: 50px;
        }
        .no-active {
          text-align: center;
          margin-top: 100px;
        }
        a {
          font-size: 20px;
        }
        .create-challenge {
          margin-top: 20px;
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

export default NoChallenges;
