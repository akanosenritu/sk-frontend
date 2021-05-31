import {Failure, getWithJWT, post, Success, SuccessWithData} from "./api"
import {getJWT, removeJWT, setJWT} from "../user"

export const signIn = async (username: string, password: string) => {
  const result = await post("token/", {username, password})
  if (result.ok) {
    setJWT(result.data as unknown as JWT)
  }
  return result
}

export const signOut = async (): Promise<Success> => {
  removeJWT()
  return {
    ok: true,
  }
}

export const getUserInfo = async (): Promise<SuccessWithData<UserInfo>|Failure> => {
  const result = await getWithJWT("get-user/")
  if (result.ok) {
    return {
      ok: true,
      data: result.data as UserInfo
    }
  }
  return result
}

export const refreshJWT = async (): Promise<Success|Failure> => {
  const jwt = getJWT()
  if (!jwt) return {
    ok: false,
    description: "refresh token was not found."
  }
  const refreshToken = jwt.refresh
  const result = await post("token/refresh/", {refresh: refreshToken})
  if (result.ok) {
    const jwt = result.data as unknown as JWT
    setJWT(jwt)
    return {
      ok: true
    }
  }
  return result
}