// import path from "path";
// import glob from "glob";

// var entries = {};
// glob.sync("./src/**/index.ts").map(function (file) {
//   entries[file] = file;
// });

// module.exports = {
//   entry: entries,
//   module: {
//     rules: [
//       {
//         test: /\.tsx?$/,
//         use: "ts-loader",
//         exclude: /node_modules/,
//       },
//     ],
//   },
//   resolve: {
//     extensions: [".tsx", ".ts", ".js"],
//   },
//   output: {
//     filename: "bundle.js",
//     path: path.resolve(__dirname, "dist"),
//   },
// };
