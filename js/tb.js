/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true,    bitwise : true
*/
/*global $, tb:true*/

// BEGIN tb
tb = (function () {
  /***************** BEGIN MODULE SCOPE VARIABLES **************/
  'use strict';
  //noinspection MagicNumberJS,NonShortCircuitBooleanExpressionJS
  var
    vMap = {
      _0_str_          : '0',
      _addClass_       : 'addClass',
      _animate_        : 'animate',
      _append_         : 'append',
      _blank_          : '',
      _call_           : 'call',
      _change_         : 'change',
      _charAt_         : 'charAt',
      _create_         : 'create',
      _cssRules_       : 'cssRules',
      _css_            : 'css',
      _fadeOut_        : 'fadeOut',
      _false_          : false,
      _find_           : 'find',
      _fromCharCode_   : 'fromCharCode',
      _get_            : 'get',
      _gevent_         : 'gevent',
      _hasOwnProperty_ : 'hasOwnProperty',
      _hide_           : 'hide',
      _html_           : 'html',
      _indexOf_        : 'indexOf',
      _join_           : 'join',
      _keydown_        : 'keydown',
      _keypress_       : 'keypress',
      _keys_           : 'keys',
      _length_         : 'length',
      _null_           : null,
      _on_             : 'on',
      _play_           : 'play',
      _preventDefault_ : 'preventDefault',
      _propIsEnum_     : 'propertyIsEnumerable',
      _publish_        : 'publish',
      _push_           : 'push',
      _remove_         : 'remove',
      _replace_        : 'replace',
      _show_           : 'show',
      _slice_          : 'slice',
      _sort_           : 'sort',
      _splice_         : 'splice',
      _subscribe_      : 'subscribe',
      _substring_      : 'substring',
      _text_           : 'text',
      _toString_       : 'toString',
      _true_           : true,
      _undef_          : undefined,
      _val_            : 'val'
    },

    nMap = {
      // cast as integers
      _n1_   : -1    | 0,
      _0_    : 0     | 0,
      _1_    : 1     | 0,
      _2_    : 2     | 0,
      _3_    : 3     | 0,
      _4_    : 4     | 0,
      _5_    : 5     | 0,
      _6_    : 6     | 0,
      _7_    : 7     | 0,
      _8_    : 8     | 0,
      _9_    : 9     | 0,
      _10_   : 10    | 0,
      _11_   : 11    | 0,
      _12_   : 12    | 0,
      _13_   : 13    | 0,
      _16_   : 16    | 0,
      _20_   : 20    | 0,
      _22_   : 22    | 0,
      _25_   : 25    | 0,
      _32_   : 32    | 0,
      _50_   : 50    | 0,
      _100_  : 100   | 0,
      _1k_   : 1000  | 0,
      _5k_   : 5000  | 0,
      _10k_  : 10000 | 0,

      // floating point
      _d04_  : 0.04,
      _d06_  : 0.06,
      _d08_  : 0.08,
      _d5_   : 0.5,
      _d12_  : 0.12,
      _d16_  : 0.16,
      _d20_  : 0.20,
      _d24_  : 0.24,
      _d28_  : 0.28,
      _d32_  : 0.32,
      _d33_  : 0.33,
      _d66_  : 0.66,
      _9d99_ : 9.99
    },

    fMap = {
      _Array_          : Array,
      _Object_         : Object,
      _String_         : String,
      _clearTo_        : clearTimeout,
      _floor_          : Math.floor,
      _json_parse_     : JSON.parse,
      _json_stringfy_  : JSON.stringify,
      _parseInt_       : parseInt,
      _rnd_            : Math.random,
      _setTo_          : setTimeout
    },

    __null  = vMap._null_,
    __undef = vMap._undefined_,
    __n1    = nMap._n1_,

    createObj,
    fillTmplt,
    getVarType,
    makeOptHtml,
    makeUcFirstStr,
    shuffleList,
    swapFn
    ;

  try {
    fMap._localStorage_ = localStorage;
  }
  catch ( ignored ) {
    fMap._localStorage_ = vMap._undef_;
  }
  /****************** END MODULE SCOPE VARIABLES ***************/

  /******************** BEGIN PUBLIC METHODS *******************/
  // BEGIN Public method /getVarType/
  // Returns '_Function_', '_Object_', '_Array_',
  // '_String_', '_Number_', '_Null_', '_Boolean_', or '_Undefined_'
  //
  getVarType = (function () {
    var
      typeof_map = {
        'boolean'   : '_Boolean_',
        'number'    : '_Number_',
        'string'    : '_String_',
        'function'  : '_Function_',
        'object'    : '_Object_',
        'undefined' : '_Undefined_',

        'Array'     : '_Array_',
        'Boolean'   : '_Boolean_',
        'Function'  : '_Function_',
        'Null'      : '_Null_',
        'Number'    : '_Number_',
        'Object'    : '_Object_',
        'String'    : '_String_',
        'Undefined' : '_Undefined_'
      };

    function get_type_fn ( data ) {
      var type_key, type_str;

      if ( data === __null  ) { return '_Null_'; }
      if ( data === __undef ) { return '_Undefined_'; }

      type_key = typeof data;
      type_str = typeof_map[ type_key ];

      if ( type_str && type_str !== '_Object_' ) { return type_str; }
      type_key = {}[ vMap._toString_ ][ vMap._call_ ](
        data )[ vMap._slice_ ]( nMap._8_, __n1 );

      //noinspection NestedConditionalExpressionJS
      return typeof_map[ type_key ] || type_key;
    }
    return get_type_fn;
  }());

  // BEGIN public method /createObj/
  // Purpose : Emulates Object.create on shitty browsers
  //
  createObj = (function () {
    var create_object = fMap._Object_[ vMap._create_ ]
      || function ( o ) {
        var fn = function () {
         //noinspection UnnecessaryReturnStatementJS
          return;
        };
        fn.prototype = o;
        return new fn();
      };

    return function ( proto_obj ) {
      return create_object( proto_obj );
    };
  }());
  // END public method /createObj/

  // BEGIN public method /fillTmplt/
  fillTmplt = (function () {
    var replace_fn, fill_fn, lookup_map, tmplt_rx;

    tmplt_rx   = /\{([^\{\}]+[^\\])\}/g;
    replace_fn = function ( match_str, name ) {
      return lookup_map[ name ];
    };

    fill_fn = function ( arg_map ) {
      var tmplt_str;

      lookup_map = arg_map._lookup_map_;
      tmplt_str  = arg_map._tmplt_str_ || vMap._blank_;

      return tmplt_str[ vMap._replace_ ](
        tmplt_rx, replace_fn
      );
    };

    return fill_fn;
  }());
  // END public method /fillTmplt/

  // BEGIN public method /makeOptHtml/
  makeOptHtml = function ( arg_val_str, value_list, arg_title_map ) {
    var
      html        = '',
      title_map   = arg_title_map || {},
      match_str   = fMap._String_( arg_val_str ),

      idx, val_str, title_text
      ;

    for ( idx = nMap._0_; idx < value_list.length; idx++ ){
      val_str   = fMap._String_( value_list[ idx ] );
      title_text  = title_map[ val_str ]
        || makeUcFirstStr( val_str );

      html += '<option value="' + val_str + '"';

      if ( val_str === match_str ){
        html += ' selected="selected"';
      }

      html += '>' + title_text + '</option>';
    }
    return html;
  };
  // END public method /makeOptHtml/

  // BEGIN public method /makeUcFirstStr/
  makeUcFirstStr = function ( arg_input_str ) {
    var
      input_str  = fMap._String_( arg_input_str ),
      first_char = input_str.charAt( nMap._0_ ).toUpperCase();
    return first_char + input_str.substr( nMap._1_ );
  };
  // END public method /makeUcFirstStr/

  // BEGIN public method /shuffleList/
  // Purpose : Shuffles elements in an array
  //
  shuffleList = function ( list ) {
    var j, k, x, i, c;
    c = list[ vMap._length_ ];
    for ( i = c; i > nMap._0_; i-- ) {
      j = fMap._floor_( fMap._rnd_() * i );
      k = i - nMap._1_;
      x = list[ k ];
      list[ k ] = list[ j ];
      list[ j ] = x;
    }
    return list;
  };
  // END public method /shuffleList/

  // BEGIN public method /swapFn/
  // Example: To swap foo and bar:
  //   bar = swap( foo, foo = bar );
  swapFn = function ( arg ) { return arg; };
  // END public method /swapFn/
  /********************* END PUBLIC METHODS ********************/

 return {
    _vMap_ : vMap,
    _nMap_ : nMap,
    _fMap_ : fMap,

    _createObj_      : createObj,
    _fillTmplt_      : fillTmplt,
    _getVarType_     : getVarType,
    _makeOptHtml_    : makeOptHtml,
    _makeUcFirstStr_ : makeUcFirstStr,
    _shuffleList_    : shuffleList,
    _swapFn_         : swapFn
  };
}());
// END tb
