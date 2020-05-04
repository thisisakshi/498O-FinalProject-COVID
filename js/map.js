
 var dataset = new Map();
 var covidData = new Map();

 // Getting the Health Expenditure per Capita % data
 d3.json("http://localhost:8080/").then(data => {
     data.forEach(element => {
           var countryCode = element["Country Code"];
            var lastyear = element["2017"];
            dataset.set(countryCode, Math.round(lastyear));
      });
 });


// Getting live Coronavirus data
 d3.json("https://pomber.github.io/covid19/timeseries.json")
      .then(data => {
            for (x in data) {
                  var len = data[x].length;
                  covidData.set(x, data[x][len - 1]["confirmed"]);
            }
});


var map = new Datamap({

      scope: 'world',
      element: document.getElementById('mapContainer'),
      done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                alert(geography.properties.name);
                
                // call function here to create plots
                
            });
      },
      projection: d3.geoMercator,
      height: 500,
      width: 800,

      fills: {
            defaultFill: 'rgba(212,175,55,0.9)',
            },
      
      geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: 'green',
            highlightBorderColor: 'rgb(0, 0, 0)',
            highlightBorderWidth: 0.3,
            popupTemplate: function(geography, data) {
                  try{
                        // getting the coronavirus data for the tooltip
                        var num = covidData.get(geography.properties.name);
                        // renaming US because of different data names
                        if(geography.properties.name == "United States of America") {
                              num = covidData.get("US");
                        }
                        return ShowTooltip(geography, num);
                  }catch(e){}
            },
      
            },
            projectionConfig: {
            rotation: [97, 0]
            },
});
 
 function ShowTooltip(geography, num){
       var tooltipDiv = '<div class="hoverinfo worldmap_tooltip"> ';
            tooltipDiv += '<div class="worldmap_tooltip_title">' + geography.properties.name + '</div>';
            tooltipDiv += '<br/><div class="worldmap_tooltip_data_label"> Confirmed Coronavirus Cases: ' + num +  '</div><br/>';
            tooltipDiv += '<div class="worldmap_tooltip_data_label"> Health Expenditure: ' +  dataset.get(geography.id) + '%</div><br/>';		
            tooltipDiv += ' </div>';
		return tooltipDiv;
 }