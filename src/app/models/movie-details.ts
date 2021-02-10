export interface MovieDetails {
  title: string;
  original_title: string;
  vote_average: Array<number>;
  ratingImdb?: Array<number>;
  overview: string;
  tagline: string;
  runtime: number;
  poster_path: string;
  mpaa?: string;
  id: number;
  imdb_id: string;
  genres: Array<Object>;
  production_countries: Array<Object>;
  credits?: string;
  director?: Array<string>;
  release_date: string;
  year?: string;
  status: string;
  production_companies: Array<Object>;
  actors?: Array<MovieActor>;
  belongs_to_collection: MovieCollection;
  homepage: string;
}

export interface MovieCollection {
  id: number;
  name: string;
  poster_path: string;
}

export interface MovieActor {
  name: string;
  role: string;
  poster_path: string;
}
