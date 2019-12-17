block( '*' )( {
  def ( node ) {
    node.mods.size = node.mods.size || 'm';
    node.mods.theme = node.mods.theme || node.defaultTheme || 'light';
    node.elemMods.theme = node.elemMods.theme || node.defaultTheme || 'light';
    return [
      applyNext( {
        defaultTheme: node.elemMods.theme || node.mods.theme || node.defaultTheme,
      } ),
    ].join( '' );
  },
} );
