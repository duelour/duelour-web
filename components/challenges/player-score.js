import PropTypes from 'prop-types';
import { Panel, Table, Popover, OverlayTrigger } from 'react-bootstrap';

const PlayerScore = ({
  enableAddWin,
  hasAccepted,
  playerName,
  totalWins,
  totalLosses,
  totalDraws,
  totalScore,
  status
}) => {
  let panelClass = '';
  let textClass = '';
  if (status === 'winning') {
    panelClass = 'panel-success';
    textClass = 'text-success';
  } else if (status === 'losing') {
    panelClass = 'panel-danger';
    textClass = 'text-danger';
  }
  return (
    <div>
      <Panel
        className={panelClass}
        header={
          <h2 className="text-primary">
            <strong>{playerName}</strong>
            {!hasAccepted &&
              <OverlayTrigger
                rootClose
                trigger={['hover', 'click']}
                placement="top"
                overlay={
                  <Popover id="pending-popover">
                    <strong>{playerName}</strong>
                    {' '}
                    has not accepted their challenge yet!
                  </Popover>
                }
              >
                <i className="error material-icons">error</i>
              </OverlayTrigger>}
          </h2>
        }
        footer={
          <Table>
            <thead>
              <tr>
                <th className="text-center">Wins</th>
                <th className="text-center">Draws</th>
                <th className="text-center">Losses</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalWins}</td>
                <td>{totalDraws}</td>
                <td>{totalLosses}</td>
              </tr>
            </tbody>
          </Table>
        }
      >
        {enableAddWin &&
          <div className="action">
            <a>Add win</a>
          </div>}
        <h1 className={textClass}>
          {totalScore}
        </h1>
      </Panel>
      <style jsx>{`
        h1 {
          font-size: 70px !important;
          margin-bottom: 30px !important;
        }
        h2 {
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .text-success {
          color: #2ecc71 !important;
        }
        .text-danger {
          color: #ed5f59 !important;
        }
        th, td {
          width: 33%;
          font-size: 30px !important;
          font-weight: 300 !important;
        }
        td {
          font-weight: bold !important;
          font-size: 40px !important;
        }
        .error {
          color: #ed5f59;
          margin-left: 5px;
          margin-top: 6px;
        }
        .action {
          position: absolute;
          font-size: 20px;
        }
      `}</style>
      <style jsx global>{`
        .panel-title {
          font-size: 30px !important;
        }
        .panel-body {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

PlayerScore.propTypes = {
  enableAddWin: PropTypes.bool.isRequired,
  hasAccepted: PropTypes.bool.isRequired,
  playerName: PropTypes.string.isRequired,
  totalWins: PropTypes.number.isRequired,
  totalLosses: PropTypes.number.isRequired,
  totalDraws: PropTypes.number.isRequired,
  totalScore: PropTypes.number.isRequired,
  status: PropTypes.oneOf(['winning', 'losing', 'draw']).isRequired
};

export default PlayerScore;
