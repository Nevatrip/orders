const dateFormat = require( 'date-fns/format' );

const locale = {
  // eslint-disable-next-line global-require
  ru: require( 'date-fns/locale/ru' ),
}

block( 'text' )
  .mod( 'format', 'date' )
  .content()( ( node, { date, format } ) => {
    return dateFormat( node._zonedTimeToUtc( date, 'Europe/Prague' ), format, { locale: locale.ru } )
  } );
