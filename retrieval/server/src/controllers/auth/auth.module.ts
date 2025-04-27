import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { UsersModule } from "src/users/users.module"
import { PassportModule } from "@nestjs/passport"
import { jwtConstants } from "../../core/guards/constants"
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from "./auth.controller"
import { ConfigModule } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "2880s" },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
