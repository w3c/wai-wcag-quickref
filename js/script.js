$('#filter-levels input').on('change', function(e) {
  $('#filter-levels input').each(function(){
    if ($(this).is(':checked')) {
      $('.levels-' + $(this).val()).each(function() {
        $(this).show();
      });
    } else {
      $('.levels-' + $(this).val()).each(function() {
        $(this).hide();
      });
    }
  });
});

$('#filters input').on('change', function(e) {
  var o = "";
  $('#filters input').each(function(){
    if ($(this).is(':checked')) {
      o = o +' ' + '<span class="label label-default">' + $(this).parent().text() + '</span><span>&nbsp;</span>';
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
