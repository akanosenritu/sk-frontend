import Cookies from "js-cookie"

export const apiURL = "http://localhost:8000/api/"

export type Success = {
  ok: true
}
export type SuccessWithData<T> = Success & {
  data: T
}
export type Failure = {
  ok: false,
  description: string,
  data?: any
}

export const setCsrfToken = async (): Promise<string> => {
  await get("set-csrf-token/")
  return Cookies.get("csrftoken") as string
}

export const getCsrfToken = async (): Promise<string> => {
  const csrfToken = Cookies.get("csrftoken")
  if (csrfToken) return csrfToken
  return setCsrfToken()
}

export const get = async <T>(target: string): Promise<SuccessWithData<T>|Failure> => {
  try {
    const response = await fetch(apiURL + target)
    if (response.ok) {
      return {
        ok: true,
        data: await response.json() as T
      }
    }
    return {
      ok: false,
      description: response.statusText
    }
  } catch (e) {
    return {
      ok: false,
      description: "unknown error",
      data: e
    }
  }
}

export const post = async <T>(target: string, data: T): Promise<SuccessWithData<T>|Failure> => {
  try {
    const csrfToken = await getCsrfToken()
    const response = await fetch(apiURL + target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken
      },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      const returnedData = await response.json()
      return {
        ok: true,
        data: returnedData as T
      }
    }
    return {
      ok: false,
      description: response.statusText,
      data: await response.json(),
    }
  } catch (e) {
    return {
      ok: false,
      description: "unknown error",
      data: e
    }
  }
}

export const postWritable = async <T, T2>(target: string, data:T): Promise<SuccessWithData<T2>|Failure> => {
  try {
    const result = await post<T>(target, data)
    if (result.ok) {
      return {
        ...result,
        data: result.data as unknown as T2
      }
    }
    if (result.data && result.data.uuid) {
      const uuidErrorMessage = (result.data.uuid as string[])[0]
      if (uuidErrorMessage.match(/with this uuid already exists\.$/)) {
        // @ts-ignore
        return putWritable<T, T2>(target + data.uuid + "/", data)
      }
    }
    return result
  } catch (e) {
    return {
      ok: false,
      description: "unknown error",
      data: e
    }
  }

}

export const put = async <T>(target: string, data: T): Promise<SuccessWithData<T>|Failure> => {
  try {
    const csrfToken = await getCsrfToken()
    const response = await fetch(apiURL + target, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken
      },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      const returnedData = await response.json()
      return {
        ok: true,
        data: returnedData as T
      }
    }
    return {
      ok: false,
      description: response.statusText,
      data: await response.json(),
    }
  } catch (e) {
    return {
      ok: false,
      description: "unknown error",
      data: e
    }
  }

}

export const putWritable = async <T, T2>(target: string, data:T): Promise<SuccessWithData<T2>|Failure> => {
  try {
    const result = await put<T>(target, data)
    if (result.ok) {
      return {
        ...result,
        data: result.data as unknown as T2
      }
    }
    return result
  } catch (e) {
    return {
      ok: false,
      description: "unknown error",
      data: e
    }
  }
}