/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
*/
/*global $, tb, Audio*/

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
        + '<div class="tb-_shell-subtext_">Press Start</div>'
        + '<div class="tb-_shell-hiscore_">High Score</div>'
        + '<div class="tb-_shell-level_">'
          + '<div class="tb-_shell-level-label_">Level</div>'
          + '<div class="tb-_shell-level-count_"></div>'
        + '</div>'
        + '<div class="tb-_shell-lives_">'
          + '<div class="tb-_shell-lives-count_"></div>'
          + '<div class="tb-_shell-lives-gfx_"></div>'
        + '</div>'
        + '<div class="tb-_shell-start_">'
          + '<div class="tb-_shell-start-label_">Start</div>'
          + '<div class="tb-_shell-start-select_"><select><option>1</option><option>2</option><option>3</option></select></div>'
          + '<div class="tb-_shell-start-btn_"></div>'
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

    onKeypress,       onKeydown,
    onAcknowledgeKey, onUpdateIngame,
    onUpdateLevel,    onUpdateLives,
    onUpdateScore,    onUpdateTypebox,

    onBombInit,    onBombMove,
    onBombExplode, onBombDestroy,
    onBombAllclear,

    initModule
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function ( $body ) {
    var
      $hiscore = $body.find( '.tb-_shell-hiscore_' ),
      $level   = $body.find( '.tb-_shell-level_'   ),
      $lives   = $body.find( '.tb-_shell-lives_'   ),
      $score   = $body.find( '.tb-_shell-score_'   ),
      $start   = $body.find( '.tb-_shell-start_'   ),
      $subtext = $body.find( '.tb-_shell-subtext_' ),
      $title   = $body.find( '.tb-_shell-title_'   ),
      $pregame = $( [
        $hiscore.get(0),
        $title.get(0),
        $start.get(0),
        $subtext.get(0)
      ] );

    jqueryMap = {
      _$body_         : $body,
      _$bg_svg_       : $body.find( '.tb-_shell-bg-svg_' ),
      _$pregame_      : $pregame,
      _$hiscore_      : $hiscore,
      _$level_        : $level,
      _$level_count_  : $level.find( '.tb-_shell-level-count_'  ),
      _$lives_        : $lives,
      _$lives_count_  : $lives.find( '.tb-_shell-lives-count_'  ),
      _$lives_gfx_    : $lives.find( '.tb-_shell-lives-gfx_'    ),
      _$score_        : $score,
      _$score_count_  : $score.find( '.tb-_shell-score-count_'  ),
      _$start_        : $start,
      _$start_label_  : $start.find( '.tb-_shell-start-label_'  ),
      _$start_select_ : $start.find( '.tb-_shell-start-select_' ),
      _$subtext_      : $subtext,
      _$title_        : $title,
      _$type_box_     : $body.find(  '.tb-_shell-typebox_'      )
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /playSnd/
  playSnd = (function () {
    var
      snd_name_list, snd_count, snd_obj_map,
      init_snd, play_sound;

    // Begin playSnd data
    snd_name_list = [ 'clack','click','honk','kick','thunder','wind','whoosh' ];
    snd_obj_map = {};
    // End playSnd data

    // Begin init_snd
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
    // End init_snd

    // Begin playI
    play_sound = function ( snd_name ) {
      var snd_obj;

      // initialize if required
      if ( ! snd_count ) { init_snd(); }

      snd_obj = snd_obj_map[ snd_name ];
      if ( ! snd_obj ) {
        console.warn( '_snd_name_not_known_' );
        return false;
      }

      snd_obj.currentTime = nMap._0_;
      snd_obj.play();
    };
    // End play_sound

    return play_sound;
  }());
  // End DOM method /playSnd/

  // Begin DOM method /animateExplode/
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
  // End DOM method /animateExplode/

  // Begin DOM method /get$BombById/
  get$BombById = function ( bomb_id ) {
    return $( '#' + cfgMap._bomb_id_prefix_+ bomb_id );
  };

  // End DOM method /get$BombById/
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin browser-event handlers
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
  // End browser-event handlers

  // Begin model-event handlers
  onAcknowledgeKey = function ( event, key_name ) {
    var snd_name = cfgMap._key_sound_map_[ key_name ];
    playSnd( snd_name );
  };
  onUpdateLevel = function ( event, level_count ) {
    jqueryMap._$level_count_.text( String( level_count ) );
  };
  onUpdateLives = function ( event, lives_count ) {
    var i, lives_list = [], lives_str;
    jqueryMap._$lives_count_.text( lives_count );
    for ( i = nMap._0_; i < lives_count; i++ ) {
      lives_list.push( cfgMap._lives_char_code_ );
    }
    lives_str = lives_list[ vMap._join_ ]( vMap._blank_ );
    jqueryMap._$lives_gfx_[ vMap._html_ ]( lives_str );
  };
  onUpdateIngame = function ( event, is_ingame ) {
    if ( is_ingame ) {
      jqueryMap._$pregame_[ vMap._hide_ ]();
      return;
    }
    jqueryMap._$pregame_[ vMap._show_ ]();
  };
  onUpdateScore = function ( event, score_count ) {
    jqueryMap._$score_count_.text( String( score_count ) );
  };
  onUpdateTypebox = function ( event, typebox_str ) {
    jqueryMap._$type_box_.text( typebox_str );
  };

  onBombInit = function ( event, bomb_obj ) {
    var lookup_map, filled_str;

    lookup_map = {
      _id_        : cfgMap._bomb_id_prefix_ + bomb_obj._id_,
      _label_str_ : bomb_obj._label_str_
    };

    filled_str = tb._fillTmplt_({
      _tmplt_str_  : cfgMap._bomb_html_,
      _lookup_map_ : lookup_map
    });

    jqueryMap._$body_.append( $( filled_str ) );
    // console.warn( '_bomb_init_', bomb_obj );
  };
  onBombMove = function ( event, bomb_obj ) {
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
  onBombExplode = function ( event, bomb_obj ) {
    var $bomb = get$BombById( bomb_obj._id_ );
    if ( ! $bomb ) { return false; }

    $bomb.remove();
    animateExplode();
    playSnd( 'thunder' );
  };
  onBombAllclear = function ( /* event */ ) {
    var $all_bombs = $( '.tb-_shell-bomb_');
    $all_bombs.remove();
  };
  onBombDestroy = function ( event, bomb_obj ) {
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
      nMap._1000_,
      function (){ this.remove(); }
    );
  };
  // End model-event handlers
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Shell public method /initModule/
  initModule = function () {
    var $body = $( 'body' );

    // initialize our styling first
    tb._css_._initModule_();

    $body.html( cfgMap._main_html_ );
    setJqueryMap( $body );

    // Begin Shell browser event bindings
    $body.on( 'keypress', onKeypress );
    $body.on( 'keydown',  onKeydown  );
    // End Shell browser event bindings

    // Begin Shell model event bindings
    $.gevent.subscribe( $body, '_acknowledge_key_', onAcknowledgeKey );
    $.gevent.subscribe( $body, '_update_ingame_',   onUpdateIngame   );
    $.gevent.subscribe( $body, '_update_level_',    onUpdateLevel    );
    $.gevent.subscribe( $body, '_update_lives_',    onUpdateLives    );
    $.gevent.subscribe( $body, '_update_score_',    onUpdateScore    );
    $.gevent.subscribe( $body, '_update_typebox_',  onUpdateTypebox  );

    $.gevent.subscribe( $body, '_bomb_init_',     onBombInit     );
    $.gevent.subscribe( $body, '_bomb_move_',     onBombMove     );
    $.gevent.subscribe( $body, '_bomb_explode_',  onBombExplode  );
    $.gevent.subscribe( $body, '_bomb_destroy_',  onBombDestroy  );
    $.gevent.subscribe( $body, '_bomb_allclear_', onBombAllclear );
    // End Shell model event bindings

    // Initialize model after we hook up our event handlers
    tb._model_._initModule_();
  };
  // End Shell public method /initModule/

  // Start the entire application
  $(function (){ initModule(); });
  //------------------- END PUBLIC METHODS ---------------------
}());
