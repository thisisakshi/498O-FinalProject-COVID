
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
            addFillKey(covidData);
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
            highlightFillColor: 'dodgerBlue',
            highlightBorderColor: 'rgb(0, 0, 0)',
            highlightBorderWidth: 1.5,
            data: dataset,
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

function addFillKey(mapData) {
      var fill = {}
      var cScale = d3.scale.linear()
            .domain([Math.min(...covidData.values()), Math.max(...covidData.values())])
            .range(["#fc9272", "#67000d"]);
      var countries = Datamap.prototype.worldTopo.objects.world.geometries;
      for (var i = 0, j = countries.length; i < j; i++) {
            var code = countries[i].id
            var name = ""
            var color = ""
            var cases = ""
            if (countries[i].properties.name == "United States of America") {
                  name = "US"
            } else { 
                  name = countries[i].properties.name
            }
            cases = covidData.get(name)
            if (typeof cases !== 'undefined') {
                  console.log(cases)
                  if (cases > 1000000) {
                        color = "#67000d"
                  }
                  else if (cases > 500000) {
                        color = "#a50f15"
                  }
                  else if (cases > 100000) {
                        color = "#cb181d"
                  }
                  else if (cases > 50000) {
                        color = "#ef3b2c"
                  }
                  else if (cases > 10000) {
                        color = "#fb6a4a"
                  }
                  else if (cases > 5000) {
                        color = "#fc9272"
                  }
                  else if (cases > 1000) {
                        color = "#fcbba1"
                  }
                  else if (cases > 0) {
                        color = "#fee0d2"
                  }
                  fill[code] = color
            } else {
                  fill[code] = "#fee0d2"
            }
      }
      delete fill[-99]
      console.log(fill)
      map.updateChoropleth(fill)
}
 
 function ShowTooltip(geography, num){
       var tooltipDiv = '<div class="hoverinfo worldmap_tooltip"> ';
            tooltipDiv += '<div class="worldmap_tooltip_title">' + geography.properties.name + '</div>';
            tooltipDiv += '<br/><div class="worldmap_tooltip_data_label"> Confirmed Coronavirus Cases: ' + num +  '</div><br/>';
            tooltipDiv += '<div class="worldmap_tooltip_data_label"> Health Expenditure: ' +  dataset.get(geography.id) + '%</div><br/>';		
            tooltipDiv += ' </div>';
		return tooltipDiv;
 }