const fs = require( 'fs' );
const path = require( 'path' );

const app = require( 'express' )();
const PrettyError = require( 'pretty-error' );
const debugHTTP = require( 'debug-http' );

const config = require( './config.js' );
const router = require( './router.js' );
const render = require( './render' ).render;
const rebuild = require( './rebuild' );

const isSocket = isNaN( config.port );
const skip = ( req, res, next ) => next();

if ( config.__DEV__ ) debugHTTP();

/*
 * Server's middleware
 *
 *****************************************************************************/
app
  .disable( 'x-powered-by' )
  .enable( 'trust proxy' )
  .use( require( 'compression' )() ) // TODO: Add Brotli / Zopfli compression #2
  .use( config.__DEV__ ? require( 'tiny-lr' ).middleware( { app, dashboard: true } ) : skip )
  .use( require( 'serve-favicon' )( path.join( config.staticFolder, 'favicon.ico' ) ) )
  .use( require( 'serve-static' )( config.staticFolder ) )
  .use( require( 'cookie-parser' )() )
  .use( require( 'body-parser' ).urlencoded( { extended: true } ) )
  .use( require( 'express-session' )( {
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret,
  } ) )
  .use( config.__DEV__ ? skip : require( 'connect-slashes' )() );

/*
 * Routing
 *
 *****************************************************************************/
app.all( '*', async ( req, res, next ) => {
  try {
    const route = await router.resolve( {
      pathname: req.path,
      query: req.query || {},
    } );


    if ( route.redirect ) {
      res.redirect( route.status || 302, route.redirect );

      return;
    }

    res.status( route.status || 200 );

    if ( route.page ) {
      const html = await render( req, res, route );


      return html;
    }

    return res.json( route );
  } catch ( error ) {
    // Prepare for error handler
    next( error );
  }
} );

/*
 * Error handler
 *
 *****************************************************************************/
const pe = new PrettyError();

pe.skipNodeFiles();
pe.skipPackage( 'express' );

app.use( ( err, req, res ) => {
  console.error( pe.render( err ) );
  res.status( err.status || 500 );
  const html = render( req, res, {}, { page: 'error', api: { error: err } } );

  return res.send( html );
} );

if ( config.__DEV__ ) {
  rebuild( app );
}

/*
 * Start server
 *
 *****************************************************************************/
isSocket && fs.existsSync( config.port ) && fs.unlinkSync( config.port );
app.listen( config.port, function () {
  isSocket && fs.chmod( config.port, '0777' );
  console.log( `Server is now listening on ${ this.address().port }` );
} );
