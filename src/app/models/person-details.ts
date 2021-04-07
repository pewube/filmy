export interface PersonDetails {
  also_known_as: Array<string>;
  biography: string;
  birthday: string;
  deathday: string;
  gender: number;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  profile_path: string;
  combined_credits: CombinedCredits;
  images: ImageProfile;
  homepage: string;
}

export interface CombinedCredits {
  cast: Array<PersonVideo>;
  crew: Array<PersonVideo>;
}

export interface PersonVideo {
  backdrop_path: string;
  genre_ids: Array<number>;
  id: number;
  original_language: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  title?: string;
  name?: string;
  episode_count?: number;
  origin_country?: Array<string>;
  vote_average: number;
  vote_count: number;
  character?: string;
  department?: string;
  job?: string;
  media_type: string;
}

export interface ImageProfile {
  profiles: Array<PersonImage>;
}

export interface PersonImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  iso_639_1: string;
}

export interface PersonVideoList {
  department?: Array<PersonVideo>;
}
