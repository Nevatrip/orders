block( 'page' ).elem( 'filter' ).content()( () => {
  // const url = node.data.url;

  // https://api.nevatrip.ru/orders?filter[where][user.email]=maiers%40inbox.ru&filter[offset]=0&filter[limit]=10&filter[skip]=0

  const now = new Date();
  let dd = now.getDate();
  let mm = now.getMonth() + 1; //January is 0!

  const yyyy = now.getFullYear();

  if ( dd < 10 ) {
    dd = `0${ dd }`;
  }
  if ( mm < 10 ) {
    mm = `0${ mm }`;
  }
  const today = `${ dd }.${ mm }.${ yyyy }`;

  return [
    {
      block: 'form',
      mods: { message: 'popup', inline: true },
      method: 'get',
      directions: [ 'right-top' ],
      content: [
        {
          block: 'form-field',
          name: 'any',
          mods: {
            type: 'input',
            inline: true,
            message: 'popup',
          },
          content: [
            {
              elem: 'control',
              content: [
                {
                  block: 'input',
                  mods: { 'has-clear': true },
                  placeholder: 'Имя, email, телефон, № заказа',
                },
              ],
            },
          ],
        },
        {
          block: 'form-field',
          name: 'products',
          mods: {
            type: 'select',
            required: true,
            inline: true,
            message: 'popup',
          },
          js: { required: { message: 'Super required select!' } },
          content: [
            {
              elem: 'control',
              content: [
                {
                  block: 'select',
                  mods: { mode: 'check' },
                  text: 'Все экскурсии',
                  options: [
                    { text: 'Петропавловская крепость', val: 'cfzISQI39vvEyEH3XJV0Ru' },
                    { text: '«Ночной Петербург»', val: '1949faec-c728-40de-a700-ca5b666ba765' },
                    { text: 'Метеор', val: '50bee78d-8d6a-416f-9359-257c4a0d23cb' },
                  ],
                },
              ],
            },
          ],
        },
        {
          block: 'form-field',
          mods: {
            type: 'checkbox-group',
            required: true,
            inline: true,
            message: 'popup',
          },
          js: { required: { message: 'Super required select!' } },
          name: 'status',
          val: 'all',
          content: [
            {
              elem: 'control',
              content: [
                {
                  block: 'checkbox-group',
                  mods: { type: 'button' },
                  val: [ 'new', 'paid' ],
                  options: [
                    { text: 'Новый', val: 'new' },
                    { text: 'Оплачен', val: 'paid' },
                    { text: 'Отменён', val: 'rejected' },
                  ],
                },
              ],
            },
          ],
        },
        {
          block: 'form-field',
          name: 'dateFrom',
          mods: {
            type: 'input',
            required: true,
            inline: true,
            message: 'popup',
          },
          js: { required: { message: 'Super required select!' } },
          content: [
            {
              elem: 'control',
              content: [
                {
                  block: 'input',
                  mods: {
                    'has-calendar': true,
                  },
                  placeholder: 'дд.мм.гггг',
                  weekdays: [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ],
                  months: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
                  val: today,
                },
              ],
            },
          ],
        },
        {
          block: 'form-field',
          name: 'dateTo',
          mods: {
            type: 'input',
            required: true,
            inline: true,
            message: 'popup',
          },
          js: { required: { message: 'Super required select!' } },
          content: [
            {
              elem: 'control',
              content: [
                {
                  block: 'input',
                  mods: { 'has-calendar': true },
                  placeholder: 'дд.мм.гггг',
                  weekdays: [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ],
                  months: [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ],
                  val: today,
                },
              ],
            },
          ],
        },
        {
          block: 'form-field',
          mods: {
            type: 'radio-group',
            required: true,
            inline: true,
            message: 'popup',
          },
          js: { required: { message: 'Super required select!' } },
          name: 'dateType',
          val: 'created',
          content: [
            {
              elem: 'control',
              content: [
                {
                  block: 'radio-group',
                  mods: { type: 'button' },
                  val: 'created',
                  options: [
                    { text: 'Созданные', val: 'created' },
                    { text: 'По дате поездки', val: 'event' },
                  ],
                },
              ],
            },
          ],
        },
        {
          block: 'form-field',
          mods: {
            type: 'select',
            required: true,
            inline: true,
            message: 'popup',
          },
          js: { required: { message: 'Super required select!' } },
          name: 'limit',
          val: 'all',
          content: [
            {
              elem: 'control',
              content: [
                {
                  block: 'select',
                  mods: { mode: 'radio-check' },
                  val: '9999999999',
                  options: [
                    { text: '10', val: '10' },
                    { text: '30', val: '30' },
                    { text: '50', val: '50' },
                    { text: 'Все', val: '9999999999' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      elem: 'stats',
    },
  ]

  // return {
  //   block: 'list',
  //   mods: { type: 'circle' },
  //   content: [
  //     {
  //       elem: 'item',
  //       content: {
  //         block: 'link',
  //         url: '/?limit=100',
  //         content: 'Все',
  //       },
  //     },
  //     {
  //       elem: 'item',
  //       content: {
  //         block: 'link',
  //         url: '/?where[user.email]=maiers%40inbox.ru&offset=0&limit=100&skip=0',
  //         content: 'Все от maiers@inbox.ru',
  //       },
  //     },
  //     {
  //       elem: 'item',
  //       content: {
  //         block: 'link',
  //         url: '/?where[products.productId]=50bee78d-8d6a-416f-9359-257c4a0d23cb&offset=0&limit=100&skip=0',
  //         content: 'Только c «Метеором»',
  //       },
  //     },
  //   ],
  // };
} );
