$('#filter-levels input').on('change', function(e) {
  $('#filter-levels input').each(function(){
    console.log($(this).is(':checked'));
    if ($(this).is(':checked')) {
      $('.levels-' + $(this).val()).each(function() {
        $(this).show();
      });
    } else {
      $('.levels-' + $(this).val()).each(function() {
        $(this).hide();
      });
    }
  });;
});