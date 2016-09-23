/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
*/
/*global $, tb, Audio*/

// BEGIN tb._shell_
tb._shell_ = (function () {
  /***************** BEGIN MODULE SCOPE VARIABLES **************/
  'use strict';
  var
    fMap       = tb._fMap_,
    nMap       = tb._nMap_,
    vMap       = tb._vMap_,

    __0        = nMap._0_,

    __Str      = fMap._String_,
    __setTo    = fMap._setTo_,
    __$sub     = $[ vMap._gevent_ ][ vMap._subscribe_],

    cfgMap = {
      _main_html_ : vMap._blank_
        + '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
          + 'class="tb-_shell_bg_svg_"'
          + 'viewbox="0 0 100 100" preserveAspectRatio="none">'
          + '<path d="M 0,0 40,100 0,100 M 100,0 60,100 100,100"></path>'
        + '</svg>'
        + '<div class="tb-_shell_title_">TypeB'
          + '<span class="tb-_x_down_">o</span>mb'
          + '<span class="tb-_x_greeny_">alpha</span>'
        + '</div>'
        + '<div class="tb-_shell_subtext_"></div>'
        + '<div class="tb-_shell_hi_score_">High Score</div>'
        + '<div class="tb-_shell_level_">'
          + '<div class="tb-_shell_level_label_">Level</div>'
          + '<div class="tb-_shell_level_count_"></div>'
        + '</div>'
        + '<div class="tb-_shell_lives_">'
          + '<div class="tb-_shell_lives_count_"></div>'
          + '<div class="tb-_shell_lives_gfx_"></div>'
        + '</div>'
        + '<div class="tb-_shell_typebox_"></div>'
        + '<div class="tb-_shell_score_">'
          + '<div class="tb-_shell_score_label_">Score</div>'
          + '<div class="tb-_shell_score_count_"></div>'
        + '</div>',
      _bomb_html_ : 
        '<div id="{_id_}" class="tb-_shell_bomb_">{_label_str_}</div>',
      _start_html_ : 'Select start level: ',

      _bomb_id_prefix_ : 'tb-_shell_bomb_-' ,
      _lives_char_code_ : '&#9825;',
      _key_sound_map_ : {
        _bkspc_     : 'clack',
        _returnd_   : 'kick',
        _char_add_  : 'click',
        _at_limit_  : 'honk'
      }
    },
    $Map,
    playSnd,        set$Map,
    animateExplode, get$BombById,
    updateLivesCount,

    onChangeLevel, onKeypress,
    onKeydown,     onAcknowledgeKey,
    onSetMode,     onUpdateField,

    onWaveComplete,

    onBombInit,    onBombMove,
    onBombExplode, onBombDestroy,
    onBombAllclear,

    initModule
    ;
  /****************** END MODULE SCOPE VARIABLES ***************/

  /********************* BEGIN UTILITY METHODS *****************/
  /********************** END UTILITY METHODS ******************/

  /********************** BEGIN DOM METHODS ********************/
  // BEGIN DOM method /set$Map/
  set$Map = function ( $body ) {
    var
      $hi_score = $body[ vMap._find_ ]( '.tb-_shell_hi_score_' ),
      $level    = $body[ vMap._find_ ]( '.tb-_shell_level_'   ),
      $lives    = $body[ vMap._find_ ]( '.tb-_shell_lives_'   ),
      $score    = $body[ vMap._find_ ]( '.tb-_shell_score_'   ),
      $subtext  = $body[ vMap._find_ ]( '.tb-_shell_subtext_' ),
      $title    = $body[ vMap._find_ ]( '.tb-_shell_title_'   ),
      $sell_fields = $( [
        $hi_score[ vMap._get_ ]( __0 ),
        $title[    vMap._get_ ]( __0 ),
        $subtext[  vMap._get_ ]( __0 )
      ] );

    $Map = {
      _$body_         : $body,
      _$bg_svg_       : $body[ vMap._find_ ]( '.tb-_shell_bg_svg_' ),
      _$sell_fields_  : $sell_fields,
      _$hi_score_     : $hi_score,
      _$level_        : $level,
      _$level_count_  : $level[ vMap._find_ ]( '.tb-_shell_level_count_'  ),
      _$lives_        : $lives,
      _$lives_count_  : $lives[ vMap._find_ ]( '.tb-_shell_lives_count_'  ),
      _$lives_gfx_    : $lives[ vMap._find_ ]( '.tb-_shell_lives_gfx_'    ),
      _$score_        : $score,
      _$score_count_  : $score[ vMap._find_ ]( '.tb-_shell_score_count_'  ),
      _$subtext_      : $subtext,
      _$title_        : $title,
      _$typebox_      : $body[ vMap._find_ ](  '.tb-_shell_typebox_'      )
    };
  };
  // END DOM method /set$Map/

  // BEGIN DOM method /playSnd/
  playSnd = (function () {
    var
      snd_name_list, snd_count, snd_obj_map,
      init_snd, play_sound;

    // BEGIN playSnd data
    snd_name_list = [
      'clack','click','honk','kick',
      'thunder','wind','wavechange','whoosh'
    ];
    snd_obj_map = {};
    // END playSnd data

    // BEGIN init_snd
    init_snd = function () {
      var i, name_count, snd_name;
      if ( snd_count > __0 ) { return; }// already initialized

      name_count = snd_name_list[ vMap._length_ ];

      for ( i = __0; i < name_count; i++ ) {
        snd_name = snd_name_list[i];
        snd_obj_map[ snd_name ] = new Audio( 'snd/' + snd_name + '.mp3' );
      }
      snd_count = name_count;
    };
    // END init_snd

    // BEGIN playI
    play_sound = function ( snd_name ) {
      var snd_obj;

      // initialize if required
      if ( ! snd_count ) { init_snd(); }

      snd_obj = snd_obj_map[ snd_name ];
      if ( ! snd_obj ) {
        throw '_snd_name_not_known_';
      }

      snd_obj.currentTime = __0;
      snd_obj[ vMap._play_ ]();
    };
    // END play_sound

    return play_sound;
  }());
  // END DOM method /playSnd/

  // BEGIN DOM method /animateExplode/
  animateExplode = (function () {
    var flash_count, animate_explode;

    animate_explode = function () {
      var hex_list, i, hex_str;
      if ( flash_count === vMap._undef_ ) {
        flash_count = nMap._20_;
      }

      flash_count--;
      if ( flash_count < nMap._1_ ) {
        flash_count = vMap._undef_;
        $Map._$bg_svg_[ vMap._css_ ]( 'fill', vMap._blank_ );
        return;
      }

      hex_list = [];
      for ( i = __0 ; i < nMap._3_; i++ ) {
        hex_list[ vMap._push_ ](
          fMap._floor_(  fMap._rnd_() * nMap._9d99_ )
        );
      }

      hex_str = '#' + hex_list[ vMap._join_ ]( vMap._blank_ );
      $Map._$bg_svg_[ vMap._css_ ]( 'fill', hex_str );
      //noinspection DynamicallyGeneratedCodeJS
      __setTo( animate_explode, nMap._50_ );
    };
    return animate_explode;
  }());
  // END DOM method /animateExplode/

  // BEGIN DOM method /get$BombById/
  get$BombById = function ( bomb_id ) {
    return $( '#' + cfgMap._bomb_id_prefix_+ bomb_id );
  };
  // END DOM method /get$BombById/
  updateLivesCount = function ( lives_count ) {
    var i, lives_list = [], lives_str;
    $Map._$lives_count_[ vMap._text_ ]( lives_count );
    for ( i = __0; i < lives_count; i++ ) {
      lives_list[ vMap._push_ ]( cfgMap._lives_char_code_ );
    }
    lives_str = lives_list[ vMap._join_ ]( vMap._blank_ );
    $Map._$lives_gfx_[ vMap._html_ ]( lives_str );
  };
  /********************** END DOM METHODS **********************/

  /******************** BEGIN EVENT HANDLERS *******************/
  // BEGIN browser-event handlers
  onChangeLevel = function ( event_obj ) {
    var level_str = $(this)[ vMap._val_ ]();
    event_obj[ vMap._preventDefault_ ]();
    if ( level_str === '--' ) { return; }
    tb._model_._startGame_( level_str );
  };

  onKeypress = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    event_obj[ vMap._preventDefault_ ]();
    tb._model_._reportKeyPress_( key_code );
  };

  onKeydown = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    if ( key_code !== 8 ) { return; }
    event_obj[ vMap._preventDefault_ ]();
    tb._model_._reportKeyPress_( key_code );
  };
  // END browser-event handlers

  // BEGIN model-event handlers
  onAcknowledgeKey = function ( event_obj, key_name ) {
    var snd_name = cfgMap._key_sound_map_[ key_name ];
    playSnd( snd_name );
  };

  onUpdateField = function( event_obj, arg_map ) {
    var
      field_name = arg_map._field_name_,
      field_val  = arg_map._field_val_;

    switch ( field_name ) {
      case '_level_count_' :
        $Map._$level_count_[ vMap._text_ ]( __Str( field_val ) );
        break;
      case '_lives_count_' :
        updateLivesCount( field_val );
        break;
      case '_score_count_' :
        $Map._$score_count_[ vMap._text_ ]( __Str( field_val ) );
        break;
      case '_typebox_str_' :
        $Map._$typebox_[ vMap._text_ ]( field_val );
        break;
      case '_match_count_':
      case '_wave_count_':
        break;
      default :
        throw '_unknown_field_update_ ' + field_name;
    }
  };

  onSetMode = function ( event_obj, arg_map ) {
    var
      mode_str = arg_map._mode_str_,
      all_level_count, i, val_list, opt_html;


    switch ( mode_str ) {
      case '_sell_' :
        all_level_count = arg_map._all_level_count_;
        val_list = [ '--' ];
        for ( i = __0; i < all_level_count; i++ ) {
          val_list[ vMap._push_ ]( i );
        }

        opt_html = tb._makeOptHtml_( '--', val_list );

        $Map._$subtext_[ vMap._html_ ](
          cfgMap._start_html_ + ' <select>' + opt_html + '</select>'
        );
        $Map._$subtext_[ vMap._find_ ]( 'select' )[ vMap._on_ ]( 
          vMap._change_, onChangeLevel
        );
        $Map._$sell_fields_[ vMap._show_ ]();
        break;

      case '_play_' :
        $Map._$sell_fields_[ vMap._hide_ ]();
        break;

      case '_add_' :
        $Map._$hi_score_[ vMap._html_ ](
          'You have placed ' + __Str( arg_map._hi_score_idx_ + 1 )
          + ' on the hi-score list!<br/>\n'
          +  fMap._json_stringfy_( arg_map._hi_score_list_ ) + '<br/>'
          + 'Please enter your initials!'
        );
        $Map._$sell_fields_[ vMap._show_ ]();
        break;

      default:
        throw '_unknown_mode_str_' + mode_str;
    }
  };

  onWaveComplete = function ( event_obj, level_count, wave_count ) {
    var msg_str = 'Completed level '
      + __Str( level_count )
      + ' wave '
      + __Str( wave_count );

    $Map._$subtext_[ vMap._text_ ]( msg_str )[ vMap._show_ ](
      )[ vMap._fadeOut_ ](
        nMap._5k_ , function () { $(this)[ vMap._hide_](); }
      );

    playSnd( 'wavechange' );
  };

  onBombInit = function ( event_obj, bomb_obj ) {
    var lookup_map, filled_str, speed_ratio, class_str, $bomb, isBigBomb;

    lookup_map = {
      _id_        : cfgMap._bomb_id_prefix_ + bomb_obj._id_,
      _label_str_ : bomb_obj._label_str_
    };

    filled_str = tb._fillTmplt_({
      _tmplt_str_  : cfgMap._bomb_html_,
      _lookup_map_ : lookup_map
    });

    isBigBomb = bomb_obj._is_big_bomb_;
    speed_ratio = bomb_obj._speed_ratio_;
    class_str = 'tb-';
    //noinspection NestedConditionalExpressionJS
    class_str += isBigBomb === true ? '_x_big_bomb_'
      : speed_ratio < nMap._d33_ ? '_x_fast_'
      : speed_ratio < nMap._d66_ ? '_x_normal_' : '_x_slow_';

    $bomb = $( filled_str );
    $bomb[ vMap._addClass_ ]( class_str );

    $Map._$body_[ vMap._append_ ]( $bomb, null );
  };

  onBombMove = function ( event_obj, bomb_obj ) {
    var left_percent, btm_percent, $bomb, css_map;

    $bomb = get$BombById( bomb_obj._id_ );
    if ( ! $bomb ) { return false; }

    btm_percent  = bomb_obj._y_ratio_ * nMap._100_;
    left_percent = bomb_obj._x_ratio_ * nMap._100_;
    css_map = {
      left   : __Str( left_percent ) + '%',
      bottom : __Str( btm_percent  ) + '%'
    };

    $bomb[ vMap._css_ ]( css_map );
  };

  onBombExplode = function ( event_obj, bomb_obj ) {
    var $bomb = get$BombById( bomb_obj._id_ );
    if ( ! $bomb ) { return false; }

    $bomb[ vMap._remove_ ]();
    animateExplode();
    playSnd( 'thunder' );
  };

  onBombAllclear = function ( /* event_obj */ ) {
    var $all_bombs = $( '.tb-_shell_bomb_');
    $all_bombs[ vMap._remove_ ]();
  };

  onBombDestroy = function ( event_obj, bomb_obj ) {
    var
      $bomb = get$BombById( bomb_obj._id_ ),
      animate_map;

    if ( ! $bomb ) { return false; }

    playSnd( 'whoosh' );
    animate_map = {
      opacity : __0,
      left    : bomb_obj._x_ratio_ < nMap._d5_ ? '-=50%' : '+=50%'
    };

    $bomb[ vMap._animate_ ](
      animate_map,
      nMap._1k_,
      function () { this[ vMap._remove_ ](); }
    );
  };
  // END model-event handlers
  /********************* END EVENT HANDLERS ********************/

  /******************** BEGIN PUBLIC METHODS *******************/
  // BEGIN public method /initModule/
  initModule = function () {
    var $body = $( 'body' );

    // Initialize our styling first
    tb._css_._initModule_();

    // Set up screen
    $body[ vMap._html_ ]( cfgMap._main_html_ );
    set$Map( $body );

    // BEGIN browser event bindings
    $body[ vMap._on_ ]( vMap._keypress_, onKeypress );
    $body[ vMap._on_ ]( vMap._keydown_,  onKeydown  );
    // END browser event bindings

    // BEGIN model event bindings
    __$sub( $body, '_set_mode_',        onSetMode        );
    __$sub( $body, '_update_field_',    onUpdateField    );
    __$sub( $body, '_acknowledge_key_', onAcknowledgeKey );

    __$sub( $body, '_wave_complete_', onWaveComplete );
    __$sub( $body, '_bomb_init_',     onBombInit     );
    __$sub( $body, '_bomb_move_',     onBombMove     );
    __$sub( $body, '_bomb_explode_',  onBombExplode  );
    __$sub( $body, '_bomb_destroy_',  onBombDestroy  );
    __$sub( $body, '_bomb_allclear_', onBombAllclear );
    // END model event bindings

    // Initialize model *after* we have subscribed all our handlers
    tb._model_._initModule_();
  };
  // END public method /initModule/

  // Start the entire application
  $(function (){ initModule(); });
  /******************** END PUBLIC METHODS *********************/
}());
// END tb._shell_


