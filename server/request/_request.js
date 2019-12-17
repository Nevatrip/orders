const axios = require( 'axios' );
const { cacheAdapterEnhancer } = require( 'axios-extensions' );

const API = axios.create( {
  baseURL: process.env.API,
  headers: { 'Cache-Control': 'no-cache' },

  // cache will be enabled by default
  adapter: cacheAdapterEnhancer( axios.defaults.adapter, false ),
} );

const fetch = async options => {
  try {
    const response = await API( options );

    return response;
  } catch ( error ) {
    console.error( 'Request Failed:', error.config );
    if ( error.response ) {
      console.error( 'Status:', error.response.status );
      console.error( 'Data:', error.response.data );
      console.error( 'Headers:', error.response.headers );
    } else {
      console.error( 'Error Message:', error.message );
    }
    throw new Error( error.response || error.message );
  }
};

class Request {
  constructor ( url, params = {}, session ) {
    this.pathname = url.replace( /\/?$/, '/' );
    this.search = params;
    this.session = session;
  }

  get url () {
    const params = Object.keys( this.search )
      .map( param => `${ param }=${ this.search[ param ] }` )
      .join( '&' );

    return `${ this.pathname }/?${ params }`;
  }

  set url ( url ) {
    this.pathname = url;
    return this;
  }

  get params () {
    return this.search;
  }

  set params ( params = {} ) {
    this.search = Object.assign( {}, this.search, params );
    return this;
  }

  set removeParam ( param ) {
    if ( this.search.hasOwnProperty( param ) ) {
      // delete this.search[param];
      Reflect.deleteProperty( this.search, param );
    }
    return this;
  }

  request ( type = 'get' ) {
    const options = {
      method: type,
      url: this.pathname,
      params: this.params,
      ...type === 'post' ? { data: this.params } : {},
      withCredentials: true,
    };

    return fetch( options )
      .then( response => response.data )
      .catch( error => error );
  }
}

module.exports = Request;
