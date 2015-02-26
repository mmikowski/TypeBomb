/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
 */
/*global $, tb*/

// Begin model
tb.model = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    __Object = Object,
    cfgMap   = {
      _init_map_ : {
        _level_count_ : tb._nmap_._1_,
        _lives_count_ : tb._nmap_._5_,
        _score_count_ : tb._nmap_._0_,
        _typebox_str_ : 'Type here ...'
      },
      _max_typebox_int_  : tb._nmap_._22_
    },
    stateMap = {
      _typebox_str_ : tb._smap_._blank_,
      _level_count_ : tb._smap_._undef_,
      _lives_count_ : tb._smap_._undef_,
      _score_count_ : tb._smap_._undef_,
      _is_ingame_   : tb._smap_._true_
    },
    reportKeyPress, initModule
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /reportKeyPress/
  // If key press is actionable, return true
  reportKeyPress = (function () {
    var
      spc_code    = tb._nmap_._32_,
      bkspc_code  = tb._nmap_._8_,
      return_code = tb._nmap_._13_,
      report_keypress;

    report_keypress = function ( key_code ) {
      var typebox_str, type_length, end_idx, resp_name;

      typebox_str = stateMap._typebox_str_;
      type_length = typebox_str[ tb._smap_._length_ ];

      // clear default text if present
      if ( typebox_str === cfgMap._init_map_._typebox_str_ ) {
        typebox_str = '';
        type_length = 0;
      }

      // prevent duplicate spaces
      if ( key_code === spc_code ) {
        end_idx = type_length - 1;
        if ( typebox_str.charAt( end_idx ) === ' ' ) {
          return false;
        }
      }

      // handle character codes
      switch( key_code ) {
        case bkspc_code :
          if ( type_length > tb._nmap_._0_ ) {
            type_length--;
            resp_name = '_bkspc_';
          }
          break;

        case return_code :
          if ( type_length > tb._nmap_._0_ ) {
            typebox_str = '';
            type_length = tb._nmap_._0_;
            resp_name = '_returnd_';
          }
          break;

        default : // everything else
          typebox_str += String.fromCharCode( key_code );
          type_length = typebox_str[ tb._smap_._length_ ];
          resp_name = '_char_add_';
          break;
      }

      if ( type_length > cfgMap._max_typebox_int_ ) {
        type_length = cfgMap._max_typebox_int_;
        $.gevent.publish( '_acknowledge_key_', [ '_at_limit_' ]); // honk
        return false;
      }

      // display revised string if needed
      typebox_str = typebox_str.substring( 0, type_length );

      if ( typebox_str === stateMap._typebox_str_ ) {
        return false;
      }

      $.gevent.publish( '_update_typebox_', typebox_str + '|' );
      $.gevent.publish( '_acknowledge_key_', [ resp_name ]);
      stateMap._typebox_str_  = typebox_str;
      return true;
    };

    return report_keypress;
  }());
  // End public method /reportKeyPress/

  // Begin public method /initModule/
  initModule = function () {
    var init_map, key_list, key_name, list_count, i;
    $.gevent.publish( '_acknowledge_init_' );

    // Begin initialize for game play (we will move this later)
    init_map   = cfgMap._init_map_;
    key_list   = __Object[ tb._smap_._keys_ ]( init_map );
    list_count = key_list[ tb._smap_._length_ ];

    for ( i = tb._nmap_._0_; i < list_count; i++ ) {
      key_name = key_list[ i ];
      stateMap[ key_name ] = init_map[ key_name ];
    }

    $.gevent.publish( '_update_level_',   stateMap._level_count_ );
    $.gevent.publish( '_update_lives_',   stateMap._lives_count_ );
    $.gevent.publish( '_update_score_',   stateMap._score_count_ );
    $.gevent.publish( '_update_typebox_', stateMap._typebox_str_ );
    // End initialize for game play (we will move this later)
  };
  // End public method /initModule/

  return {
    _initModule_     : initModule,
    _reportKeyPress_ : reportKeyPress
  };
  //-------------------- END PUBLIC METHODS --------------------
}());

