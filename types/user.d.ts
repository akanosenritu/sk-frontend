declare type AuthenticatedUser = {
  status: "authenticated",
  username: string,
  isStaff: boolean
}

declare type CheckingUser = {
  status: "checking",
}

declare type AnonymousUser = {
  status: "anonymous"
}

declare type User = AuthenticatedUser | CheckingUser | AnonymousUser

declare type UserInfo = {
  username: string,
  isStaff: boolean,
}

declare type JWT = {
  access: string,
  refresh: string,
}