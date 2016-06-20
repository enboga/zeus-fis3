基于 fis3 针对 jsp/velocity 模板的前端工程解决方案，定制特有的JSP前后端解决方案，同时支持组件发布到静态服务器。

本模块修改于 fis3的解决方案 [fis3-jello@1.0.10](https://github.com/fex-team/fis3-jello "https://github.com/fex-team/fis3-jello")，有兴趣的可以看看.

## 特点

- 定制目录结构
- 默认使用sass
- 支持组件发布的到静态服务器（不同版本独立发布）
- jsp/velocity 模板
- 支持组件化
- 支持模块化


## 使用说明

### 全局安装 `fis3`

	npm install -g fis3

### 项目中安装 `zeus-fis3`

	npm install zeus-fis3 --save


然后在 fis-conf.js 中添加以下代码即可。

```js
fis.require('zeus-fis3')(fis);
```

### 运行 & 预览

	fis3 release
	fis3 server start

如果当前命令行在 fis-conf.js 所在目录（即项目目录），直接通过 `fis3 server start` 即可。

否则请使用 `fis3 server start --type jello`。

### 混合前后端方式
如果项目中包含纯前端的html页面，编译时需要先进行默认编译再进行html别名编译

	fis3 release
	fis3 release html

> **如果不是特别需要，尽量不在项目中混用后端和纯前端方式页面**

### 发布产品代码

开启压缩和合并等等。。

	fis3 release prod -d /path/of/your/j2ee/app

#### 开发和发布切换

当遇到开发和发布的配置参数需要不一样，可以使用 `__ZEUS_FIS3_MEDIA__` 来判断，`__ZEUS_FIS3_MEDIA__` 会根据执行的命令不一样嵌入不同的字符串。

- 开发

> __ZEUS_FIS3_MEDIA__ = "dev"

- 发布

> __ZEUS_FIS3_MEDIA__ = "prod"

比如你可以这样用：

	if ('__ZEUS_FIS3_MEDIA__' == 'dev') {
	    module.exports = require('./configureStore.dev');
	} else {
	    module.exports = require('./configureStore.prod');
	}

执行 `fis3 release` 运行 `module.exports = require('./configureStore.dev');`

执行 `fis3 release prod` 运行 `module.exports = require('./configureStore.prod');`



## 目录结构
暂无说明

## 更新日志

### v0.0.6

	通过 __ZEUS_FIS3_MEDIA__ 支持开发和发布自动切换配置
	新增支持编译ES7语法
	所有jsx，es文件都会被执行ES6\ES7编译，/src/modules下的js,jsx都会被执行ES6\ES7编译
	发布时文件名增加md5后缀
	发布时 /src/modules/**.{js,jsx,es} 会执行压缩，其他文件夹下的jsx,es会被压缩
	此版本对于发布可能有些问题，后续再优化
	

### v0.0.5

	增加 fis-parser-babel-5.x依赖，不需要再全局安装
	增加 sass 配置，默认支持生成map

### v0.0.4

	更新同步fis3-jello@1.0.10,解决插件依赖查找出问题的BUG