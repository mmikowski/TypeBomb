/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
 */
/*global $, tb*/

// BEGIN _model_
tb._model_ = (function () {
  'use strict';
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  var
    fMap      = tb._fMap_,
    nMap      = tb._nMap_,
    vMap      = tb._vMap_,
    __clearTo = fMap._clearTo_,
    __setTo   = fMap._setTo_,

    cfgMap   = {
      _init_map_        : {
        // _level_count_ : nMap._0_,
        _lives_count_ : nMap._5_,
        _match_count_ : nMap._0_,
        _score_count_ : nMap._0_,
        _typebox_str_ : 'Type here ...',
        _wave_count_  : nMap._0_
      },
      _max_typebox_int_ : nMap._22_,
      _storage_key_     : 'tb-hiscore_list',
      _timetick_ms_     : nMap._100_,

      _level_pause_ms_ : nMap._10k_,
      _wave_pause_ms_  : nMap._5k_,

      _wave_key_list_ : [
        '_onscreen_count_',     // how many bombs to try to keep onscreen
        '_word_complex_idx_',   // how difficult the words should be (0-5?)
        '_drop_speed_num_',     // max drop speed in percent of screen height
        '_drop_range_num_',     // variation from max speed allowed
        '_match_goal_int_',     // number of matched bombs to complete wave
        '_bomb_pause_ms_'       // max pause before dropping new bomb
      ],
      _level_wave_list_ : [
        [
          [ nMap._4_, nMap._0_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._0_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._0_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._0_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._0_, nMap._d32_, nMap._d08_, 50,  800 ]
        ],
        [
          [ nMap._9_, nMap._1_, nMap._d32_, nMap._d08_, 60, 500 ]
        ],
        [
          [ nMap._9_, nMap._1_, nMap._d32_, nMap._d08_, 60, 500 ]
        ]
      ]
    },

    stateMap = {
      _is_ingame_       : vMap._undef_,
      _level_count_     : vMap._undef_,
      _level_wave_list_ : vMap._undef_,
      _lives_count_     : vMap._undef_,
      _match_count_     : vMap._undef_,
      _score_count_     : vMap._undef_,
      _tick_toid_       : vMap._undef_,
      _typebox_str_     : vMap._undef_,
      _wave_count_      : vMap._undef_
    },

    // utility methods
    addHiScore,
    compileLevelWaveList,
    getHiScoreList, initGameVals,
    makeTimeStamp,  runTimeTick,
    setIsIngame,

    // utility objects
    bombMgrObj,

    // public methods
    reportKeyPress,  startGame,
    stopGame,        initModule
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  // BEGIN utility method /addHiScore/
  addHiScore = (function () {
    var sort_fn, add_fn;

    sort_fn = function ( a_map, b_map ) {
      return b_map._score_int_ - a_map._score_int_;
    };

    add_fn = function ( score_int, name_str ) {
      var hiscore_list = getHiScoreList();

      if ( ! hiscore_list ) { hiscore_list = []; }

      hiscore_list[ vMap._push_ ](
        { _score_int_: score_int, _name_str_: name_str }
      );

      hiscore_list[ vMap._sort_ ]( sort_fn );

      return vMap._true_;
    };

    return add_fn;
  }());

  // END utility method /addHiScore/

  // BEGIN utility method /compileWaveLevelList/
  // This converts the terse data structure (list->list->list)
  // in cMap._wave_level_list_ into a friendly structre
  // (list->list->map) stored in stateMap._level_wave_list_
  // so one can access the values like so:
  // stateMap._level_wave_list[ level_count ][ wave_count ]._onscreen_count_
  //
  //noinspection FunctionWithMultipleLoopsJS
  compileLevelWaveList = function () {
    var
      level_list     = cfgMap._level_wave_list_,
      level_count    = level_list[ vMap._length_ ],
      wave_key_list  = cfgMap._wave_key_list_,
      wave_key_count = wave_key_list[ vMap._length_ ],

      gen_level_list,
      gen_wave_list, wave_list,    wave_count,
      value_list,    gen_wave_map, wave_key,
      i, j, k;

    gen_level_list = [];
    for ( i = nMap._0_; i < level_count; i++ ) {
      gen_wave_list = [];
      wave_list  = level_list[ i ];
      wave_count = wave_list[ vMap._length_ ];

      for ( j = nMap._0_; j < wave_count; j++ ) {
        value_list = wave_list[ j ];
        gen_wave_map = {};

        for ( k = nMap._0_; k < wave_key_count; k++ ) {
          wave_key = wave_key_list[ k ];
          switch( wave_key ) {
            case '_drop_speed_num_':
            case '_drop_range_num_':
              gen_wave_map[ wave_key ] = value_list[ k ] / nMap._100_;
              break;

            default:
              gen_wave_map[ wave_key ] = value_list[ k ];
              break;

          }
        }
        gen_wave_list[ vMap._push_ ]( gen_wave_map );
      }
      gen_level_list[ vMap._push_ ]( gen_wave_list );
    }
    stateMap._level_wave_list_ = gen_level_list;
  };
  // END utility method /compileWaveLevelList/

  // BEGIN utility method /initGameVals/
  initGameVals = function ( level_idx ) {
    var init_map, key_list, key_name, list_count, i;

    init_map   = cfgMap._init_map_;
    key_list   = fMap._Object_[ vMap._keys_ ]( init_map );
    list_count = key_list[ vMap._length_ ];

    for ( i = nMap._0_; i < list_count; i++ ) {
      key_name = key_list[ i ];
      stateMap[ key_name ] = init_map[ key_name ];
    }

    stateMap._level_count_ = level_idx || nMap._0_;

    $.gevent.publish( '_update_level_',   stateMap._level_count_ );
    $.gevent.publish( '_update_lives_',   stateMap._lives_count_ );
    $.gevent.publish( '_update_score_',   stateMap._score_count_ );
    $.gevent.publish( '_update_typebox_', stateMap._typebox_str_ );
  };
  // END utility method /initGameVals/

  // BEGIN utility method /getHiScoreList/
  getHiScoreList = function () {
    var store_obj, json_str;

    store_obj = fMap._localStorage_;
    if ( ! store_obj ) { return vMap._undef_; }

    json_str = store_obj[ cfgMap._storage_key_ ];
    if ( ! json_str ) { return vMap._undef_; }

    return fMap._json_parse_( json_str );
  };
  // END utility method /getHiScoreList/

  // BEGIN utility method /makeTimeStamp/
  makeTimeStamp = function () { return +new Date(); };
  // END utility method /makeTimeStamp/


  // BEGIN utility method /runTimeTick/
  // Execute all game-based periodic actions here.
  runTimeTick = (function () {
    var tick_ms, run_fn;

    run_fn = function () {
      var
        new_ms, elapsed_ms, adj_ticktime_ms;

      if ( stateMap._is_ingame_ ) {
        bombMgrObj._updateBombList_();
        new_ms = makeTimeStamp();

        elapsed_ms = tick_ms > nMap._0_
          ? new_ms - tick_ms
          : nMap._0_;

        // This adjusts for actual elapsed time since the last invocation
        adj_ticktime_ms = cfgMap._timetick_ms_ - elapsed_ms;

        stateMap._tick_toid_ = __setTo( run_fn, adj_ticktime_ms );
        tick_ms = new_ms;
      }
    };

    return run_fn;
  }());
  // END utility method /runTimeTick/


  // BEGIN utility method /setIsInGame/
  setIsIngame = function ( arg_is_ingame, arg_level_idx ) {
    var is_ingame, level_idx, level_count;

    level_count = cfgMap._level_wave_list_[ vMap._length_ ];

    level_idx = fMap._parseInt_( arg_level_idx ) || nMap._0_;

    is_ingame   = !! arg_is_ingame;
    stateMap._is_ingame_ = is_ingame;

    // level and all other fields are updated here
    if ( is_ingame ) {
      initGameVals( level_idx );
      runTimeTick();
    }
    $.gevent.publish( '_update_ingame_', [ is_ingame, level_count ] );
  };
  // END utility method /setIsInGame/
  //--------------------- END UTILITY METHODS ------------------

  //-------------------- BEGIN UTILITY OBJECTS -----------------
  // BEGIN utility object /bombMgrObj/
  bombMgrObj = (function () {
    var
      sMap = {
        _addbomb_toid_    : vMap._undef_,
        _bomb_list_       : [],
        _bomb_int_        : nMap._0_,
        _next_wave_toid_  : vMap._undef_,
        _wave_map_        : vMap._undef_
      },
      wordList = [
        'asdf', 'fgh', 'jkl', 'alm', 'poe', 'qjuery', 'doe', 'dis',
        'dat', 'dudder', 'the', 'am', 'I', 'you', 'them', 'if', 'then',
        'that', 'power', 'tic', 'tac', 'toe', 'to', 'car', 'fart'
      ],
      wordCount = wordList[ vMap._length_ ],

      bombProto,        addBomb,
      doNextWave,
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
          stateMap._lives_count_--;
          if ( stateMap._lives_count_ < nMap._1_ ) {
            stopGame();
            return;
          }
          $.gevent.publish( '_bomb_explode_', bomb_obj );
          $.gevent.publish( '_update_lives_', stateMap._lives_count_ );
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

    addBomb = function () {
      var
        wave_map, label_idx, label_str,
        speed_ratio, drop_speed, x_ratio,
        bomb_obj, bomb_list;

      wave_map   = sMap._wave_map_;
      label_idx  = fMap._floor_( wordCount * fMap._rnd_() );
      label_str  = wordList[ label_idx ];
      speed_ratio = fMap._rnd_();
      drop_speed = wave_map._drop_speed_num_
      - ( wave_map._drop_range_num_ * speed_ratio );
      drop_speed = -drop_speed;
      x_ratio = nMap._d16_ + nMap._d66_ * fMap._rnd_();

      bomb_obj = tb._createObj_( bombProto );
      bomb_obj._id_          = 'bb' + fMap._String_( sMap._bomb_int_ );
      bomb_obj._y_ratio_     = nMap._1_;
      bomb_obj._delta_y_num_ = drop_speed;
      bomb_obj._x_ratio_     = x_ratio;
      bomb_obj._speed_ratio_ = speed_ratio;
      bomb_obj._label_str_   = label_str || vMap._blank_;
      sMap._bomb_int_++;

      bomb_list = sMap._bomb_list_;
      bomb_list[ vMap._push_ ]( bomb_obj );

      $.gevent.publish( '_bomb_init_', bomb_obj );
      $.gevent.publish( '_bomb_move_', bomb_obj );
      sMap._addbomb_toid_ = vMap._undef_;
    };

    doNextWave = function () {
      stateMap._match_count_ = nMap._0_;
      sMap._next_wave_toid_  = vMap._undef_;
    };

    checkBombDestroy = function ( label_str ) {
      var
        wave_map = sMap._wave_map_,
        bomb_obj = getBombByKey( '_label_str_', label_str, true ),

        pause_ms, level_wave_list,
        level_count, wave_count,
        next_wave_map
        ;

      // Increment score and match count.
      // Publish events for score update and bomb destruction.
      //
      if ( bomb_obj ) {
        stateMap._score_count_ += nMap._50_;
        stateMap._match_count_ += nMap._1_;
        $.gevent.publish( '_bomb_destroy_', bomb_obj );
        $.gevent.publish( '_update_score_', stateMap._score_count_ );
      }

      if ( stateMap._match_count_ < wave_map._match_goal_int_ ) { return; }

      // Fire off new level or wave if all bombs are cleared
      //
      level_count = stateMap._level_count_;
      wave_count  = stateMap._wave_count_;
      $.gevent.publish( '_wave_complete_', [ level_count, wave_count ] );

      wave_count++;
      level_wave_list = stateMap._level_wave_list_;
      next_wave_map = level_wave_list[ level_count ][ wave_count ];

      // Increment to next wave if exists...
      //
      if ( next_wave_map ) {
        stateMap._wave_count_ = wave_count;
        sMap._wave_map_ = next_wave_map;
        pause_ms = cfgMap._wave_pause_ms_;
      }

      // ..otherwise increment level, wave 0
      //
      else {
        wave_count = nMap._0_;
        if ( level_wave_list[ level_count + nMap._1_ ] ) {
          level_count++;
        }
        next_wave_map = level_wave_list[ level_count ][ wave_count ];

        stateMap._wave_count_  = wave_count;
        stateMap._level_count_ = level_count;
        sMap._wave_map_ = next_wave_map;
        pause_ms        = cfgMap._level_pause_ms_;
        $.gevent.publish( '_update_level_',  level_count );
      }

      // Set pause and notify gui
      //
      sMap._next_wave_toid_ = __setTo( doNextWave, pause_ms);
      console.warn( '_wave_complete_', level_count, wave_count );
    };

    clearBombList = function () {
      $.gevent.publish( '_bomb_allclear_' );
      sMap._bomb_list_[ vMap._length_ ] = nMap._0_;
      if ( sMap._addbomb_toid_ ) {
        __clearTo( sMap._addbomb_toid_ );
        sMap._addbomb_toid_ = vMap._undef_;
      }
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
        bomb_list[ vMap._splice_ ]( idx, nMap._1_ );
      }
      return found_obj;
    };

    getBombCount = function () {
      return sMap._bomb_list_[ vMap._length_ ];
    };

    // '_onscreen_count_',     // how many bombs to try to keep onscreen
    // '_word_complex_idx_',   // how difficult the words should be (0-5?)
    // '_drop_speed_num_',       // max drop speed in percent of screen height
    // '_drop_range_num_',     // variation from max speed allowed
    // '_match_goal_int_',     // number of matched bombs to complete wave
    // '_bomb_pause_ms_'       // max pause before dropping new bomb
    updateBombList = function () {
      var
        idx, bomb_list, bomb_count, bomb_obj,
        wave_map, delay_ms;

      // do nothing of we have a wave break
      if ( sMap._next_wave_toid_ ) { return; }

      // Make sure we are initiated (this should not happen!)
      if ( stateMap._level_count_ === vMap._undef_ ) {
        compileLevelWaveList();
        console.warn( '_call_to_update_game_without_init_' );
      }

      // Move all bombs
      bomb_list = sMap._bomb_list_;
      bomb_count = bomb_list[ vMap._length_ ];
      for ( idx = nMap._0_; idx < bomb_count; idx++ ) {
        bomb_obj = bomb_list[ idx ];
        if ( bomb_obj ) { bomb_obj._move_(); }
      }

      // Spawn a new bomb if we need a new one
      if ( ! sMap._addbomb_toid_ ) {
        wave_map = stateMap._level_wave_list_[
          stateMap._level_count_ ][
          stateMap._wave_count_];

        sMap._wave_map_ = wave_map;
        if ( stateMap._match_count_ + bomb_count < wave_map._match_goal_int_ ) {
          bomb_count = bombMgrObj._getBombCount_();
          if ( wave_map._onscreen_count_ > bomb_count ) {
            delay_ms = wave_map._bomb_pause_ms_ * fMap._rnd_();
            sMap._addbomb_toid_ = __setTo( addBomb, delay_ms );
          }
        }
      }
    };

    return {
      _checkBombDestroy_ : checkBombDestroy,
      _clearBombList_    : clearBombList,
      _getBombCount_     : getBombCount,
      _updateBombList_   : updateBombList
    };
  }());
  // END utility object /bombMgrObj/
  //--------------------- END UTILITY OBJECTS ------------------


  //------------------- BEGIN PUBLIC METHODS -------------------
  // BEGIN public method /reportKeyPress/
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
            bombMgrObj._checkBombDestroy_( typebox_str );
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
        $.gevent.publish( '_acknowledge_key_', [ '_at_limit_' ]);
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
  // END public method /reportKeyPress/

  // BEGIN public method /stopGame/
  stopGame = function (){
    if ( stateMap._tick_toid_ ) {
      __clearTo( stateMap._tick_toid_ );
      stateMap._tick_toid_ = vMap._undef_;
    }
    bombMgrObj._clearBombList_();
    setIsIngame( vMap._false_ );
    $.gevent.publish( '_bomb_allclear_' );
  };
  // END public method /stopGame/

  // BEGIN public method /startGame/
  startGame = function ( level_count ){
    if ( stateMap._level_wave_list_ === vMap._undef_ ) {
      compileLevelWaveList();
    }

    if ( stateMap._is_ingame_ ) {
      stopGame();
    }

    stateMap._level_count_ = level_count;
    stateMap._wave_count_  = nMap._0_;

    setIsIngame( vMap._true_, level_count );
  };
  // END public method /startGame/

  // BEGIN public method /initModule/
  initModule = function () {
    initGameVals();
    $.gevent.publish( '_acknowledge_init_' );
    setIsIngame( vMap._false_);
  };
  // END public method /initModule/

  return {
    // TODO: delete _addHiScore_; this is a hack for jslint
    _addHiScore_     : addHiScore,
    _initModule_     : initModule,
    _stopGame_       : stopGame,
    _startGame_      : startGame,
    _reportKeyPress_ : reportKeyPress
  };
  //-------------------- END PUBLIC METHODS --------------------
}());
// END _model_
