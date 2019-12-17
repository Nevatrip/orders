modules.define( 'calendar', [ 'i-bem-dom' ], function ( provide, bemDom ) {
  provide( bemDom.declBlock( this.name, {}, {
    _getToday () {
      const today = new Date();

      today.setHours( 0, 0, 0, 0 );

      return today;
    },

    parseDate ( val ) {
      if ( val instanceof Date ) return val;

      const parsed = this._parseDateParts( val );

      if ( parsed ) {
        const day = parsed.day;
        const month = parsed.month;
        const year = parsed.year;
        const date = this._getToday();

        date.setMonth( month, day );

        if ( year ) {
          date.setFullYear( year );
        }

        return date;
      }

      return null;
    },

    _parseDateParts ( str ) {
      let match = /^\s*(\d{1,2})[./-](\d{1,2})(?:[./-](\d{4}|\d\d))?\s*$/.exec( str );

      if ( match ) {
        return {
          day: match[ 1 ],
          month: match[ 2 ] - 1,
          year: match[ 3 ],
        };
      }

      match = /^\s*(\d{4})[./-](\d\d)(?:[./-](\d\d))?\s*$/.exec( str );

      if ( match ) {
        return {
          day: match[ 3 ],
          month: match[ 2 ] - 1,
          year: match[ 1 ],
        };
      }

      return null;
    },
  } ) );
} );
