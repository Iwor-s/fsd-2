const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
	mode: 'development',
	devtool: isDev ? 'inline-source-map' : false,
	// entry: { main: './src/index.js' },     // by default
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),  // for CleanWebpackPlugin
		publicPath: './'
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	devServer: {
		publicPath: '/',
		overlay: {
			warnings: true,
			errors: true
		},
		writeToDisk: true,
		// hot: true,                           // не работает с html
		// open: true,
		port: 8081,
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: './src/colors & type.html'
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: filename('css')
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env'
						]
					}
				}
			},
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
		'css-loader',
	];
	const postCssLoader = {
		loader: "postcss-loader",
		options: {
			postcssOptions: {
				plugins: [
					'autoprefixer',
					'cssnano'
				],
			}
		}
	}
	if (isProd) loaders.push(postCssLoader);
	if (loader) loaders.push(loader);
	return loaders;
}

function filename(ext) {
	return isDev ? `[name].${ext}` : `[name].[hash].${ext}`
}