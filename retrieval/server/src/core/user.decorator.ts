import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import jwt from "jsonwebtoken"
import { jwtConstants } from "./guards/constants"

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()

  // if route is protected, there is a user set in auth.middleware
  if (req.user) {
    return data ? req.user[data] : req.user
  }

  // in case a route is not protected, we still want to get the optional auth user from jwt
  const [type, token] = req.headers.authorization?.split(" ") ?? []

  if (type && token) {
    const payload = jwt.verify(token, jwtConstants.secret)
    return data ? payload[data] : payload
  }
})
