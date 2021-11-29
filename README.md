# Additional Imports Webpack Pre Loader

Adds additional imports to the end of the processed file according to the passed global paths.

## Installation

You can install the package as follows:

```sh
npm install @sumotto/additional-imports-webpack-pre-loader --save-dev

# or

yarn add @sumotto/additional-imports-webpack-pre-loader --dev
```

## Usage

Add a rule to your Webpack configuration:

```js
module.exports = {
	module: {
		rules: [
			{
				test: /src[\\/]index\.js$/, // Files into which the imports will be added.
				exclude: /node_modules/,
				enforce: 'pre', // Be sure to specify 'pre' to make the other loaders work later.
				use: [
					{
						loader: '@sumotto/additional-imports-webpack-pre-loader',
						options: {
							// An array of absolute globe paths, the found files will be imported.
							globs: [
								resolve( __dirname, 'src/styles/pages/**/*.pcss' ),
								resolve( __dirname, 'src/scripts/pages/**/*.js' ),
							],
							// Webpack magical comments will be added to each additional import.
							magicComments: 'webpackMode: "eager", webpackChunkName: "pages"',
							// The function which checks if the path found needs to be imported.
							pathCheck( path ) {
								return path.test( /test/ );
							}
						}
					}
				],
			},
		]
	},
}
```

## License

MIT License
