export interface Restrictions {
  certifications: Certifications;
}

export interface Certifications {
  US?: Array<RestrictionDeatils>;
  GB?: Array<RestrictionDeatils>;
  FR?: Array<RestrictionDeatils>;
  ES?: Array<RestrictionDeatils>;
  DE?: Array<RestrictionDeatils>;
}

export interface RestrictionDeatils {
  certification: string;
  meaning: string;
  order: number;
}
