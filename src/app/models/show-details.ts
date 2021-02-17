export interface ShowDetails {
  name: string;
  original_name: string;
  vote_average: number;
  vote_count: number;
  ratingImdb?: number;
  number_of_seasons: number;
  number_of_episodes: number;
  overview: string;
  tagline: string;
  runtime?: number;
  poster_path: string;
  backdrop_path: string;
  mpaa?: string;
  episodeGuide?: string;
  id: number;
  external_ids: ShowIds;
  genres: Array<ShowData>;
  production_countries: Array<ShowData>;
  first_air_date: string;
  last_air_date: string;
  year?: string;
  status: string;
  networks: Array<ShowData>;
  created_by: Array<ShowData>;
  actors?: Array<ShowActor>;
  homepage?: string;
  credits?: ShowCredits;
  images?: ShowImages;
  seasons: Array<ShowSeason>;
  content_ratings?: Array<ShowCertification>;
}

export interface ShowCredits {
  cast: Array<ShowActor>;
  crew: Array<ShowCrew>;
}

export interface ShowCrew {
  name: string;
  profile_path: string;
  job: string;
}

export interface ShowActor {
  name: string;
  character: string;
  profile_path: string;
}

export interface ShowData {
  iso_3166_1?: string;
  name: string;
}

export interface ShowIds {
  facebook_id: string;
  freebase_id: string;
  freebase_mid: string;
  imdb_id: string;
  instagram_id: string;
  tvdb_id: number;
  tvrage_id: number;
  twitter_id: string;
}

export interface ShowSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface ShowCertification {
  country: string;
  certification: string;
}

export interface ShowImages {
  backdrops: Array<ShowImage>;
  posters: Array<ShowImage>;
}
export interface ShowImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string;
}
