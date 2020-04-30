
 var dataset = new Map();

 d3.json("http://localhost:8080/").then(data => {
     data.forEach(element => {
           var countryCode = element["Country Code"];
            var lastyear = element["2017"];
            dataset.set(countryCode, Math.round(lastyear));
      });
 });


 var map = new Datamap({
 
       scope: 'world',
       element: document.getElementById('mapContainer'),
       projection: 'mercator',
       height: 400,
       width: 600,
 
       fills: {
             defaultFill: 'rgba(212,175,55,0.9)',
         },
       
       geographyConfig: {
             popupOnHover: true,
             highlightOnHover: true,
             highlightFillColor: 'green',
             highlightBorderColor: 'rgb(0, 0, 0)',
             highlightBorderWidth: 0.3,
             popupTemplate: function(geography, dataset) {
                   try{
                         //console.log(geography.id);
                         return ShowTooltip(geography);
                   }catch(e){}
             },
      
         },
         projectionConfig: {
            rotation: [97, 0]
          },
 })
 
 function ShowTooltip(geography){
       // return '<div class="hoverinfo">' + geography.properties.name + ' Electoral Votes:' +  data.electoralVotes + ' </div>';

       var tooltipDiv = '<div class="hoverinfo worldmap_tooltip"> ';
		tooltipDiv += '<div class="worldmap_tooltip_title">' + geography.properties.name + '</div>';
		tooltipDiv += '<div class="worldmap_tooltip_data_label"> Health Expenditure : </div>';
		tooltipDiv += '<div class="worldmap_tooltip_data_value">'+ dataset.get(geography.id)+ '% </div>';
		tooltipDiv += ' </div>';
		return tooltipDiv;
 }
 
 