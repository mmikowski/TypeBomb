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
        onKeypress, onKeydown,
        $body = $(document.body),
        $typearea = $body.find( '.tb-shell-typebox' );

      onKeypress = function ( event_obj ) {
        console.log( 'onKeypress run', event_obj );
        var
          key_code    = event_obj.keyCode,
          type_str    = $typearea.text(),
          type_length = type_str.length;

        // console.log( key_code );
        event_obj.preventDefault();

        // clear default text if present
        if ( type_str === 'Type here...' ) {
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
            type_str = '';
            type_length = 0;
            // Here we would check for word match here
          break;

          // Everything else
          default :
            type_str = type_str.substr( 0, type_length )
              + String.fromCharCode( key_code );
            type_length = type_str.length;
          break;
        }

        type_str = type_str.substring( 0, type_length ) + '|';
        $typearea.text( type_str );

        return;
      };

      onKeydown = function ( event_obj ) {
        console.log( 'onKeydown run' );
        var
          type_str, type_length,
          key_code = event_obj.keyCode;

        if ( key_code !== 8 ) { return; }

        type_str    = $typearea.text();
        type_length = type_str.length;

        // snip off cursor
        if ( type_length > 0 ) {
          type_length--;
        }

        // backspace if possible
        if ( type_length > 0 ) {
          type_length--;
        }

        type_str = type_str.substring( 0, type_length ) + '|';
        $typearea.text( type_str );

        return false;
      };

      $body.on( 'keypress', onKeypress );
      $body.on( 'keydown',  onKeydown );

    });
