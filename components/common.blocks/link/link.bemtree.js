block( 'link' )(
  match( ( node, { to } ) => to ).def()( ( { data }, ctx ) => {
    try {
      const url = data.params.urlTo( ctx.to );

      ctx.url = url === data.url.pathname ? '' : url
    } catch ( err ) {
      console.error( err );
    }

    return applyNext();
  } )
)
