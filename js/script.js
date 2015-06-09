jQuery(document).ready(function($) {

  function updateuri(uri) {
    uri.fragment("");
    history.pushState(null, null, uri);
    localStorage.setItem('url', uri);
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
    var url = localStorage.getItem('url');
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
      $('#filtered').html('<strong>No filters set.</strong>');
      $('#clearall').hide();
    } else {
      o = ' <strong>Items filtered out:</strong> ' + o.join(', ');
      $('#filtered').html(o);
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
  }

  $('#filters').on('change', function(e) {
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
     $('html,body').animate({
         scrollTop: (target.offset().top - parseInt($('.filterrow').outerHeight(),10))
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
    $(this).parents('.form-group').find("input[type=checkbox]").prop('checked', false);
    $(this).parent().find("input[type=checkbox]").prop('checked', true).trigger( "change" );
  });

  $('.hide-sb').on('click', function(e){
    var sidebar = $(this).parent().parent().parent();
    var status = sidebar.find('.sidebar-content').toggle().is(":visible");
    sidebar.find('h6>span:first-child').toggle();
    sidebar.parent().toggleClass('hidden-sb');

    $(this).parent().find('.glyphicon').prop('hidden', function(idx, oldProp) {
        return !oldProp;
    });
    var uri = new URI(window.location);
    if (status) {
      uri.removeSearch("hide", $(this).parent().parent().attr('class'));
    } else {
      uri.addSearch("hide", $(this).parent().parent().attr('class'));
    }
    updateuri(uri);
    sidebar.css('width',$(this).parent().width());
  });

  function excolsc() {
    var hr = $('.sc-content hr');
    hr.hide(); // hide horizontal rule
    hr.prev().append('<br><button type="button" aria-expanded="false" class="btn btn-default"><span class="word-show"><span class="glyphicon glyphicon-chevron-right"></span> Show</span><span class="word-hide"><span class="glyphicon glyphicon-chevron-down"></span> Hide</span> full description</button>'); // Append button
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

    });;
  }
  excolsc();

  var tagButtons = function () {
    $('#tags').on('click', function(e) {
      var button = $(e.target);
      $('.sc-wrapper').removeClass('current');
      $('.sc-wrapper[data-tags~="' + button.attr('data-tag') + '"]').addClass('current');
      $('body').addClass('tagged');
      $('#tags button').removeClass('btn-primary').addClass('btn-default');
      button.removeClass('btn-default').addClass('btn-primary');
    });
  };

  function init() {
    $('html').addClass('.has-js');
    $('.navbar-scroll').css('width', $('.navbar-scroll').parent().width()).fixedsticky();
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
  }

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
