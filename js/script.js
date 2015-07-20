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
    $(selshow.join(',')).show();
    $(selhide.join(',')).hide();
    updateuri(uri);
    statustext();

    if (o.length == 0) {
      $('#clearall').hide();
    } else {
      $('#clearall').show();
    }
  }

  $('#filters').on('change', function(e) {
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

  $('.sbbox-heading button').on('click', function(e) {
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

  $('.btn-only').on('click', function(){
    $(this).parents('.sbbox-body').find("input[type=checkbox]").prop('checked', false);
    $(this).parent().find("input[type=checkbox]").prop('checked', true).trigger( "change" );
  });

  $('.hide-sb').on('click', function(e){
    var sidebar = $(this).parent().parent().parent().parent();
    var status = sidebar.find('.sidebar-content, h6').toggle().is(":visible");
    //sidebar.find('h6>span:first-child').toggle();
    sidebar.parent().toggleClass('hidden-sb');

    $(this).parent().find('.glyphicon').prop('hidden', function(idx, oldProp) {
        return !oldProp;
    });
    var uri = new URI(window.location);
    if (status) {
      uri.removeSearch("hide", $(this).parent().parent().parent().attr('class'));
      window.setTimeout(function (){
        sidebar.css('width',$(this).parent().width()); // On Resize fix funky stuff
      }, 100);
      $(this).removeClass('btn-primary btn-lg').addClass('btn-default');
    } else {
      uri.addSearch("hide", $(this).parent().parent().parent().attr('class'));
      sidebar.css('width','auto');
      $(this).addClass('btn-primary btn-lg').removeClass('btn-default');
    }
    updateuri(uri);
  });

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
    $('#tags').on('click', function(e) {
      if(e.target.localName=="button") {
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
          //$('#status .sc').html('<strong>Tags applied:</strong> '+tags.join(', '));
        } else {
          //$('#status .sc').html('No tags applied.');
          $('body').removeClass('tagged');
        }
        statustext();
      }
    });
  };

  var techniqueCheckboxes = function () {
    $('#filter-techniques-content input').on('change', function(event) {
      $('#filter-techniques-content input:checked').each(function(index, el) {
        $('.techniques-button input[name$="' + $(el).val() + '"]').prop('checked', true);
      });
      $('#filter-techniques-content input:not(:checked)').each(function(index, el) {
        $('.techniques-button input[name$="' + $(el).val() + '"]').prop('checked', false);
      });
    });
  };

  function init() {
    $('html').addClass('.has-js');
    $('.mainrow>div>div').css('width', $('.tab-pane.active').outerWidth()).fixedsticky();
    $('.fixedsticky').fixedsticky();
    $('aside.tags>div').css('width', $('aside.tags').width()).fixedsticky();
    if ($( window ).width() > 896) {
      $('html').addClass('large');
      $('.tab-nav-wrap .nav-pills').addClass('nav-stacked');
    } else {
      $('html').removeClass('large');
      $('.tab-nav-wrap .nav-pills').removeClass('nav-stacked');
    }
    if ($( window ).width() < 480) {
      $('.hide-sb').not(".hidden-sb .hide-sb").trigger('click');
    }
    $('.mainrow aside > div').css('top', $('.navrow').height());


      if($('.prototype-8')) {
        $('.prototype-8 .tab-content.fixedsticky').css('top', $('.navrow').height()).fixedsticky();

        $('#hidesidebars').on('click', function () {
            $('.mainrow>div').hide();
            $('#showsidebars').show().focus();
        });

        $('#showsidebars').on('click', function () {
          $('.mainrow>div').show();
          $('#showsidebars').hide();
          $('#hidesidebars').focus();
        });
      }

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

      $('.sidebar-content').css('height', window.innerHeight-document.querySelectorAll('.active .sidebar-content')[0].getBoundingClientRect().top);

  }

  $('#col_overview, #col_customize').on('show.bs.collapse', function () {
    $('.mainrow').removeClass($(this).attr('id'));
  });

  $('#col_overview, #col_customize').on('hide.bs.collapse', function () {
    $('.mainrow').addClass($(this).attr('id'));
  });

  $('.techniques-button').on('change', 'input', function(event) {
    event.preventDefault();
    var target = $(event.target);
    if(target.is(':checked')) {
      $('#' + target.prop('name')).addClass('active');
    } else {
      $('#' + target.prop('name')).removeClass('active');
    }
  });

  techniqueCheckboxes();

  $( window ).resize(function() {
    init();
  });

  init();
  geturi();
  tagButtons();

});

$(window).on('popstate', function(event) {
  applyurl();
});
