## 1 hello nestjs!

### 1.1 初始化项目

创建项目文件夹，然后在项目文件夹下执行 pnpm init初始化 package.json

```
pnpm init
```

### 1.2 安装 nest 的依赖

```
pnpm add @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
pnpm add -D @nestjs/cli @nestjs/schematics typescript @types/express @types/node ts-loader ts-node
```

### 1.3 配置tsconfig

执行 tsc --init，生成默认的tsconfig.json

```
tsc --init
```

设置如下配置项：

```
    "target": "es2021",     		/* Set the JavaScript language version for... */
    "experimentalDecorators": true, /* Enable experimental support for legacy... */
    "emitDecoratorMetadata": true,  /* Emit design-type metadata for... */
    "baseUrl": "./",                /* Specify the base directory to... */
    "outDir": "./dist",             /* Specify an output folder for all... */
```

### 1.4 编写代码

在项目根目录下创建src，添加如下源代码：

src/main.ts

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

src/app.service.ts

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

```

src/app.module.ts

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

src/app.controller.ts

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### 1.4 运行

此时执行下述命令，即可启动服务，

```
nest build
nest start
```

启动后访问可以访问：[`http://localhost:3000/`](http://localhost:3000/)

在package.json的script中添加下述命令，就可以用pnpm run 来启动：

```json
  "build": "nest build",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
```

另外，package.json中的  "main": "index.js" 可以删掉

## 2 添加 eslint 和prettier的支持

### 2.1 用eslint初始化工具设置eslint

```
pnpm create @eslint/config@latest
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · none
√ Does your project use TypeScript? · typescript
√ Where does your code run? · browser
The config that you've selected requires the following dependencies:

eslint, globals, @eslint/js, typescript-eslint
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · pnpm
```

运行后生成的配置文件 eslint.config.mjs如下：（扩展名 .mjs 表示js使用ESM）

```js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
```

在vscode中只要安装了 eslint ，那么就ide中就可以看到eslint的提示了。

vscode中eslint插件：https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

### 2.2 集成prettier

先安装下述两个依赖：

```
pnpm add --save-dev --save-exact prettier
pnpm add --save-dev eslint-config-prettier eslint-plugin-prettier
```

配置 eslint：

```
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

export default [
  // Any other config imports go at the top
  eslintPluginPrettierRecommended,
];
```

推荐的prettier配置如下，在项目根下建立 .prettierrc文件：

```
{
  "semi": false,
  "printWidth": 100
}
```

其他配置项都使用默认值，注意在prettier 2.0版本后 行尾默认值不再是 auto，而是LF。考虑到现在几乎所有的windows下的编辑器基本都能很好的支持LF了，所以建议在windows下也统一使用LF，而不是CRLF，和linux保持一致。

在vscode的files.eol的默认设置是 auto（随操作系统的约定），建议设置成 \n, 即 LF  (Line Feed)， 新建文件时就不会是 CRLF  (\r\n)