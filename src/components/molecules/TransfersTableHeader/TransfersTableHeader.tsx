import "./TransfersTableHeader.css";

export function TransfersTableHeader() {
  return (
    <div className="ff-transfers-header">
      <div className="ff-transfers-header__cell" style={{ textAlign: "center" }}>
        Name
      </div>
      <div className="ff-transfers-header__cell" style={{ textAlign: "right" }}>
        Size
      </div>
      <div className="ff-transfers-header__cell">Status</div>
      <div className="ff-transfers-header__cell" style={{ textAlign: "center" }}>
        Progress
      </div>
      <div className="ff-transfers-header__cell" style={{ textAlign: "right" }}>
        Speed
      </div>
      <div className="ff-transfers-header__cell ff-transfers-header__cell--last" style={{ textAlign: "right" }}>
        Time
      </div>
    </div>
  );
}
