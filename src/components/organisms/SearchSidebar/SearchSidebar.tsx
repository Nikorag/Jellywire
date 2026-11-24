import { CategoryTypeGrid, QueryForm, ServerSummaryCard } from "../../molecules";
import type { QueryFormValues } from "../../molecules/QueryForm/QueryForm";
import type { StatusDotTone } from "../../atoms/StatusDot/StatusDot";
import type { MediaCategory } from "../../../types/jellyfin";
import "./SearchSidebar.css";

export interface SearchSidebarProps {
  category: MediaCategory;
  onCategoryChange: (category: MediaCategory) => void;
  queryValues: QueryFormValues;
  genres: string[];
  onQueryChange: <K extends keyof QueryFormValues>(key: K, value: QueryFormValues[K]) => void;
  onSearch: () => void;
  serverTone: StatusDotTone;
  serverHeadline: string;
  serverHost: string;
  serverDetail: string;
}

export function SearchSidebar({
  category,
  onCategoryChange,
  queryValues,
  genres,
  onQueryChange,
  onSearch,
  serverTone,
  serverHeadline,
  serverHost,
  serverDetail,
}: SearchSidebarProps) {
  return (
    <div className="ff-search-sidebar">
      <div className="ff-search-sidebar__label">Select Search Type:</div>
      <CategoryTypeGrid selected={category} onSelect={onCategoryChange} />
      <QueryForm values={queryValues} genres={genres} onChange={onQueryChange} onSubmit={onSearch} />
      <ServerSummaryCard tone={serverTone} headline={serverHeadline} host={serverHost} detail={serverDetail} />
    </div>
  );
}
