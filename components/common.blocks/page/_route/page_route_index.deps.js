[ {
  shouldDeps: [
    {
      block: 'page',
      elems: [
        'filter',
        'orders',
      ],
    },
    {
      block: 'form',
    },
    {
      block: 'form-field',
    },
    {
      block: 'functions',
      elem: 'debounce',
    },
    {
      block: 'list',
      mods: {
        of: 'stats',
        type: 'description',
      },
    },
    {
      block: 'dropdown',
      mods: { view: 'stats' },
    },
    {
      block: 'text',
      mods: { weight: 'bold' },
    },
    {
      block: 'location',
    },
  ],
}, {
  tech: 'js',
  shouldDeps: [
    {
      block: 'page',
      elems: [
        'filter',
        'orders',
      ],
      tech: 'bemhtml',
    },
    {
      block: 'dropdown',
      mods: { switcher: 'link' },
      tech: 'bemhtml',
    },
    {
      block: 'list',
      mods: {
        of: 'stats',
        type: 'description',
      },
      tech: 'bemhtml',
    },
    {
      block: 'button',
      mods: {
        type: 'link',
      },
      tech: 'bemhtml',
    }
  ],
} ];
