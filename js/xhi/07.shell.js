/*
 * 07.shell.js
 *
 * Use     : xhi._makeShell_( app_map );
 * Synopsis: Add _shell_ capabilities to app_map
 * Provides: Page Shell controller
 *
 * @author Michael S. Mikowski - mike.mikowski@gmail.com
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true, todo    : true, unparam  : true
*/
/*global $ */

var __ns = 'xhi', __NS;
/* istanbul ignore next */
try          { __NS = global[ __ns ]; }
catch ( e1 ) { __NS = window[ __ns ]; }

// == BEGIN MODULE __NS._makeShell_ ====================================
__NS._makeShell_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey    = aMap._aKey_,
    vMap    = aMap._vMap_,
    nMap    = aMap._nMap_,
    __util  = aMap._util_,

    __0     = nMap._0_,
    __1     = nMap._1_,
    __blank = vMap._blank_,

    __logObj = __util._getLogObj_(),
    __logMsg = __logObj._logMsg_,

    topCmap = {
      _main_tmplt_ : '<h1>Hello world from |'
        + aKey + '| namespace</h1>'
    },
    topSmap = {},

    $Map
    ;
 // == . END MODULE SCOPE VARIABLES ====================================

  // == BEGIN DOM METHODS ==============================================
  // Cache jQuery collections here
  function set$Map ( $top_box ) {
    $Map = { _$top_box_ : $top_box };
  }
  // == . END DOM METHODS ==============================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModule/
  function initModule ( $top_box ) {
    // Set styles
    aMap._css_._initModule_();

    // Initial DOM content using methods above
    // and then set jQuery colection cache
    $top_box[ vMap._html_ ]( topCmap._main_tmplt_ );
    set$Map( $top_box );

    // Report debug values
    __logMsg( '_info_', $,
      '\n  __0     === ' + __0,
      '\n  __1     === ' + __1,
      '\n  __blank === ' + __blank,
      '\n  aKey    === ' + aKey,
      '\n  aMap    === ' + JSON.stringify( aMap ),
      '\n  topCmap === ' + JSON.stringify( topCmap ),
      '\n  topSmap === ' + JSON.stringify( topSmap ),
      '\n  $Map    === ' + JSON.stringify( $Map )
    );

    // Bind shell event handlers (taps, drags, long-press, etc)
  }
  // . END Public method /initModule/

  aMap._shell_ = { _initModule_ : initModule };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE __NS._makeShell_ ====================================
