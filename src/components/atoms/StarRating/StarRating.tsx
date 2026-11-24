import "./StarRating.css";

export interface StarRatingProps {
  stars: number;
  selected?: boolean;
}

export function StarRating({ stars, selected = false }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, Math.round(stars)));
  return (
    <span className={["ff-star-rating", selected ? "ff-star-rating--selected" : ""].join(" ")}>
      {"★".repeat(clamped)}
    </span>
  );
}
