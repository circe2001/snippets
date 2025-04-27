import { EntitySchema } from "@mikro-orm/core"
import * as model from "src/common/model"

export const AccountSchema = new EntitySchema({
  class: model.Account,
  properties: {
    id: { primary: true, type: "integer" },
    name: {
      type: "string",
      nullable: true,
      comment: `账号名是可空的，对于匿名用户、或者直接使用手机号、电子邮件号登录的用户，也是不需要账号名。如果设置了账号名，那么可以用账号名登录，一般来说，由于一般系统都会提供多种登录方式和多个昵称，所以有必要把登录名、昵称和账号区分出不同的概念。
为了和手机好和电子邮件区分，规定账号名不能是纯数字、不能包含字符@、长度至少6个字符。`,
      unique: "account_name_key",
    },
    pwd: { type: "string" },
    pwdAlgorithm: {
      type: "string",
      nullable: true,
      comment: "none, md5, sha256, salt-md5, salt-sha256",
    },
    lockType: {
      type: "string",
      nullable: true,
      comment:
        "locked_time非空时，lock_type指定锁定的类型，不同的锁定类型，对应不同的解锁方式，如，一定时间的自动解锁，或者必须手动解锁等。",
    },
    pwdErrorTimes: {
      type: "integer",
      comment: "累计密码出错次数。如果某次密码错误和上次密码错误时间间隔很短，那么累计错误次数。",
    },
    pwdErrorLatestTime: {
      type: "datetime",
      nullable: true,
      comment: "最近一次密码错误的时间。",
    },
    aliasName: { type: "string", nullable: true, comment: "别名，即显示名称。" },
    mobile: {
      type: "string",
      nullable: true,
      comment: "经绑定验证的手机，可作为登录名。",
      unique: "account_mobile_key",
    },
    email: {
      type: "string",
      nullable: true,
      comment: "经绑定验证的电子邮件，可作为登录名。",
      unique: "account_email_key",
    },
    createdAt: { type: "datetime", defaultRaw: `CURRENT_TIMESTAMP` },
    updatedAt: { type: "datetime", nullable: true },
    deletedAt: { type: "datetime", nullable: true },
    needChangePwd: { type: "boolean" },
    lastLogin: { type: "datetime", nullable: true },
    firstLogin: { type: "datetime", nullable: true },
    remark: { type: "text", nullable: true },
    isEnable: { type: "boolean" },
    lockedTime: { type: "datetime", nullable: true },
  },
})
