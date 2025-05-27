export interface ErrorResponse {
  data: {
    detail: string;
    status: number;
    title: string;
  };
}
