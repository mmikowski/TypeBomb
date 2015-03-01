/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true,    bitwise : true
*/

/*global $, tb:true*/
'use strict';
//noinspection MagicNumberJS,NonShortCircuitBooleanExpressionJS
var tb;
tb = (function () {
  var vMap, nMap, fMap, swapFn, getVarType;

  vMap = {
    _0_str_          : '0',
    _blank_          : '',
    _call_           : 'call',
    _cssRules_       : 'cssRules',
    _false_          : false,
    _hasOwnProperty_ : 'hasOwnProperty',
    _hide_           : 'hide',
    _join_           : 'join',
    _html_           : 'html',
    _keys_           : 'keys',
    _length_         : 'length',
    _null_           : null,
    _propIsEnum_     : 'propertyIsEnumerable',
    _push_           : 'push',
    _show_           : 'show',
    _slice_          : 'slice',
    _toString_       : 'toString',
    _true_           : true,
    _undef_          : undefined
  };

  nMap = { // cast as integers
    _n1_  : -1  | 0,
    _0_   : 0   | 0,
    _1_   : 1   | 0,
    _3_   : 3   | 0,
    _5_   : 5   | 0,
    _6_   : 6   | 0,
    _8_   : 8   | 0,
    _13_  : 13  | 0,
    _20_  : 20  | 0,
    _22_  : 22  | 0,
    _32_  : 32  | 0,
    _50_  : 50  | 0,
    _100_ : 100 | 0,

    _9d99_ : 9.99
  };

  fMap = {
    _setTo_    : setTimeout,
    _Object_   : Object,
    _Array_    : Array,
    _String_   : String,
    _floor_    : Math.floor,
    _parseInt_ : parseInt,
    _rnd_      : Math.random
  };

  //================= BEGIN NON-BROWSER UTILITIES ==============
  // BEGIN non-browser utility /swapFn/
  // Example: To swap foo and bar:
  //   bar = swap( foo, foo = bar );
  swapFn = function ( arg ) { return arg; };
  // END non-browser utility /swapFn/

  // BEGIN non-browser utility /getVarType/
  // Returns 'Function', 'Object', 'Array',
  // 'String', 'Number', 'Null', 'Boolean', or 'Undefined'
  //
  getVarType = (function () {
    var
      get_type_fn,
      __typeof   = function ( a ) { return typeof a; },
      __array    = vMap._Array_,
      typeof_map = {
        'undefined' : '_Undefined_',
        'boolean'   : '_Boolean_',
        'number'    : '_Number_',
        'string'    : '_String_',
        'function'  : '_Function_',

        'Undefined'      : '_Undefined_',
        'Null'           : '_Null_',
        'Boolean'        : '_Boolean_',
        'Number'         : '_Number_',
        'String'         : '_String_',
        'Function'       : '_Function_',
        'Array'          : '_Array_',
        'StyleSheetList' : '_Array_'
      };

    get_type_fn = function ( data ) {
      var type_key, type_str;

      if ( data === vMap._null_  ) { return '_Null_';      }
      if ( data === vMap._undef_ ) { return '_Undefined_'; }

      type_key = __typeof( data );
      type_str = typeof_map[ type_key ];

      if ( type_str ) { return type_str; }

      type_key = {}[ vMap._toString_ ][ vMap._call_ ]( data )[ vMap._slice_ ](
        nMap._8_, nMap._n1_
      );

      //noinspection NestedConditionalExpressionJS
      return typeof_map[ type_key ] ||
        ( data instanceof __array ? '_Array_' :
          ( data[ vMap._propIsEnum_ ]( vMap._0_str_ )
          && data[ vMap._length_ ] !== vMap._undef_
            ? '_Array_' : '_Object_'
          )
        );
    };

    return get_type_fn;
  }()
  );
  // END non-browser utility /getVarType/

  return {
    _vMap_       : vMap,
    _nMap_       : nMap,
    _fMap_       : fMap,
    _swapFn_     : swapFn,
    _getVarType_ : getVarType
  };
}()
);
