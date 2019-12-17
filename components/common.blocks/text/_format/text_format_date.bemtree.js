const dateFormat = require( 'date-fns/format' );

const locale = {
  // eslint-disable-next-line global-require
  ru: require( 'date-fns/locale/ru' ),
}

block( 'text' )
  .mod( 'format', 'date' )
  .content()( ( node, { date, format } ) => dateFormat( date, format, { locale: locale.ru } ) );
