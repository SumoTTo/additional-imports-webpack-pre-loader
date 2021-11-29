/* eslint-disable jsdoc/no-undefined-types */
const { sync } = require( 'glob' );
const AdditionalImportWebpackPreLoaderOptions = require( './options' );

/**
 * @param {string} content - Content of the resource file.
 * @return {string} - Content at the end of which additional imports have been added.
 * @this {loaderContext} loaderContext - The Loader Context.
 */
module.exports = function( content ) {
	const paths = [];
	const options = new AdditionalImportWebpackPreLoaderOptions( this.getOptions(), this.loaderName );

	options.globs.forEach( ( glob ) => {
		sync( glob ).forEach( ( path ) => {
			if ( ! paths.includes( path ) && options.pathCheck( path ) ) {
				content += `\r\nimport( ${ options.magicComments } "${ path }" );\r\n`;
				this.addDependency( path.replace( /\//g, '\\' ) );
				paths.push( path );
			}
		} );
	} );

	return content;
};
