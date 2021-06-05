import create from "zustand"
import {Failure, Success} from "./api/api"
import {checkUser, signIn, signOut} from "./api/user"

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

const getCheckingUser = (): CheckingUser => ({
  status: "checking"
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
  checkUserStatus: () => void,
  isSigningIn: boolean,
  signIn: (username: string, password: string) => Promise<Success | Failure>,
  signOut: () => Promise<Success | Failure>,
  updateUser: (user: User) => void,
}


export const useUser = create<State>(set => ({
  user: getCheckingUser(),
  checkUserStatus: async () => {
    console.log("checking...")
    const result = await checkUser()
    if (result.ok) set({user: getAuthenticatedUser(result.data)})
    else set({user: getAnonymousUser()})
  },
  isSigningIn: false,
  signIn: async (username, password) => {
    set(() => ({isSigningIn: true}))
    const result = await signIn(username, password)
    set(() => ({isSigningIn: false}))
    if (result.ok) {
      set({user: getAuthenticatedUser(result.data)})
    } else {
      set({user: getAnonymousUser()})
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