export interface BookInput {
  _id?: unknown;
  id?: string;
  title?: string;
  author?: string;
  description?: string;
  review?: string;
  cover?: string;
  genre?: string[];
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
