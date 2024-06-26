#!/usr/bin/env perl

# Use this tool to remove meaningful internal variable names from the
# compressed javascript. It can cut uglified code by 50% or more.

    use warnings;
    use strict;
    use feature ':5.10';

    use List::Util qw(shuffle);
    use List::MoreUtils qw(uniq);
    use Data::Dumper;
    use File::Slurp;
    use Getopt::Mixed;

    ## TODO: switch Getopt::Mixed to Getopt::Long
    #   See http://crumple-zone.it.uts.edu.au\
    #     /pub/mirror/cpan/modules/by-category/12_Opt_Arg_Param_Proc/\
    #     Getopt/Getopt-Mixed-1.11.readme
    #   In short, Getopt::Long now supports long and short options, and
    #   is part of the standard Perl distribution; therefore it is a better
    #   choice.  Here is the setup:
    #     use Getop::Long;
    #     Getopt::Long::Configure(qw(bundling no_getopt_compat));
    #     GetOptions( ...option-descriptions... );

    # Reporting utilities
    local $Data::Dumper::Terse    => 1;
    local $Data::Dumper::Indent   => 1;
    local $Data::Dumper::Sortkeys => 1;

    ## BEGIN process command-line options
    #
    Getopt::Mixed::init( 'i=s o=s l=s input>i output>o log>l' );
    my %opt_map;


    while ( my( $option, $value, $pretty )
      = Getopt::Mixed::nextOption()
    ) {
      $opt_map{ $option } = $value;
    };
    Getopt::Mixed::cleanup();

    # get file paths for input file, output file, and log file
    my $script_file = $opt_map{ 'i' }
      || die q(required [i]nput not  provided);
    my $output_file = $opt_map{ 'o' }
      || die q(required [o]utput not provided);
    my $log_file    = $opt_map{ 'l' }
      || die q(required [l]og not provided);
    #
    ## END process command-line options

    ## BEGIN extract tokens from input
    #
    # slurp in file content
    my $script_str = read_file($script_file);
    # split into lines
    my @str_script_lines = split qq(\n), $script_str;

    # create a list of tokens to replace
    my @raw_patterns = $script_str =~ m{_[A-Za-z0-9\$_-]+_}g;

    # TODO : Create a general solution to add and exclude tokens
    my @boundry_patterns = ( 'TAFFY', 'jQuery', 'EXIT' );
    for my $pattern( @boundry_patterns ) {
      my @bonus_matches = $script_str =~ m{\b$pattern\b}g;
      push @raw_patterns, @bonus_matches;
    }

    # remove '___'
    @raw_patterns = grep( !/^___$/, @raw_patterns );

    # count frequency
    my $seen_mref = {};
    for my $raw_pattern( @raw_patterns ) {
      my $count = $seen_mref->{$raw_pattern} || 0;
      $count++;
      $seen_mref->{$raw_pattern} = $count;
    }

    # create sorted, unique tokens
    my @token_list
      = sort { $seen_mref->{$b} <=> $seen_mref->{$a} } keys(%{$seen_mref});
    # DEBUG: print STDERR join( q(, ), @token_list ) . "\n";
    #
    ## END extract tokens from input

    ## BEGIN Deck management
    #
    my @deck1_char_list = qw(
      _ a b c d e f g h i j k l m n o p q r s t u v w x y z
    );
    my @deck2_char_list = qw(
      _ a b c d e f g h i j k l m n o p q r s t u v w x y z
      0 1 2 3 4 5 6 7 8 9
    );

    my @deck_list      = ();
    my @orig_deck_list = ();

    sub add_deck {
      my $deck_int = scalar @deck_list;

      my ( @new_card_list, @copied_card_list );

      if ( $deck_int < 1 ) {
        @new_card_list = List::Util::shuffle( @deck1_char_list );
      }
      else {
        @new_card_list = List::Util::shuffle( @deck2_char_list );
      }

      @copied_card_list = @new_card_list;

      push @deck_list,      \@new_card_list;
      push @orig_deck_list, \@copied_card_list;

      return scalar @deck_list;
    }
    #
    ## END deck management

    ## BEGIN initialize vars to create token_x_munge_map map
    #
    my %token_x_munge_map = ();
    # munge strings to skip; currently all js reserved words
    my $skip_key_mref = {
      'abstract'     => 1, 'boolean'      => 1,
      'break'        => 1, 'byte'         => 1,
      'case'         => 1, 'catch'        => 1,
      'char'         => 1, 'class'        => 1,
      'const'        => 1, 'continue'     => 1,
      'debugger'     => 1, 'default'      => 1,
      'delete'       => 1, 'do'           => 1,
      'double'       => 1, 'else'         => 1,
      'enum'         => 1, 'export'       => 1,
      'extends'      => 1, 'final'        => 1,
      'finally'      => 1, 'float'        => 1,
      'for'          => 1, 'function'     => 1,
      'goto'         => 1, 'if'           => 1,
      'implements'   => 1, 'import'       => 1,
      'in'           => 1, 'instanceof'   => 1,
      'int'          => 1, 'interface'    => 1,
      'let'          => 1, 'long'         => 1,
      'native'       => 1, 'new'          => 1,
      'package'      => 1, 'private'      => 1,
      'protected'    => 1, 'public'       => 1,
      'return'       => 1, 'short'        => 1,
      'static'       => 1, 'super'        => 1,
      'switch'       => 1, 'synchronized' => 1,
      'this'         => 1, 'throw'        => 1,
      'throws'       => 1, 'transient'    => 1,
      'try'          => 1, 'typeof'       => 1,
      'var'          => 1, 'void'         => 1,
      'volatile'     => 1, 'while'        => 1,
      'with'         => 1
    };

    # Variables for metrics
    my $skipped_count = 0;
    my @skipped_list  = ();

    # Initialize our list of deck_list by adding our first one
    my $deck_count = add_deck();
    my @munge_digit_list = ();
    #
    ## END initialize vars to create token_x_munge_map map

    ## BEGIN Create %token_x_munge_map
    #
    for my $token_str( @token_list ) {
      my $munge_str;
      my $found_count = 1;

      ## BEGIN find valid replacement token (munge_str)
      #
      while ( $found_count != 0 ) {

        ## BEGIN build munge string
        #
        # use last deck to get digit
        my $deck_idx = scalar( @deck_list ) - 1;
        my $is_roll_over = 1;

        while ( $is_roll_over > 0 ) {
          my $pull_deck_lref = $deck_list[ $deck_idx ];

          # If this deck is empty ...
          if ( scalar( @{ $pull_deck_lref } ) < 1 ) {

            # ...reset it
            my @copy_list = @{ $orig_deck_list[ $deck_idx ] };
            $deck_list[ $deck_idx ]  = \@copy_list;
            $pull_deck_lref          = $deck_list[ $deck_idx ];
            $munge_digit_list[ $deck_idx ] = pop( @{ $pull_deck_lref } );

            # Now consider deck to the left
            $deck_idx--;
            if ( $deck_idx < 0 ) {
              $deck_idx = add_deck() - 1;
              $pull_deck_lref = $deck_list[ $deck_idx ];
              $munge_digit_list[ $deck_idx ] = pop( @{ $pull_deck_lref } );
              $is_roll_over   = 0;
            }
          }
          else {
            $munge_digit_list[ $deck_idx ] = pop( @{ $pull_deck_lref } );
            $is_roll_over = 0;
          }
        }
        $munge_str = join( q(), @munge_digit_list );
        #
        ## END build munge string

        ## BEGIN test munge string
        #
        # check to see if munge already exists in file ...
        my @match_list = grep { /\b$munge_str\b/ } @str_script_lines;
        # ... if it does, this is non-zero so we will build a new munge
        $found_count = scalar @match_list;

        # add in reserved words
        $found_count += ( $skip_key_mref->{ $munge_str } || 0 );
        if ( $found_count > 0 ) {
          push @skipped_list, $munge_str;
          $skipped_count++;
        }
        #
        ## END test munge string
      }
      #
      ## END find valid replacement token (munge_str)

      # save the mapping
      $token_x_munge_map{$token_str} = $munge_str;
    }
    #
    ## END Create %token_x_munge_map

    ## BEGIN collate and output
    #
    # Replace tokens in script
    for my $pattern( @boundry_patterns ) {
      $script_str  =~ s{\b$pattern\b}{$token_x_munge_map{$pattern}}g;
      delete $token_x_munge_map{$pattern};
    }
    $script_str  =~ s{\b(_[A-Za-z0-9\$_-]+_)\b}{$token_x_munge_map{$1}}ge;
    $script_str  =~ s{[\n\r]}{}g;

    # modify dumper to turn into JSON
    my $json_str = Dumper( \%token_x_munge_map );
    $json_str    =~ s{\s*=>\s*}{:}g;
    $json_str    =~ s{'}{"}g;
    $json_str    =~ s{\$VAR1 = }{};
    $json_str    =~ s{;$}{};

    open my $fh_output, '>', $output_file;
    print $fh_output $script_str;
    close $fh_output;

    open my $fh_log,'>', $log_file;
    print $fh_log $json_str;
    close $fh_log;

    print STDERR qq(\nWARN: Skipped token candidates: )
      . Dumper( \@skipped_list ) . q([)
      . scalar( @skipped_list ) . qq(]\n);

    print STDERR qq(WARN: Total skip loops : $skipped_count \n);

    my @report_list  = ();
    my @suspect_list = ();
    for my $token_str ( @token_list ) {
      my $count = $seen_mref->{ $token_str };
      if ( $count < 2 ) { push @suspect_list, $token_str; }
      push @report_list, $count . q( : ) . $token_str;
    }
    print STDERR qq(WARN: Tokens with only one use: \n)
      . Dumper( \@suspect_list ) . qq(\n\n);

    print STDERR qq(Token frequency: \n);
    print STDERR join( qq(,\n), @report_list );
    # print STDERR Dumper( \$seen_mref );

    ## END collate and output

    exit 0;
