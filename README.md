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


