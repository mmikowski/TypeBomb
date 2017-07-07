# TypeBomb
## Summary
TypeBomb is an update of the classic game used to teach
typing.

## Copyright (c)
2015 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

## Release Notes
0.01 - Initial repository import
0.02 - Code cleanup and documentation

This build requires Perl 5.10+ and the following standard libraries:

- List::Util qw(shuffle);
- List::MoreUtils qw(uniq);
- Data::Dumper;
- File::Slurp;
- Getopt::Mixed;

## Variable name convention reference

```js
  +---------+----------------------+--------------------------+
  | Type    |  Suffix              | Example                  |
  +---------+----------------------+--------------------------+
  | string  | _name _str _id _code | user_name user_id        |
  |         |                      | user_code use_str        |
  +---------+----------------------+--------------------------+
  | number  | _num _ratio          | drop_ratio speed_num     |
  +---------+----------------------+--------------------------+
  | integer | _int _count _idx     | loop_idx bomb_count      |
  +---------+----------------------+--------------------------+
  | boolean | _bool or be_ prefix  | is_big_bomb has_boom     |
  |         |                      | do_big_bomb bomb_bool    |
  +---------+----------------------+--------------------------+
  | array   | _list                | bomb_list                |
  +---------+----------------------+--------------------------+
  | map     | _map                 | animal_map               |
  | maps are objects with properties only, no methods         |
  +---------+----------------------+--------------------------+

  local variables are in snake_case
  module-scope variables are in camelCase
  labels are UPPERCASE:

  Example label use:

  HERD: for ( jdx = 0; jdx < herd_count; jdx++ ) {
    cow_count = cow_obj_list.length;
    COW: for ( idx = 0; idx < cow_count; idx++ ) {
      cow_obj = cow_obj_list[ idx ];
      if ( cow_obj._is_lactating_ ) { continue HERD; }
      // do more shit here
    }
  }

  Always declare all variables at the top of functions to avoid
  hoisting confusion.


  Git structure
  [ Local Files ] => [ Local Repository ] => [ Origin Repo ]

  git fetch                 # refresh list of branches
  git branch -a             # show all branches
  git checkout <branch>     # checkout a branch
  git checkout -b <new>     # create a new branch
  git branch -d <new>       # delete a local branch
  git branch -D <new>       # delete a local branch with changes
  git diff <alt_branch>     # compare with <alt_branch>
  git difftool <alt_branch> # use visual diff to compare branches
```

```js
== DEPENDENCY ORDER (load order) 
   tb.js => tb.util.js* => tb.model.js => tb.model.data.js
         => tb.css.js   => tb.shell.js
            
== CALL and INIT ORDER
   tb.shell.js => tb.css.js   => tb.model.js => tb.model.data.js
               => tb.util.js* => tb.js

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
```


