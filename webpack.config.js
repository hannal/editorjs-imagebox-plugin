const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[format].js',
    library: {
      name: 'ImageTool',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: {
    '@editorjs/editorjs': {
      commonjs: '@editorjs/editorjs',
      commonjs2: '@editorjs/editorjs',
      amd: '@editorjs/editorjs',
      root: 'EditorJS'
    }
  }
}; 