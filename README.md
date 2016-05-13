# zeus-fis3

基于 fis3 针对 jsp/velocity 模板的前端工程解决方案，定制特有的JSP前后端解决方案，同时支持组件发布到静态服务器。

本模块修改于 fis3的解决方案 [fis3-jello](https://github.com/fex-team/fis3-jello "https://github.com/fex-team/fis3-jello")，有兴趣的可以看看.

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

### 全局安装 `zeus-fis3`

	npm install -g zeus-fis3


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

## 目录结构
暂无说明

## 更新日志

### v0.0.5

	z

### v0.0.4

	更新同步fis3-jello@1.0.10,解决插件依赖查找出问题的BUG