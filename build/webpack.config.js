const webpack = require("webpack");
const paths = require("./paths");
const path = require("path");

const UglifyJSPlugin = require("uglify-js-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ErrorOverlayPlugin = require("error-overlay-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = function getWebpackConfig(webpackEnv) {
  const isEnvProduction = webpackEnv === "production";
  const isEnvDevelopment = webpackEnv === "development";

  return {
    mode: webpackEnv,
    entry: ["babel-polyfill", paths.appIndexJs],
    devtool: isEnvDevelopment ? "cheap-module-source-map" : "source-map",
    output: {
      path: paths.appBuild,
      filename: isEnvProduction
        ? "static/js/[name].[hash].js"
        : "static/js/bundle.js",
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      publicPath: isEnvProduction ? paths.publicUrlOrPath : undefined,
    },
    resolve: {
      extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
      alias: {
        "@": paths.appSrc,
      },
    },
    module: {
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        // {
        //   test: /\.(js|mjs|jsx|ts|tsx)$/,
        //   enforce: "pre",
        //   include: paths.appSrc,
        //   use: [
        //     {
        //       options: {
        //         emitError: true,
        //         emitWarning: true,
        //         cache: true,
        //         formatter: require.resolve("eslint-friendly-formatter"),
        //         eslintPath: require.resolve("eslint"),
        //         resolvePluginsRelativeTo: __dirname,
        //       },
        //       loader: require.resolve("eslint-loader"),
        //     },
        //   ],
        // },
        // {
        //   test: /\.coffee$/,
        //   loader: "coffee-loader",
        // },
        {
          test: /\.less$/i,
          loader: [
            // compiles Less to CSS
            "style-loader",
            "css-loader",
            "less-loader",
          ],
        },
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              exclude: /node_modules/,
              loader: "babel-loader",
            },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            { test: /\.(png|svg|jpg|gif)$/, loader: "file-loader" },
            { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ["file-loader"] },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [isEnvProduction && new UglifyJSPlugin()].filter(Boolean),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "../public"),
            to: "public",
            filter: (path) => !path.endsWith(".html"),
          },
        ],
      }),
      new HtmlWebpackPlugin({ template: "public/index.html" }),
      isEnvProduction &&
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production"),
        }),
      isEnvDevelopment && new FriendlyErrorsWebpackPlugin(),
      // isEnvDevelopment && new ErrorOverlayPlugin(),
      isEnvDevelopment && new webpack.NamedModulesPlugin(),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    ].filter(Boolean),
  };
};
