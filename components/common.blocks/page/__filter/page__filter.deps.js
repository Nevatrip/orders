[{
  shouldDeps: [
    {
      block: 'form',
      mods: {
        message: 'popup',
        inline: true,
      },
    },
    {
      block: 'form-field',
      mods: {
        type: [
          'select',
          'input',
          'radio-group',
          'checkbox-group',
        ],
        required: true,
        inline: true,
        message: 'popup',
      },
    },
    {
      block: 'select',
      mods: { mode: ['check', 'radio-check'] },
    },
    {
      block: 'input',
      mods: {
        'has-calendar': true,
        'has-clear': true
      },
    },
    {
      block: 'radio-group',
      mods: { type: 'button' },
    },
    {
      block: 'checkbox-group',
      mods: { type: 'button' },
    },
    {
      block: 'text',
      mods: { format: 'date' },
    },
    {
      block: 'label',
    },
    {
      block: 'list',
      mods: { type: 'circle' },
    },
    {
      block: 'link',
    },
    {
      block: 'dropdown',
      mods: { switcher: 'link' },
    },
    {
      block: 'list',
      mods: { type: 'description' },
    }
  ]
}]
