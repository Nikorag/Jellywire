import type { MediaCategory } from "../../../types/jellyfin";
import allTypesIcon from "../../../assets/category-icons/all-types.png";
import audioIcon from "../../../assets/category-icons/audio.png";
import moviesIcon from "../../../assets/category-icons/movies.png";
import showsIcon from "../../../assets/category-icons/shows.png";
import photosIcon from "../../../assets/category-icons/photos.png";
import booksIcon from "../../../assets/category-icons/books.png";
import "./CategoryIcon.css";

const CATEGORY_ICON: Record<MediaCategory, string> = {
  "All Types": allTypesIcon,
  Audio: audioIcon,
  Movies: moviesIcon,
  Shows: showsIcon,
  Photos: photosIcon,
  Books: booksIcon,
};

export interface CategoryIconProps {
  category: MediaCategory;
}

export function CategoryIcon({ category }: CategoryIconProps) {
  return <img className="ff-category-icon" src={CATEGORY_ICON[category]} alt="" />;
}
