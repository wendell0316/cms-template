const path = require('path');
const NODE_ENV = process.env['envType'] || 'development';
const projectConfig = require(`./src/config/config.${NODE_ENV}`);
let baseUrl = projectConfig.base;
const resolve = (dir) => {
    return path.join(__dirname, dir);
};


console.log(baseUrl)
module.exports = {
    publicPath: baseUrl,
    lintOnSave: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'));
        config.output.filename('[name].[hash].js').end();
        config.plugin('define').use(require('webpack/lib/DefinePlugin'), [
            {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.envType': JSON.stringify(process.env.envType),
            },
        ]);
    },
    // 打包时不生成.map文件
    productionSourceMap: false,
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://10.101.44.4:15900/nzapi/cms/', //这里后台的地址模拟的;应该填写你们真实的后台接口
    //             // ws: true,
    //             changOrigin: true, //允许跨域
    //             pathRewrite: {
    //                 '^/api': '' //请求的时候使用这个api就可以
    //             }
    //         }
    //     }
    //     // proxy: 'http://10.101.44.4:15900/nzapi/cms/',
    // }
};
