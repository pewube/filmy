export interface VideoDetails {
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  vote_average: number;
  vote_count: number;
  ratingImdb?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  overview: string;
  tagline: string;
  runtime?: number;
  poster_path: string;
  backdrop_path: string;
  id: number;
  external_ids: VideoIds;
  genres: Array<VideoData>;
  production_countries: Array<VideoData>;
  release_date?: string;
  first_air_date?: string;
  last_air_date?: string;
  next_episode_to_air?: VideoSeason;
  status: string;
  production_companies?: Array<VideoData>;
  networks?: Array<VideoData>;
  created_by?: Array<VideoCrew>;
  belongs_to_collection?: VideoCollection;
  homepage?: string;
  credits?: VideoCredits;
  images?: VideoImages;
  release_dates?: any;
  seasons?: Array<VideoSeason>;
  content_ratings?: Array<VideoCertification>;
}

export interface VideoCollection {
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface VideoSeason {
  air_date: string;
  episode_count?: number;
  id: number;
  name: string;
  overview: string;
  poster_path?: string;
  season_number: number;
  episode_number?: number;
}

export interface VideoCredits {
  cast: Array<VideoActor>;
  crew: Array<VideoCrew>;
}

export interface VideoCrew {
  name: string;
  profile_path: string;
  job?: string;
}
export interface VideoActor {
  name: string;
  character: string;
  profile_path: string;
}

export interface VideoData {
  iso_3166_1?: string;
  name: string;
}

export interface VideoIds {
  facebook_id: string;
  freebase_id?: string;
  freebase_mid?: string;
  imdb_id: string;
  instagram_id: string;
  tvdb_id?: number;
  tvrage_id?: number;
  twitter_id: string;
}

export interface VideoCertification {
  country: string;
  certification: string;
}

export interface VideoImages {
  backdrops: Array<VideoImage>;
  posters: Array<VideoImage>;
}
export interface VideoImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string;
}
