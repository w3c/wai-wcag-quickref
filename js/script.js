$('#filters input').on('change', function(e) {
  var o = "";
  $('#filters input').each(function(){
    var cinput = $(this);
    if (cinput.is(':checked')) {
      o = o +' ' + '<span class="label label-default">' + cinput.parent().text() + '</span><span>&nbsp;</span>';
      $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
        $(this).show();
      });
    } else {
      $('.' + cinput.attr('name') + '-' + cinput.val()).each(function () {
        $(this).hide();
      });
    }
  });
  o = ' <strong>Your selection:</strong> ' + o;
  $('#filtered').html(o);
});

function scrollto(target) {
   $('html,body').animate({
       scrollTop: (target.offset().top - 60)
  }, 1000);
  return false;
}

function search(query) {
  $('#searchbtnprev, #searchbtnnext').attr('disabled', 'disabled');
  $('main').removeHighlight();
  $('main').highlight(query);
  var marknum = $('mark.highlight:visible').length;
  $('#searchnumber').val('1/1').attr('data-current-index', '1');
  $('#searchnumber').val('1/1').attr('data-max-index', marknum);
  if (marknum == 1) {
    scrollto($('mark.highlight:visible').first().addClass('current'));
  } else if (marknum > 1) {
    $('#searchnumber').val('1/' + marknum);
    scrollto($('mark.highlight').first().addClass('current'));
    $('#searchbtnnext').removeAttr('disabled');
  }
}

$('#exampleSearch').on('keyup', function() {
  var val = $(this).val();
  if (val.length > 3) {
    search(val);
  } else {
    $('main').removeHighlight();
  }
});

$('#searchbtnprev').on('click', function() {
  var currentindex = parseInt($('#searchnumber').attr('data-current-index'),10);
  var maxindex = parseInt($('#searchnumber').attr('data-max-index'),10);
  $('mark.highlight.current').removeClass('current');
  if (currentindex > 1) {
    var newindex = currentindex - 1;
    scrollto($('mark.highlight:visible').eq(newindex - 1).addClass('current'));
    $('#searchnumber').val(newindex + '/' + maxindex).attr('data-current-index', newindex);
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
    scrollto($('mark.highlight:visible').eq(newindex -1).addClass('current'));
    $('#searchnumber').val(newindex + '/' + maxindex).attr('data-current-index', newindex);
    $('#searchbtnprev').removeAttr('disabled');
    if (newindex == $('#searchnumber').attr('data-max-index')) {
      $('#searchbtnnext').attr('disabled', 'disabled');
    }
  }
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
