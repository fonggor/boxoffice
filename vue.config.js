module.exports = {
    devServer: {
        proxy: {   //设置proxy解决跨域问题
            '/tp': {
                target: 'https://box.maoyan.com/',  //这里是跨域的地址
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/tp': ''
                }
            }
        }
    }
};