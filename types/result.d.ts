declare type Success = {
  ok: true
}

declare type SuccessWithData<T> = {
  ok: true,
  data: T
}

declare type Failure = {
  ok: false,
  description: string,
  data?: any
}
