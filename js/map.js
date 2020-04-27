var map = new Datamap({
      scope: 'world',
      element: document.getElementById('mapContainer'),
      projection: 'equirectangular',
      height: 600,
      width: 900,

      fills: {
            defaultFill: 'rgba(212,175,55,0.9)',
        },
      
      geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: 'green',
            highlightBorderColor: 'rgb(0, 0, 0)',
            highlightBorderWidth: 0.3,
        },

})

