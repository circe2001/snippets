/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServerException } from "@mikro-orm/core"
import { Catch, ArgumentsHost, HttpStatus } from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core"
import { Request, Response } from "express"

@Catch(ServerException)
export class SqlServerExceptionsFilter extends BaseExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    // 必须注释掉下述语句，否则运行时异常。BaseExceptionFilter 会处理Http信息而此时没有相关的上下文所以会出错。
    //super.catch(exception, host)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>() as Record<string, any>
    const requestId = request.requestId
    let msg = "数据库处理错误"
    let err = {} as Record<string, any>
    switch (exception.name) {
      case "ForeignKeyConstraintViolationException":
        msg = "外键约束错误"
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(wrapHttpException(exception, HttpStatus.BAD_REQUEST, requestId, msg))
        break
      case "CheckConstraintViolationException":
        msg = "检查约束错误"
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(wrapHttpException(exception, HttpStatus.BAD_REQUEST, requestId, msg))
        break
      case "NotNullConstraintViolationException":
        msg = "非空约束错误"
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(wrapHttpException(exception, HttpStatus.BAD_REQUEST, requestId, msg))
        break
      case "UniqueConstraintViolationException":
        msg = "唯一键约束错误"
        err = {
          constraint: (exception as any).constraint,
          dbmessage: (exception as any).details,
        }
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(wrapHttpException(exception, HttpStatus.BAD_REQUEST, requestId, msg, err))
        break
      case "InvalidFieldNameException":
        msg = "错误的字段名称"
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(wrapHttpException(exception, HttpStatus.INTERNAL_SERVER_ERROR, requestId, msg))
        break
      default:
        msg = "数据库处理错误"
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(wrapHttpException(exception, HttpStatus.INTERNAL_SERVER_ERROR, requestId, msg))
    }
  }
}

// todo：确定每种错误的具体信息后，添加 error 信息返回给前端。
function wrapHttpException(
  exception: ServerException,
  httpStatus: HttpStatus,
  requestId: string,
  message: string,
  error?: object,
) {
  return {
    httpStatus,
    errorMessage: message,
    // 直接用异常名称做为错误代码，前端可根据此code做为错误类型判断
    errorCode: exception.name,
    requestId,
    // exception.code 为postgresql的错误代码，参见：https://www.postgresql.org/docs/9.4/errcodes-appendix.html
    error: { errorNo: "SQLERR: " + exception.code, ...error },
  }
}
