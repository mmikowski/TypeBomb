/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
 */
/*global $, tb*/

// Begin model
tb._model_ = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    fMap     = tb._fMap_,
    nMap     = tb._nMap_,
    vMap     = tb._vMap_,
    __setTo  = fMap._setTo_,
    cfgMap   = {
      _init_map_ : {
        _level_count_ : nMap._1_,
        _lives_count_ : nMap._5_,
        _score_count_ : nMap._0_,
        _typebox_str_ : 'Type here ...'
      },
      _max_typebox_int_ : nMap._22_,
      _timetick_ms_     : 32
    },
    stateMap = {
      _typebox_str_ : vMap._blank_,
      _level_count_ : vMap._undef_,
      _lives_count_ : vMap._undef_,
      _score_count_ : vMap._undef_,
      _is_ingame_   : vMap._true_
    },
    bombMgrUtil,

    initGameVals,
    runTimeTick,
    setIsIngame,

    reportKeyPress,  startGame,
    stopGame, initModule
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------

  // Begin utility object /bombMgrUtil/
  bombMgrUtil = (function () {
    var
      sMap = {
        // TODO: replace list with a map by id
        _bomb_list_ : [],
        _bomb_int_  : nMap._0_
      },
      bombProto,
      addBomb, updateBombList
      ;

    bombProto = {
      //_id_          : 'bomb',   // instance var
      //_delta_y_num_ : nMap._0_, // instance var
      //_y_ratio_     : nMap._1_, // instance var
      //_x_ratio_     : nMap._0_, // instance var
      _explode_ : function () {
        var idx, bomb_list, bomb_list_count, bomb_obj, found_obj;

        bomb_list = sMap._bomb_list_;
        bomb_list_count = bomb_list[ vMap._length_ ];
        for ( idx = nMap._0_; idx < bomb_list_count; idx++ ) {
          bomb_obj = bomb_list[ idx ];
          if ( bomb_obj._id_ === this._id_ ) {
            found_obj = bomb_obj;
            break;
          }
        }
        if ( found_obj ) {
          $.gevent.publish( '_bomb_explode_', found_obj );
          bomb_list[ vMap._splice_ ]( idx );
        }
      },
      _move_ :  function (){
        this._y_ratio_ += this._delta_y_num_;
        if ( this._y_ratio_ < nMap._0_ ) {
          this._explode_();
          return;
        }
        $.gevent.publish( '_bomb_move_', this );
      }
    };

    addBomb = function ( label_str ){
      var bomb_obj, bomb_list;
      bomb_obj = tb._createObj_( bombProto );
      bomb_obj._id_          = 'bb' + fMap._String_( sMap._bomb_int_ );
      bomb_obj._y_ratio_     = nMap._1_;
      bomb_obj._delta_y_num_ = -0.0016;
      bomb_obj._x_ratio_     = 0.5;
      bomb_obj._label_str_   = label_str || vMap._blank_;

      bomb_list = sMap._bomb_list_;
      bomb_list[ vMap._push_ ]( bomb_obj );

      $.gevent.publish( '_bomb_init_', bomb_obj );
      $.gevent.publish( '_bomb_move_', bomb_obj );
    };

    updateBombList = function (){
      var idx, bomb_list, bomb_list_count, bomb_obj;
      bomb_list = sMap._bomb_list_;
      bomb_list_count = bomb_list[ vMap._length_ ];

      for ( idx = nMap._0_; idx < bomb_list_count; idx++ ) {
        bomb_obj = bomb_list[ idx ];
        bomb_obj._move_();
      }
    };

    return {
      _addBomb_ : addBomb,
      _updateBombList_ : updateBombList
    };
  }());
  // End utility object /bombMgrUtil/

  // Begin utility method /initGameVals/
  initGameVals = function () {
    var init_map, key_list, key_name, list_count, i;

    init_map   = cfgMap._init_map_;
    key_list   = fMap._Object_[ vMap._keys_ ]( init_map );
    list_count = key_list[ vMap._length_ ];

    for ( i = nMap._0_; i < list_count; i++ ) {
      key_name = key_list[ i ];
      stateMap[ key_name ] = init_map[ key_name ];
    }

    $.gevent.publish( '_update_ingame_', stateMap._is_ingame_ );
    $.gevent.publish( '_update_level_', stateMap._level_count_ );
    $.gevent.publish( '_update_lives_', stateMap._lives_count_ );
    $.gevent.publish( '_update_score_', stateMap._score_count_ );
    $.gevent.publish( '_update_typebox_', stateMap._typebox_str_ );
  };
  // End utility method /initGameVals/

  // Begin utility method /runTimeTick/
  // Initiate all game-based periodic actions here.
  runTimeTick = function () {
    bombMgrUtil._updateBombList_();
    if ( stateMap._is_ingame_ ) {
      __setTo( runTimeTick, cfgMap._timetick_ms_ );
    }
  };
  // End utility method /runTimeTick/

  // Begin utility method /setInGame/
  setIsIngame = function ( arg_is_ingame, arg_level_count ) {
    var is_ingame, level_count;

    is_ingame   = !! arg_is_ingame;
    level_count = fMap._parseInt_( arg_level_count );

    stateMap._is_ingame_ = is_ingame;
    if ( is_ingame ) {
      initGameVals( level_count );
      runTimeTick();
    }
    $.gevent.publish( '_update_ingame_', stateMap._is_ingame_ );
  };
  // End utility method /setInGame/
  //--------------------- END UTILITY METHODS ------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin public method /reportKeyPress/
  // If key press is actionable, return true
  reportKeyPress = (function () {
    var
      spc_code    = nMap._32_,
      bkspc_code  = nMap._8_,
      return_code = nMap._13_,
      report_keypress;

    report_keypress = function ( key_code ) {
      var typebox_str, type_length, end_idx, resp_name;

      // do not handle if not in game
      if ( ! stateMap._is_ingame_ ) { return vMap._false_; }

      // get typebox content and length
      typebox_str = stateMap._typebox_str_;
      type_length = typebox_str[ vMap._length_ ];

      // clear default text if present
      if ( typebox_str === cfgMap._init_map_._typebox_str_ ) {
        typebox_str = '';
        type_length = nMap._0_;
      }

      // prevent duplicate spaces
      if ( key_code === spc_code ) {
        end_idx = type_length - nMap._n1_;
        if ( typebox_str.charAt( end_idx ) === ' ' ) {
          return vMap._true_;
        }
      }

      // handle character codes
      switch( key_code ) {
        case bkspc_code :
          if ( type_length > nMap._0_ ) {
            type_length--;
            resp_name = '_bkspc_';
          }
          break;

        case return_code :
          if ( type_length > nMap._0_ ) {
            typebox_str = '';
            type_length = nMap._0_;
            resp_name = '_returnd_';
          }
          break;

        default : // everything else
          typebox_str += String.fromCharCode( key_code );
          type_length = typebox_str[ vMap._length_ ];
          resp_name = '_char_add_';
          break;
      }

      if ( type_length > cfgMap._max_typebox_int_ ) {
        type_length = cfgMap._max_typebox_int_;
        $.gevent.publish( '_acknowledge_key_', [ '_at_limit_' ]); // honk
        return false;
      }

      // display revised string if needed
      typebox_str = typebox_str.substring( nMap._0_, type_length );

      if ( typebox_str === stateMap._typebox_str_ ) {
        return false;
      }

      $.gevent.publish( '_update_typebox_', typebox_str + '|' );
      $.gevent.publish( '_acknowledge_key_', [ resp_name ]);
      stateMap._typebox_str_  = typebox_str;
      return vMap._true_;
    };

    return report_keypress;
  }());
  // End public method /reportKeyPress/

  // Begin public method /stopGame/
  stopGame = function (){
    setIsIngame( vMap._false_);
  };
  // End public method /stopGame/

  // Begin public method /startGame/
  startGame = function ( level_count ){
    setIsIngame( vMap._true_, level_count );
    bombMgrUtil._addBomb_( 'asdf' );
  };
  // End public method /startGame/

  // Begin public method /initModule/
  initModule = function () {
    initGameVals();
    $.gevent.publish( '_acknowledge_init_' );
    setIsIngame( vMap._false_);
  };
  // End public method /initModule/

  return {
    _initModule_     : initModule,
    _stopGame_       : stopGame,
    _startGame_      : startGame,
    _reportKeyPress_ : reportKeyPress
  };
  //-------------------- END PUBLIC METHODS --------------------
}());

