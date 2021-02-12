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
  imdb_id?: string;
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
  name: string;
}
