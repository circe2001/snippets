export class Account {
  id!: number
  name: string | null = null
  pwd!: string
  pwdAlgorithm: string | null = null
  lockType: string | null = null
  pwdErrorTimes: number = 0
  pwdErrorLatestTime: Date | null = null
  aliasName: string | null = null
  mobile: string | null = null
  email: string | null = null
  createdAt?: Date
  updatedAt: Date | null = null
  deletedAt: Date | null = null
  needChangePwd: boolean = false
  lastLogin: Date | null = null
  firstLogin: Date | null = null
  remark: string | null = null
  isEnable: boolean = true
  lockedTime: Date | null = null
}

export class AccountCreate {
  id!: number
}

export type AccountUpdate = Partial<AccountCreate> & { id: number }
