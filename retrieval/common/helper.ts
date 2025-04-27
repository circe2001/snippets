// 数据保存到数据库时的规范化，
// 1. 如果值为空数组[]、空字符串""，空对象{}，则设置为 null
// 2. 如果值为 undefined，则删除该字段，insert时为字段的默认值，update时会略掉该字段
export function emptyToNull(obj: { [key: string]: any }) {
  if (obj === null || typeof obj !== "object") return obj

  const target = {} as Record<string, any>
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) continue

    if (Array.isArray(obj[key]) && obj[key].length === 0) {
      target[key] = null
    } else if (typeof obj[key] === "string" && obj[key].length === 0) {
      target[key] = null
    } else if (
      obj[key] !== null &&
      typeof obj[key] === "object" &&
      Object.keys(obj[key]).length === 0
    ) {
      target[key] = null
    } else {
      target[key] = obj[key]
    }
  }
  return target
}

export function isEmpty(value: any): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === "string" && value.trim() === "") return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === "object" && Object.keys(value).length === 0) return true
  return false
}

// 非空验证，包括 undefined, null, "", [], {}
export function validNotEmpty(value: any, name?: string): string {
  return isEmpty(value) ? `${name ?? ""} 不能为空` : ""
}

export function validateMobile(mobile: string, name?: string): string {
  const pattern = /^1[3-9]\d{9}$/
  return pattern.test(mobile)
    ? ""
    : `${name ?? ""}手机号码 ${mobile} 格式不正确: 以 1 打头 11 位数字，第二位数字为 3-9 之间`
}

export function validateEmail(email: string, name?: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
    ? ""
    : `${name ?? ""}邮箱 ${email} 格式不正确: 必须包含 @ 且两边不能有空格，且 @ 后必须有域名`
}

export function deleteOneById(arr: { aid: number }[], aid: number) {
  arr.forEach((item, index) => {
    if (item.aid === aid) {
      arr.splice(index, 1)
    }
  })
}

export function replaceByAid(arr: { aid: number }[], newItem: { aid: number }) {
  arr.forEach((item, index) => {
    if (item.aid === newItem.aid) {
      arr[index] = newItem
    }
  })
}

export function getOneByAid(arr: { aid: number }[], aid: number) {
  return arr.find((item) => item.aid === aid)
}

export function getArrayId(arr: { aid: number }[] | null) {
  let id = 100
  if (arr && arr.length) {
    id = Math.floor(arr[arr.length - 1].aid / 100 + 1) * 100
  }
  id += Math.random() * 100
  return Math.floor(id)
}
