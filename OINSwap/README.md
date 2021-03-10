# create-create-app@3.4.1 模板

### 依赖项
```text
    eslint
        "@typescript-eslint/eslint-plugin": "^2.10.0",
        "@typescript-eslint/parser": "^2.10.0",
        "babel-eslint": "10.1.0",
        "eslint": "^6.6.0",
        "eslint-config-react-app": "^5.2.1",
        "eslint-loader": "3.0.3",
        "eslint-plugin-flowtype": "4.6.0",
        "eslint-plugin-import": "2.20.1",
        "eslint-plugin-jsx-a11y": "6.2.3",
        "eslint-plugin-react": "7.19.0",
        "eslint-plugin-react-hooks": "^1.6.1",
    postcss
        "postcss-flexbugs-fixes": "4.1.0",
        "postcss-loader": "3.0.0",
        "postcss-normalize": "8.0.1",
        "postcss-preset-env": "6.7.0",
        "postcss-safe-parser": "4.0.1",
    webpack
        "babel-loader": "8.1.0",
        "css-loader": "3.4.2",
        "eslint-loader": "3.0.3",
        "file-loader": "4.3.0",
        "sass-loader": "8.0.2",
        "style-loader": "0.23.1",
        "url-loader": "2.3.0",
        "webpack": "4.42.0",
        "webpack-dev-server": "3.10.3",
        "webpack-manifest-plugin": "2.2.0",
        "workbox-webpack-plugin": "4.3.1"
```

### paths
```text
    dotenv                  -> .env
    appPath                 -> .
    appBuild                -> build
    appPublic               -> public
    appHtml                 -> public/index.html
    appIndexJs              -> src/index
    appPackageJson          -> package.json
    appSrc                  -> src
    appTsConfig             -> tsconfig.json
    appJsConfig             -> jsconfig.json
    yarnLockFile            -> yarn.lock
    testsSetup              -> src/setupTests
    proxySetup              -> src/setupProxy.js
    publicUrlOrPath         -> dev?homepage:PUBLIC_URL
    ownPath                 -> .
    onwNodeModules          -> node_modules
    appTypeDeclarations     -> src/react-app-env.d.ts
    ownTypeDeclarations     -> lib/react-app.d.ts
    
```

### .env配置规则
```text
同时获取 .env.*.local .env.* .env
    .env
    .env.*
    .env.*.local
    覆盖优先级是 由下往上

```

### HTTPS dev 配置
```text
    process.env
        SSL_CRT_FILE, 
        SSL_KEY_FILE, 
        HTTPS
    SSL_CRT_FILE/SSL_KEY_FILE 本地文件名，cra 的配置回去读取
    HTTPS 是一个布尔值
```

### 所需基本环境变量
```text
ClientEnvironment
    - NODE_ENV
    - publicUrl
    - WDS_SOCKET_HOST
    - WDS_SOCKET_PATH
    - WDS_SOCKET_PORT

```

### postcss 新增配置
```text
    postcss 的 vw 相关配置
    autoprefixer
    postcss-aspect-ration-mini
        实现固定容器宽高比，撑开容器
        .aspect-box{
            aspect-ratio: '16:9'
        }
        =》
        .aspect-box:before{
            padding-top: 56.25%;
        }
    postcss-px-to-viewport
    postcss-write-svg
        以 css 的形式写svg，然后对应生成 base64 图片
    postcss-viewport-units
        功能类似 viewport-units-buggyfill
    
    [意外了解]
    viewport-units-buggyfill
        一些老IE 和 Android Stock Browser 能够识别以为hack
        .my-viewport-units-using-thingie {
          width: 50vmin;
          height: 50vmax;
          top: calc(50vh - 100px);
          left: calc(50vw - 100px);
        
          /* hack to engage viewport-units-buggyfill */
          content: 'viewport-units-buggyfill; width: 50vmin; height: 50vmax; top: calc(50vh - 100px); left: calc(50vw - 100px);';
        }
    cssnano
        就是这样的一个缩减器，是基于 node.js 开发。用于确保最终生成的 用于生产环境的CSS样式表文件尽可能小
```

### react-dev-utils的相关工具
```text

EntryPoints[7]
    InterpolateHtmlPlugin
        该插件让我们注入 variables 到 index.html limit HtmlWebpackPlugin 2.x
        
        plugins: [
            HtmlWebpackPlugin({
                inject: true,
                template: path.resolve('public/index.html'),
            }),
            new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
            // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
                PUBLIC_URL: publicUrl,
            })
        ]
        
    InlineChunkHtmlPlugin
        内联 chunk 脚本，直接将 js 代码嵌入 script 中，类似公共类库
        
    ModuleScopePlugin
        确保相对导入并不会超出它指定的目录范围之外，node_modules 是默认路径
        plugins:[
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
        ]
        
    WatchMissingNodeModulesPlugin
       观察某个目录下是有有自己import的依赖，如果没有就安装该依赖并重启
       new WatchMissingNodeModulesPlugin(path.resolve('node_modules'))
    
    checkRequiredFiles(files:Array<string>):boolean
       确认传递的文件是存在的，且文件名要求是绝对路径
    clearConsole
        跨平台的方式清空命令行的 console
    eslintFormatter(results: Object): string
        cra 自定义的官方 eslint 报错格式
        module:{
            rules:[
                {
                    test:/\.(js|jsx)$/
                    include: paths.appSrc,
                    enforce: 'pre',
                    use:[
                        {
                            loader: 'eslint-loader',
                            options: {
                                formatter: eslintFormatter,
                            }
                        }
                    ]
                }
            ]
        }
FileSizeReport[10]
    measureFileSizesBeforeBuild(buildFolder: string): Promise<OpaqueFileSizes>
    printFileSizeAfterBuild(
        webpackStats: WebpackStats, 
        previousFileSizes: OpaqueFileSizes, 
        buildFolder: string,
        maxBundleGzipSize?: number,
        maxChunkGzipSize?: number    
    )   
        测量 build 前后文件包的体积变化
    
    formatWebpackMessages({
        errors: Array<string>,
        warnings: Array<string>
    }): {
        errors: Array<string>,
        warnings: Array<string>
    }
    
    printBuildError(error: Object): void
        打印构建的错误信息
        
    getProcessForPort(port: number): string
        查找到当前端口在跑的服务，并返回 名字 和 目录
        
    launchEditor(fileName: string, lineNumber: number): void
       用编辑其打开某个文件
       至于编辑器的种类是可以 通过 .env.local 下的 REACT_EDITOR = atom 进行编辑
    
    noopServiceWorkerMiddleware(servedPath: string): ExpressMiddleware
        返回 expressMiddleware 重置之前的服务配置，对于 development 非常有用，但我还是不太清楚
    redirectServedPathMiddleware(servedPath: string): ExpressMiddleware
    
    openBrowser(url:string):boolean
    
    printHostingInstructions(
        appPackage: Object,
        publicUrl: string,
        publicPath: string,
        buildFolder: string,
        useYarn: boolean
    ): void
        const appPackage = require(paths.appPackageJson);
        const publicUrl = paths.publicUrlOrPath;    
        const publicPath = config.output.publicPath;
        printHostingInstructions(appPackage, publicUrl, publicPath, 'build', true);

WebpackDevServeUtils[7]
    choosePort(host: string, defaultPort: number): Promise<number | null>
    
    createCompiler(config): WebpackCompiler
    {
        appName,
        config,
        devSocket,
        urls,
        useYarn,
        useTypeScript,
        tscCompileOnError,
        webpack        
    }
    
    prepareProxy(proxySetting:string, appPublicFolder: string, servedPathname: string): Object
        创建一个 proxy 配置 从 package.json 下的 proxy 中读取
    prepareUrls(protocol: string, host:string, port:number, pathname: string ='/'):Object
        
     webpackHotDevClient
        仅支持 webpack 3.x
        在 entry 中加入 'react-dev-utils/webpackHotDevClient'
        
     // 至此我知道 react 所谓的 scssModule 是如何实现的了, css-loader已经添加了该支持
     getCSSModuleLocalIdent(
        context: object, 
        localIdentName: string,
        localName: string,
        options: object
     )
            module:{
                rules:[
                    {
                        test: /\.module\.css$/,
                        use:[
                            loader: require.resolve('css-loader'),
                            options:{
                                importLoaders: 1,
                                modules:{
                                    getLocalIdent: getCSSModuleLocalIdent,
                                }
                            }
                        ]
                    }
                ]
            }
            
    getCacheIdentifier(environment: string, packages: string[]):string
    
    

```

### react-app-polyfill
```text
- ie9
    extends ie11
    map
    set

- ie11
    Promise
    fetch
    object-assign
    symbol
    Array.from

- jsdom
   fetch

- stable
   core-js/stable
   regenerator-runtime/runtime     

推荐我们使用 @babel/preset-env browserslist 的组合，根据目标浏览器添加 polyfill
```

### react-error-overlay
```text
有一个类似的 error-overlay-webpack-plugin 的插件
plugins:[ new ErrorOverlayPlugin() ] -> ok. 
```

### css 代码检查
```text

- stylelint
- stylelint-config-prettier
- stylelint-config-recommended
- stylelint-config-styled-components
- stylelint-order
- stylelint-processor-styled-components

```

### styled-components
```text

styled-components

- babel-plugin-styled-components
    minify -> one removes all whitespace & comments
- babel-plugin-macros

```

### react-app-rewired
```text
    package.json
    config-overrides-path -> node_modules/some-preconfigured-rewire
    
    react-scripts 会覆盖 tsconfig.json 中的compilerOptions 属性
    所以更改 paths 需要添加 extends tsconfig.paths.json 
```
