/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
 */
/*global $, tb*/

// BEGIN tb._model_
tb._model_ = (function () {
  /***************** BEGIN MODULE SCOPE VARIABLES **************/
  'use strict';
  //noinspection MagicNumberJS
  var
    fMap      = tb._fMap_,
    nMap      = tb._nMap_,
    vMap      = tb._vMap_,

    __0       = nMap._0_,
    __1       = nMap._1_,

    __Str     = fMap._String_,
    __clearTo = fMap._clearTo_,
    __setTo   = fMap._setTo_,
    __$pub    = $[ vMap._gevent_ ][ vMap._publish_],

    cfgMap   = {
      _init_map_        : {
        _level_count_ : __0,
        _lives_count_ : nMap._5_,
        _match_count_ : __0,
        _score_count_ : __0,
        _typebox_str_ : 'Type here ...',
        _wave_count_  : __0
      },
      _max_typebox_int_  : nMap._32_,
      _max_hi_score_int_ : nMap._10_,
      _storage_key_      : 'tb-hi-score-list',
      _timetick_ms_      : nMap._100_,

      _level_pause_ms_  : nMap._10k_,
      _level_score_int_ : nMap._5k_,
      _wave_pause_ms_   : nMap._5k_,

      _wave_key_list_ : [
        '_onscreen_count_',     // how many bombs to try to keep onscreen
        '_drop_speed_num_',     // max drop speed in percent of screen height
        '_drop_range_num_',     // variation from max speed allowed
        '_match_goal_int_',     // number of matched bombs to complete wave
        '_bomb_pause_ms_'       // max pause before dropping new bomb
      ],
      _level_wave_list_ : [
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ]
        ],
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ]
        ],
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ],
          [ nMap._9_, nMap._d32_, nMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ],
          [ nMap._9_, nMap._d32_, nMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ],
          [ nMap._9_, nMap._d32_, nMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ],
          [ nMap._9_, nMap._d32_, nMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ],
          [ nMap._9_, nMap._d32_, nMap._d08_, 60,  500 ]
        ],
        [ [ nMap._4_, nMap._d16_, nMap._d04_, 24, 2000 ],
          [ nMap._5_, nMap._d20_, nMap._d06_, 32, 1500 ],
          [ nMap._6_, nMap._d24_, nMap._d08_, 38, 1250 ],
          [ nMap._7_, nMap._d28_, nMap._d08_, 44, 1000 ],
          [ nMap._8_, nMap._d32_, nMap._d08_, 50,  800 ],
          [ nMap._9_, nMap._d32_, nMap._d08_, 60,  500 ]
        ]
      ],
      mode_str_list : [ '_sell_', '_play_', '_add_' ]
    },

    stateMap = {
      _mode_str_        : '_sell_',
      _hi_score_list_   : vMap._undef_,
      _level_count_     : vMap._undef_,
      _level_wave_list_ : vMap._undef_,
      _lives_count_     : vMap._undef_,
      _match_count_     : vMap._undef_,
      _score_count_     : vMap._undef_,
      _tick_toid_       : vMap._undef_,
      _typebox_str_     : vMap._undef_,
      _wave_count_      : vMap._undef_,
      _weight_ratio_    : vMap._undef_
    },

    // utility methods
    setModeAdd, setModeSell, setModePlay,

    compileLevelWaveList,

    addHiScore, getHiScoreList, hiScoreSortFn, storeHiScoreList,

    initGameVals, makeTimeStamp, runTimeTick,


    // utility objects
    bombMgrObj,

    // public methods
    reportKeyPress,  startGame,
    stopGame,        initModule
    ;
  /***************** END MODULE SCOPE VARIABLES ***************/

  /******************** BEGIN UTILITY METHODS *****************/
  // BEGIN utility /setModeAdd/
  setModeAdd = function ( hi_score_list, hi_score_idx ) {
    stateMap._mode_str_ = '_add_';
    __$pub( '_set_mode_', {
      _mode_str_      : '_add_',
      _hi_score_list_ : hi_score_list,
      _hi_score_idx_  : hi_score_idx
    });
  };
  // END utility /setModeAdd/

  // BEGIN utility /setModePlay/
  setModePlay = function ( arg_req_level_idx  ) {
    var req_level_idx, all_level_count;

    // Get count of all levels and requested level
    all_level_count = cfgMap._level_wave_list_[ vMap._length_ ];
    req_level_idx   = fMap._parseInt_( arg_req_level_idx ) || __0;
    if ( req_level_idx > all_level_count ) { req_level_idx = all_level_count; }
    initGameVals( req_level_idx );

    // Publish events to set play mode
    stateMap._mode_str_ = '_play_';
    __$pub( '_set_mode_', { _mode_str_ : '_play_' } );

    // Kick-off run-time game heartbeat
    runTimeTick();
  };
  // END utility /setModePlay/

  // BEGIN utility /setModeSell/
  setModeSell = function () {
    var all_level_count = cfgMap._level_wave_list_[ vMap._length_ ];

    stateMap._mode_str_ = '_sell_';
    __$pub( '_set_mode_', {
      _mode_str_        : '_sell_',
      _all_level_count_ : all_level_count
    });
  };
  // END utility method /setModeSell/

  // BEGIN utility method /compileLevelWaveList/
  // This converts the terse data structure (list->list->list)
  // in cMap._wave_level_list_ into a friendly structre
  // (list->list->map) stored in stateMap._level_wave_list_
  // so one can access the values like so:
  // stateMap._level_wave_list[ level_count ][ wave_count ]._onscreen_count_
  //
  //noinspection FunctionWithMultipleLoopsJS
  //
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
    for ( i = __0; i < level_count; i++ ) {
      gen_wave_list = [];
      wave_list  = level_list[ i ];
      wave_count = wave_list[ vMap._length_ ];

      for ( j = __0; j < wave_count; j++ ) {
        value_list = wave_list[ j ];
        gen_wave_map = {};

        for ( k = __0; k < wave_key_count; k++ ) {
          wave_key = wave_key_list[ k ];
          switch( wave_key ) {
            case '_drop_speed_num_':
            case '_drop_range_num_':
              gen_wave_map[ wave_key ] = value_list[ k ] / nMap._100_;
              break;

            default:
              try { gen_wave_map[ wave_key ] = value_list[ k ]; }
              catch ( error_obj ) {
                throw error_obj;
              }
              break;

          }
        }
        gen_wave_list[ vMap._push_ ]( gen_wave_map );
      }
      gen_level_list[ vMap._push_ ]( gen_wave_list );
    }
    stateMap._level_wave_list_ = gen_level_list;
  };
  // END utility method /compileLevelWaveList/

  // BEGIN utility method /addHiScore/
  // Purpose: Add score to hi score list, and then truncate it to
  // the maximum length.  If the added score is in the remaining list,
  // return the position in the list to the caller.
  //
  addHiScore =  function ( score_count, name_str ) {
    var
      score_map = { _score_count_: score_count, _name_str_: name_str },
      hi_score_list = getHiScoreList(),
      score_idx
      ;

    hi_score_list[ vMap._push_ ]( score_map );
    hi_score_list[ vMap._sort_ ]( hiScoreSortFn );
    if ( hi_score_list[ vMap._length_ ] > cfgMap._max_hi_score_int_) {
      hi_score_list[ vMap._length_] = cfgMap._max_hi_score_int_;
    }

    score_idx = hi_score_list[ vMap._indexOf_ ]( score_map );

    stateMap._hi_score_list_ = hi_score_list;
    return score_idx;
  };
  // END utility method /addHiScore/

  // BEGIN utility method /hiScoreSortFn/
  // Purpose: Sort function: hi_score_list.sort( hiScoreSortFn );
  //
  hiScoreSortFn = function ( a_map, b_map ) {
    return b_map._score_count_ - a_map._score_count_;
  };
  // END utility method /hiScoreSortFn/

  // BEGIN utility method /getHiScoreList/
  // Purpose: Get the hi-score list from cache, or local storage.
  //
  getHiScoreList = function () {
    var
      hi_score_list =  stateMap._hi_score_list_,
      store_obj, json_str
      ;

    // Return cache results if found
    if ( hi_score_list) { return hi_score_list; }

    // Otherwise, look at local storage...
    store_obj = fMap._localStorage_;

    // If no local storage, set to empty array ...
    if ( ! store_obj ) { hi_score_list = []; }

    // If list not yet defined (e.g. not an empty array)
    // then try to the serialized list from local storage
    //
    if ( ! hi_score_list ) {
      json_str = store_obj[ cfgMap._storage_key_ ];
      // If the serialization is empty, set to empty array
      if ( ! json_str ) { hi_score_list = []; }
    }

    // If list not yet defined (e.g. json_str is valid),
    // parse the json_str and sort the resulting list.
    //
    if ( ! hi_score_list ) {
      hi_score_list = fMap._json_parse_( json_str );
      if ( tb._getVarType_( hi_score_list ) !== '_Array_' ) {
        hi_score_list = [];
      }
    }

    // Sort the list and store it in state map
    hi_score_list[ vMap._sort_ ]( hiScoreSortFn );
    stateMap._hi_score_list_ = hi_score_list;

    storeHiScoreList();

    return hi_score_list;
  };
  // END utility method /getHiScoreList/

  // BEING utility method /storeHiScoreList/
  storeHiScoreList = function () {
    var
      hi_score_list = stateMap._hi_score_list_,
      store_obj = fMap._localStorage_
      ;

    if ( ! ( hi_score_list && store_obj ) ) { return vMap._false_; }

    store_obj[ cfgMap. _storage_key_ ] = fMap._json_stringfy_( hi_score_list );
    return vMap._true_;
  };
  // END utility method /storeHiScoreList/


  // BEGIN utility method /initGameVals/
  // Purpose: Initializes values for the start of a game
  //
  initGameVals = function ( start_level_idx ) {
    var init_map, field_list, field_name, list_count, i;

    init_map   = cfgMap._init_map_;
    field_list = fMap._Object_[ vMap._keys_ ]( init_map );
    list_count = field_list[ vMap._length_ ];

    for ( i = __0; i < list_count; i++ ) {
      field_name = field_list[ i ];
      stateMap[ field_name ] = init_map[ field_name ];
    }
    if ( start_level_idx ) {
      stateMap._level_count_ = start_level_idx;
      stateMap._score_count_ = cfgMap._level_score_int_ * start_level_idx;
    }
    for ( i = __0; i < list_count; i++ ) {
      field_name = field_list[ i ];
      __$pub( '_update_field_', {
        _field_name_: field_name,
        _field_val_ : stateMap[ field_name ]
      });
    }
  };
  // END utility method /initGameVals/

  // BEGIN utility method /makeTimeStamp/
  makeTimeStamp = function () { return +new Date(); };
  // END utility method /makeTimeStamp/

  // BEGIN utility method /runTimeTick/
  // Purpose: Execute all game-based periodic actions.
  //   This function calls itself with time adjustments
  //   to ensure appropriate frame pacing
  //
  runTimeTick = (function () {
    var tick_ms, run_fn;

    run_fn = function () {
      var
        mode_str = stateMap._mode_str_,
        new_ms, elapsed_ms, adj_ticktime_ms;

      // do not run if not in game mode
      if ( mode_str !== '_play_') { return; }

      bombMgrObj._updateBombList_();
      new_ms = makeTimeStamp();

      elapsed_ms = tick_ms > __0
        ? new_ms - tick_ms
        : __0;

      // Compensate for elapsed time since the last invocation
      adj_ticktime_ms = cfgMap._timetick_ms_ - elapsed_ms;

      stateMap._tick_toid_ = __setTo( run_fn, adj_ticktime_ms );
      tick_ms = new_ms;
    };
    return run_fn;
  }());
  // END utility method /runTimeTick/
  /********************* END UTILITY METHODS ******************/

  /******************** BEGIN UTILITY OBJECTS *****************/
  // BEGIN utility object /bombMgrObj/
  bombMgrObj = (function () {
    var
      sMap = {
        _addbomb_toid_    : vMap._undef_,
        _bomb_list_       : [],
        _bomb_int_        : __0,
        _next_wave_toid_  : vMap._undef_,
        _wave_map_        : vMap._undef_
      },

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
        if ( ! bomb_obj ) { return; }

        stateMap._lives_count_--;
        __$pub( '_bomb_explode_', bomb_obj );
        __$pub( '_update_field_', {
          _field_name_ : '_lives_count_',
          _field_val_  :  stateMap._lives_count_
        });

        if ( stateMap._lives_count_ < __1 ) {
          stopGame();
        }
      },
      _move_ :  function () {
        this._y_ratio_ += this._delta_y_num_;
        if ( this._y_ratio_ < __0 ) {
          this._explode_();
          return;
        }
        __$pub( '_bomb_move_', this );
      }
    };

    addBomb = function () {
      var
        wave_map, label_str, speed_ratio,
        drop_speed, x_ratio, bomb_obj, bomb_list, big_bomb
        ;

      if ( Math.random() > 0.7 ) {
        big_bomb = true;
      }
      else {
        big_bomb = false;
      }
      wave_map  = sMap._wave_map_;
      if ( big_bomb ) {
        label_str = tb._model_._data_._getBigBombWord_();
      }
      else {
        label_str = tb._model_._data_._getWord_(
          stateMap._level_count_, stateMap._weight_ratio_
        );
      }
      x_ratio     = nMap._d16_ + nMap._d66_ * fMap._rnd_();
      speed_ratio = fMap._rnd_();
      drop_speed  = wave_map._drop_speed_num_
        - ( wave_map._drop_range_num_ * speed_ratio );
      drop_speed  = -drop_speed;

      bomb_obj = tb._createObj_( bombProto );


      bomb_obj._is_big_bomb_ = false;
      bomb_obj._id_          = 'bb' + __Str( sMap._bomb_int_ );
      bomb_obj._y_ratio_     = __1;
      bomb_obj._delta_y_num_ = drop_speed;
      bomb_obj._x_ratio_     = x_ratio;
      bomb_obj._speed_ratio_ = speed_ratio;
      bomb_obj._label_str_   = label_str || vMap._blank_;
      if( big_bomb ) {
        bomb_obj._is_big_bomb_ = true;
      }
      sMap._bomb_int_++;

      bomb_list = sMap._bomb_list_;
      bomb_list[ vMap._push_ ]( bomb_obj );

      __$pub( '_bomb_init_', bomb_obj );
      __$pub( '_bomb_move_', bomb_obj );
      sMap._addbomb_toid_ = vMap._undef_;
    };

    doNextWave = function () {
      stateMap._match_count_ = __0;
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
        stateMap._match_count_ += __1;
        __$pub( '_bomb_destroy_', bomb_obj );
        __$pub( '_update_field_', {
          _field_name_ : '_score_count_',
          _field_val_  : stateMap._score_count_
        });
      }

      if ( stateMap._match_count_ < wave_map._match_goal_int_ ) { return; }

      // Fire off new level or wave if all bombs are cleared
      //
      level_count = stateMap._level_count_;
      wave_count  = stateMap._wave_count_;
      __$pub( '_wave_complete_', [ level_count, wave_count ] );

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
        wave_count = __0;

        if ( level_wave_list[ level_count + __1 ] ) {
          level_count++;
        }
        else {
          //noinspection MagicNumberJS
          stateMap._weight_ratio_ += 0.2;
        }

        next_wave_map = level_wave_list[ level_count ][ wave_count ];

        stateMap._wave_count_  = wave_count;
        stateMap._level_count_ = level_count;
        sMap._wave_map_ = next_wave_map;
        pause_ms        = cfgMap._level_pause_ms_;
        __$pub( '_update_field_', {
          _field_name_ : '_level_count_',
          _field_val_  : level_count
        });
      }

      // Set pause and notify gui
      //
      sMap._next_wave_toid_ = __setTo( doNextWave, pause_ms);
    };

    clearBombList = function () {
      __$pub( '_bomb_allclear_' );
      sMap._bomb_list_[ vMap._length_ ] = __0;
      if ( sMap._addbomb_toid_ ) {
        __clearTo( sMap._addbomb_toid_ );
        sMap._addbomb_toid_ = vMap._undef_;
      }
    };

    getBombByKey = function ( bomb_key, bomb_val, do_delete ) {
      var idx, bomb_list, bomb_list_count, bomb_obj, found_obj;

      bomb_list = sMap._bomb_list_;
      bomb_list_count = bomb_list[ vMap._length_ ];
      for ( idx = __0; idx < bomb_list_count; idx++ ) {
        bomb_obj = bomb_list[ idx ];
        if ( bomb_obj[ bomb_key ] === bomb_val ) {
          found_obj = bomb_obj;
          break;
        }
      }
      if ( found_obj && do_delete ) {
        bomb_list[ vMap._splice_ ]( idx, __1 );
      }
      return found_obj;
    };

    getBombCount = function () {
      return sMap._bomb_list_[ vMap._length_ ];
    };

    // '_onscreen_count_',     // how many bombs to try to keep onscreen
    // '_word_complex_idx_',   // how difficult the words should be (0-5?)
    // '_drop_speed_num_',     // max drop speed in percent of screen height
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
      for ( idx = __0; idx < bomb_count; idx++ ) {
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
  /********************* END UTILITY OBJECTS ******************/

  /******************* BEGIN PUBLIC METHODS *******************/
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

      // Do not handle if not in game.
      // TODO: when not in game, pass the key press to another routine
      // that will allow user to press 'i' for instructions, etc.
      //
      if ( stateMap._mode_str_ !== '_play_' ) { return vMap._false_; }

      // get typebox content and length
      typebox_str = stateMap._typebox_str_;
      type_length = typebox_str[ vMap._length_ ];

      // clear default text if present
      if ( typebox_str === cfgMap._init_map_._typebox_str_ ) {
        typebox_str = '';
        type_length = __0;
      }

      // prevent duplicate spaces
      if ( key_code === spc_code ) {
        end_idx = type_length - nMap._n1_;
        if ( typebox_str[ vMap._charAt_ ]( end_idx ) === ' ' ) {
          return vMap._true_;
        }
      }

      // handle character codes
      switch( key_code ) {
        case bkspc_code :
          if ( type_length > __0 ) {
            type_length--;
            resp_name = '_bkspc_';
          }
          break;

        case return_code :
          if ( type_length > __0 ) {
            bombMgrObj._checkBombDestroy_( typebox_str );
            typebox_str = '';
            type_length = __0;
            resp_name = '_returnd_';
          }
          break;

        default : // everything else
          typebox_str += __Str[ vMap._fromCharCode_ ]( key_code );
          type_length = typebox_str[ vMap._length_ ];
          resp_name = '_char_add_';
          break;
      }

      if ( type_length > cfgMap._max_typebox_int_ ) {
        type_length = cfgMap._max_typebox_int_;
        __$pub( '_acknowledge_key_', [ '_at_limit_' ]);
        return false;
      }

      // display revised string if needed
      typebox_str = typebox_str[ vMap._substring_]( __0, type_length );

      if ( typebox_str === stateMap._typebox_str_ ) {
        return false;
      }

      __$pub( '_update_field_', {
        _field_name_ : '_typebox_str_',
        _field_val_  : typebox_str + '|'
      });

      __$pub( '_acknowledge_key_', resp_name );
      stateMap._typebox_str_  = typebox_str;
      return vMap._true_;
    };

    return report_keypress;
  }());
  // END public method /reportKeyPress/

  // BEGIN public method /stopGame/
  stopGame = function () {
    var score_count, hi_score_list, hi_score_idx;

    if ( stateMap._tick_toid_ ) {
      __clearTo( stateMap._tick_toid_ );
      stateMap._tick_toid_ = vMap._undef_;
    }
    score_count  = stateMap._score_count_;

    bombMgrObj._clearBombList_();

    __$pub( '_bomb_allclear_' );

    hi_score_idx  = addHiScore( score_count, '' );
    hi_score_list = stateMap._hi_score_list_;

    if ( hi_score_idx > nMap._n1_ ) {
      hi_score_list = getHiScoreList();
      setModeAdd( hi_score_list, hi_score_idx );
    }
    else {
      setModeSell();
    }
  };
  // END public method /stopGame/

  // BEGIN public method /startGame/
  startGame = function ( level_count ) {
    if ( stateMap._mode_str_ !== '_sell_' ) { return; }

    if ( stateMap._level_wave_list_ === vMap._undef_ ) {
      compileLevelWaveList();
    }

    stateMap._level_count_   = level_count;
    stateMap._wave_count_    = __0;
    stateMap._weight_ratio_  = __0;

    setModePlay( level_count );
  };
  // END public method /startGame/

  // BEGIN public method /initModule/
  initModule = function () {
    tb._model_._data_._initModule_();
    stateMap._level_count_ = __0;

    initGameVals();
    __$pub( '_acknowledge_init_' );
    setModeSell();
  };
  // END public method /initModule/

  return {
    _initModule_     : initModule,
    _stopGame_       : stopGame,
    _startGame_      : startGame,
    _reportKeyPress_ : reportKeyPress
  };
  /******************** END PUBLIC METHODS ********************/
}());
// END tb._model_
