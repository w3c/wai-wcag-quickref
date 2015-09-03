/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
    "use strict";

    // For browsers that support matchMedium api such as IE 9 and webkit
    var styleMedia = (window.styleMedia || window.media);

    // For those that don't support matchMedium
    if (!styleMedia) {
        var style       = document.createElement('style'),
            script      = document.getElementsByTagName('script')[0],
            info        = null;

        style.type  = 'text/css';
        style.id    = 'matchmediajs-test';

        script.parentNode.insertBefore(style, script);

        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

        styleMedia = {
            matchMedium: function(media) {
                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
                if (style.styleSheet) {
                    style.styleSheet.cssText = text;
                } else {
                    style.textContent = text;
                }

                // Test if media query is true or false
                return info.width === '1px';
            }
        };
    }

    return function(media) {
        return {
            matches: styleMedia.matchMedium(media || 'all'),
            media: media || 'all'
        };
    };
}());


jQuery(document).ready(function($) {

  function array2prose(array, andor) {
    if (array.length < 3) {
      return array.join(' '+andor+' ');
    } else {
      var o = [];
      for (var i = array.length - 2; i >= 0; i--) {
        o[i] = $.trim(array[i]);
      };
      return o.join(', ') + ', ' + andor + ' ' + $.trim(array[array.length - 1]);
    }
  }

  function updateuri(uri) {
    uri.fragment("");
    history.pushState(null, null, uri);
    localStorage.setItem('url-' + uri.filename(), uri);
  }

  function applyurl() {
    var location = window.history.location || window.location;
    var uri = new URI(location);
    var data = uri.search(true);

    for(var prop in data) {
      if(data.hasOwnProperty(prop)) {
        if (prop == "hide") {
          for (var i = data[prop].length - 1; i >= 0; i--) {
            var sidebar = $('#' + data[prop]);
            var status = sidebar.find('.sidebar-content').toggle().is(":visible");
            sidebar.find('h6 .glyphicon').prop('hidden', function(idx, oldProp) {
                return !oldProp;
            });
            sidebar.parent().toggleClass('hidden-sb');
          }
        } else {
          for (var i = data[prop].length - 1; i >= 0; i--) {
            $('[name=' + prop + '][value=' + data[prop][i] + ']').prop('checked', false);
            applyFilters();
          }
        }
      }
    }
  }

  function geturi() {
    var location = window.history.location || window.location;
    var uri = new URI(location);
    var url = localStorage.getItem('url-' + uri.filename());
    if (uri.search()=="" && url!=="") {
      history.replaceState(null, null, url);
    }
    applyurl();
  }

  function applyFilters() {
    var o = [],
        selshow = [],
        selhide = [],
        uri,
        location = window.history.location || window.location;
    uri = new URI(location);
    $('#filters input').each(function(){
      var cinput = $(this);
      if (cinput.is(':checked')) {
        selshow.push('.' + cinput.attr('name') + '-' + cinput.val());
        uri.removeSearch(cinput.attr('name'),cinput.val());
      } else {
        o.push($.trim(cinput.parent().text()));
        selhide.push('.' + cinput.attr('name') + '-' + cinput.val());
        uri.addSearch(cinput.attr('name'),cinput.val());
      }
    });
    $('body').addClass('tagged');
    $(selshow.join(',')).each(function(e) {
      if ($(this).hasClass('sc-wrapper')) {
        $(this).addClass('current');
      } else {
        $(this).show();
      }
    });
    $(selhide.join(',')).each(function(e) {
      if ($(this).hasClass('sc-wrapper')) {
        $(this).removeClass('current');
      } else {
        $(this).hide();
      }
    });

    $('#filters .sbbox').each(function(index, el) {
      var elem = $(el);
      var allcheckboxes = elem.find('input[type=checkbox]');
      var checked = elem.find('input[type=checkbox]:checked');
      if (allcheckboxes.length == checked.length) {
        elem.find('.sbbox-heading button').prop('disabled', true);
      } else {
        elem.find('.sbbox-heading button').prop('disabled', false);
      }
    });

    updateuri(uri);
    statustext();

    if (o.length == 0) {
      $('#clearall').hide();
    } else {
      $('#clearall').show();
    }
  }

  $('#filters').on('change', '#filter-technologies input[type=checkbox], #filter-levels input[type=checkbox]', function(e) {
    $('.filter-status').addClass('loading');
    $('.filter-status .loaded').hide();
    $('.filter-status .loading').show();
    applyFilters();
  });

  $('#clearall').on('click', function(e) {
    var unchecked = $('#filters input:not(:checked)');
    unchecked.each(function(){
      $(this).prop('checked', 'checked');
    });
    applyFilters();
    $('#tags .btn-primary').removeClass('btn-primary').addClass('btn-default').removeAttr('aria-selected');
    $('.sc-wrapper.current').removeClass('current');
    $('body').removeClass('tagged');
    statustext();
  });

  $('.sbbox-heading button.filters').on('click', function(e) {
    var unchecked = $(e.target).parent().parent().find('input:not(:checked)');
    unchecked.each(function(){
      $(this).prop('checked', 'checked');
    });
    applyFilters();
  });

  function scrollto(target) {
     var scrollpos = (target.offset().top - parseInt($('.navrow').outerHeight(),10));
           scrollpos = scrollpos - 10;
     $('html,body').animate({
         scrollTop: scrollpos
    }, 1000);
    return false;
  }

  // Only buttons in filters

  $('.btn-only').on('click', function(){
    $(this).parents('.sbbox-body').find("input[type=checkbox]").prop('checked', false);
    $(this).parent().find("input[type=checkbox]").prop('checked', true).trigger( "change" );
  });


  // More buttons in Success Criteria
  function excolsc() {
    var hr = $('.sc-content hr');
    hr.hide(); // hide horizontal rule
    hr.prev().append(' <button type="button" aria-expanded="false" class="btn btn-info btn-xs"><span class="word-show"><span class="glyphicon glyphicon-chevron-right" aria-label="Show full description"></span></span><span class="word-hide"><span aria-label="Hide full description" class="glyphicon glyphicon glyphicon-chevron-down"></span></span></button>'); // Append button
    hr.find('~ *').hide();
    hr.prev().find('button').on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      $(this).attr('aria-expanded', function(idx, oldAttr) {
          if(oldAttr==='true') {
            return 'false';
          } else {
            return 'true';
          }
      }).parent().find('~ *:not(hr)').toggle();

    });
  }
  excolsc();

  var statustext = function(){
    var tags = new Array(),
        htags = new Array(),
        sctext = "all success criteria",
        sctext1 = "",
        sctexthidden1 = "",
        sctext2 = "",
        sctexthidden2 = "",
        techtext = "all techniques",
        techtexthidden = "";
    var pressed = $('#tags .btn-primary');
    if (pressed.length>0) {
      pressed.each(function(index, el) {
        tags.push($(el).attr('data-tag'));
      });
      sctext1 = ' tagged with '+ array2prose(tags, 'or');
      var notpressed = $('#tags .btn-default');
      if (notpressed.length>0) {
        notpressed.each(function(index, el) {
          htags.push($(el).attr('data-tag'));
        });
        sctexthidden1 = ' <span class="deem">(Hidden: '+ array2prose(htags, 'and')+ ')</span>';
      }
    }
    var levels = new Array(),
        hlevels = new Array();
    var selected = $('#filter-levels input:checked'),
        nselected = $('#filter-levels input:not(:checked)'),
        all = $('#filter-levels input');
    if (selected.length<all.length) {
      selected.each(function(index, el) {
        levels.push($(el).attr('value').toUpperCase());
      });
      sctext2 = ' for levels '+array2prose(levels, 'and');
    };
    if (nselected.length>0) {
      nselected.each(function(index, el) {
        hlevels.push($(el).attr('value').toUpperCase());
      });
      sctexthidden2 = ' <span class="deem">(Hidden: '+array2prose(hlevels, 'and')+')</span>';
    }
    if ((pressed.length>0) || (selected.length<all.length)) {
      sctext = 'success criteria ' + sctext1 + sctexthidden1 + sctext2 + sctexthidden2;
    };
    var technologies = new Array(),
        htechnologies = new Array();
    var selectedtechnologies = $('#filter-technologies input:checked'),
        nselectedtechnologies = $('#filter-technologies input:not(:checked)'),
        alltechnologies = $('#filter-technologies input');
    if (selectedtechnologies.length<alltechnologies.length) {
      selectedtechnologies.each(function(index, el) {
        technologies.push($(el).parent().text());
      });
      techtext = ' techniques for the following technologies: '+array2prose(technologies, 'and');
    };
    if (nselectedtechnologies.length>0) {
      nselectedtechnologies.each(function(index, el) {
        htechnologies.push($(el).parent().text());
      });
      techtexthidden = ' <span class="deem">(Hidden: '+array2prose(htechnologies, 'and')+')</span>';
    };
    $('#status .sc').html(sctext);
    $('#status .tech').html(techtext + techtexthidden);
    if (techtext == "all techniques" && sctext == "all success criteria") {
      $('#clearall').hide();
    } else {
      $('#clearall').show();
    }
  };

  var tagButtons = function () {
    $('#tags').on('click', 'button', function(e) {
      $('.filter-status').addClass('loading');
      $('.filter-status .loaded').hide();
      $('.filter-status .loading').show();
      $('.sc-wrapper.current').removeClass('current');
      var button = $(e.target), tags = new Array();
      if (button.hasClass('btn-primary')) {
        button.removeClass('btn-primary').addClass('btn-default').removeAttr('aria-selected');
      } else {
        button.removeClass('btn-default').addClass('btn-primary').attr('aria-selected','true');
      }
      var pressed = $('#tags .btn-primary');
      if (pressed.length>0) {
        $('#tags .btn-primary').each(function(index, el) {
          tags.push($(el).attr('data-tag'));
        });
        var selector = '.sc-wrapper[data-tags~="' + tags.join('"], .sc-wrapper[data-tags~="') + '"]';
        $('body').addClass('tagged');
        $(selector).addClass('current');
        $('#deselecttags').prop('disabled', false);
      } else {
        $('body').removeClass('tagged');
        $('#deselecttags').prop('disabled', true);
      }
      statustext();
    });
  };

  var techniqueCheckboxes = function () {
    var techniques = $('#filter-techniques-content');
    techniques.on('change', 'input', function(event) {
      var techniques = $('#filter-techniques-content');
      var tselected = new Array(), tunselected = new Array();
      var checked =  techniques.find('input:checked');
      for (var i = checked.length - 1; i >= 0; i--) {
        tselected.push($(checked[i]).val());
      };
      var selector = '.techniques-button input[name$="' + tselected.join('"], .techniques-button input[name$="') + '"]';
      $(selector).prop('checked', true);
      var unchecked =  techniques.find('input:not(:checked)');
      for (var i = unchecked.length - 1; i >= 0; i--) {
        tunselected.push($(unchecked[i]).val());
      };
      selector = '.techniques-button input[name$="' + tunselected.join('"], .techniques-button input[name$="') + '"]';
      $(selector).prop('checked', false);
      $(selector).find('input:first-of-type').change();
    });
  };

  function init() {
    $('html').addClass('.has-js');
    $('.fixedsticky').fixedsticky();
    if ($( window ).width() > 896) {
      $('html').addClass('large');
    } else {
      $('html').removeClass('large');
    }
    if ($( window ).width() < 480) {
      $('#hidesidebars').not(":visible").trigger('click');
    }

    $('.mainrow aside > div').css('top', $('.navrow').height()); //Applies top to make fixedsticky work in sidebars

    $('#hidesidebars').on('click', function () {
        var location = window.history.location || window.location;
        var uri = new URI(location);
        uri.addSearch("hidesidebar", true);
        $('.mainrow>div').hide();
        $('#showsidebars').show().focus();
        updateuri(uri);
    });

    $('#showsidebars').on('click', function () {
      var location = window.history.location || window.location;
      var uri = new URI(location);
      uri.removeSearch("hidesidebar")
      $('.mainrow>div').show();
      $('#showsidebars').hide();
      $('#hidesidebars').focus();
      updateuri(uri);
    });

    $('#overview').on('click', function(e) {
      var thetarget = $(e.target).parents('a').attr('href');
      scrollto($(thetarget));
    });

    $('.toplink').on('click', function(e) {
      var thetarget = $(this).attr('href');
      scrollto($(thetarget));
    });

    $('.filter-status').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(event) {
      $(this).removeClass('loading');
      $('.filter-status .loaded').show();
      $('.filter-status .loading').hide();
    });

    if (matchMedia('screen and (min-width: 43em)').matches) {
      $('.sidebar-content').css('height', window.innerHeight-document.querySelectorAll('.active .sidebar-content')[0].getBoundingClientRect().top);
    }

    $('#deselecttags').on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      $('#tags .btn-primary').removeClass('btn-primary').addClass('btn-default').removeAttr('aria-selected');
      $('.sc-wrapper.current').removeClass('current');
      $('body').removeClass('tagged');
      statustext();
      $(this).hide();
    });

    $('.sidebar>div').css('width', $('.tab-pane.active').outerWidth());
  }

  $('main').on('change', '.techniques-button input', function(event) {
    event.preventDefault();
    var target = $(event.target),
        type = target.attr('name').match(/sc-[0-9]{3}-(.*)/)[1];
    if (($('.techniques-button input[name$="' + type + '"]:checked').length > 0) && ($('.techniques-button input[name$="' + type + '"]:not(:checked)').length > 0)) {
      $('[name="filter-techniques"][value="' + type + '"]').prop('indeterminate', true);
    } else {
      $('[name="filter-techniques"][value="' + type + '"]').prop('indeterminate', false);
      if ($('.techniques-button input[name$="' + type + '"]:checked').length == 0) {
        $('[name="filter-techniques"][value="' + type + '"]').removeProp('checked');
      };
      if ($('.techniques-button input[name$="' + type + '"]:not(:checked)').length == 0) {
        $('[name="filter-techniques"][value="' + type + '"]').prop('checked', "checked");
      };
    }
    if(target.is(':checked')) {
      $('#' + target.prop('name')).addClass('active');
    } else {
      $('#' + target.prop('name')).removeClass('active');
    }
  });

  techniqueCheckboxes();

  $( window ).resize(function() {
    //init();
  });

  init();
  geturi();
  tagButtons();

});

$(window).on('popstate', function(event) {
  applyurl();
});
