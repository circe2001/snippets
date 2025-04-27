export type Profile = {
  id: number
  username: string | null
  lockType: string | null
  pwdErrorTimes: number
  pwdErrorLatestTime: Date | null
  aliasName: string | null
  mobile: string | null
  email: string | null
  needChangePwd: boolean
  lastLogin: Date | null
  firstLogin: Date | null
  isEnable: boolean
  lockedTime: Date | null
  remark: string | null
  role?: string
  avatar?: string
}
