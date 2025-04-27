import { SqlServerExceptionsFilter } from "./core/filter/sql-server-exception.filter"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new SqlServerExceptionsFilter())

  await app.listen(3001)
}
bootstrap()
