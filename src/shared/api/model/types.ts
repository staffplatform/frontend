interface IApiErrorData {
  message: string;
}

export interface IApiError extends Error {
  status: number;
  data: IApiErrorData;
}