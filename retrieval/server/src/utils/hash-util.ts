import { createHash } from "crypto"
import type { BinaryToTextEncoding, BinaryLike } from "crypto"

// type: 'sha256','sha512','sha1','md5', ... 取值为：openssl list -digest-algorithms
// encoding: 'hex' | 'base64' | base64Url
export function getHash(
  type: string,
  data: BinaryLike | BinaryLike[],
  encoding: BinaryToTextEncoding = "hex",
) {
  const hash = createHash(type)
  if (Array.isArray(data)) {
    for (const d of data) {
      hash.update(d)
    }
  } else {
    hash.update(data)
  }
  return hash.digest(encoding)
}
