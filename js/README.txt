            DEPENDENCY ORDER (load order) 
                  DATA FLOW
                    tb.js
                      V
                  tb.util.js*
                      V
                  tb.model.js   <== tb.model.data.js
                      V
             tb.css.js tb.shell.js
            
                  ==========

                  CALL ORDER
             tb.css.js tb.shell.js
                      V
                  tb.model.js   ==> tb.model.data.js
                      V
                  tb.util.js*
                      V
                    tb.js

* tb.util.js is combined with tb.js 


              INITIALIZATION ORDER
                 tb.shell.js  => tb.css.js
                      V
                  tb.model.js   ==> tb.model.data.js
                      V
                  tb.util.js*
                      V
                    tb.js


HOWTO add special bombs:

1. In model.data in getWord method, return not only the word, but it's level
of diffuculty.
2. In the model, in addBomb method, inspect difficutly, and if difficult
enough and no other big bombs on the board, and reasonable other constraints,
then make this a "bigBomb" by adding set _is_big_bomb_ : true;

PREFERRED ALT: 
1 + 2: In the model in the addBomb method, at random time with enough lead time
and and no other big bombs on the board, and reasonable other constraints, 
request a bigBomb word from model.data an then make this a "bigBomb" by adding set
_is_big_bomb_ : true;
We may also set velocity and other attributes special for a big bomb.  Perhaps
it moves Left-Right instead of Top-Bottom
3. In the shell, in the initbomb method, will show big_bomb differently when
it sees the bomb_obj._is_big_bomb_ === true!


