const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entries = {};

fs.readdirSync('src/Scripts/')
	.filter(
		(entryName) =>
			entryName.includes('.js') &&
			entryName.indexOf('.') !== 0 && // avoid dirs beginning by "."
			entryName.indexOf('_') !== 0, // avoid dirs beginning by "_"
	)
	.forEach(
		(entry) => (entries[entry.replace('.js', '')] = `./src/Scripts/${entry}`),
	);

const alias = {
	styles: path.resolve(__dirname, 'src/Content/css/'),
	scripts: path.resolve(__dirname, 'src/Scripts/'),
	utils: path.resolve(__dirname, 'src/Scripts/utils/'),
	data: path.resolve(__dirname, 'src/data/'),
};

module.exports = (env, argV) => {
	const IS_DEV = !!env.development;
	const IS_PROD = !!env.production;
	const outputPath = 'dist';

	return {
		mode: IS_PROD ? 'production' : 'development',
		devtool: IS_PROD ? false : 'source-map',
		watch: IS_DEV,
		stats: {
			assets: false,
			assetsSort: 'name',
			builtAt: false,
			children: false,
			chunks: false,
			excludeAssets: [/\.(png|jpg|gif|svg)?$/, /\.(map)?$/],
			hash: false,
			modules: false,
			warnings: false,
		},
		entry: entries,
		output: {
			publicPath: '/',
			filename: 'Scripts/[name].js',
			path: path.resolve(__dirname, outputPath),
		},
		optimization: {
			emitOnErrors: true,
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
			alias, // declared in the upper scope
		},
		plugins: [
			new webpack.DefinePlugin({ IS_DEV, IS_PROD }),
			new ESLintPlugin({}),

			new MiniCssExtractPlugin({
				filename: 'Content/css/[name].css',
			}),
		],
		module: {
			rules: [
				{ test: /\.tsx?$/, loader: 'ts-loader' },
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: ['source-map-loader', 'babel-loader'],
				},
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								url: false,
							},
						},
					],
				},
				{
					test: /\.s[ac]ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								url: false,
							},
						},
						'postcss-loader',
						'sass-loader',
					],
				},
			],
		},
	};
};
