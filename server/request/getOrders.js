const Request = require( './_request' );

const getOrders = async params => {
  const filter = {
    where: {},
    offset: 0,
    limit: 10,
    skip: 0,
    order: [ 'created' ],
    ...params,
  }

  const orders = new Request( 'https://api.nevatrip.ru/orders', { filter } );
  const response = await orders.request();

  return response;
};

module.exports = getOrders;
