block( 'text' ).mod( 'format', 'date' )( {
  tag: 'time',
  addAttrs: ( node, ctx ) => ( {
    title: ctx.content,
  } ),
  content: ( node, { date, format, lang = 'ru' } ) => {
    const dateFns = typeof window === 'undefined' ? node.require( 'dateFns' ) : window.dateFns;
    const locale = typeof window === 'undefined' ? node.require( `locale_${ lang }` ) : {};

    return dateFns.format( date, format, { locale } );
  },
} );
