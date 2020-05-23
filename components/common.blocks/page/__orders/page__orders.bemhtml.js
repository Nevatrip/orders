block( 'page' ).elem( 'orders' )( {
  content: ( node, { orders = [] } ) => ( {
    block: 'table',
    mods: { view: 'orders' },
    content: orders.map( ( order, index ) => {
      const {
        Amount = 0,
        TransactionId,
        InternalId,
      } = ( order.payment || {} ).Model || {};

      return {
        elem: 'row',
        elemMods: { status: order.status },
        attrs: {
          id: order.id,
        },
        content: [
          { elem: 'cell', content: index + 1 },
          {
            elem: 'cell',
            content: [
              {
                block: 'link',

                // url: `/?any=${ order.user.email }`,
                content: order.user.fullName,
              },
              order.hash ? {
                block: 'form',
                mods: { message: 'popup', inline: true },
                method: 'get',
                action: `https://api.test.prahatrip.cz/orders/${ order.id }/email/send`,
                directions: [ 'right-top' ],
                content: [
                  {
                    block: 'form-field',
                    mods: { type: 'hidden' },
                    name: 'hash',
                    val: order.hash,
                  },
                  {
                    block: 'form-field',
                    mods: {
                      type: 'input',
                      required: true,
                      inline: true,
                      message: 'popup',
                      width: 'available',
                    },
                    name: 'email',
                    directions: [ 'left-bottom' ],
                    js: { required: { message: 'Super required input!' } },
                    content: [
                      {
                        elem: 'control',
                        content: [
                          {
                            block: 'input',
                            mods: { width: 'available' },
                            placeholder: '№ заказа',
                            val: order.user.email,
                          },
                        ],
                      },
                    ],
                  },
                  order.status === 'paid' && {
                    block: 'button',
                    mods: { type: 'submit' },
                    text: 'Отправить',
                  },
                ],
              } : {
                content: order.user.email,
              },
              { tag: 'br' },
              order.user.phone,
            ],
          },
          {
            elem: 'cell',
            content: order.products.map( ( { product, options = [] } ) => {
              if ( !product || options.length === 0 ) return null;
              let subSum = 0;
              const [ {
                direction,
                tickets,
                number,
                event,
              } ] = options;
              const _direction = product.directions.find( directionItem => directionItem._key === direction );

              if ( !_direction ) return null;

              const _tickets = _direction.tickets.map(
                ( { _key, price, category, ticket } ) => {
                  const count = tickets[ _key ] || 0;
                  const cost = price * count;

                  subSum += cost;

                  return !!count && {
                    elem: 'item',
                    attrs: {
                      style: 'display: flex',
                      title: `${ price } € × ${ count } = ${ cost } €`,
                    },
                    content: [
                      { elem: 'term', content: `${ count } × ${ ticket[ 0 ].title.ru } (${ category.title.ru })` },
                      // eslint-disable-next-line no-irregular-whitespace
                      { elem: 'definition', content: ` по ${ price } €` },
                    ],
                  }
                }
              );

              if ( !event ) return '';

              return [
                {
                  attrs: { style: 'display: flex' },
                  content: [
                    {
                      tag: 'fieldset',
                      content: [
                        {
                          tag: 'legend',
                          content: [
                            {
                              block: 'link',
                              title: product.title.ru.name,
                              content: product.title.ru.name.length > 40 ? `${ product.title.ru.name.substring( 0, 40 ) }…` : product.title.ru.name,
                              target: '_blank',
                              url: '#',

                              //url: `https://nevatrip.ru/index.php?id=${ product.oldId }`,
                            },
                            ' ',
                            {
                              block: 'link',
                              title: 'Открыть в админке',
                              content: 'ред.',
                              target: '_blank',
                              url: `https://admin.prahatrip.cz/desk/tour;${ product._id }`,
                            },
                          ],
                        },
                        'Отправление: ',
                        {
                          block: 'link',

                          // url: `/?where[products.options.date]=${ options.date }&offset=0&limit=100&skip=0`,
                          content: {
                            block: 'text',
                            mods: { format: 'date' },
                            date: event.start,
                            format: `DD.MM.YYYY ${ event.allDay ? ', билет на весь день' : '[в] HH:mm' }`,
                          },
                        },
                        { tag: 'br' },
                        _direction.title
                          ? `Направление: ${ _direction.title.length > 40 ? `${ _direction.title.ru.substring( 0, 40 ) }…` : _direction.title.ru }`
                          : 'Неизвестное направление',
                      ],
                    },
                    {
                      tag: 'fieldset',
                      attrs: { style: 'flex: 1' },
                      content: [
                        { tag: 'legend', content: `Билеты: ${ subSum } €` },
                        {
                          block: 'list',
                          mods: { type: 'description' },
                          content: _tickets,
                        },
                      ],
                    },
                    {
                      tag: 'fieldset',
                      content: [
                        { tag: 'legend', content: 'Посадочный' },
                        {
                          content: order.status === 'paid' && number && {
                            block: 'link',
                            url: `https://api.test.prahatrip.cz/orders/${ order.id }/email?hash=${ order.hash }`,
                            target: '_blank',
                            content: `НТ${ number }`,
                          },
                        },
                      ],
                    },
                  ],
                },
              ]
            } ),
          },
          {
            elem: 'cell',
            content: [
              'Создан: ',
              {
                block: 'text',
                mods: { format: 'date' },
                date: order.created,
                format: 'DD.MM.YYYY HH:mm',
              },
              { tag: 'br' },
              order.status === 'paid'
                ? [
                  'Обновлён: ',
                  {
                    block: 'text',
                    mods: { format: 'date' },
                    date: order.updated,
                    format: 'DD.MM.YYYY HH:mm',
                  },
                ]
                : 'Ещё не менялся',
            ],
          },
          {
            elem: 'cell',
            content: [
              {
                content: `Сумма: ${ Amount } €`,
              },
              TransactionId
                ? [ 'Транзакция: ', {
                  block: 'link',
                  target: '_blank',
                  title: JSON.stringify( order.payment.Model, null, 2 ),
                  url: `https://merchant.cloudpayments.ru/transactions/${ TransactionId }`,
                  content: TransactionId,
                } ]
                : InternalId && [ 'Заказ: ', {
                  block: 'link',
                  target: '_blank',
                  title: JSON.stringify( order.payment.Model, null, 2 ),
                  url: `https://merchant.cloudpayments.ru/orders/${ InternalId }`,
                  content: InternalId,
                } ],
              order.promocode && {
                content: `Промокод: ${ order.promocode }`,
              },
            ],
          },
        ],
      }
    } ),
  } ),
} )
