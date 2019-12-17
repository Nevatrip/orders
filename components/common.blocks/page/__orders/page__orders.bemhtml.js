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
                url: `/?any=${ order.user.email }`,
                content: order.user.fullName,
              },
              order.hash ? {
                block: 'form',
                mods: { message: 'popup', inline: true },
                method: 'get',
                action: `https://api.nevatrip.ru/orders/${ order.id }/email/send`,
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
            content: order.products.map( ( { product, options } ) => {
              let subSum = 0;
              const [ {
                direction,
                tickets,
                number,
                event,
              } ] = options;
              const _direction = product.directions.find( directionItem => directionItem._key === direction );
              const _tickets = _direction.tickets.map(
                ( { _key, name, price } ) => {
                  const count = tickets[ _key ] || 0;
                  const cost = price * count;

                  subSum += cost;

                  return !!count && {
                    elem: 'item',
                    attrs: {
                      style: 'display: flex',
                      title: `${ price } ₽ × ${ count } = ${ cost } ₽`,
                    },
                    content: [
                      { elem: 'term', content: `${ count } × ${ name }` },
                      // eslint-disable-next-line no-irregular-whitespace
                      { elem: 'definition', content: ` ${ price > 0 ? `по ${ price } ₽ ` : '' }` },
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
                          content: {
                            block: 'link',
                            title: product.title.ru.name,
                            content: product.title.ru.name.length > 40 ? `${ product.title.ru.name.substring( 0, 40 ) }…` : product.title.ru.name,

                          // url: `/?where[products.productId]=${ product._id }&offset=0&limit=100&skip=0`,
                          },
                        },
                        'Отправление: ',
                        {
                          block: 'link',

                          // url: `/?where[products.options.date]=${ options.date }&offset=0&limit=100&skip=0`,
                          content: {
                            block: 'text',
                            mods: { format: 'date' },
                            date: event.start,
                            format: `DD.MM ${ event.allDay ? ', билет на весь день' : '[в] HH:mm' }`,
                          },
                        },
                        { tag: 'br' },
                        `Направление: ${ _direction.title.length > 40 ? `${ _direction.title.substring( 0, 40 ) }…` : _direction.title }`,
                      ],
                    },
                    {
                      tag: 'fieldset',
                      attrs: { style: 'flex: 1' },
                      content: [
                        { tag: 'legend', content: `Билеты: ${ subSum } ₽` },
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
                            url: `http://localhost:3017/email?order=${ order.id }`,
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
                format: 'DD.MM HH:mm',
              },
              { tag: 'br' },
              order.status === 'paid'
                ? [
                  'Обновлён: ',
                  {
                    block: 'text',
                    mods: { format: 'date' },
                    date: order.updated,
                    format: 'DD.MM HH:mm',
                  },
                ]
                : 'Ещё не менялся',
            ],
          },
          {
            elem: 'cell',
            content: [
              {
                content: `Сумма: ${ Amount } ₽`,
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
