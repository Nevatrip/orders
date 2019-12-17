[{
  shouldDeps: [
    {
      block: 'table',
      mods: { view: 'orders' },
    },
    {
      block: 'text',
      mods: { format: 'date' },
    },
    {
      block: 'dropdown',
      mods: {
        switcher: 'link',
      },
    },
    {
      block: 'input',
      mods: {
        type: 'hidden',
        width: 'available',
      },
    },
    {
      block: 'form-field',
      mods: {
        type: [
          'hidden',
          'input'
        ],
        required: true,
        inline: true,
        message: 'popup',
        width: 'available',
      },
    },
    {
      block: 'button',
      mods: {
        view: 'pseudo',
        type: 'submit',
      },
    }
  ]
}]
