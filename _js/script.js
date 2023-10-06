/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

if (!window.matchMedia) {
  window.matchMedia = function() {
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
}();
}

jQuery(document).ready(function($) {

  function array2prose(array, andor) {
    if (array.length < 3) {
      return array.join(' '+andor+' ');
    } else {
      var o = [];
      for (var i = array.length - 2; i >= 0; i--) {
        o[i] = $.trim(array[i]);
      }
      return o.join(', ') + ', ' + andor + ' ' + $.trim(array[array.length - 1]);
    }
  }

  function statusanimation() {
    $('.maininner').addClass('loading');
    $('.filter-status .loaded').hide();
    $('.filter-status .loading').show();
  }

  function updateuri(uri) {
    if (!window.noAddToHistory) {
      history.pushState(null, null, uri);
      uri.fragment("");
      localStorage.setItem('url-' + uri.filename(), uri);
    }
    setScrollSpy();
  }

  function applyurl() {
    var location = window.history.location || window.location;
    var uri = new URI(location);
    var data = uri.search(true);

    if(data.hidesidebar) {
      $('.sidebar').hide();
      $('.mainrow').addClass('sidebar-hidden');
      $('#showsidebars').show().focus();
    }

    if(data.currentsidebar) {
      $('a[href=' + data.currentsidebar + ']').trigger('click');
    }

    if (data.tags) {
      $('#tags .btn').removeClass('btn-primary').addClass('btn-default').attr('aria-pressed', 'false');
      $('#tags .btn[data-tag="' + data.tags.split(',').join('"], #tags .btn[data-tag="') + '"]').addClass('btn-primary').removeClass('btn-default').attr('aria-pressed', true);
    }

    if (data.levels) {
      $('#filter-levels input').prop('checked', true);
      $('#filter-levels input[value="' + data.levels.split(',').join('"], #filter-levels input[value="') + '"]').prop('checked', false);
    }
    if (data.technologies) {
      $('#filter-technologies input').prop('checked', true);
      $('#filter-technologies input[value="' + data.technologies.split(',').join('"], #filter-technologies input[value="') + '"]').prop('checked', false);
    }
    if (data.techniques) {
      $('#filter-techniques input').prop('checked', true);
      $('#filter-techniques input[value="' + data.techniques.split(',').join('"], #filter-techniques input[value="') + '"]').prop('checked', false);
    }
    if (data.versions) {
      $('#wcagver [value="'+ data.versions +'"]').prop('selected', true);
    }
    $('.btn-techniques').each(function(index, el) {
      var btn = $(el);
      btn.attr('data-expanded', "false");
      $('#'+btn.attr('aria-controls')).removeClass('in');
    });
    if (data.showtechniques) {
      $('.btn-techniques[aria-controls="techniques-' + data.showtechniques.split(',').join('"], .btn-techniques[aria-controls="techniques-') + '"]').each(function(index, el) {
        var btn = $(el);
        btn.attr('data-expanded', "true");
        $('#'+btn.attr('aria-controls')).addClass('in');
      });
    }
    applyTechnologies();
    applyTechniques();
    applyVersions();
    applyTagsAndLevelsToSC();
    $('#tags button:disabled').first().addClass('first');
    if (uri.hash()) {
      var gotohash = uri.hash();
      if (gotohash.match(/(.*)-sufficient-head$/) || gotohash.match(/(.*)-tech-optional-head$/) || gotohash.match(/(.*)-failures-head$/)) {
        $('[data-historicalid="' + gotohash + '"]').parents('.collapse').collapse('show');
        scrollto($('[data-historicalid="' + gotohash.replace('#', '') + '"]'));
      } else {
        // search for alternative ids
        var altid = $('[data-alt-id~="' + gotohash.replace('#', '') + '"]');
        if (altid.length) {
          scrollto(altid);
          history.replaceState(null, null, '#' + altid.attr('id'));
        } else {
          scrollto($(gotohash));
        }
      }
    }
  }

  function geturi() {
    var location = window.history.location || window.location;
    var uri = new URI(location);
    var url = localStorage.getItem('url-' + uri.filename());
    if ((uri.search()==="") && (url!=="")) {
      history.replaceState(null, null, url);
    }
    applyurl();
  }

  function applyTagsAndLevelsToSC() {
    var pressed = $('#tags .btn-primary:not(:disabled)');
    var audiences = $('#audiences input:checked');
    var uncheckedLevels = $('#filter-levels input:not(:checked)');

    //$('.sc-wrapper').addClass('current');
    if (pressed.length>0) {
      var tags = [],
          auds = [],
          sels = [];
      pressed.each(function(index, el) {
        tags.push($(el).attr('data-tag'));
      });
      audiences.each(function(index, el) {
        auds.push($(el).val());
      });
      for (var i = auds.length - 1; i >= 0; i--) {
        for (var j = tags.length - 1; j >= 0; j--) {
          sels.push('.sc-wrapper[data-tags-' + auds[i] + '~=' + tags[j] + ']');
        }
      }
      var selector = sels.join(', ');
      $('.sc-wrapper').removeClass('current');
      $(selector).addClass('current');
      $('#deselecttags').prop('disabled', false);
    } else {
      $('.sc-wrapper').addClass('current');
      $('#deselecttags').prop('disabled', true);
    }

    if (uncheckedLevels.length==2){
      $('#filter-levels input:checked').prop('disabled', true);
    } else {
      $('#filter-levels input:checked').prop('disabled', false);
    }

    if (uncheckedLevels.length>0) {
      $('#filter-levels button.filters').prop('disabled', false);
      uncheckedLevels.each(function(index, lvl) {
        $('.sc-wrapper.current').each(function(index, sc) {
          if($(sc).hasClass('filter-levels-' + $(lvl).val())) {
            $(sc).removeClass('current');
          }
        });
      });
    } else {
      $('#filter-levels button.filters').prop('disabled', true);
    }

    $('.sc-wrapper').each(function(index, el) {
      if ($(el).is('.current')) {
        $('.overview [href="#' + $(el).find('h4').attr('id') + '"]').parent().show();
      } else {
        $('.overview [href="#' + $(el).find('h4').attr('id') + '"]').parent().hide();
      }
    });

    $('.guideline').each(function(index, el) {
      if ($(el).has('.sc-wrapper.current').length > 0) {
        $(el).find('> .panel-heading, > .panel-body').show();
        $('.overview [href="#' + $(el).find('h3').attr('id') + '"]').parent().show();
      } else {
        $(el).find('> .panel-heading, > .panel-body').hide();
        $('.overview [href="#' + $(el).find('h3').attr('id') + '"]').parent().hide();
      }
    });
    $('.principle + .guidelines').each(function(index, el) {
      if ($(el).has('.sc-wrapper.current').length > 0) {
        $(el).prev().show();
        $('.overview [href="#' + $(el).prev().find('h2').attr('id') + '"]').parent().show();
      } else {
        $(el).prev().hide();
        $('.overview [href="#' + $(el).prev().find('h2').attr('id') + '"]').parent().hide();
      }
    });
    if($('.sc-wrapper:not(.current)').length > 0) {
      $('#hiddensc').empty();
      $('<div class="panel-heading"><h2 style="margin: 0;">Filtered-Out Success Criteria <button class="clearall btn btn-info btn-sm" hidden="" style="display: inline-block;"><span class="glyphicon glyphicon-refresh"></span> Clear filters</button></h2></div><div class="panel-body"><p><strong>The following success criteria are not shown based on the selected version, tags, and/or filters:</strong></p></div>').appendTo('#hiddensc');
      $('<div class="panel-body hiddensc-inner">').appendTo('#hiddensc');
      var hiddenscul = $('<ul>');
      $('.sc-wrapper:not(.current) h4'). each(function(index, el) {
        hiddenscul.append('<li>' + $(el).find('> strong').text() + ' ' + $(el).find('> span').text() + ' ' + $(el).parent().find('.newin21').text() + '</li>').appendTo('#hiddensc .hiddensc-inner');
      });
      $('#hiddensc, #hiddennav').show();
    } else {
      $('#hiddensc, #hiddennav').hide();
    }
    saveURL();
    statustext();
  }

  function applyTechnologies() {
    $('[class*=filter-tech]').show();
    var technologies = [];
    var uncheckedTechnologies = $('#filter-technologies input:not(:checked)');
    if (uncheckedTechnologies.length>0) {
      uncheckedTechnologies.each(function(index, el) {
        technologies.push($(el).val());
      });
      var selector = '.filter-tech-' + technologies.join(', .filter-tech-') + '';
      $(selector).hide();
      saveURL();
      statustext();
      $('#filter-technologies button.filters').prop('disabled', false);
    } else {
      $('#filter-technologies button.filters').prop('disabled', true);
    }
  }

  function applyVersions() {
    $('[data-versions]').hide();
    $('.sc-wrapper.current').removeClass('current');
    var ver = $('#wcagver').val();
    if (ver == "2.1only") {
      $('[data-versions="2.1 2.2 "]').show().addClass('current');
    } else if (ver == "2.2only") {
      $('[data-versions="2.2 "]').show().addClass('current');
    } else {
      $('[data-versions*="' + ver + '"]').show().addClass('current');
    }
  }

  function applyTechniques() {
    var techniques = $('#filter-techniques-content');
    var tselected = [], tunselected = [];
    var checked =  techniques.find('input:checked');
    for (var i = checked.length - 1; i >= 0; i--) {
      tselected.push($(checked[i]).val());
    }
    var selector = '.techniques-button input[name$="' + tselected.join('"], .techniques-button input[name$="') + '"]';
    var selector2 = '.tbox-' + tselected.join(', .tbox-') + '';
    $(selector).prop('checked', true);
    $(selector2).addClass('active');
    var unchecked =  techniques.find('input:not(:checked)');
    if (unchecked.length>0) {
      for (var j = unchecked.length - 1; j >= 0; j--) {
        tunselected.push($(unchecked[j]).val());
      }
      selector = '.techniques-button input[name$="' + tunselected.join('"], .techniques-button input[name$="') + '"]';
      selector2 = '.tbox-' + tunselected.join(', .tbox-') + '';
      $(selector).prop('checked', false);
      $(selector2).removeClass('active');
      $('#filter-techniques button.filters').prop('disabled', false);
    } else {
      $('#filter-techniques button.filters').prop('disabled', true);
    }
  }

  function saveURL() {
    var location = window.history.location || window.location,
        uri = new URI(location),
        tags = [];
        uri.removeSearch('tags');
    $('#tags .btn-primary').each(function(index, elm){
      tags.push($(elm).data('tag'));
      uri.setSearch('tags', tags.join(','));
    });

    $('#filters .sbbox').each(function(index, el){
      var filter = [];
      $(el).find('input:not(:checked)').each(function(index, el) {
        filter.push($(el).val());
      });
      uri.removeSearch(el.id.replace(/filter-/gi, ""));
      if (filter.length>0) {
        uri.setSearch(el.id.replace(/filter-/gi, ""), filter.join(',') + '');
      }
    });

    updateuri(uri);
  }

  $('#filter-technologies').on('change', 'input[type=checkbox]', function(e) {
    statusanimation();
    applyVersions();
    applyTechnologies();
  });

  $('#filter-levels').on('change', 'input[type=checkbox]', function(e) {
    statusanimation();
    applyVersions();
    applyTagsAndLevelsToSC();
  });

  $('#hiddensc, .filter-status-row').on('click', '.clearall', function(e) {
    var unchecked = $('#filters input:not(:checked), #audiences input:not(:checked)');
    unchecked.each(function(){
      $(this).prop('checked', 'checked');
    });
    $('#tags .btn-primary').removeClass('btn-primary').addClass('btn-default').attr('aria-pressed', 'false');
    $('#tags .btn').removeAttr('disabled');
    $('.sc-wrapper.current').removeClass('current');
    applyTechnologies();
    applyVersions();
    applyTagsAndLevelsToSC();
    statustext();
    scrollto($('#top'));
  });

  $('.sbbox-heading button.filters').on('click', function(e) {
    var unchecked = $(e.target).parent().parent().find('input:not(:checked)');
    unchecked.each(function(){
      $(this).prop('checked', 'checked');
    });
    applyTechnologies();
    applyVersions();
    applyTagsAndLevelsToSC();
  });

  function setScrollSpy() {
    $('body').scrollspy({
      target: '.overview.spy-active',
      offset: $('.navrow').outerHeight() + 10
    });
  }

  function scrollto(target) {
    // console.log(target);
    var location = window.history.location || window.location,
        uri = new URI(location),
        scrolldiff = 60;
        if ($('.navrow').outerHeight() > 0) {
          scrolldiff = $('.navrow').outerHeight() + 5;
        }
    setTimeout(function () {
      window.scrollTo(0, target.offset().top - scrolldiff);
      }, 100);
    uri.fragment('#' + $(target).attr('id'));
    updateuri(uri);
    target.attr('tabindex', '-1').focus();
    return false;
  }

  // Only buttons in filters

  $('.btn-only').on('click', function(){
    $(this).parents('.sbbox-body').find("input[type=checkbox]").prop('checked', false);
    $(this).parent().find("input[type=checkbox]").prop('checked', true).trigger( "change" );
  });


  // More buttons in Success Criteria
  function excolsc() {
    var hr = $('.sc-content hr:first-of-type');
    hr.hide(); // hide horizontal rule
    hr.prev().append(' <button type="button" data-expanded="false" class="btn btn-info btn-xs"><span class="word-show"><svg aria-hidden="true" class="i-chevron-right"><use xlink:href="img/icons.svg#i-chevron-right"></use></svg> Show</span><span class="word-hide"><svg aria-hidden="true" class="i-chevron-down"><use xlink:href="img/icons.svg#i-chevron-down"></use></svg> Hide</span> full description</button>'); // Append button
    hr.find('~ *').hide();
    hr.prev().find('button').on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      $(this).attr('data-expanded', function(idx, oldAttr) {
          if(oldAttr=='true') {
            return 'false';
          } else {
            return 'true';
          }
      }).parent().find('~ *:not(hr)').toggle();

    });
  }
  excolsc();

  var statustext = function(){
    statusanimation();
    var tags = [],
        htags = [],
        sctext = "all success criteria",
        sctext1 = "",
        sctexthidden1 = "",
        sctext2 = "",
        sctexthidden2 = "",
        pretechtext = "all",
        techtext = "techniques",
        techtexthidden = "";

    var vertxt = $('#wcagver').val();
    if (vertxt == "2.1only") {
      version = 'Only what’s added in WCAG 2.1:';
    } else if (vertxt == "2.2only") {
      version = 'Only what’s added in WCAG 2.2:';
    } else {
      version = 'WCAG ' + vertxt + ':';
    }

    var techtypes = $('#filter-techniques-content input'),
        techtypeschecked = techtypes.filter(':checked');

    if (techtypeschecked.length<techtypes.length) {
      var ttypes = [];
      techtypeschecked.each(function(index, el) {
        if ($(el).val() == "failures") {
          ttypes.push('failure');
        } else {
          ttypes.push($(el).val());
        }
      });
      pretechtext = array2prose(ttypes, 'and');
    }

    pretechtext = pretechtext + " ";

    var pressed = $('#tags .btn-primary');
    if (pressed.length>0) {
      pressed.each(function(index, el) {
        tags.push($(el).attr('data-tag'));
      });
      sctext1 = ' <strong>tagged with '+ array2prose(tags, 'or') + '</strong>';
      var notpressed = $('#tags .btn-default');
      // if (notpressed.length>0) {
      //   notpressed.each(function(index, el) {
      //     htags.push($(el).attr('data-tag'));
      //   });
      //   sctexthidden1 = ' <span class="deem">(Hidden: '+ array2prose(htags, 'and')+ ')</span>';
      // }
    }
    var levels = [],
        hlevels = [];
    var selected = $('#filter-levels input:checked'),
        nselected = $('#filter-levels input:not(:checked)'),
        all = $('#filter-levels input');
    if (selected.length<all.length) {
      selected.each(function(index, el) {
        levels.push($(el).attr('value').toUpperCase());
      });
      sctext2 = ' for <strong>levels ' + array2prose(levels, 'and') + '</strong>';
    }
    // if (nselected.length>0) {
    //   nselected.each(function(index, el) {
    //     hlevels.push($(el).attr('value').toUpperCase());
    //   });
    //   sctexthidden2 = ' <span class="deem">(Hidden: '+array2prose(hlevels, 'and')+')</span>';
    // }
    if ((pressed.length>0) || (selected.length<all.length)) {
      sctext = 'success criteria ' + sctext1 + sctexthidden1 + sctext2 + sctexthidden2;
    }
    var technologies = [],
        htechnologies = [];
    var selectedtechnologies = $('#filter-technologies input:checked'),
        nselectedtechnologies = $('#filter-technologies input:not(:checked)'),
        alltechnologies = $('#filter-technologies input');
    if (selectedtechnologies.length<alltechnologies.length) {
      selectedtechnologies.each(function(index, el) {
        technologies.push($(el).parent().text());
      });
      techtext = ' techniques for the technologies: <strong>' + array2prose(technologies, 'and') + '</strong>';
    }
    // if (nselectedtechnologies.length>0) {
    //   nselectedtechnologies.each(function(index, el) {
    //     htechnologies.push($(el).parent().text());
    //   });
    //   techtexthidden = ' <span class="deem">(Hidden: '+array2prose(htechnologies, 'and')+')</span>';
    // }
    $('#status .ver').html(version);
    $('#status .sc').html(sctext);
    $('#status .tech').html(pretechtext + techtext + techtexthidden + '.');
    if (techtext == "all techniques" && sctext == "all success criteria") {
      $('.clearall').hide();
      $('.filter-status-row').removeClass('active');
    } else {
      $('.clearall').show();
      $('.filter-status-row').addClass('active');
    }
  };

  $('#tags').on('click', '.btn', function(e) {
    statusanimation();
    var button = $(e.target), tags = [];
    if (button.hasClass('btn-primary')) {
        button.removeClass('btn-primary').addClass('btn-default').attr('aria-pressed', 'false');
    } else {
      button.removeClass('btn-default').addClass('btn-primary').attr('aria-pressed','true');
    }
    applyTagsAndLevelsToSC();
    saveURL();
  });

  $('#showalltags').on('click', function(e) {
    var txt = $('#tags').is('.open') ? 'Show all tags' : 'Show fewer tags';
    $(this).text(txt);
    $('#tags').toggleClass('open');
  });

  $('#audiences').on('change', 'input', function(e) {
    $('#tags button').prop('disabled', false);
    $('#tags button').removeClass('first');
    var sel = [];
    $('#audiences input:checked').each(function(index, el) {
      sel.push($(el).val());
    });
    var selector = '[data-count' + sel.join('="0"][data-count') + '="0"]';
    $('#tags button' + selector).prop('disabled', true);
    $('#tags button' + selector).first().addClass('first');
    applyTechniques();
    applyTechnologies();
    applyTagsAndLevelsToSC();
  });

  $('#filter-techniques-content').on('change', 'input', function(event) {
    applyTechniques();
    applyTechnologies();
    applyTagsAndLevelsToSC();
  });

  function init() {
    $('html').addClass('has-js');
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
        $('.sidebar').hide();
        $('.mainrow').addClass('sidebar-hidden');
        $('#showsidebars').show().focus();
        updateuri(uri);
    });

    $('#showsidebars').on('click', function () {
      var location = window.history.location || window.location;
      var uri = new URI(location);
      uri.removeSearch("hidesidebar");
      $('.sidebar').show();
      $('.mainrow').removeClass('sidebar-hidden');
      $('#showsidebars').hide();
      $('#hidesidebars').focus();
      updateuri(uri);
    });

    $('#navtabs a').on('click', function (e) {
      var location = window.history.location || window.location;
      var uri = new URI(location);
      uri.setSearch("currentsidebar", $(this).attr('href'));
      updateuri(uri);
    });

    $('#overview').on('click', 'a', function(e) {
      e.preventDefault();
      var tgt = $(e.target),
          thetarget;
      if (tgt.is('a')) {
        thetarget = tgt.attr('href');
      } else {
        thetarget = tgt.parents('a').attr('href');
      }
      scrollto($(thetarget));
      return false;
    });

    $('#hiddennav').on('click', function(event) {
      event.preventDefault();
      scrollto($('#hiddensc'));
    });

    $('.maininner').on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(event) {
      $(this).removeClass('loading');
      $('.filter-status .loaded').show();
      $('.filter-status .loading').hide();
    });

    // FixedSticky.tests.sticky = false;
    // if (matchMedia('screen and (min-width: 43em)').matches) {
    //   $('.fixedsticky').fixedsticky();
    // } else {
    //   $('.navrow.fixedsticky').fixedsticky();
    // }

    $('#deselecttags').on('click', function(event) {
      event.preventDefault();
      /* Act on the event */
      $('#tags .btn-primary').removeClass('btn-primary').addClass('btn-default').attr('aria-pressed', 'false');
      applyTechnologies();
      applyTagsAndLevelsToSC();
      statustext();
      $(this).prop('disabled', true);
    });

    $('#wcagver').on('change', function(event) {
      event.preventDefault();
      var location = window.history.location || window.location;
      var uri = new URI(location);
      uri.setSearch("versions", $('#wcagver').val());
      applyTechnologies();
      applyVersions();
      applyTagsAndLevelsToSC();
      statustext();
      updateuri(uri);
    });

    svg4everybody();
  }

  $('main').on('change', '.techniques-button input', function(event) {
    event.preventDefault();
    var target = $(event.target);
    var type = target.attr('name').match(/sc-[0-9]{2,3}-(.*)/)[1];
    if (($('.techniques-button input[name$="' + type + '"]:checked').length > 0) && ($('.techniques-button input[name$="' + type + '"]:not(:checked)').length > 0)) {
      $('[name="filter-techniques"][value="' + type + '"]').prop('indeterminate', true);
    } else {
      $('[name="filter-techniques"][value="' + type + '"]').prop('indeterminate', false);
      if ($('.techniques-button input[name$="' + type + '"]:checked').length === 0) {
        $('[name="filter-techniques"][value="' + type + '"]').removeProp('checked');
      }
      if ($('.techniques-button input[name$="' + type + '"]:not(:checked)').length === 0) {
        $('[name="filter-techniques"][value="' + type + '"]').prop('checked', "checked");
      }
    }
    if(target.is(':checked')) {
      $('#' + target.prop('name')).addClass('active');
    } else {
      $('#' + target.prop('name')).removeClass('active');
    }
  });

  $('main').on('click', '.techniques-button .btn-techniques', function(event) {
    var target = $(event.target),
        cntrls = target.attr('aria-controls'),
        location = window.history.location || window.location,
        uri = new URI(location),
        urltags = [];
    $('.btn-techniques[data-expanded="true"]').each(function(index, el) {
      urltags.push($(el).attr('aria-controls'));
    });
    // attribute data-expanded is false when clicked on the button when the associated area is currently hidden. So if the following returns 'false' the panel is/will be open.
    if (target.attr('data-expanded') == "false") {
      urltags.push(cntrls);
    } else {
      for (var i = urltags.length - 1; i >= 0; i--) {
        if (urltags[i] == cntrls) {
          urltags.splice(i, 1);
        }
      }
    }
    if (urltags.length > 0) {
      uri.setSearch('showtechniques', urltags.join(',').replace(/techniques-/gi, "") + '');
    } else {
      uri.removeSearch('showtechniques');
    }
    updateuri(uri);
  });

  $('#sharethisviewbutton').on('click', function (){

    var location = window.history.location || window.location;
    var sharebox = $(this).parent().find('.sharebox');

    if (sharebox.hasClass( "open" )) {
      sharebox.removeClass('open');
    } else {
      sharebox.addClass('open');
      sharebox.find('input').val(location).select().focus();
    }

  });

  $('#sharethisviewbutton').parent().find('.sharebox button').on('click', function (){
    $(this).parent().parent().parent().removeClass('open');
    $('#sharethisviewbutton').focus();
  });

  $('#expandcollapsalltechniques').on('click', function (e) {
    if($(this).attr('data-expanded') != 'true') {
      $('.collapse').collapse('show');
      $('.sc-text button').attr('data-expanded', true).parent().find('~ *:not(hr)').toggle();
      $(this).attr('data-expanded', true).find('span').html('Collapse <strong>all</strong> sections');
    } else {
      $('.collapse').collapse('hide');
      $('.sc-text button').attr('data-expanded', false).parent().find('~ *:not(hr)').toggle();
      $(this).attr('data-expanded', false).find('span').html('Expand <strong>all</strong> sections');
    }
  });

  $(window).on('popstate', function(event) {
    window.noAddToHistory = true;
    applyurl();
    window.noAddToHistory = false;
  });

  init();

  window.noAddToHistory = true;
  applyurl();
  window.noAddToHistory = false;

});
