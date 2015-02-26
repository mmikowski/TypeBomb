/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
*/
/*global $, tb, Audio*/

tb.shell = (function () {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  'use strict';
  var
    __setTO = setTimeout,
    cfgMap = {
      _main_html_ : tb._smap_._blank_
        + '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
          + 'class="tb-_shell-bg-svg_"'
          + 'viewbox="0 0 100 100" preserveAspectRatio="none">'
          + '<path d="M 0,0 40,100 0,100 M 100,0 60,100 100,100"></path>'
        + '</svg>'
        + '<div class="tb-_shell-announce_">TypeB<span>o</span>mb</div>'
        + '<div class="tb-_shell-subtext_">subtext</div>'
        + '<div class="tb-_shell-hiscore_">hi-score</div>'
        + '<div class="tb-_shell-level_">'
          + '<div class="tb-_shell-level-label_">Level</div>'
          + '<div class="tb-_shell-level-count_"></div>'
        + '</div>'
        + '<div class="tb-_shell-lives_">'
          + '<div class="tb-_shell-lives-count_"></div>'
          + '<div class="tb-_shell-lives-gfx_"></div>'
        + '</div>'
        + '<div class="tb-_shell-start_">'
          + '<div class="tb-_shell-start-label_"></div>'
          + '<div class="tb-_shell-start-select_"></div>'
          + '<div class="tb-_shell-start-btn_"></div>'
        + '</div>'
        + '<div class="tb-_shell-typebox_"></div>'
        + '<div class="tb-_shell-score_">'
          + '<div class="tb-_shell-score-label_">Score</div>'
          + '<div class="tb-_shell-score-count_"></div>'
        + '</div>',
      _life_char_code_ : '&#9825;',
      _key_sound_map_ : {
        _bkspc_     : 'clack',
        _returnd_   : 'kick',
        _char_add_  : 'click',
        _at_limit_  : 'honk'
      }
    },
    jqueryMap,
    playSnd, setJqueryMap, animateExplode,

    onKeypress, onKeydown,
    onAcknowledgeKey, onUpdateLevel, onUpdateLives,
    onUpdateScore, onUpdateTypebox,

    initModule
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function ( $body ) {
    var
      $level = $body.find( '.tb-_shell-level_' ),
      $lives = $body.find( '.tb-_shell-lives_' ),
      $score = $body.find( '.tb-_shell-score_' )
      ;

    jqueryMap = {
      _$body_        : $body,
      _$bg_svg_      : $body.find( '.tb-_shell-bg-svg_' ),
      _$level_       : $level,
      _$level_count_ : $level.find( '.tb-_shell-level-count_' ),
      _$lives_       : $lives,
      _$lives_count_ : $lives.find( '.tb-_shell-lives-count_' ),
      _$lives_gfx_   : $lives.find( '.tb-_shell-lives-gfx_'   ),
      _$score_       : $score,
      _$score_count_ : $score.find( '.tb-_shell-score-count_' ),
      _$type_box_    : $body.find(  '.tb-_shell-typebox_'     )
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /playSnd/
  playSnd = (function () {
    var
      snd_name_list, snd_count, snd_obj_map,
      init_snd, play_sound;

    // Begin playSnd data
    snd_name_list = [ 'clack','click','honk','kick','thunder','wind' ];
    snd_obj_map = {};
    // End playSnd data

    // Begin init_snd
    init_snd = function () {
      var i, name_count, snd_name;
      if ( snd_count > 0 ) { return; }// already initialized

      name_count = snd_name_list[ tb._smap_._length_ ];

      for ( i = tb._nmap_._0_; i < name_count; i++ ) {
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
        console.warn( 'Snd name not known' );
        return false;
      }

      snd_obj.currentTime = tb._nmap_._0_;
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
      if ( flash_count === tb._smap_._undef_ ) { flash_count = tb._nmap_._20_; }
      flash_count--;
      if ( flash_count < tb._nmap_._1_ ) {
        flash_count = tb._smap_._undef_;
        jqueryMap._$bg_svg_.css( 'fill', tb._smap_._blank_ );
        return;
      }

      hex_list = [];
      for ( i = tb._nmap_._0_ ; i < tb._nmap_._3_; i++ ) {
        hex_list.push(
          tb._fmap_._floor_(  tb._fmap_._rnd_() * tb._nmap_._9d99_ )
        );
      }

      hex_str = '#' + hex_list.join( tb._smap_._blank_ );
      jqueryMap._$bg_svg_.css( 'fill', hex_str );
      //noinspection DynamicallyGeneratedCodeJS
      __setTO( animate_explode, tb._nmap_._50_ );
    };
    return animate_explode;
  }());
  // End DOM method /animateExplode/

  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin browser-event handlers
  onKeypress = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    event_obj.preventDefault();
    tb.model._reportKeyPress_( key_code );
  };

  onKeydown = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    if ( key_code !== 8 ) { return; }
    event_obj.preventDefault();
    tb.model._reportKeyPress_( key_code );
  };
  // End browser-event handlers

  // Begin model-event handlers
  onAcknowledgeKey = function ( event, key_name ) {
    var snd_name = cfgMap._key_sound_map_[ key_name ];
    playSnd( snd_name );
    if ( key_name === '_returnd_' ) {
      animateExplode();
      playSnd( 'thunder' );
    }
  };
  onUpdateLevel = function ( event, level_count ) {
    jqueryMap._$level_count_.text( String( level_count ) );
  };
  onUpdateLives = function ( event, lives_count ) {
    var i, life_list = [], lives_str;
    jqueryMap._$lives_count_.text( lives_count );
    for ( i = tb._nmap_._0_; i < lives_count; i++ ) {
      life_list.push( cfgMap._life_char_code_ );
    }
    lives_str = life_list.join( tb._smap_._blank_ );
    jqueryMap._$lives_gfx_.html( lives_str );
  };
  onUpdateScore = function ( event, score_count ) {
    jqueryMap._$score_count_.text( String( score_count ) );
  };
  onUpdateTypebox = function ( event, typebox_str ) {
    jqueryMap._$type_box_.text( typebox_str );
  };
  // End model-event handlers
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Shell public method /initModule/
  initModule = function () {
    var $body = $( 'body' );
    $body.html( cfgMap._main_html_ );
    setJqueryMap( $body );

    // Begin Shell browser event bindings
    $body.on( 'keypress', onKeypress );
    $body.on( 'keydown',onKeydown );
    // End Shell browser event bindings

    // Begin Shell model event bindings
    $.gevent.subscribe( $body, '_acknowledge_key_', onAcknowledgeKey );
    $.gevent.subscribe( $body, '_update_level_',    onUpdateLevel    );
    $.gevent.subscribe( $body, '_update_lives_',    onUpdateLives    );
    $.gevent.subscribe( $body, '_update_score_',    onUpdateScore    );
    $.gevent.subscribe( $body, '_update_typebox_',  onUpdateTypebox  );
    // End Shell model event bindings

    // Initialize model
    tb.model._initModule_();
  };
  // End Shell public method /initModule/
  return {
    _initModule_     : initModule,
    _animateExplode_ : animateExplode
  };
  //------------------- END PUBLIC METHODS ---------------------
}());
