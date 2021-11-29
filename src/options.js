// eslint-disable-next-line jsdoc/valid-types
/**
 * @typedef {import('schema-utils').ValidationError} ValidationError
 */

const { validate } = require( 'schema-utils' );

class AdditionalImportWebpackPreLoaderOptions {
	globs = [];
	magicComments = '';
	pathCheck = () => true;

	#scheme = {
		type: 'object',
		properties: {
			globs: {
				description: 'Absolute globs to the file that need to be imported.',
				anyOf: [ { type: 'string' }, { type: 'array' } ],
			},
			magicComments: {
				description: 'Webpack magic comments for all imports.',
				type: 'string',
			},
			pathCheck: {
				description:
					'The function which checks if the path found needs to be imported. It takes the file path as input,' +
					'and should return true if the path is to be imported, false if it is not.',
				instanceof: 'Function',
			},
		},
		additionalProperties: false,
	};

	/**
	 * Performs validation and results in the desired format.
	 *
	 * @throws {ValidationError} Will throw an error if options do not check the schema.
	 *
	 * @param {Object} loaderOptions - An array of options, will be checked against the scheme.
	 * @param {string} loaderName    - Loader name, will be displayed in error.
	 */
	constructor( loaderOptions, loaderName ) {
		validate( this.#scheme, loaderOptions, { name: loaderName } );
		this.#setOptions( loaderOptions );
	}

	/**
	 * Sets options in the desired format.
	 *
	 * @param {Object} loaderOptions - An object of loader options.
	 */
	#setOptions( loaderOptions ) {
		const toArrayOptions = [
			'globs',
		];

		for ( const optionKey in loaderOptions ) {
			const option = loaderOptions[ optionKey ];

			if ( toArrayOptions.indexOf( optionKey ) !== -1 ) {
				this[ optionKey ] = typeof option === 'string' ? Array( option ) : option;
			} else {
				this[ optionKey ] = option;
			}
		}

		if ( this.magicComments ) {
			this.magicComments = '/* ' + this.magicComments + ' */';
		}
	}
}

module.exports = AdditionalImportWebpackPreLoaderOptions;
