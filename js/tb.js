/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true,    bitwise : true
*/

/*global $, tb:true*/
//noinspection MagicNumberJS,NonShortCircuitBooleanExpressionJS
var tb = (function () {
  'use strict';
  var
    vMap, nMap, fMap, swapFn,
    getVarType, createObj, fillTmplt;

  vMap = {
    _0_str_          : '0',
    _blank_          : '',
    _create_         : 'create',
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
    _replace_        : 'replace',
    _show_           : 'show',
    _splice_         : 'splice',
    _slice_          : 'slice',
    _toString_       : 'toString',
    _true_           : true,
    _undef_          : undefined
  };

  nMap = {
    // cast as integers
    _n1_   : -1   | 0,
    _0_    : 0    | 0,
    _1_    : 1    | 0,
    _2_    : 2    | 0,
    _3_    : 3    | 0,
    _4_    : 4    | 0,
    _5_    : 5    | 0,
    _6_    : 6    | 0,
    _8_    : 8    | 0,
    _12_   : 12   | 0,
    _13_   : 13   | 0,
    _16_   : 16   | 0,
    _20_   : 20   | 0,
    _22_   : 22   | 0,
    _32_   : 32   | 0,
    _50_   : 50   | 0,
    _100_  : 100  | 0,
    _3000_ : 3000 | 0,
    _5000_ : 5000 | 0,

    // floating point
    _d04_  : 0.04,
    _d12_  : 0.12,
    _d16_  : 0.16,
    _d20_  : 0.20,
    _d24_  : 0.24,
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
  }());
  // END non-browser utility /getVarType/

  // BEGIN non-browser utility /createObj/
  // Purpose : Emulates Object.create on shitty browsers
  //
  createObj = (function () {
    var create_object = fMap._Object_[ vMap._create_ ]
      || function ( o ) {
        var fn = function () { return; };
        fn.prototype = o;
        return new fn();
      };

    return function ( proto_obj ) {
      return create_object( proto_obj );
    };
  }());
  // END non-browser utility /createObj/

  // BEGIN non-browser utility /fillTmplt/
  fillTmplt = (function () {
    var replace_fn, fill_fn, lookup_map, tmplt_regex;

    tmplt_regex = /%!%([^%]+)%!%/g;

    replace_fn = function ( match_str, name ) {
      return lookup_map[ name ];
    };

    fill_fn = function ( arg_map ) {
      var tmplt_str;

      lookup_map = arg_map._lookup_map_;
      tmplt_str  = arg_map._tmplt_str_ || vMap._blank_;

      return tmplt_str[ vMap._replace_ ](
        tmplt_regex, replace_fn
      );
    };

    return fill_fn;
  }());
  // END non-browser utility /fillTmplt/


  return {
    _vMap_       : vMap,
    _nMap_       : nMap,
    _fMap_       : fMap,

    _createObj_  : createObj,
    _fillTmplt_  : fillTmplt,
    _getVarType_ : getVarType,
    _swapFn_     : swapFn
  };
}());

