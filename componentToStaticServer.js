var fs = require('fs');

var exports = module.exports = function (fis) {

    fis.set('namespace', '');   // 命名空间、上下文根
    fis.set('componentDomain', 'http://192.168.1.72:8999'); //组件访问地址
    fis.set('receiverUrl', 'http://192.168.1.72:8999/receiver'); // 设置静态服务器地址
    fis.set('receiverDir', 'output'); // 发布服务器存放路径

    var weight = -100;

    var flist = scanFolder('src/components').files;
    for (var i = 0; i < flist.length; i++) {
        var item = flist[i];
        if (item.indexOf('component.json') != -1) {
            //console.info(item);
            var data = fs.readFileSync(item, "utf-8");
            //console.log(data);
            var component = JSON.parse(data);
            var componentPath = '/src/components/' + component.name + '/(**)';
            var componentRelease = '/components/' + component.name + '/' + component.version + '/$1';

            fis.media('prod')
                .match(componentPath, {
                    release: componentRelease,
                    domain: '${componentDomain}'
                }, weight + 1);
        }
    }

    function scanFolder(path) {
        var fileList = [],
            folderList = [],
            walk = function (path, fileList, folderList) {
                files = fs.readdirSync(path);
                files.forEach(function (item) {
                    var tmpPath = path + '/' + item,
                        stats = fs.statSync(tmpPath);

                    if (stats.isDirectory()) {
                        walk(tmpPath, fileList, folderList);
                        folderList.push(tmpPath);
                    } else {
                        fileList.push(tmpPath);
                    }
                });
            };

        walk(path, fileList, folderList);

        //console.log('扫描' + path + '成功');

        return {
            'files': fileList,
            'folders': folderList
        }
    }


// =========== 以下为发布设置 =============

    fis.media('prod')
        //.match('*.js', {
        //    domain: '/legend/static/'
        //})

        // 设置打包规则
        .match('::package', {
            // 关于打包配置，请参考：https://github.com/fex-team/fis3-packager-deps-pack
            packager: fis.plugin('deps-pack', {
                'pkg/frame.css': [
                    '/src/static/scss/**.css',
                    '/src/static/scss/**.scss',
                    '/src/widget/**.scss'
                ],
                //'pkg/boot.js': [
                //  'static/js/require.js',
                //  'components/jquery/jquery.js',
                //  'components/bootstrap/bootstrap.js',
                //  'components/bootstrap/bootstrap.js:deps' // 匹配依赖部分
                //],
                'pkg/app.js': [
                    'src/page/examples/form.js',
                    'src/page/examples/form.js:deps'
                ]
            })
        })

        // 设置打包规则
        //.match('/static/**.*', {
        //    deploy: fis.plugin('http-push', {
        //        receiver: '${receiverUrl}',
        //        to: '${receiverDir}'    // 服务端存放路径
        //    })
        //})

        // 设置组件发布到静态资源服务器规则
        .match('/src/components/**.*', {
            deploy: fis.plugin('http-push', {
                receiver: '${receiverUrl}',
                to: '${receiverDir}'    // 服务端存放路径
            })
        })
    ;

};

exports.init = exports;
