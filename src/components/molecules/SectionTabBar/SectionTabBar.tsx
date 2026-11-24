import logo from "../../../assets/logo.png";
import "./SectionTabBar.css";

export function SectionTabBar() {
  return (
    <div className="ff-section-tabs">
      <div className="ff-section-tabs__tab ff-section-tabs__tab--active">
        <span className="ff-section-tabs__search-icon" />
        Search
      </div>
      <div className="ff-section-tabs__spacer" />
      <div className="ff-section-tabs__wordmark">
        <img src={logo} className="ff-section-tabs__orb" alt="Jellywire" />
        <span className="ff-section-tabs__wordmark-text">
          JELLY<span className="ff-section-tabs__wordmark-accent">WIRE</span>
        </span>
      </div>
    </div>
  );
}
