/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true,    bitwise : true
*/

/*global $, tb:true*/
'use strict';
//noinspection MagicNumberJS
var tb = {
  _smap_ : {
    _blank_   : '',
    _false_   : false,
    _hide_    : 'hide',
    _keys_    : 'keys',
    _length_  : 'length',
    _show_    : 'show',
    _true_    : true,
    _undef_   : undefined
  },
  _nmap_ : {
    _0_    : 0  |0, // cast as integers
    _1_    : 1  |0,
    _3_    : 3  |0,
    _5_    : 5  |0,
    _6_    : 6  |0,
    _8_    : 8  |0,
    _13_   : 13 |0,
    _20_   : 20 |0,
    _22_   : 22 |0,
    _32_   : 32 |0,
    _50_   : 50 |0,

    _9d99_ : 9.99
  },
  _fmap_ : {
    _floor_ : Math.floor,
    _rnd_   : Math.random
  }
};
