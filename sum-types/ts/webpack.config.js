/* global __dirname */
module.exports = {
  entry: "./src/index.ts",
  devtool: "source-map",
  output: {
    path: __dirname + "/build",
    filename: "generated-app.js"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          compilerOptions: {
            declaration: false
          }
        },
      }
    ]
  }
};
