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
        _level_count_ : nMap._0_,
        _wave_count_  : nMap._0_,
        _lives_count_ : nMap._5_,
        _score_count_ : nMap._0_,
        _typebox_str_ : 'Type here ...'
      },
      _max_typebox_int_ : nMap._22_,
      _timetick_ms_     : nMap._32_,

      _level_pause_ms_   : nMap._3000_,
      _wave_pause_ms_    : nMap._5000_,

      _wave_onscreen_int_   : vMap._undef_,
      _wave_complexity_int_ : vMap._undef_,
      _wave_max_move_pct_   : vMap._undef_,
      _wave_drop_range_num_ : vMap._undef_,
      _wave_complete_int_   : vMap._undef_,

      // levelWaveList[ level ][ wave ] = [
      //   0 wave_onscreen_int,    // how many bombs to try to keep onscreen
      //   1 wave_complex_int,     // how difficult the words should be (0-5?)
      //   2 wave_max_move_pct_,   // max drop speed in percent of screen height
      //   3 wave_drop_range_num,  // variation from max speed allowed
      //   4 wave_complete_int     // number of matched bombs to complete wave
      // ];
      level_wave_list : [
        [
          [ nMap._1_, nMap._0_, nMap._d12_, nMap._0_,   nMap._4_  ],
          [ nMap._1_, nMap._0_, nMap._d16_, nMap._d04_, nMap._8_  ],
          [ nMap._1_, nMap._0_, nMap._d20_, nMap._d04_, nMap._12_ ]
        ],
        [
          [ nMap._2_, nMap._1_, nMap._d12_, nMap._d04_, nMap._4_  ],
          [ nMap._2_, nMap._1_, nMap._d16_, nMap._d04_, nMap._8_  ],
          [ nMap._2_, nMap._1_, nMap._d20_, nMap._d04_, nMap._12_ ],
          [ nMap._2_, nMap._1_, nMap._d24_, nMap._d04_, nMap._16_ ]
        ]
      ]
    },
    stateMap = {
      _is_ingame_   : vMap._true_,
      _level_count_ : vMap._undef_,
      _lives_count_ : vMap._undef_,
      _score_count_ : vMap._undef_,
      _tick_toid_   : vMap._undef_,
      _typebox_str_ : vMap._blank_
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
      bombProto,        addBomb,
      checkBombDestroy, clearBombList,
      getBombByKey,     getBombCount,
      updateBombList
      ;

    bombProto = {
      // instance vars:
      //_id_          : 'bb<serial_num>', // eg. bb25
      //_delta_y_num_ : -<0-1> // move amount per tick, eg. -0.0016
      //_y_ratio_     : <0-1>  // btm of bomb.  1 = 100%
      //_x_ratio_     : <0-1>  // left position of bomb
      //
      _explode_ : function () {
        var bomb_obj = getBombByKey( '_id_', this._id_, vMap._true_ );
        if ( bomb_obj ) {
          $.gevent.publish( '_bomb_explode_', bomb_obj );
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
      sMap._bomb_int_++;

      bomb_list = sMap._bomb_list_;
      bomb_list[ vMap._push_ ]( bomb_obj );

      $.gevent.publish( '_bomb_init_', bomb_obj );
      $.gevent.publish( '_bomb_move_', bomb_obj );
    };

    checkBombDestroy = function ( label_str ) {
      var bomb_obj = getBombByKey( '_label_str_', label_str, true );
      if ( bomb_obj ) {
        $.gevent.publish( '_bomb_destroy_', bomb_obj );
      }
    };

    clearBombList = function () {
      $.gevent.publish( '_bomb_allclear_' );
      sMap._bomb_list_[ vMap._length_ ] = nMap._0_;
    };

    getBombByKey = function ( bomb_key, bomb_val, do_delete ) {
      var idx, bomb_list, bomb_list_count, bomb_obj, found_obj;

      bomb_list = sMap._bomb_list_;
      bomb_list_count = bomb_list[ vMap._length_ ];
      for ( idx = nMap._0_; idx < bomb_list_count; idx++ ) {
        bomb_obj = bomb_list[ idx ];
        if ( bomb_obj[ bomb_key ] === bomb_val ) {
          found_obj = bomb_obj;
          break;
        }
      }
      if ( found_obj && do_delete ) {
        bomb_list[ vMap._splice_ ]( idx );
      }
      return found_obj;
    };

    getBombCount = function () {
      return sMap._bomb_list_[ vMap._length_ ];
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
      _addBomb_          : addBomb,
      _checkBombDestroy_ : checkBombDestroy,
      _clearBombList_    : clearBombList,
      _getBombCount_     : getBombCount,
      _updateBombList_   : updateBombList
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

    $.gevent.publish( '_update_ingame_',  stateMap._is_ingame_ );
    $.gevent.publish( '_update_level_',   stateMap._level_count_ );
    $.gevent.publish( '_update_lives_',   stateMap._lives_count_ );
    $.gevent.publish( '_update_score_',   stateMap._score_count_ );
    $.gevent.publish( '_update_typebox_', stateMap._typebox_str_ );
  };
  // End utility method /initGameVals/

  // Begin utility method /runTimeTick/
  // Execute all game-based periodic actions here.
  runTimeTick = function () {
    bombMgrUtil._updateBombList_();
    if ( stateMap._is_ingame_ ) {
      stateMap._tick_toid_ = __setTo( runTimeTick, cfgMap._timetick_ms_ );
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
            bombMgrUtil._checkBombDestroy_( typebox_str );
            typebox_str = '';
            type_length = nMap._0_;
            resp_name = '_returnd_';
          }
          break;

        default : // everything else
          typebox_str += fMap._String_.fromCharCode( key_code );
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
    if ( stateMap._tick_toid_ ) {
      clearTimeout( stateMap._tick_toid_ );
      stateMap._tick_toid_ = vMap._undef_;
    }
    bombMgrUtil._clearBombList_();
    setIsIngame( vMap._false_);
    $.gevent.publish( '_bomb_allclear_' );
  };
  // End public method /stopGame/

  // Begin public method /startGame/
  startGame = function ( level_count ){
    if ( stateMap._is_ingame_ ) {
      stopGame();
    }
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

