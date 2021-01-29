const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PATH = {
	// 'path.resolve' doesn't need '__dirname'
	src: path.resolve('src'),
	dist: path.resolve('dist')
};

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
	mode: 'development',
	devtool: isDev ? 'inline-source-map' : false,
	entry: {
		main: PATH.src                          // by default
	},
	output: {
		filename: filename('js'),               // by default
		path: PATH.dist,                        // for CleanWebpackPlugin
		publicPath: isDev ? './' : '/'          // to open 'index.html' without 'webpack serve'
	},
	resolve: {
		alias: {
			'@': PATH.src
		}
	},
	target: isDev ? "web" : "browserslist",   // live reload don't work with 'browserslist'
	devServer: {
		publicPath: '/',
		overlay: {
			warnings: true,
			errors: true
		},
		writeToDisk: true,
		// hot: true,                           // don't work with html
		// open: true,
		port: 8081,
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: path.join(PATH.src, 'colors & type.html'),
			filename: 'colors & type.html'
		}),
		new HTMLWebpackPlugin({
			template: path.join(PATH.src, 'example.pug'),
			inject: true,
			filename: 'index.html'
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
				test: /\.pug$/,
				loader: 'pug-loader'
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
					path.join(PATH.src, 'assets/fonts')
				],
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]'
				}
			},
			{
				test: /\.(jpe?|pn|sv)g$/,
				include: [
					path.join(PATH.src, 'assets/img')
				],
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[name][ext]'
				}
			}
		]
	}
}

function filename(ext) {
	return isDev ? `[name].${ext}` : `[name].[contenthash:7].${ext}`
}

function css(loader) {
	const loaders = [
		MiniCssExtractPlugin.loader,
		'css-loader'
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
	};
	if (isProd) loaders.push(postCssLoader);
	if (loader) loaders.push(loader);
	return loaders;
}