const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');


const PATH = {
	// 'path.resolve' doesn't need '__dirname'
	dist: path.resolve('dist'),
	src: path.resolve('src'),
	pages: path.resolve('src/pages')
};
const PAGES = fs.readdirSync(PATH.pages).filter(fileName => {
	return fileName.endsWith('.html') || fileName.endsWith('.pug')
});
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;



module.exports = {
	mode: 'development',
	devtool: isDev ? 'inline-source-map' : false,
	
	entry: {
		main: PATH.src,
		'colors&type': path.join(PATH.pages, 'colors&type'),
		'headers&footers': path.join(PATH.pages, 'headers&footers')
	},
	output: {
		filename: filename('js'),
		path: PATH.dist,                        // for CleanWebpackPlugin
		publicPath: isDev ? './' : '/'          // to open html without 'webpack serve'
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
		// hot: true,                           // doesn't work with html
		// open: true,
		port: 8081,
	},
	plugins: [
		// new HTMLWebpackPlugin({
		// 	template: path.join(PATH.src, 'index.pug'),
		// 	filename: 'index.html',
		// 	chunks: ['main']
		// }),
		...PAGES.map(page => new HTMLWebpackPlugin({
			template: path.join(PATH.pages, page),
			filename: path.parse(page).name + '.html',
			chunks: [
				'main',
				path.parse(page).name
			]
		})),
		
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
				use: {
					loader: 'pug-loader',
					options: {
						pretty: true,
						root: PATH.pages
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
					path.join(PATH.src, 'assets/fonts')
				],
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name][ext]'
				}
			},
			{
				test: /\.(jpe?|pn|sv)g$/,
				exclude: [
					path.join(PATH.src, 'assets/fonts')
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