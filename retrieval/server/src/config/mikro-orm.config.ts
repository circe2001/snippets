import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql"

const config: Options = {
  dbName: "postgres",
  driver: PostgreSqlDriver,
  user: "postgres",
  password: "123456",
  host: "localhost",
  port: 5432,
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  forceUndefined: false,
  debug: true,
}

export default config
