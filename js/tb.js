/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
*/
/*global $*/

    $(function () {
      "use strict";
      var
        $body         = $(document.body),
        $typeArea     = $body.find( '.tb-shell-typebox' ),
        windSndObj    = new Audio('snd/wind.mp3'),
        thunderSndObj = new Audio('snd/thunder.mp3'),
        kickSndObj    = new Audio('snd/kick.mp3'),
        clickSndObj   = new Audio('snd/click.mp3'),
        delSndObj     = new Audio('snd/clack.mp3'),

        modelObj,

        onKeypress, onKeydown;

      windSndObj.play();

      modelObj = (function () {
        var
          // data
          modelCfgMap, modelStateMap,
          // methods
          initModel, reportKeyPress
          ;


        modelCfgMap = {
          init_area_str : 'Type here ... '
        };

        modelStateMap = {
          type_area_str : ''
        };

        initModel = function () {
          modelStateMap.type_area_str = modelCfgMap.init_area_str;

        }

        reportKeyPress = function ( keyCode ) {
          
        }
        
        return {
          initModel      : initModel,
          reportKeyPress : reportKeyPress
        };

      }());


      onKeypress = function ( event_obj ) {
        var
          key_code    = event_obj.keyCode,
          type_str    = $typeArea.text(),
          type_length = type_str.length;

        // console.log( 'onKeypress_event=', event_obj );
        event_obj.preventDefault();

        // clear default text if present
        if ( type_str === 'Typebox' ) {
          type_str    = '';
          type_length = 0;
        }

        // snip off cursor
        if ( type_length > 0 ) {
          type_length--;
        }

        // handle character codes
        switch( key_code ) {
          // Return
          case 13 :
            kickSndObj.play();
            type_str = '';
            type_length = 0;
            // Here we would check for word match here
          break;

          // Everything else
          default :
            clickSndObj.play();
            type_str = type_str.substr( 0, type_length )
              + String.fromCharCode( key_code );
            type_length = type_str.length;
          break;
        }

        // display revised string
        type_str = type_str.substring( 0, type_length ) + '|';
        $typeArea.text( type_str );

        return;
      };

      onKeydown = function ( event_obj ) {
        var
          type_str, type_length,
          key_code = event_obj.keyCode;

        // console.log( 'onKeydown_event=', event_obj );
        if ( key_code !== 8 ) { return; }

        type_str    = $typeArea.text();
        type_length = type_str.length;

        // snip off cursor
        if ( type_length > 0 ) {
          type_length--;
        }

        // backspace if possible
        if ( type_length > 0 ) {
          type_length--;
          delSndObj.play();
        }

        // display revised string
        type_str = type_str.substring( 0, type_length ) + '|';
        $typeArea.text( type_str );

        return false;
      };

      $body.on( 'keypress', onKeypress );
      $body.on( 'keydown',  onKeydown );

    });
