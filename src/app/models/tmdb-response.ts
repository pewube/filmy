export interface TmdbResponse {
  page: number;
  results: Array<Result>;
  total_pages: number;
  total_results: number;
}

export interface Result {
  adult?: boolean;
  backdrop_path: string;
  first_air_date?: string;
  genre_ids: Array<number>;
  id: number;
  name?: string;
  title?: string;
  origin_country?: Array<string>;
  original_language: string;
  original_name?: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
