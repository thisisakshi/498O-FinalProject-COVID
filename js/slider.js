$( function() {
    $( "#slider" ).slider({
      value: new Date('2019.12.01').getTime() / 1000,
      min: new Date('2019.12.01').getTime() / 1000,
      max: new Date('2020.05.01').getTime() / 1000,
      step: 86400,
      slide: function( event, ui ) {
        $( "#date" ).val( new Date(ui.value *1000).toDateString() );
      }
    });
    $( "#date" ).val( (new Date($( "#slider" ).slider( "values", 0 )*1000).toDateString()) );
} );