/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
*/
/*global $, tb, Audio*/

// BEGIN tb._shell_
tb._shell_ = (function () {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  'use strict';
  var
    fMap     = tb._fMap_,
    nMap     = tb._nMap_,
    vMap     = tb._vMap_,
    __setTo  = fMap._setTo_,
    cfgMap = {
      _main_html_ : vMap._blank_
        + '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
          + 'class="tb-_shell-bg-svg_"'
          + 'viewbox="0 0 100 100" preserveAspectRatio="none">'
          + '<path d="M 0,0 40,100 0,100 M 100,0 60,100 100,100"></path>'
        + '</svg>'
        + '<div class="tb-_shell-title_">TypeB<span>o</span>mb</div>'
        + '<div class="tb-_shell-subtext_"></div>'
        + '<div class="tb-_shell-hi_score_">High Score</div>'
        + '<div class="tb-_shell-level_">'
          + '<div class="tb-_shell-level-label_">Level</div>'
          + '<div class="tb-_shell-level-count_"></div>'
        + '</div>'
        + '<div class="tb-_shell-lives_">'
          + '<div class="tb-_shell-lives-count_"></div>'
          + '<div class="tb-_shell-lives-gfx_"></div>'
        + '</div>'
        + '<div class="tb-_shell-typebox_"></div>'
        + '<div class="tb-_shell-score_">'
          + '<div class="tb-_shell-score-label_">Score</div>'
          + '<div class="tb-_shell-score-count_"></div>'
        + '</div>',
      _bomb_html_ : vMap._blank_
        + '<div id="%!%_id_%!%" class="tb-_shell-bomb_">'
          + '%!%_label_str_%!%'
        + '</div>',
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
    jqueryMap,
    playSnd,        setJqueryMap,
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
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // BEGIN DOM method /setJqueryMap/
  setJqueryMap = function ( $body ) {
    var
      $hi_score = $body.find( '.tb-_shell-hi_score_' ),
      $level    = $body.find( '.tb-_shell-level_'   ),
      $lives    = $body.find( '.tb-_shell-lives_'   ),
      $score    = $body.find( '.tb-_shell-score_'   ),
      $subtext  = $body.find( '.tb-_shell-subtext_' ),
      $title    = $body.find( '.tb-_shell-title_'   ),
      $sell_fields = $( [
        $hi_score.get( nMap._0_ ),
        $title.get(   nMap._0_ ),
        $subtext.get( nMap._0_ )
      ] );

    jqueryMap = {
      _$body_         : $body,
      _$bg_svg_       : $body.find( '.tb-_shell-bg-svg_' ),
      _$sell_fields_  : $sell_fields,
      _$hi_score_     : $hi_score,
      _$level_        : $level,
      _$level_count_  : $level.find( '.tb-_shell-level-count_'  ),
      _$lives_        : $lives,
      _$lives_count_  : $lives.find( '.tb-_shell-lives-count_'  ),
      _$lives_gfx_    : $lives.find( '.tb-_shell-lives-gfx_'    ),
      _$score_        : $score,
      _$score_count_  : $score.find( '.tb-_shell-score-count_'  ),
      _$subtext_      : $subtext,
      _$title_        : $title,
      _$typebox_      : $body.find(  '.tb-_shell-typebox_'      )
    };
  };
  // END DOM method /setJqueryMap/

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
      if ( snd_count > nMap._0_ ) { return; }// already initialized

      name_count = snd_name_list[ vMap._length_ ];

      for ( i = nMap._0_; i < name_count; i++ ) {
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

      snd_obj.currentTime = nMap._0_;
      snd_obj.play();
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
        jqueryMap._$bg_svg_.css( 'fill', vMap._blank_ );
        return;
      }

      hex_list = [];
      for ( i = nMap._0_ ; i < nMap._3_; i++ ) {
        hex_list.push(
          fMap._floor_(  fMap._rnd_() * nMap._9d99_ )
        );
      }

      hex_str = '#' + hex_list[ vMap._join_ ]( vMap._blank_ );
      jqueryMap._$bg_svg_.css( 'fill', hex_str );
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
    jqueryMap._$lives_count_.text( lives_count );
    for ( i = nMap._0_; i < lives_count; i++ ) {
      lives_list.push( cfgMap._lives_char_code_ );
    }
    lives_str = lives_list[ vMap._join_ ]( vMap._blank_ );
    jqueryMap._$lives_gfx_[ vMap._html_ ]( lives_str );
  };
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // BEGIN browser-event handlers
  onChangeLevel = function ( event_obj ) {
    var level_str = $(this).val();
    event_obj.preventDefault();
    if ( level_str === '--' ) { return; }
    tb._model_._startGame_( level_str );
  };
  onKeypress = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    event_obj.preventDefault();
    tb._model_._reportKeyPress_( key_code );
  };

  onKeydown = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    if ( key_code !== 8 ) { return; }
    event_obj.preventDefault();
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
        jqueryMap._$level_count_.text( fMap._String_( field_val ) );
        break;
      case '_lives_count_' :
        updateLivesCount( field_val );
        break;
      case '_score_count_' :
        jqueryMap._$score_count_.text( fMap._String_( field_val ) );
        break;
      case '_typebox_str_' :
        jqueryMap._$typebox_.text( field_val );
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
        for ( i = nMap._0_; i < all_level_count; i++ ) {
          val_list.push( i );
        }

        opt_html = tb._makeOptHtml_( '--', val_list );

        jqueryMap._$subtext_.html(
          cfgMap._start_html_ + ' <select>' + opt_html + '</select>'
        );
        jqueryMap._$subtext_.find( 'select' ).on( 'change', onChangeLevel );
        jqueryMap._$sell_fields_[ vMap._show_ ]();
        break;

      case '_play_' :
        jqueryMap._$sell_fields_[ vMap._hide_ ]();
        break;

      case '_add_' :
        jqueryMap._$hi_score_.html(
          'You have placed ' + fMap._String_( arg_map._hi_score_idx_ + 1 )
          + ' on the hi-score list!<br/>\n'
          +  fMap._json_stringfy_( arg_map._hi_score_list_ ) + '<br/>'
          + 'Please enter your initials!'
        );
        jqueryMap._$sell_fields_[ vMap._show_ ]();
        break;

      default:
        throw '_unknown_mode_str_' + mode_str;
    }

  };
  onWaveComplete = function ( event_obj, level_count, wave_count ) {
    var msg_str = 'Completed level '
      + fMap._String_( level_count )
      + ' wave '
      + fMap._String_( wave_count );

    jqueryMap._$subtext_
      .text( msg_str )
      .show()
      .fadeOut( nMap._5k_ , function () { $(this).hide(); })
      ;

    playSnd( 'wavechange' );
  };

  onBombInit = function ( event_obj, bomb_obj ) {
    var lookup_map, filled_str, speed_ratio, class_str, $bomb;

    lookup_map = {
      _id_        : cfgMap._bomb_id_prefix_ + bomb_obj._id_,
      _label_str_ : bomb_obj._label_str_
    };

    filled_str = tb._fillTmplt_({
      _tmplt_str_  : cfgMap._bomb_html_,
      _lookup_map_ : lookup_map
    });

    speed_ratio = bomb_obj._speed_ratio_;
    class_str = 'tb-';
    //noinspection NestedConditionalExpressionJS
    class_str += speed_ratio < nMap._d33_ ? '_x-fast_'
      : speed_ratio < nMap._d66_ ? '_x-normal_' : '_x-slow_';

    $bomb = $( filled_str );
    $bomb.addClass( class_str );

    jqueryMap._$body_.append( $bomb );
  };
  onBombMove = function ( event_obj, bomb_obj ) {
    var left_percent, btm_percent, $bomb, css_map;

    $bomb = get$BombById( bomb_obj._id_ );
    if ( ! $bomb ) { return false; }

    btm_percent  = bomb_obj._y_ratio_ * nMap._100_;
    left_percent = bomb_obj._x_ratio_ * nMap._100_;
    css_map = {
      left   : fMap._String_( left_percent ) + '%',
      bottom : fMap._String_( btm_percent  ) + '%'
    };

    $bomb.css( css_map );
    // console.warn( '_bomb_move_', css_map, $bomb );
  };
  onBombExplode = function ( event_obj, bomb_obj ) {
    var $bomb = get$BombById( bomb_obj._id_ );
    if ( ! $bomb ) { return false; }

    $bomb.remove();
    animateExplode();
    playSnd( 'thunder' );
  };
  onBombAllclear = function ( /* event_obj */ ) {
    var $all_bombs = $( '.tb-_shell-bomb_');
    $all_bombs.remove();
  };
  onBombDestroy = function ( event_obj, bomb_obj ) {
    var
      $bomb = get$BombById( bomb_obj._id_ ),
      animate_map;

    if ( ! $bomb ) { return false; }

    playSnd( 'whoosh' );
    animate_map = {
      opacity : nMap._0_,
      left    : bomb_obj._x_ratio_ < nMap._d5_ ? "-=50%" : '+=50%'
    };

    $bomb.animate(
      animate_map,
      nMap._1k_,
      function () { this.remove(); }
    );
  };
  // END model-event handlers
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // BEGIN public method /initModule/
  initModule = function () {
    var $body = $( 'body' );

    // initialize our styling first
    tb._css_._initModule_();

    $body.html( cfgMap._main_html_ );
    setJqueryMap( $body );

    // BEGIN browser event bindings
    $body.on( 'keypress', onKeypress );
    $body.on( 'keydown',  onKeydown  );
    // END browser event bindings

    // BEGIN model event bindings
    $.gevent.subscribe( $body, '_set_mode_',        onSetMode        );
    $.gevent.subscribe( $body, '_update_field_',    onUpdateField    );
    $.gevent.subscribe( $body, '_acknowledge_key_', onAcknowledgeKey );

    $.gevent.subscribe( $body, '_wave_complete_', onWaveComplete );
    $.gevent.subscribe( $body, '_bomb_init_',     onBombInit     );
    $.gevent.subscribe( $body, '_bomb_move_',     onBombMove     );
    $.gevent.subscribe( $body, '_bomb_explode_',  onBombExplode  );
    $.gevent.subscribe( $body, '_bomb_destroy_',  onBombDestroy  );
    $.gevent.subscribe( $body, '_bomb_allclear_', onBombAllclear );
    // END model event bindings

    // Initialize model *after* we have subscribed all our handlers
    tb._model_._initModule_();
  };
  // END public method /initModule/

  // Start the entire application
  $(function (){ initModule(); });
  //------------------- END PUBLIC METHODS ---------------------
}());
// END tb._shell_
