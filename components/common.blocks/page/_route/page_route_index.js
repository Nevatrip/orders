modules.define( 'page', [
  'form',
  'form-field',
  'jquery',
  'i-bem-dom',
  'BEMHTML',
  'calendar',
  'functions__debounce',
  'functions__throttle',
  'location',
  'uri__querystring',
], ( provide, Form, FormField, $, bemDom, BEMHTML, Calendar, Debounce, Throttle, Location, Querystring, Page, ) => {
  provide( Page.declMod( { modName: 'route', modVal: 'index' }, {
    onSetMod: {
      js: {
        inited () {
          const form = this.findChildBlock( Form );
          const { queryParams } = Querystring.Uri.parse( window.location.href );
          const formData = this.getFormData( queryParams );

          this._apiToken = this.params.apiToken;

          form.setVal( formData );
          this.filter( form.getVal() );

          this._domEvents( form ).on( 'submit', e => {
            e.preventDefault();
            this.filter( form.getVal() );
          } )

          const handleScroll = this.debounce( () => {
            // console.log( `${ arg } ${ event.type }` )
            this.filter( form.getVal() );
          }, 500, true );

          this._events( form ).on( 'change', () => {
            Location.change( { params: form.getVal() } );

            handleScroll()

            // Debounce( , 1000 );
          } );
        },
      },
    },

    debounce ( callback, wait, immediate = false ) {
      let timeout = null

      return function () {
        const callNow = immediate && !timeout
        const next = () => callback.apply( this, arguments )

        clearTimeout( timeout )
        timeout = setTimeout( next, wait )

        if ( callNow ) {
          next()
        }
      }
    },

    getFormData ( queryParams ) {
      const date = new Date();
      const today = date.toLocaleString( 'ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      } );

      return {
        dateFrom: queryParams.dateFrom ? queryParams.dateFrom[ 0 ] : today,
        dateTo: queryParams.dateTo ? queryParams.dateTo[ 0 ] : today,
        dateType: queryParams.dateType ? queryParams.dateType[ 0 ] : 'created',
        id: queryParams.id ? queryParams.id[ 0 ] : '',
        limit: queryParams.limit ? queryParams.limit[ 0 ] : 99999,
        products: queryParams.products || [],
        status: queryParams.status || [ 'new', 'paid' ],
        any: queryParams.any ? queryParams.any[ 0 ] : '',
      };
    },

    filter ( params ) {
      const self = this;

      Object.keys( params ).forEach( key => {
        if ( !params[ key ] ) delete params[ key ];
      } );

      const filterCondition = {
        created: 'created',
        event: 'products.options.event.start',
      }

      if ( params.any ) {
        params[ 'where][or][0][user.email][like' ] = params.any;
        params[ 'where][or][1][user.phone][like' ] = params.any;
        params[ 'where][or][2][user.fullName][like' ] = params.any;
        params[ 'where][or][3][products.options.number][like' ] = params.any;
        delete params.any;
      }

      if ( params.products.length ) {
        params[ 'where][products.productId][inq' ] = params.products;
        delete params.products;
      }

      if ( params.status.length ) {
        params[ 'where][status][inq' ] = params.status;
        delete params.status;
      }

      const dateFrom = Calendar.parseDate( params.dateFrom );
      const dateTo = Calendar.parseDate( params.dateTo );

      dateFrom.setHours( 0 );
      dateFrom.setMinutes( 0 );
      dateFrom.setSeconds( 0 );
      dateTo.setHours( 23 );
      dateTo.setMinutes( 59 );
      dateTo.setSeconds( 59 );

      params[ `where][${ filterCondition[ params.dateType ] }][between][0` ] = dateFrom.toISOString();
      params[ `where][${ filterCondition[ params.dateType ] }][between][1` ] = dateTo.toISOString();

      delete params.dateFrom;
      delete params.dateTo;

      params.order = [ filterCondition[ params.dateType ] ];
      delete params.dateType;

      const filter = {
        where: {},
        fields: {
          sessionId: true,
          created: true,
          updated: true,
          products: true,
          number: true,
          user: true,
          id: true,
          status: true,
          source: true,
          payment: true,
          promocode: true,
          sum: true,
          isFullDiscount: true,
          hash: true,
        },
        offset: 0,
        limit: 1,
        skip: 0,
        order: [ 'created' ],
        ...params,
      }

      bemDom.update( self._elem( 'orders' ).domElem, 'Загрузка…' );

      $.ajax( {
        url: 'https://api.test.prahatrip.cz/orders',
        data: {
          filter,
          token: self._apiToken,
        },
        success ( response ) {
          // console.log( 'response', response );
          // console.log( 'filter', filter );

          const stat = response.reduce( ( acc, order ) => {
            const { tickets } = acc[ order.status ];

            acc[ order.status ].count++;
            acc[ order.status ].sum += order.sum || 0;
            order.products.forEach( ( { options = [], product = {} } ) => {
              const countTickets = {};

              options.forEach( direction => {
                Object.keys( direction.tickets ).forEach( ticketId => {
                  countTickets[ ticketId ] = direction.tickets[ ticketId ];

                  tickets[ ticketId ] = tickets[ ticketId ] || {};
                  tickets[ ticketId ].sum = tickets[ ticketId ].sum || 0;
                  tickets[ ticketId ].title = tickets[ ticketId ].title || '';
                  tickets[ ticketId ].count = tickets[ ticketId ].count || 0;
                  tickets[ ticketId ].count += countTickets[ ticketId ] || 0;
                } );
              } );

              if ( !product.hasOwnProperty( 'directions' ) ) return;

              product.directions.forEach( direction => {
                direction.tickets.forEach( ( { category, name, price, _key, ..._ } ) => {
                  tickets[ _key ] = tickets[ _key ] || {};
                  tickets[ _key ].sum += ( countTickets[ _key ] || 0 ) * parseInt( price, 10 );
                  tickets[ _key ].title = `${ category.title.ru } ${ name || _.ticket.map( ( { title } ) => title.ru ).join( ' + ' ) }`;
                } );
              } );
            } );

            return acc;
          }, {
            paid: {
              sum: 0,
              count: 0,
              tickets: {},
            },
            new: {
              sum: 0,
              count: 0,
              tickets: {},
            },
            rejected: {
              sum: 0,
              count: 0,
              tickets: {},
            },
          } );

          // console.log( 'stat', stat );

          const tickets = Object.keys( stat ).map( status => {
            let title = '';

            switch ( status ) {
            case 'new': title = 'Неоплаченные'; break;
            case 'paid': title = 'Оплаченные'; break;
            case 'rejected': title = 'Отменённые'; break;
            default: break;
            }

            return {
              title,
              status,
              tickets: Object.values( stat[ status ].tickets ),
            }
          } );

          // console.log( 'tickets', tickets );

          function getNoun ( number, one, two, five ) {
            let n = Math.abs( number );

            n %= 100;
            if ( n >= 5 && n <= 20 ) {
              return five;
            }
            n %= 10;
            if ( n === 1 ) {
              return one;
            }
            if ( n >= 2 && n <= 4 ) {
              return two;
            }
            return five;
          }

          const loadUrl = Querystring.Uri.parse( `https://api.test.prahatrip.cz/orders?${ $.param( { filter } ) }` );

          loadUrl.replaceParam( 'format', 'csv' );
          loadUrl.replaceParam( 'token', self._apiToken );

          if ( response.length ) {
            bemDom.replace( self._elem( 'orders' ).domElem, BEMHTML.apply( { block: 'page', elem: 'orders', orders: response } ) );
            bemDom.update( self._elem( 'stats' ).domElem, BEMHTML.apply( {
              block: 'dropdown',
              mods: {
                switcher: 'link',
                view: 'stats',
                size: 'xl',
              },
              switcher: `Заказов: ${ response.length }`,
              popup: [
                {
                  block: 'list',
                  mods: {
                    of: 'stats',
                    type: 'description',
                  },
                  content: [
                    {
                      elem: 'item',
                      content: [
                        { elem: 'term', content: 'Заказов:' },
                        { elem: 'definition', content: response.length },
                      ],
                    },
                    tickets.map( part => [
                      stat[ part.status ].count ? {
                        elem: 'item',
                        content: [
                          { elem: 'term', content: { block: 'text', mods: { weight: 'bold' }, content: `${ part.title }:` } },
                          { elem: 'definition', content: `${ stat[ part.status ].count } ${ getNoun( stat[ part.status ].count, 'заказ', 'заказа', 'заказов' ) } на ${ stat[ part.status ].sum } €` },
                        ],
                      } : '',
                      stat[ part.status ].count ? part.tickets.map( ticket => ( {
                        elem: 'item',
                        content: [
                          { elem: 'term', content: `${ ticket.count || 0 } × ${ ticket.title }` },
                          { elem: 'definition', content: `${ ticket.sum } €` },
                        ],
                      } ) ) : '',
                    ] ),
                  ],
                },
                { tag: 'br' },
                {
                  block: 'button',
                  mods: {
                    type: 'link',
                    size: 'l',
                  },
                  url: loadUrl.toString(),
                  text: 'Скачать',
                },
              ],
            } ) )
          } else {
            bemDom.update( self._elem( 'orders' ).domElem, 'Нет подходящих экскурсий' );
          }
        },
        error ( error ) {
          console.log( 'error', error );
          bemDom.update( self._elem( 'orders' ).domElem, 'Ошибка загрузки списка заказов' );
        },
      } );
    },
  } ) );
} );
