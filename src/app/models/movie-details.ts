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
  external_ids: MovieIds;
  genres: Array<MovieData>;
  production_countries: Array<MovieData>;
  release_date: string;
  year?: string;
  status: string;
  production_companies: Array<MovieData>;
  actors?: Array<MovieActor>;
  belongs_to_collection: MovieCollection;
  homepage: string;
  credits?: MovieCredits;
  images?: MovieImages;
  release_dates?: any;
}

export interface MovieCollection {
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface MovieCredits {
  cast: Array<MovieActor>;
  crew: Array<MovieCrew>;
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
  iso_3166_1?: string;
  name: string;
}

export interface MovieIds {
  facebook_id: string;
  imdb_id: string;
  instagram_id: string;
  twitter_id: string;
}

export interface MovieCertification {
  country: string;
  certification: string;
}

export interface MovieImages {
  backdrops: Array<MovieImage>;
  posters: Array<MovieImage>;
}
export interface MovieImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string;
}
