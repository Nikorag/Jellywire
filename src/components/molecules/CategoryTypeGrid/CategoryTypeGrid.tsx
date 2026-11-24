import { CategoryIcon } from "../../atoms";
import type { MediaCategory } from "../../../types/jellyfin";
import "./CategoryTypeGrid.css";

const CATEGORIES: MediaCategory[] = ["All Types", "Audio", "Movies", "Shows", "Photos", "Books"];

export interface CategoryTypeGridProps {
  selected: MediaCategory;
  onSelect: (category: MediaCategory) => void;
}

export function CategoryTypeGrid({ selected, onSelect }: CategoryTypeGridProps) {
  return (
    <div className="ff-category-grid">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={[
            "ff-category-grid__btn",
            category === selected ? "ff-category-grid__btn--active" : "",
          ].join(" ")}
          onClick={() => onSelect(category)}
        >
          <CategoryIcon category={category} />
          {category}
        </button>
      ))}
    </div>
  );
}
