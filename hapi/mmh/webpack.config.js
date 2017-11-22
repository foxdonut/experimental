/*global __dirname*/
var path = require("path");

module.exports = {
  entry: {
    "domvm": "./src/jsx/index.jsx"
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "generated-[name].js",
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // options may need to be in .babelrc for tests to work
          options: {
            presets: ["env"],
            plugins: [
              ["transform-react-jsx", {
                "pragma": "jsx"
              }]
            ]
          }
        }
      }
    ]
  }
};

