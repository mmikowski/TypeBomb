/*
 * xhi-module-tmplt.js
 *
 * Use: $ cp xhi-module-tmplt.js 07.<newfeature>.js
 * Synopsis: Feature module template
 * Provides: A template that embodies best practice
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

// == BEGIN MODULE __NS._makeTmplt_ ====================================
__NS._makeTmplt_ = function ( aMap ) {
  // == BEGIN MODULE SCOPE VARIABLES ===================================
  'use strict';
  var
    aKey     = aMap._aKey_,
    vMap     = aMap._vMap_,
    nMap     = aMap._nMap_,
    __util   = aMap._util_,

    __0      = nMap._0_,
    __1      = nMap._1_,
    __blank  = vMap._blank_,

    __logObj = __util._getLogObj_(),
    __logMsg = __logObj._logMsg_,

    topCmap  = {},
    topSmap  = {},

    $Map
    ;
  // == . END MODULE SCOPE VARIABLES ===================================

  // == BEGIN UTILITY METHODS ==========================================
  // == . END UTILITY METHODS ==========================================

  // == BEGIN DOM METHODS ==============================================
  // BEGIN DOM method /set$Map/
  // Summary   : set$Map( <jquery_obj> );
  // Purpose   : Set the module jQuery cache
  // Example   : set$Map( $top_box );
  // Arguments : (positional)
  //   0: $top_box : A jQuery object used to locate DOM elements.
  // Settings  : Module-scoped $Map is populated by this function.
  // Returns   : undef
  // Throws    : none
  //
  function set$Map ( $top_box ) {
    $Map = { _$top_box_ : $top_box };
  }
  // . END DOM method /set$Map/
  // == . END DOM METHODS ==============================================

  // == BEGIN EVENT HANDLERS ===========================================
  // == . END EVENT HANDLERS ===========================================

  // == BEGIN PUBLIC METHODS ===========================================
  // BEGIN Public method /initModule/
  function initModule ( $top_box ) {
    // Initialize DOM content and set jQuery collection cache
    set$Map( $top_box );

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
  }
  // . END Public method /initModule/

  aMap._makeTmplt_ = { _initModule_ : initModule };
  // == . END PUBLIC METHODS ===========================================
};
// == . END MODULE __NS._makeTmplt_ ====================================

