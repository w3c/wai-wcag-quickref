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
