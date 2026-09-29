import axios from "axios"

type ErrorBody = {
  message?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function toApiError(error: unknown) {
  if (isApiError(error)) {
    return error
  }

  if (axios.isAxiosError<ErrorBody>(error)) {
    const status = error.response?.status ?? 0
    const message =
      error.response?.data?.message ||
      (status === 0 ? "The server did not respond." : "The request failed.")

    return new ApiError(message, status)
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0)
  }

  return new ApiError("The request failed.", 0)
}

export function getErrorMessage(error: unknown) {
  if (isApiError(error)) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong."
}
