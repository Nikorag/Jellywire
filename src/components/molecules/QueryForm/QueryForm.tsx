import type { FormEvent } from "react";
import { XpButton, XpCheckbox, XpInput, XpSelect } from "../../atoms";
import "./QueryForm.css";

export interface QueryFormValues {
  title: string;
  artist: string;
  collection: string;
  genre: string;
  minQuality: string;
  onlyOffline: boolean;
}

export interface QueryFormProps {
  values: QueryFormValues;
  genres: string[];
  onChange: <K extends keyof QueryFormValues>(key: K, value: QueryFormValues[K]) => void;
  onSubmit: () => void;
}

export function QueryForm({ values, genres, onChange, onSubmit }: QueryFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <div className="ff-query-form">
      <div className="ff-query-form__header">Query</div>
      <form className="ff-query-form__body" onSubmit={handleSubmit}>
        <label className="ff-query-form__field">
          Title
          <XpInput
            value={values.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="paper compass"
          />
        </label>
        <label className="ff-query-form__field">
          Artist / Studio
          <XpInput value={values.artist} onChange={(e) => onChange("artist", e.target.value)} />
        </label>
        <label className="ff-query-form__field">
          Collection
          <XpInput value={values.collection} onChange={(e) => onChange("collection", e.target.value)} />
        </label>
        <label className="ff-query-form__field">
          Genre
          <XpSelect value={values.genre} onChange={(e) => onChange("genre", e.target.value)}>
            <option value="">(any)</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </XpSelect>
        </label>
        <label className="ff-query-form__field">
          Minimum Quality
          <XpSelect value={values.minQuality} onChange={(e) => onChange("minQuality", e.target.value)}>
            <option value="0">Any</option>
            <option value="3">3 stars and up</option>
            <option value="4">4 stars and up</option>
            <option value="5">5 stars only</option>
          </XpSelect>
        </label>
        <XpCheckbox
          label="Hide items already downloaded"
          checked={values.onlyOffline}
          onChange={(e) => onChange("onlyOffline", e.target.checked)}
        />
        <XpButton type="submit">Search</XpButton>
      </form>
    </div>
  );
}
