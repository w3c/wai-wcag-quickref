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