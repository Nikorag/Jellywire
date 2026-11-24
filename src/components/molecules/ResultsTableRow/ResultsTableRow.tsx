import { CategoryIcon, StarRating } from "../../atoms";
import type { MediaCategory, SearchResult } from "../../../types/jellyfin";
import { formatBytes } from "../../../lib/format";
import "./ResultsTableRow.css";

export interface ResultsTableRowProps {
  result: SearchResult;
  category: MediaCategory;
  selected: boolean;
  onSelect: () => void;
  onFetch: () => void;
}

export function ResultsTableRow({ result, category, selected, onSelect, onFetch }: ResultsTableRowProps) {
  const stars = result.communityRating ? Math.round(result.communityRating / 2) : 0;

  return (
    <div
      className={["ff-results-row", selected ? "ff-results-row--selected" : ""].join(" ")}
      onClick={onSelect}
      onDoubleClick={onFetch}
    >
      <div className="ff-results-row__cell">
        <StarRating stars={stars} selected={selected} />
      </div>
      <div className="ff-results-row__cell ff-results-row__cell--right">{result.playCount ?? 0}</div>
      <div className="ff-results-row__cell ff-results-row__cell--name">
        <CategoryIcon category={category} />
        <span className="ff-results-row__name">{result.filename}</span>
      </div>
      <div className="ff-results-row__cell">{result.container ?? "—"}</div>
      <div className="ff-results-row__cell ff-results-row__cell--right">{formatBytes(result.sizeBytes)}</div>
      <div className="ff-results-row__cell ff-results-row__cell--right">
        {result.bitrateKbps ? `${(result.bitrateKbps / 1000).toFixed(1)} Mbps` : "—"}
      </div>
      <div className="ff-results-row__cell ff-results-row__cell--mark">
        {result.alreadyDownloaded ? "✓" : ""}
      </div>
    </div>
  );
}
