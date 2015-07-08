jQuery(document).ready(function($) {

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

    if (o.length == 0) {
      $('#clearall').hide();
    } else {
      $('#clearall').show();
      var val = $('#exampleSearch').val();
      if (val.length > 0) {
        search(val, false);
      } else {
        $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
        $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
        $('#searchbtnfocusresult').hide();
        $('main').removeHighlight();
      }
    }
    statustext();
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
  });

  function scrollto(target) {
     var scrollpos = (target.offset().top - parseInt($('.navrow').outerHeight(),10));
           scrollpos = scrollpos - 10;
     $('html,body').animate({
         scrollTop: scrollpos
    }, 1000);
    return false;
  }

  function search(query, scroll) {
    $('#searchbtnfocusresult').parent().hide();
    $('#searchbtnprev, #searchbtnnext, #searchnumber').attr('disabled', 'disabled');
    $('#searchnumber').val('0/0');
    $('main').removeHighlight();
    $('main').highlight(query);
    var total = $('mark.highlight');
    var marknum = total.filter(":visible").length;
    var hiddennum = total.length - marknum;
    $('#searchnumber').attr('data-current-index', '1').attr('data-max-index', marknum).attr('data-hiddennum', hiddennum);
    if (marknum > 0) {
      $('#searchbtnfocusresult').parent().css('display','flex');
      $('#searchnumber').val('1/' + marknum + ' [' + hiddennum + ' hidden]').removeAttr('disabled', 'disabled');
      if (scroll !== false) {
        scrollto($('mark.highlight').filter(":visible").first().addClass('current'));
      }
    }
    if (marknum > 1) {
      $('#searchbtnnext').removeAttr('disabled');
    }
  }

  $('#exampleSearch').on('keyup', function() {
    var val = $(this).val();
    if (val.length > 3) {
      search(val);
    } else {
      $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
      $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
      $('#searchbtnfocusresult').parent().hide();
      $('main').removeHighlight();
    }
  });

  $('#searchbtnsubmit').on('click', function(e) {
    e.preventDefault();
    var val = $('#exampleSearch').val();
    if (val.length > 0) {
      search(val);
    } else {
      $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
      $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
      $('#searchbtnfocusresult').hide();
      $('main').removeHighlight();
    }
  });

  $('#searchbtnprev').on('click', function() {
    var currentindex = parseInt($('#searchnumber').attr('data-current-index'),10);
    var maxindex = parseInt($('#searchnumber').attr('data-max-index'),10);
    var hiddennum = parseInt($('#searchnumber').attr('data-hiddennum'),10);
    $('mark.highlight.current').removeClass('current');
    if (currentindex > 1) {
      var newindex = currentindex - 1;
      scrollto($('mark.highlight').filter(":visible").eq(newindex - 1).addClass('current'));
      $('#searchnumber').val(newindex + '/' + maxindex + ' [' + hiddennum + ' invisible]').attr('aria-label', "Result" + newindex + ' of ' + maxindex).attr('data-current-index', newindex);
      $('#searchbtnnext').removeAttr('disabled');
      if (newindex == 1) {
        $('#searchbtnprev').attr('disabled', 'disabled');
      }
    }
  });

  $('#searchbtnnext').on('click', function() {
    var currentindex = parseInt($('#searchnumber').attr('data-current-index'),10);
    var maxindex = parseInt($('#searchnumber').attr('data-max-index'),10);
    var hiddennum = parseInt($('#searchnumber').attr('data-hiddennum'),10);
    $('mark.highlight.current').removeClass('current');
    if (currentindex < maxindex) {
      var newindex = currentindex + 1;
      scrollto($('mark.highlight').filter(":visible").eq(newindex -1).addClass('current'));
      $('#searchnumber').val(newindex + '/' + maxindex + ' [' + hiddennum + ' invisible]').attr('aria-label', "Result" + newindex + ' of ' + maxindex).attr('data-current-index', newindex);
      $('#searchbtnprev').removeAttr('disabled');
      if (newindex == $('#searchnumber').attr('data-max-index')) {
        $('#searchbtnnext').attr('disabled', 'disabled');
      }
    }
  });

  $('#searchbtnfocusresult').on('click', function() {
    $('mark.highlight.current').attr('tabindex', '-1').focus();
  });

  $('[data-toggle]').each(function(e) {
    $('#'+$(this).attr('aria-controls')).on('hidden.bs.collapse shown.bs.collapse', function () {
      var val = $('#exampleSearch').val();
      if (val.length > 0) {
        search(val, false);
      } else {
        $('#searchnumber').val('0/0').attr('data-current-index', 0).attr('data-max-index', 0).attr('aria-label', "No search results").attr('disabled', 'disabled');
        $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
        $('#searchbtnfocusresult').hide();
        $('main').removeHighlight();
      }
    });
  });

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
        sctext = "all success criteria",
        sctext1 = "";
        sctext2 = ""
        techtext = "all techniques";
    var pressed = $('#tags .btn-primary');
    if (pressed.length>0) {
      pressed.each(function(index, el) {
        tags.push($(el).attr('data-tag'));
      });
      sctext1 = ' tagged with '+tags.join(', ');
    }
    var levels = new Array();
    var selected = $('#filter-levels input:checked'),
        all = $('#filter-levels input');
    if (selected.length<all.length) {
      selected.each(function(index, el) {
        levels.push($(el).attr('value').toUpperCase());
      });
      sctext2 = ' for levels '+levels.join(', ');
    };
    if ((pressed.length>0) || (selected.length<all.length)) {
      sctext = 'success criteria ' + sctext1 + sctext2;
    };
    var techniques = new Array();
    var selectedtechniques = $('#filter-techniques input:checked'),
        alltechniques = $('#filter-techniques input');
    if (selectedtechniques.length<alltechniques.length) {
      selectedtechniques.each(function(index, el) {
        techniques.push($(el).parent().text());
      });
      techtext = ' techniques for the following technologies: '+techniques.join(', ');
    };
    $('#status .sc').html(sctext);
    $('#status .tech').html(techtext);
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

  function init() {
    $('html').addClass('.has-js');
    $('.navbar-scroll').css('width', $('.navbar-scroll').parent().width()).fixedsticky();
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
          if ($(this).is('[aria-expanded=true]')) {
            $('.mainrow>div, .navrow .buttons li:nth-child(2), .navrow .buttons li:nth-child(3)').hide();
            $(this).attr('aria-expanded', 'false').parent().addClass('closed').parent().addClass('closed');
          } else {
            $('.mainrow>div, .navrow .buttons li:nth-child(2), .navrow .buttons li:nth-child(3)').show();
            $(this).attr('aria-expanded', 'true').parent().removeClass('closed').parent().removeClass('closed');
          }

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

      $('.filter-status').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(event) {
        $(this).removeClass('loading');
        $('.filter-status .loaded').show();
        $('.filter-status .loading').hide();
      });

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
