export interface ResumeSpecification {
  key: string;
  value: string;
}

export interface ResumeResponse {
  id: string;
  position: string;
  yearsOld: number;
  location: string;
  rating: number;
  specifications: ResumeSpecification[];
  uploadedAt: Date;
}
