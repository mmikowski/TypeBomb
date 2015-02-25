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
    cfgMap = {
      main_html : String()
        + '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"'
          + 'class="tb-shell-bg-svg"'
          + 'viewbox="0 0 100 100" preserveAspectRatio="none">'
          + '<path d="M 0,0 40,100 0,100 M 100,0 60,100 100,100"/>'
        + '</svg>'
        + '<div class="tb-shell-announce">TypeB<span>o</span>mb</div>'
        + '<div class="tb-shell-subtext">subtext</div>'
        + '<div class="tb-shell-hiscore">hi-score</div>'
        + '<div class="tb-shell-level">'
          + '<div class="tb-shell-level-label">Level</div>'
          + '<div class="tb-shell-level-count">1</div>'
        + '</div>'
        + '<div class="tb-shell-lives">'
          + '<div class="tb-shell-lives-count">5</div>'
          + '<div class="tb-shell-lives-gfx">&#9825;&#9825;&#9825;&#9825;&#9825;</div>'
        + '</div>'
        + '<div class="tb-shell-start">'
          + '<div class="tb-shell-start-label"></div>'
          + '<div class="tb-shell-start-select"></div>'
          + '<div class="tb-shell-start-btn"></div>'
        + '</div>'
        + '<div class="tb-shell-typebox"><span>Typebox</span></div>'
        + '<div class="tb-shell-score">'
          + '<div class="tb-shell-score-label">Score</div>'
          + '<div class="tb-shell-score-count">105</div>'
        + '</div>',
      key_sound_map : {
        bkspc    : 'clack',
        enterd   : 'kick',
        char_add : 'click',
        at_limit : 'honk'
      }
    },
    jqueryMap,
    playSnd, setJqueryMap,

    onKeypress, onKeydown,
    onAcknowledgeKey, onUpdateTypebox, initModule
    ;
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  //--------------------- END UTILITY METHODS ------------------

  //--------------------- BEGIN DOM METHODS --------------------
  // Begin DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $body = $( document.body );
    jqueryMap = {
      $body     : $body,
      $type_box : $body.find( '.tb-shell-typebox span' )
    };
  };
  // End DOM method /setJqueryMap/

  // Begin DOM method /playSnd/
  playSnd = (function () {
    var
      sndNameList, sndCount, sndObjMap,
      initSnd, playIt;

    // Begin playSnd data
    sndNameList = [ 'clack','click','honk','kick','thunder','wind' ];
    sndObjMap = {};
    // End playSnd data

    // Begin initSnd
    initSnd = function () {
      var i, name_count, snd_name;
      if ( sndCount > 0 ) { return; }// already initialized

      name_count = sndNameList.length;

      for ( i = 0; i < name_count; i++ ) {
        snd_name = sndNameList[i];
        sndObjMap[ snd_name ] = new Audio( 'snd/' + snd_name + '.mp3' );
      }
      sndCount = name_count;
    };
    // End initSnd

    // Begin playIt
    playIt = function ( snd_name ) {
      var snd_obj;

      // initialize if required
      if ( ! sndCount ) { initSnd(); }

      snd_obj = sndObjMap[ snd_name ];
      if ( ! snd_obj ) {
        console.warn( 'Snd name not known' );
        return false;
      }

      snd_obj.currentTime = 0;
      snd_obj.play();
    };
    // End playIt
    return playIt;
  }());
  // End DOM method /playSnd/
  //--------------------- END DOM METHODS ----------------------

  //------------------- BEGIN EVENT HANDLERS -------------------
  // Begin browser-event handlers
  onKeypress = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    event_obj.preventDefault();
    tb.model.reportKeyPress( key_code );
  };

  onKeydown = function ( event_obj ) {
    var key_code = event_obj.keyCode;
    if ( key_code !== 8 ) { return; }
    event_obj.preventDefault();
    tb.model.reportKeyPress( key_code );
  };
  // End browser-event handlers

  // Begin model-event handlers
  onAcknowledgeKey = function ( event, key_name ) {
    var snd_name = cfgMap.key_sound_map[ key_name ];
    playSnd( snd_name );
  };
  onUpdateTypebox = function ( event, typebox_str ) {
    jqueryMap.$type_box.text( typebox_str );
  };
  // End model-event handlers
  //-------------------- END EVENT HANDLERS --------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  // Begin Shell public method /initModule/
  initModule = function () {
    var $body = $( document.body );
    $body.html( cfgMap.main_html );
    setJqueryMap( $body );

    // Begin Shell browser event bindings
    $body.on( 'keypress', onKeypress );
    $body.on( 'keydown',onKeydown );
    // End Shell browser event bindings

    // Begin Shell model event bindings
    $.gevent.subscribe( $body, 'acknowledge_key', onAcknowledgeKey );
    $.gevent.subscribe( $body, 'update_typebox',  onUpdateTypebox );
    // End Shell model event bindings

    // Initialize model
    tb.model.initModule();
  };
  // End Shell public method /initModule/
  return { initModule : initModule };
  //------------------- END PUBLIC METHODS ---------------------
}());

