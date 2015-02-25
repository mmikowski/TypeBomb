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
    cfgMap   = { 
      init_typebox_str : 'Type here ... ',
      max_typebox_int  : 22
    },
    stateMap = {
      typebox_str : '',
      is_ingame   : true
    },
    reportKeyPress, initModule
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /reportKeyPress/
  // If key press is actionable, return true
  reportKeyPress = function ( key_code ) {
    var typebox_str, type_length, end_idx, resp_name;

    typebox_str = stateMap.typebox_str;
    type_length = typebox_str.length;

    // clear default text if present
    if ( typebox_str === cfgMap.init_typebox_str ) {
      typebox_str = '';
      type_length = 0;
    }

    // prevent duplicate spaces
    if ( key_code === 32 ) {
      end_idx = type_length - 1;
      if ( typebox_str.charAt( end_idx ) === ' ' ) {
        return false;
      }
    }

    // handle character codes
    switch( key_code ) {
      case 8 :   // backspace
        if ( type_length > 0 ) {
          type_length--;
          resp_name = 'bkspc'; // clack
        }
        break;

      case 13 :  // return
        if ( type_length > 0 ) {
          typebox_str = '';
          type_length = 0;
          resp_name = 'enterd'; // kick
        }
        break;

      default : // everything else
        typebox_str += String.fromCharCode( key_code );
        type_length = typebox_str.length;
        resp_name = 'char_add'; // click
        break;
    }

    if ( type_length > cfgMap.max_typebox_int ) {
      type_length = cfgMap.max_typebox_int;
      $.gevent.publish( 'acknowledge_key', [ 'at_limit' ]); // honk
      return false;
    }

    // display revised string if needed
    typebox_str = typebox_str.substring( 0, type_length );

    if ( typebox_str === stateMap.typebox_str ) {
      return false;
    }

    $.gevent.publish( 'update_typebox', typebox_str + '|' );
    $.gevent.publish( 'acknowledge_key', [ resp_name ]);
    stateMap.typebox_str  = typebox_str;
    return true;
  };
  // End public method /reportKeyPress/

  // Begin public method /initModule/
  initModule = function () {
    stateMap.typebox_str = cfgMap.init_typebox_str;
    $.gevent.publish( 'acknowledge_init' );
  };
  // End public method /initModule/

  return {
    initModule     : initModule,
    reportKeyPress : reportKeyPress
  };
  //-------------------- END PUBLIC METHODS --------------------
}());

