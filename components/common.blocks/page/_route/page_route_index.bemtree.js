block( 'page' ).mod( 'route', 'index' )( {
  route: [
    { elem: 'filter' },
    { elem: 'orders' },
  ],
  addJs: node => ( { apiToken: node.config.apiToken } ),
} );
