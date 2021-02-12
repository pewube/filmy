export interface MovieDetails {
  title: string;
  original_title: string;
  vote_average: number;
  vote_count: number;
  ratingImdb?: number;
  overview: string;
  tagline: string;
  runtime: number;
  poster_path: string;
  backdrop_path: string;
  mpaa?: string;
  id: number;
  imdb_id: string;
  genres: Array<MovieData>;
  production_countries: Array<MovieData>;
  credits?: Array<MovieCrew>;
  director?: Array<MovieCrew>;
  release_date: string;
  year?: string;
  status: string;
  production_companies: Array<MovieData>;
  actors?: Array<MovieActor>;
  belongs_to_collection: MovieCollection;
  homepage: string;
}

export interface MovieCollection {
  id: number;
  name: string;
  poster_path: string;
}

export interface MovieCrew {
  name: string;
  profile_path: string;
  job: string;
}
export interface MovieActor {
  name: string;
  character: string;
  profile_path: string;
}

export interface MovieData {
  name: string;
}
