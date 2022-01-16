/* eslint-disable jsdoc/no-undefined-types */
const { sync } = require( 'glob' );
const { parse, basename } = require( 'path' );
const { readFileSync, writeFile } = require( 'fs' );
const chokidar = require( 'chokidar' );
const AdditionalImportWebpackPreLoaderOptions = require( './options' );

/**
 * @param {string} content - Content of the resource file.
 * @return {string} - Content at the end of which additional imports have been added.
 * @this {loaderContext} loaderContext - The Loader Context.
 */
module.exports = function( content ) {
	const paths = [];
	const imports = {};
	const options = new AdditionalImportWebpackPreLoaderOptions( this.getOptions(), this.loaderName );

	const add = ( path ) => {
		path = path.replace( /\\/g, '/' );

		let magicComments = '';
		const fileInfo = parse( path );

		if ( options.magicComments ) {
			if ( options.magicComments instanceof Function ) {
				magicComments = options.magicComments( { ...fileInfo, path } );
			} else if ( typeof options.magicComments === 'string' ) {
				magicComments = options.magicComments.replace( /\[(.+)]/g, function( m, name ) {
					return fileInfo[ name ] || m;
				} );
			}

			if ( magicComments ) {
				magicComments = '/* ' + magicComments + ' */';
			}
		}

		imports[ path ] = `\r\nimport( ${ magicComments } "${ path }" );\r\n`;

		content += imports[ path ];
		this.addDependency( path.replace( /\//g, '\\' ) );
	};

	options.globs.forEach( ( glob ) => {
		sync( glob ).forEach( ( path ) => {
			if ( ! paths.includes( path ) && options.pathCheck( path, paths ) ) {
				paths.push( path );
			}
		} );
		if ( this.hot ) {
			chokidar
				.watch( glob, {
					ignoreInitial: true,
					followSymlinks: false,
				} )
				.on( 'add', () => {
					const buffer = readFileSync( this.resourcePath );
					writeFile( this.resourcePath, buffer.toString(), 'utf8', () => true );
				} )
				.on( 'unlink', () => {
					const buffer = readFileSync( this.resourcePath );
					writeFile( this.resourcePath, buffer.toString(), 'utf8', () => true );
				} );
		}
	} );

	paths.sort( function( a, b ) {
		a = basename( a );
		b = basename( b );
		if ( a < b ) {
			return -1;
		}
		if ( a > b ) {
			return 1;
		}

		return 0;
	} ).forEach( add );

	return content;
};
