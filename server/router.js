const UniversalRouter = require( 'universal-router' );
const generateUrls = require( 'universal-router/generateUrls' );

const home = require( './routes/home' );
const error = require( './routes/error' );
const wip = require( './routes/wip' );

const router = new UniversalRouter(
  {
    path: '',
    name: 'root',
    children: [
      {
        path: '',
        name: 'index',
        load: async () => await home,
      },
      {
        path: '/order/:order',
        name: 'order',
        load: async () => await wip,
      },

      {
        path: '(.*)',
        name: '404',
        load: async () => await error,
      },
    ],

    async action ( { next } ) {
      const route = await next() || {};

      return route;
    },
  },
  {
    resolveRoute ( context, params ) {
      params.urlTo = generateUrls( context.router );

      if ( typeof context.route.load === 'function' ) {
        return context.route.load().then( action => action( context, params ) );
      }
      if ( typeof context.route.action === 'function' ) {
        return context.route.action( context, params );
      }
      return undefined;
    },
  },
);

module.exports = router;
