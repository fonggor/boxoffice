module.exports = {
    devServer: {
        proxy: {   //设置proxy解决跨域问题
            '/api': {
                target: 'https://box.maoyan.com/promovie',  //这里是跨域的地址
                ws: true,
                changeOrigin: true
            }
        }
    }
};