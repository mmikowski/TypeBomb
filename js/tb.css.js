/*jslint           browser : true,   continue : true,
 devel   : true,    indent : 2,       maxerr  : 50,
 newcap  : true,     nomen : true,   plusplus : true,
 regexp  : true,      vars : false,    white  : true
 unparam : true,      todo : true
 */
/*global $, tb*/

// BEGIN tb._css_
tb._css_ = (function () {
  //---------------- BEGIN MODULE SCOPE VARIABLES --------------
  'use strict';
  //noinspection MagicNumberJS,NonShortCircuitBooleanExpressionJS
  var
    vMap = tb._vMap_,
    fMap = tb._fMap_,
    nMap = tb._nMap_,
    keyMap, K, valMap, V, cssMap,
    addCssRule, fillSheetObj,
    initModule;

  keyMap = {
    _background_color_ : 'background-color',
    _border_           : 'border',
    _border_color_     : 'border-color',
    _border_bottom_    : 'border-bottom',
    _border_top_       : 'border-top',
    _border_left_      : 'border-left',
    _border_radius_    : 'border-radius',
    _bottom_           : 'bottom',
    _box_shadow_       : 'box-shadow',
    _box_sizing_       : 'box-sizing',
    _clip_             : 'clip',
    _color_            : 'color',
    _display_          : 'display',
    _fill_             : 'fill',
    _float_            : 'float',
    _font_family_      : 'font-family',
    _font_size_        : 'font-size',
    _font_style_       : 'font-style',
    _font_weight_      : 'font-weight',
    _height_           : 'height',
    _left_             : 'left',
    _line_height_      : 'line-height',
    _margin_           : 'margin',
    _margin_left_      : 'margin-left',
    _margin_right_     : 'margin-right',
    _min_height_       : 'min-height',
    _min_width_        : 'min-width',
    _overflow_         : 'overflow',
    _padding_          : 'padding',
    _position_         : 'position',
    _right_            : 'right',
    _stroke_           : 'stroke',
    _stroke_width_     : 'stroke_width',
    _text_align_       : 'text-align',
    _text_decoration_  : 'text-decoration',
    _text_indent_      : 'text-indent',
    _top_              : 'top',
    _vertical_align_   : 'vertical-align',
    _width_            : 'width',

    __moz_box_sizing_  : '-moz-box-sizing',
    __webkit_user_select_ : '-webkit-user-select',
    __khtml_user_select_  : '-khtml-user-select ',
    __moz_user_select_    : '-moz-user-select',
    __o_user_select_      : '-o-user-select',
    __ms_user_select_     : '-ms-user-select',
    _user_select_         : 'user-select',
    __webkit_user_drag_   : '-webkit-user-drag',
    __moz_user_drag_      : '-moz-user-drag',
    _user_drag_           : 'user-drag',

    __webkit_tap_highlight_color_ : '-webkit-tap-highlight-color',
    __webkit_touch_callout_       : '-webkit-touch-callout'
  };
  K = keyMap;

  valMap = {
    _0_            : '0',
    _100p_         : '100%',
    _14px_         : '14px',
    _1em_          : '1em',
    _1d5em_        : '1.5em',
    _1d6em_        : '1.6em',
    _20p_          : '20%',
    _2em_          : '2em',
    _2d5em_        : '2.5em',
    _36p_          : '36%',
    _3em_          : '3em',
    _3d2em_        : '3.2em',
    _3d5em_        : '3.5em',
    _40p_          : '40%',
    _4em_          : '4em',
    _50em_         : '50em',
    _50p_          : '50%',
    _56p_          : '56%',
    _5em_          : '5em',
    _6em_          : '6em',
    _800_          : '800',
    _8em_          : '8em',
    __moz_none_    : '-moz-none',
    _absolute_     : 'absolute',
    _auto_         : 'auto',
    _block_        : 'block',
    _border_box_   : 'border-box',
    _center_       : 'center',
    _fixed_        : 'fixed',
    _hidden_       : 'hidden',
    _inherit_      : 'inherit',
    _left_         : 'left',
    _n10p_         : '-10%',
    _n18p_         : '-18%',
    _n20p_         : '-20%',
    _n28p_         : '-28%',
    _none_         : 'none',
    _d5em_         : '.5em',
    _right_        : 'right',
    _sub_          : 'sub',
    _text_         : 'text',
    _transparent_  : 'transparent',
    _x666_         : '#666',
    _x800_         : '#800',
    _x999_         : '#999',
    _xaaa_         : '#aaa',
    _xccc_         : '#ccc',
    _xc00_         : '#c00',
    _xddd_         : '#ddd',
    _xee8_         : '#ee8',

    _shadow_med_dark_str_ : '#444 0 0 0.2em 0',
    _shadow_white_str_    : '#fff 0 0 0 0.33em',
    _typebox_border_      : '0.25em solid #080',
    _2em_2em_d5em_d5em_   : '2em 2em 0 0',
    _1px_solid_xaaa_      : '1px solid #aaa',
    _std_font_face_       : 'arial,helvetica,sans-serif'
  };

  V      = valMap;
  cssMap = {
    _base_map_ : {
      '*' : {
        _box_sizing_       : V._border_box_,
        __moz_box_sizing_  : V._border_box_,
        _float_            : V._none_,
        _margin_           : V._0_,
        _clip_             : V._auto_,
        _border_           : V._0_,
        _height_           : V._auto_,
        _width_            : V._auto_,
        _padding_          : V._0_,
        _text_align_       : V._left_,
        _text_indent_      : V._0_,
        _line_height_      : V._inherit_,
        _vertical_align_   : V._inherit_,
        _font_family_      : V._inherit_,
        _font_size_        : V._inherit_,
        _font_weight_      : V._inherit_,
        _font_style_       : V._inherit_,
        _text_decoration_  : V._inherit_,
        _color_            : V._inherit_,
        _background_color_ : V._transparent_,

        __webkit_user_select_   : V._none_,
        __khtml_user_select_    : V._none_,
        __moz_user_select_      : V.__moz_none_,
        __o_user_select_        : V._none_,
        __ms_user_select_       : V._none_,
        _user_select_           : V._none_,

        __webkit_user_drag_     : V._none_,
        __moz_user_drag_        : V._none_,
        _user_drag_             : V._none_,

        __webkit_tap_highlight_color_ : V._transparent_,
        __webkit_touch_callout_ : V._none_
      },
      'input, textarea,.tb-_x-user-select_' : {
        __webkit_user_select_ : V._text_,
        __khtml_user_select_  : V._text_,
        __moz_user_select_    : V._text_,
        __o_user_select_      : V._text_,
        __ms_user_select_     : V._text_,
        _user_select_         : V._text_
      },
      'body' : {
        _position_    : V._absolute_,
        _min_width_   : V._50em_,
        _min_height_  : V._50em_,
        _top_         : V._0_,
        _bottom_      : V._0_,
        _left_        : V._0_,
        _right_       : V._0_,
        _font_size_   : V._14px_,
        _font_family_ : V._std_font_face_,
        _overflow_    : V._hidden_
      },
      '.tb-_shell-title_, .tb-_shell-subtext_' : {
        _display_     : V._block_,
        _position_    : V._absolute_,
        _left_        : V._50p_,
        _width_       : V._56p_,
        _margin_left_ : V._n28p_,
        _text_align_  : V._center_,
        _font_weight_ : V._800_
      },
      '.tb-_shell-title_ span' : {
        _vertical_align_ : V._sub_,
        _color_          : V._xc00_
      },
      '.tb-_shell-title_' : {
        _font_size_ : V._4em_,
        _top_       : V._1em_,
        _color_     : V._xaaa_
      },
      '.tb-_shell-subtext_' : {
        _font_size_ : V._3em_,
        _top_       : V._3d5em_,
        _color_     : V._x999_
      },
      '.tb-_shell-hiscore_' : {
        _display_     : V._block_,
        _position_    : V._absolute_,
        _left_        : V._50p_,
        _width_       : V._36p_,
        _margin_left_ : V._n18p_,
        _padding_     : V._d5em_,
        _font_size_   : V._2em_,
        _top_         : V._8em_,
        _text_align_  : V._center_
      },
      '.tb-_shell-level_' : {
        _display_     : V._block_,
        _position_    : V._absolute_,
        _font_size_   : V._2em_,
        _bottom_      : V._4em_,
        _left_        : V._1em_,
        _width_       : V._6em_,
        _height_      : V._2em_,
        _line_height_ : V._2em_,
        _font_weight_ : V._800_,
        _border_bottom_ : V._1px_solid_xaaa_,
        _color_       : V._x666_
      },
      '.tb-_shell-level-label_' : {
        _float_ : V._left_
      },
      '.tb-_shell-level-count_' : {
        _float_ : V._right_
      },
      '.tb-_shell-lives_' : {
        _display_   : V._block_,
        _position_  : V._absolute_,
        _font_size_ : V._2em_,
        _bottom_    : V._1em_,
        _left_      : V._1em_,
        _width_     : V._6em_,
        _height_    : V._2em_,
        _line_height_ : V._2em_,
        _font_weight_ : V._800_,

        _border_bottom_ : V._1px_solid_xaaa_
      },
      '.tb-_shell-lives-count_' : {
        _color_ : V._x666_,
        _float_ : V._right_
      },
      '.tb-_shell-lives-gfx_' : {
        _float_       : V._left_,
        _font_weight_ : V._800_,
        _color_       : V._x800_
      },
      '.tb-_shell-typebox_' : {
        _display_          : V._block_,
        _position_         : V._absolute_,
        _font_size_        : V._2d5em_,
        _bottom_           : V._0_,
        _height_           : V._2d5em_,
        _width_            : V._40p_,
        _line_height_      : V._2em_,
        _left_             : V._50p_,
        _margin_left_      : V._n20p_,
        _border_           : V._typebox_border_,
        _background_color_ : V._xddd_,
        _border_radius_    : V._2em_2em_d5em_d5em_,
        _text_align_       : V._center_,
        _box_shadow_       : V._shadow_white_str_,
        _overflow_         : V._hidden_
      },
      '.tb-_shell-score_' : {
        _display_       : V._block_,
        _position_      : V._absolute_,
        _font_size_     : V._2em_,
        _bottom_        : V._1em_,
        _right_         : V._1em_,
        _width_         : V._5em_,
        _height_        : V._3d2em_,
        _font_weight_   : V._800_,
        _border_bottom_ : V._1px_solid_xaaa_,
        _color_         : V._x666_
      },
      '.tb-_shell-score-label_' : {
        _line_height_: V._1d5em_,
        _text_align_ : V._center_
      },
      '.tb-_shell-score-count_' : {
        _line_height_: V._1d5em_,
        _text_align_ : V._center_
      },
      '.tb-_shell-bg-svg_' : {
        _position_     : V._absolute_,
        _width_        : V._100p_,
        _height_       : V._100p_,
        _fill_         : V._xccc_,
        _stroke_width_ : V._0_,
        _stroke_       : V._xaaa_
      },
      '.tb-_shell-bomb_' : {
        _position_     : V._absolute_,
        _font_size_  : '2.5em',
        _border_       : '.2em solid #ee8',
        _height_       : V._2em_,
        _line_height_  : V._1d6em_,
        _border_radius_: V._d5em_,
        _padding_      : '0 .5em 0 .5em',
        _box_shadow_   : V._shadow_med_dark_str_,
        _color_        : '#fff',
        _background_color_ : '#880'
      },
      '.tb-_x-fast_' : {
        _font_size_  : '3em',
        _color_      : '#fff',
        _background_color_ : '#080',
        _border_color_ : '#0f0'
      },
      '.tb-_x-slow_' : {
        _font_size_    : V._2em_,
        _background_color_ : V._x800_,
        _border_color_ : '#f00'

      }
    }
  };
  //----------------- END MODULE SCOPE VARIABLES ---------------

  //-------------------- BEGIN UTILITY METHODS -----------------
  // Begin utility method /addCssRule/
  // Example   :
  //   addCssRule( sheet_obj,
  //     '#tb-_shell_title_: 'display:block;color:red...', 0
  // );
  // Purpose   : Adds a selector rule to the style sheet at the
  //   specified index.
  // Arguments :
  //   * sheet_obj  - the stylesheet object to use.
  //   * select_str - the css selector string.
  //   * rule_str   - the css styles that apply for the selector.
  //   * idx        - requested position of the rule sheet_obj.cssRules array
  // Settings  : none
  // Throws    : none
  // Returns   : true on success, false on failure
  //
  addCssRule = (function () {
    var
      add_rule_str    = 'addRule',
      insert_rule_str = 'insertRule',

      cmd_str, add_css_rule;

    add_css_rule = function ( sheet_obj, select_str, rule_str, idx ) {
      var is_success = vMap._true_;

      if ( ! cmd_str ) {
        if ( sheet_obj[ add_rule_str ] ) {
          cmd_str = 'a';
        }
        else if ( sheet_obj[ insert_rule_str ] ) {
          cmd_str = 'i';
        }
      }

      switch ( cmd_str ) {
        case 'a' :
          try {
            sheet_obj[ add_rule_str ]( select_str, rule_str, idx );
          }
          catch ( error0 ) {
            console.warn( select_str, rule_str, idx, error0 );
            is_success = vMap._false_;
          }
          break;

        case 'i' :
          try {
            sheet_obj[ insert_rule_str ](
              select_str + '{' + rule_str + '}', idx
            );
          }
          catch ( error1 ) {
            console.warn( select_str, rule_str, idx, error1 );
            is_success = vMap._false_;
          }
          break;

        default :
          console.warn( '_no_means_to_add_css_rule_' );
          is_success = vMap._false_;
          break;
      }
      return is_success;
    };

    return add_css_rule;
  }());
  // End utility method /addCssRule/
  // ---------------------------------


  // ----------------------------------------
  // Begin utility method /fillSheetObj/
  // Example   :
  //   fillSheetObj(
  //     document.styleSheets[0],
  //     {  '.tb-_shell-title_, .tb-_shell-subtext_ ' : {
  //          _display_     : 'block',
  //          _position_    : 'absolute',
  //          _left_        : '50%',
  //          _background_  : [ 'url(http://imgr.com/xyzpdw.gif)', 'blue' ]
  //        },
  //       'div.tb-_score_' : {
  //       }
  //     },
  //     true
  //   );
  // Purpose   : Adds the selector rules defined by a sheet_map
  //   into the sheet object provided.
  // Arguments :
  //   * sheet_obj - the stylesheet object to create the object
  //   * sheet_map - a mapping of selector strings to maps of
  //       style keys and values.
  //   * do_abs - Change 'position : fixed' to 'position : absolute'
  // Settings  : none
  // Throws    : none
  // Returns   : A map of selector strings to associated rule objects
  //
  fillSheetObj =  function ( sheet_obj, sheet_map, do_abs ) {
    var
      idx                = nMap._0_,
      sel_x_sheetobj_map = {},
      rule_list          = sheet_obj[ vMap._cssRules_ ],

      select_key_list,  select_key_count,
      select_key,       attr_map,
      attr_key_list,    attr_key_count,
      attr_key,         attr_key_str,
      attr_val_data,    attr_val_type,
      attr_val_list,    attr_val_count,
      attr_val_str,     rule_str_list,
      rule_str,         was_added,
      i, j, k;

    select_key_list = fMap._Object_[ vMap._keys_]( sheet_map );
    select_key_count = select_key_list[ vMap._length_];

    _SELECT_KEY_: for ( i = nMap._0_; i < select_key_count; i++ ) {
      select_key = select_key_list[ i ];
      attr_map = sheet_map[ select_key ];
      rule_str_list = [];

      attr_key_list  = fMap._Object_[ vMap._keys_]( attr_map );
      attr_key_count = attr_key_list[ vMap._length_];

      _ATTR_KEY_: for ( j = nMap._0_; j < attr_key_count; j++ ) {
        attr_key     = attr_key_list[ j ];
        attr_key_str = K[ attr_key ];

        if ( ! attr_key_str ) {
          console.warn( '_unknown_attribute_key_ ' + attr_key );
          continue _ATTR_KEY_;
        }

        attr_val_data = attr_map[ attr_key ];
        attr_val_type = tb._getVarType_( attr_val_data );

        attr_val_list = attr_val_type === '_Array_'
          ? attr_val_data : [ attr_val_data ];

        attr_val_count = attr_val_list[ vMap._length_ ];

        for ( k = nMap._0_; k < attr_val_count; k++ ) {
          attr_val_str = attr_val_list[ k ];

          // if requested, change position from fixed to absolute
          if ( do_abs && attr_key === '_position_'
            && attr_val_str === V._fixed_
          ) {
            attr_val_str = V._absolute_;
          }

          rule_str_list[ vMap._push_ ](
            attr_key_str + ':' + attr_val_str + ';'
          );
        }
      }

      rule_str = rule_str_list[ vMap._join_ ]( vMap._blank_ );

      if ( ! rule_str ) { continue _SELECT_KEY_; }
      was_added = addCssRule( sheet_obj, select_key, rule_str, idx );

      // This check avoids cascading problems if FF or IE cannot add a rule
      // (e.g. if the selector is not supported)
      if ( was_added ) {
        sel_x_sheetobj_map[ select_key ] = rule_list[ idx ];
        idx++;
      }
    }

    return sel_x_sheetobj_map;
  };
  // End utility method /fillSheetObj/
  //--------------------- END UTILITY METHODS ------------------

  //------------------- BEGIN PUBLIC METHODS -------------------
  initModule = function () {
    fillSheetObj(
      document.styleSheets[ nMap._0_],
      cssMap._base_map_,
      vMap._false_
    );
  };

  return {
    _initModule_ : initModule
  };
  //-------------------- END PUBLIC METHODS --------------------
}());
// END tb._css_
