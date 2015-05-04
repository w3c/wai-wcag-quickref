jQuery(document).ready(function($) {

  function updateuri(uri) {
    uri.fragment("");
    history.pushState(null, null, uri);
    localStorage.setItem('url', uri);
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

  $('#filters input').on('change', function(e) {
    var o = [];
    $('#filters input').each(function(){
      var cinput = $(this);
      var location = window.history.location || window.location;
      var uri = new URI(location);
      if (cinput.is(':checked')) {
        $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
          $(this).show();
        });
        uri.removeSearch(cinput.attr('name'),cinput.val());
      } else {
        o.push($.trim(cinput.parent().text()));
        $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
          $(this).hide();
        });
        uri.addSearch(cinput.attr('name'),cinput.val());
      }
      updateuri(uri);
    });

    if (o.length == 0) {
      $('#filtered').html('').parent().parent().hide('slow');
    } else {
      o = ' <strong>Hidden items:</strong><br>' + o.join(', ');
      $('#filtered').html(o).parent().parent().show('slow');
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
  });

  $('#clearall').on('click', function(e) {
    var unchecked = $('#filters input:not(:checked)');
    unchecked.each(function(){
      $(this).prop('checked', 'checked');
    });
    unchecked.first().trigger('change');
  });

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
            sidebar.find('h6>span:first-child').toggle();
            sidebar.parent().toggleClass('hidden-sb');
          }
        } else {
          for (var i = data[prop].length - 1; i >= 0; i--) {
            $('[name=' + prop + '][value=' + data[prop][i] + ']').prop('checked', false).trigger( "change" );
          }
        }
      }
    }
  }

  function scrollto(target) {
     $('html,body').animate({
         scrollTop: (target.offset().top - 60)
    }, 1000);
    return false;
  }

  function search(query, scroll) {
    $('#searchbtnfocusresult').hide();
    $('#searchbtnprev, #searchbtnnext, #searchnumber').attr('disabled', 'disabled');
    $('#searchnumber').val('0/0');
    $('main').removeHighlight();
    $('main').highlight(query);
    var total = $('mark.highlight');
    var marknum = total.filter(":visible").length;
    var hiddennum = total.length - marknum;
    $('#searchnumber').attr('data-current-index', '1').attr('data-max-index', marknum).attr('data-hiddennum', hiddennum);
    if (marknum > 0) {
      $('#searchbtnfocusresult').show();
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
      $('#searchbtnfocusresult').hide();
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
  });

  function affixOn(target) {
    var $affixTarget = $(target);

    $affixTarget.affix({
      offset: {
        top: function () {
          var offsetTop      = $affixTarget.offset().top
          var sideBarMargin  = parseInt($affixTarget.children(0).css('margin-top'), 10)
          var navOuterHeight = $('.navbar-default').height()

          return (this.top = offsetTop - navOuterHeight - sideBarMargin)
        },
        bottom: function () {
          return 0;
          // return (this.bottom = $('.bs-docs-footer').outerHeight(true))
        }
      }
    });

    $affixTarget.on('affix.bs.affix', function(e) {
      $(this).css('width', $(this).parent().width());
      $(this).css('position', 'fixed');
    });

    $affixTarget.on('affixed-top.bs.affix', function(e) {
      $(this).css('width', 'auto');
      $(this).css('position', 'static');
    });
  }

  function affixOff(target) {
    $(window).off('.affix');
    $(target)
        .removeClass("affix affix-top affix-bottom")
        .removeData("bs.affix");
  }

  function moveSearchToSide() {
    $('#searchcontainer-mainbar form').detach().appendTo('#searchcontainer-sidebar');
  }

  function moveSearchToMain() {
    $('#searchcontainer-sidebar form').detach().appendTo('#searchcontainer-mainbar');
  }

  function init() {
    $('html').addClass('.has-js');
    affixOff('.navbar-scroll');
    affixOff('#searchcontainer-mainbar');
    if ($( window ).width() > 896) {
      moveSearchToSide();
      affixOn('.navbar-scroll');
      $('html').addClass('large');
      $('.tab-nav-wrap .nav-pills').addClass('nav-stacked');
    } else {
      moveSearchToMain();
      affixOn('#searchcontainer-mainbar');
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

});

$(window).on('popstate', function(event) {
  applyurl();
});