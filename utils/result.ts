export const getSuccessWithData = <T>(data: T): SuccessWithData<T> => {
  return {
    ok: true,
    data
  }
}