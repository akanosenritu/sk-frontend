import {Failure, get, post, Success, SuccessWithData} from "./api"

export const signIn = async (username: string, password: string): Promise<SuccessWithData<UserInfo> | Failure> => {
  const result = await post("login/", {username, password})
  if (result.ok) {
    return {
      ok: true,
      data: result.data as unknown as UserInfo
    }
  }
  return result
}

export const signOut = async (): Promise<Success|Failure> => {
  return await post("logout", {})
}

export const checkUser = async (): Promise<SuccessWithData<UserInfo>|Failure> => {
  const result = await get("check-user/")
  if (result.ok) {
    return {
      ok: true,
      data: result.data as UserInfo
    }
  }
  return result
}