import "./ResultsTableHeader.css";

export type ResultSortKey = "quality" | "plays" | "name" | "type" | "size" | "bitrate";

export interface ResultsTableHeaderProps {
  onSort: (key: ResultSortKey) => void;
}

const COLUMNS: { key: ResultSortKey; label: string; align?: "right" | "center" }[] = [
  { key: "quality", label: "Quality" },
  { key: "plays", label: "#", align: "right" },
  { key: "name", label: "Name", align: "center" },
  { key: "type", label: "Type" },
  { key: "size", label: "Size", align: "right" },
  { key: "bitrate", label: "Bitrate", align: "right" },
];

export function ResultsTableHeader({ onSort }: ResultsTableHeaderProps) {
  return (
    <div className="ff-results-header">
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className="ff-results-header__cell"
          style={{ textAlign: col.align }}
          onClick={() => onSort(col.key)}
        >
          {col.label}
        </div>
      ))}
      <div className="ff-results-header__cell ff-results-header__cell--mark" />
    </div>
  );
}
