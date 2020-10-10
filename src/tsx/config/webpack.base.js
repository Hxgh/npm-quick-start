const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: path.resolve(__dirname, '..', 'src'),
        use: ['url-loader?limit=8192&name=assets/image/[name].[hash:4].[ext]'],
      },
      {
        test: /\.(eot|woff|svg|ttf|woff2|otf|appcache|mp3|mp4|pdf)(\?|$)/,
        include: path.resolve(__dirname, '..', 'src'),
        use: ['file-loader?name=assets/font/[name].[hash:4].[ext]'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css'],
  },
};
