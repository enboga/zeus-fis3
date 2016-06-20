var path = require('path');
var componentToStaticServer = require('./componentToStaticServer');

var exports = module.exports = function(fis) {

    fis.set('system.localNPMFolder', path.join(__dirname, 'node_modules'));

    // since fis3@3.3.21
    // 帮当前目录的查找提前在 global 查找的前面，同时又保证 local 的查找是优先的。
    if (fis.require.paths && fis.require.paths.length) {
        fis.require.paths.splice(1, 0, path.join(__dirname, 'node_modules'));
    }


    fis.require.prefixes.unshift('jello'); // 优先加载 jello 打头的插件。

    var weight = -100; // 此插件中，所有 match 默认的权重。
    var weightWithNs = -50; // 所有针对有 namespace 后设置的权重

    fis.set('namespace', '');
    fis.set('statics', 'static');
    fis.set('component.dir', '/src/components'); //配置组件位置
    fis.set('templates', '/WEB-INF/views');

    // 默认捆绑 jello 的服务器。
    // fis3 server start 可以不指定 type.
    fis.set('server.type', 'jello');

    // 挂载 commonJs 模块化插件。
    // 
    // 如果要使用 amd 方案，请先执行
    // fis.unhook('commonjs');
    // 然后再执行 fis.hook('amd');
    // 多个模块化方案插件不能共用。
    // fis.hook('commonjs', {
    //     // baseUrl: './src/modules',
    //     // extList: ['.js', '.jsx']
    // });

    fis.hook('commonjs');

    fis

        // 对 less 文件默认支持。
        /*.match('*.less', {
            parser: fis.plugin('less'),
            rExt: '.css'
        }, weight)*/

        // 不启用 less
        // .match('*.less', {
        //     parser: null
        // }, weight)

        // 对 sass 文件默认支持。默认支持生成map
        .match('*.{sass,scss}', {
            parser: fis.plugin('node-sass', {
                include_paths: [
                    './src/static/scss'
                ],
                sourceMap: true
            }),
            rExt: '.css'
        }, weight)

        // 对 tmpl 文件，默认采用 utc 插件转换成 js 函数。
        .match('*.tmpl', {
            parser: fis.plugin('utc'),
            rExt: '.js'
        }, weight)

        // 对 vm 和 jsp 进行语言识别。
        .match('*.{vm,jsp}', {
            preprocessor: fis.plugin('extlang')
        }, weight)

        // 所有文件默认放 static 目录下面。
        // 后续会针对部分文件覆盖此配置。
        .match('**', {
            release: '${statics}/${namespace}/$0'
        }, weight)


        // ===== components =====
        .match('/src/components/(**)', {
            release: '${statics}/components/$1'
        }, weight)

        // 标记 components 目录下面的 js\jsx 都是模块。
        .match('/src/components/**.{js,jsx}', {
            isMod: true
        }, weight)
        // ===== end components =====


        // ===== page =====
        .match('/src/page/(**)', {
            release: '${statics}/page/$1'
        }, weight)

        // 标记 page 目录下面的 js\jsx 都是模块。
        .match('/src/page/**.{js,jsx}', {
            isMod: true
        }, weight)

        .match('/src/page/(**.{jsp,vm,html})', {
            id: 'page/$1',
            url: '/page/$1',
            release: '${templates}/${namespace}/page/$1',
            isMod: true,
            extras: {
                isPage: true
            }
        }, weight)

        // ===== end page =====

        // ===== widget =====
        .match('/src/widget/(**)', {
            release: '${statics}/widget/$1'
        }, weight)

        // 标记 widget 目录下面的 js\jsx 都是模块。
        .match('/src/widget/**.{js,jsx}', {
            isMod: true
        }, weight)

        .match('/src/widget/(**).({jsp,vm,html})', {
            id: 'widget/$1',
            url: '/widget/$1',
            release: '${templates}/${namespace}/widget/$1',
            isMod: true
        }, weight)
        // ===== end widget =====

        // ===== modules =====
        .match('/src/modules/(**)', {
            release: '${statics}/modules/$1'
        }, weight)

        // 标记 modules 目录下面的 js\jsx 都是模块。
        .match('/src/modules/**.{js,jsx}', {
            // id: '$1/$2',
            // moduleId: '$1',
            isMod: true
        }, weight)
        // ===== end modules =====

        // static 下面的文件直接发布到 $statics 目录。
        // 为了不多一层目录 static。
        .match('/src/static/(**)', {
            release: '${statics}/${namespace}/$1'
        }, weight)

        // ========== react ==========

        // 编译所有后缀为 jsx 的文件为 js
        // fis.set('project.fileType.text', 'jsx');
        .match('**.{jsx,es}', {
            parser: fis.plugin('babel-5.x', {
                blacklist: ['regenerator'],
                stage: 3,
                sourceMaps: true,
                optional: [
                    "es7.asyncFunctions",
                    "es7.classProperties",
                    "es7.comprehensions",
                    "es7.decorators",
                    "es7.doExpressions",
                    "es7.exponentiationOperator",
                    "es7.exportExtensions",
                    "es7.functionBind",
                    "es7.objectRestSpread",
                    "es7.trailingFunctionCommas"
                ]
            }),
            rExt: '.js'
        }, weight)

        .match('/src/modules/**.{js,jsx,es}', {
            parser: fis.plugin('babel-5.x', {
                blacklist: ['regenerator'],
                stage: 3,
                sourceMaps: true,
                optional: [
                    "es7.asyncFunctions",
                    "es7.classProperties",
                    "es7.comprehensions",
                    "es7.decorators",
                    "es7.doExpressions",
                    "es7.exponentiationOperator",
                    "es7.exportExtensions",
                    "es7.functionBind",
                    "es7.objectRestSpread",
                    "es7.trailingFunctionCommas"
                ]
            }),
            rExt: '.js'
        }, weight)



        // ========== end react ==========

        // test 目录原封不动发过去。
        .match('/src/test/(**)', {
            release: '/test/${namespace}/$1',
            isMod: false,
            useCompile: false
        }, weight)

        // ========== jsp ==========        
        .match('{map.json,${namespace}-map.json}', {
            release: '/WEB-INF/config/$0'
        }, weight)

        // 注意这类文件在多个项目中都有的话，会被最后一次 release 的覆盖。
        .match('{fis.properties,server.conf}', {
            release: '/WEB-INF/$0'
        }, weight)

        .match('server.conf', {
            release: '/WEB-INF/server${namespace}.conf'
        })

        .match('VM_global_library.vm', {
            release: '/${templates}/VM_global_library.vm'
        }, weight)
        // ========== end jsp ==========

        // _ 下划线打头的都是不希望被产出的文件。
        .match('_*.*', {
            release: false
        }, weight + 2)

        // 脚本也是。
        .match('**.{sh,bat}', {
            release: false
        }, weight)

        // 自动产出 map.json
        .match('::package', {
            postpackager: function(ret) {
                var path = require('path')
                var root = fis.project.getProjectPath();
                var ns = fis.get('namespace');
                var mapFile = ns ? (ns + '-map.json') : 'map.json';
                var map = fis.file.wrap(path.join(root, mapFile));
                map.setContent(JSON.stringify(ret.map, null, map.optimizer ? null : 4));
                ret.pkg[map.subpath] = map;
            }
        }, weight)

        .match('**', {
            deploy: [
                fis.plugin('replace', {
                    from: '__ZEUS_FIS3_MEDIA__',
                    to: 'dev'
                }),
                fis.plugin('local-deliver') //must add a deliver, such as http-push, local-deliver
            ]
        });


    fis
        .media('html')

        .match('::package', {
            // 本项目为纯前端项目，所以用 loader 编译器加载，
            // 如果用后端运行时框架，请不要使用。
            postpackager: fis.plugin('loader', {
                useInlineMap: true
            })
        });

    // 在 prod 环境下，开启各种压缩和打包。
    fis
        .media('prod')

        .match('**.{jsx,es}', {
            optimizer: fis.plugin('uglify-js',{
                drop_console: true,
                sourceMap: true
            })
        }, weight)

        .match('/src/modules/**.{js,jsx,es}', {
            optimizer: fis.plugin('uglify-js',{
                drop_console: true,
                sourceMap: true
            })
        }, weight)

        .match('*.css', {
            optimizer: fis.plugin('clean-css')
        }, weight)

        .match('*.png', {
            optimizer: fis.plugin('png-compressor')
        }, weight)

        // 加 md5
        .match('/src/{modules,page,static,widget}/**.{js,css,png,jsx,es}', {
            useHash: true
        })

        .match('**', {
            deploy: [
                fis.plugin('replace', {
                    from: '__ZEUS_FIS3_MEDIA__',
                    to: 'prod'
                }),
                fis.plugin('local-deliver') //must add a deliver, such as http-push, local-deliver
            ]
        });

    
    // 当用户 fis-conf.js 加载后触发。
    fis.on('conf:loaded', function() {
        if (!fis.get('namespace'))return;

        fis.match('/src/page/**.{jsp,vm,html}', {
            url: '/${namespace}/page/$1'
        }, weightWithNs);

        fis.match('/src/widget/**.{jsp,vm,html}', {
            url: '/${namespace}/widget/$1'
        }, weightWithNs);
    });

    //设置组件 发布到 静态服务器
    // componentToStaticServer(fis);
};

exports.init = exports;