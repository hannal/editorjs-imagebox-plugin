const path = require('path');

// 공통 설정
const common = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
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

// 각 포맷별 설정
module.exports = [
  // UMD
  {
    ...common,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'imagebox.umd.js',
      library: {
        name: 'ImageBox',
        type: 'umd',
        export: ['ImageBox', 'imageBoxParser']
      },
      globalObject: 'this'
    }
  },
  // CommonJS
  {
    ...common,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'imagebox.cjs.js',
      library: {
        type: 'commonjs2'
      }
    }
  },
  // ES Module
  {
    ...common,
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'imagebox.esm.js',
      library: {
        type: 'module'
      }
    },
    experiments: {
      outputModule: true
    }
  }
]; 