import create from "zustand"
import {Failure, Success} from "./api/api"
import {getUserInfo, refreshJWT, signIn, signOut} from "./api/user"

export const setJWT = (jwt: JWT) => {
  localStorage.setItem("jwt", JSON.stringify(jwt))
}

export const getJWT = (): JWT | null => {
  const data = localStorage.getItem("jwt")
  if (data) return JSON.parse(data) as JWT
  return null
}

export const removeJWT = () => {
  const data = localStorage.getItem("jwt")
  if (data) localStorage.removeItem("jwt")
}

export const getStoredUserInfo = (): UserInfo | null => {
  const data = localStorage.getItem("userInfo")
  if(data) return JSON.parse(data)
  return null
}

export const storeUserInfo = (userInfo: UserInfo) => {
  localStorage.setItem("userInfo", JSON.stringify(userInfo))
}

const getAnonymousUser = (): AnonymousUser => ({
  status: "anonymous"
})

const getAuthenticatedUser = (userInfo: UserInfo): AuthenticatedUser => {
  return {
    status: "authenticated",
    username: userInfo.username,
    isStaff: userInfo.isStaff,
  }
}

type State = {
  user: User,
  checkUserStatus: () => Promise<User>,
  isCheckingUserStatus: boolean,
  isSigningIn: boolean,
  signIn: (username: string, password: string) => Promise<Success | Failure>,
  signOut: () => Promise<Success | Failure>,
  updateUser: (user: User) => void,
}


export const useUser = create<State>(set => ({
  user: typeof window !== "undefined" && typeof window.localStorage !== "undefined" && getJWT()? // @ts-ignore
    getStoredUserInfo()? getAuthenticatedUser(getStoredUserInfo()): getAnonymousUser():
    getAnonymousUser(),
  checkUserStatus: async () => {
    set(() => ({isCheckingUserStatus: true}))
    let user: User | null = null
    const jwt = getJWT()
    if (!jwt) {
      user = getAnonymousUser()
    } else {
      const userInfoRetrievalResult = await getUserInfo()
      if (userInfoRetrievalResult.ok) {
        user = getAuthenticatedUser(userInfoRetrievalResult.data)
        storeUserInfo(userInfoRetrievalResult.data)
      } else {
        const refreshTokenResult = await refreshJWT()
        if (refreshTokenResult.ok) {
          const userInfoSecondRetrievalResult = await getUserInfo()
          if (userInfoSecondRetrievalResult.ok) {
            user = getAuthenticatedUser(userInfoSecondRetrievalResult.data)
          }
        }
      }
    }
    if (user == null) user = getAnonymousUser()
    set(()=>({isCheckingUserStatus: false}))
    return user
  },
  isCheckingUserStatus: false,
  isSigningIn: false,
  signIn: async (username, password) => {
    set(() => ({isSigningIn: true}))
    const result = await signIn(username, password)
    set(() => ({isSigningIn: false}))
    if (result.ok) {
      const userInfoRetrievalResult = await getUserInfo()
      if (userInfoRetrievalResult) {
        set(() => ({user: getAuthenticatedUser(userInfoRetrievalResult.data)}))
        storeUserInfo(userInfoRetrievalResult.data)
      } else {
        return userInfoRetrievalResult
      }
    }
    return result
  },
  signOut: async () => {
    const result = await signOut()
    if (result.ok) {
      set(() => ({user: getAnonymousUser()}))
    }
    return result
  },
  updateUser: user => set({user})
}))