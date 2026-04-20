export interface JobResponse {
  id: string;
  position: string;
  description: string;
  location: string;
  salary: string;
  industry: string;
  uploadedAt?: Date;
  tags?: string;
  sourceImageUrl?: string;
}
