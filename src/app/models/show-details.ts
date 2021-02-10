export interface ShowDetails {
  title: string;
  originalTitle: string;
  ratingTvdb: Array<number>;
  ratingImdb?: Array<number>;
  season: number;
  episode: number;
  plot: string;
  tagline: string;
  runtime: number;
  posterPath: string;
  mpaa?: string;
  episodeGuide: string;
  id: number;
  imdbId: string;
  genres: Array<string>;
  premiered: string;
  year: string;
  status: string;
  aired: string;
  studio: string;
  actors: Array<ShowActor>;
  homepage?: string;
}

export interface ShowCollection {
  name: string;
  role: string;
  posterPath: string;
}

export interface ShowActor {
  id: number;
  name: string;
  posterPath: string;
}
