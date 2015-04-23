$('#filters input').on('change', function(e) {
  var o = "";
  $('#filters input').each(function(){
    var cinput = $(this);
    if (cinput.is(':checked')) {
      $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
        $(this).show();
      });
    } else {
      o = o +' ' + '<span class="label label-default">' + cinput.parent().text() + '</span><span>&nbsp;</span>';
      $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
        $(this).hide();
      });
    }
  });
  if (o=="") {
    $('#filtered').html('').hide('slow');
  } else {
    o = ' <strong>Hidden items:</strong> ' + o;
    $('#filtered').html(o).parent().show('slow');
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
    $('#searchnumber').val('1/' + marknum + '[' + hiddennum + ' invisible]').removeAttr('disabled', 'disabled');
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
  $(this).parent().find('span').prop('hidden', function(idx, oldProp) {
      return !oldProp;
  });
  var uri = new URI(window.location);
  if (status) {
    uri.removeSearch("hide", $(this).parent().parent().attr('class'));
  } else {
    uri.addSearch("hide", $(this).parent().parent().attr('class'));
  }
  history.replaceState(null, null, uri);
});

var $sideBar = $('.navbar-scroll');

$sideBar.affix({
  offset: {
    top: function () {
      var offsetTop      = $sideBar.offset().top
      var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
      var navOuterHeight = $('.navbar-default').height()

      return (this.top = offsetTop - navOuterHeight - sideBarMargin)
    },
    bottom: function () {
      return 0;
      // return (this.bottom = $('.bs-docs-footer').outerHeight(true))
    }
  }
});

$sideBar.on('affix.bs.affix', function(e) {
  $(this).css('width', $(this).parent().width());
  $(this).css('position', 'fixed');
});

$sideBar.on('affixed-top.bs.affix', function(e) {
  $(this).css('width', 'auto');
  $(this).css('position', 'static');
});
