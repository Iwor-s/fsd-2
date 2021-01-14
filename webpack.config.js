const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	devServer: {
		// historyApiFallback: true,
		// contentBase: path.resolve(__dirname, 'dist'),
		// compress: true,
		// hot: true,  // не работает с html
		writeToDisk: true,
		open: true,
		port: 8080,
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: './src/colors & type.html'
		}),
		new CleanWebpackPlugin,
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: css()
			},
			{
				test: /\.s[ac]ss$/,
				use: css('sass-loader')
			},
			{
				test: /\.(eot|[ot]tf|woff2?|svg)$/,
				include: [
					path.resolve(__dirname, 'src/assets/fonts')
				],
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]'
				}
			},
			{
				test: /\.(jpe?|pn|sv)g$/,
				include: [
					path.resolve(__dirname, 'src/assets/img')
				],
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[name][ext]'
				}
			}
		]
	}
}

function css(loader) {
	const loaders = [
		MiniCssExtractPlugin.loader,
		'css-loader'
	];
	
	if (loader) loaders.push(loader);
	return loaders;
}