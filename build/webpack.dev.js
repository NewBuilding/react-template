const Config = require("./webpack.config");
const config = Config("development");

module.exports = {
  ...config,
  devServer: {
    contentBase: "./dist", // 资源地址
    compress: true, // 文件是否压缩
    host: "localhost",
    https: true,
    // open: true, // 打开浏览器
    quiet: true, // 控制台不输出打包的bundle.js信息
    overlay: false, // 错误的时候是否需要遮罩层
    port: 8888,
    progress: true,
  },
};
