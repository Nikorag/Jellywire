import { ActionButtonGroup, ResultsTableHeader, ResultsTableRow } from "../../molecules";
import type { ActionButtonSpec } from "../../molecules/ActionButtonGroup/ActionButtonGroup";
import type { ResultSortKey } from "../../molecules/ResultsTableHeader/ResultsTableHeader";
import { categoryForKind } from "../../../lib/jellyfinClient";
import type { SearchResult } from "../../../types/jellyfin";
import "./ResultsPanel.css";

export interface ResultsPanelProps {
  tabLabel: string;
  results: SearchResult[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onFetch: (result: SearchResult) => void;
  onSort: (key: ResultSortKey) => void;
  onCloseTab: () => void;
  actions: ActionButtonSpec[];
  isSearching?: boolean;
}

export function ResultsPanel({
  tabLabel,
  results,
  selectedId,
  onSelect,
  onFetch,
  onSort,
  onCloseTab,
  actions,
  isSearching = false,
}: ResultsPanelProps) {
  return (
    <div className="ff-results-panel">
      <div className="ff-results-panel__tab-row">
        <div className="ff-results-panel__tab">
          <button type="button" className="ff-results-panel__tab-close" onClick={onCloseTab} aria-label="Close tab">
            {"×"}
          </button>
          {tabLabel}
        </div>
        <div className="ff-results-panel__tab-fill" />
      </div>

      <div className="ff-results-panel__table">
        <ResultsTableHeader onSort={onSort} />
        <div className="ff-results-panel__rows">
          {isSearching && <div className="ff-results-panel__empty">Searching across your servers...</div>}
          {!isSearching && results.length === 0 && (
            <div className="ff-results-panel__empty">No results. Try a different search.</div>
          )}
          {!isSearching &&
            results.map((result) => (
              <ResultsTableRow
                key={result.id}
                result={result}
                category={categoryForKind(result.kind)}
                selected={selectedId === result.id}
                onSelect={() => onSelect(result.id)}
                onFetch={() => onFetch(result)}
              />
            ))}
        </div>
      </div>

      <div className="ff-results-panel__actions">
        <ActionButtonGroup actions={actions} />
      </div>

      <div className="ff-results-panel__divider" />
    </div>
  );
}
