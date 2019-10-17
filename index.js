//Width and height
var margin = {top: 30, right: 40, bottom: 30, left: 50},
		w = 800 - margin.left - margin.right,
	h = 500 - margin.top - margin.bottom;

//Define map projection
var projection = d3.geoAlbersUsa()
					   .translate([w/2-75, h/2-40])
					   .scale([750]);

//Define path generator
var path = d3.geoPath()
				 .projection(projection);
				 
//Define quantize scale to sort data values into buckets of color

var color = d3.scaleQuantize()
//		var color = d3.scaleThreshold()
	//	.domain([0, 10, 20, 30, 40, 50])
		.domain([10, 40])
			.range(d3.schemeBlues[4]);
			


	  //Create SVG element
var svg = d3.select("#area1")
			.append("svg")
			.attr("width", w + margin.left + margin.right)
  		.attr("height", h + margin.top + margin.bottom)
			.style("border", "dashed")
			.attr("width", w)
			.attr("height", h);


//Another take a legend

var legend = d3.legendColor()
.labelFormat(d3.format(".0f"))
.shapeWidth(20)
.cells(5)
.labels(["< 25", "< 35", "< 45", "> 45"])
.title("Women in State Legislatures (%)")
.orient("vertical")
.scale(color)


svg.append("g")
// .attr("class", "legendSequential")
.call(legend)
.attr("transform", "translate(540, 130)");  



var tooltip = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0)
    .style("background-color", "white")
		//.style("border", "solid")
		//.style("border-width", "2px")
		//.style("border-radius", "5px")
  	.style("padding", "10px");



  	 // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html( 
      	(d.properties.name + " " + d.properties.value + "%" )
      )
     	.style("left", (d3.mouse(this)[0]+50) + "px")
    	.style("top", (d3.mouse(this)[1]) + "px")
		}	

  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

    
	//Load in agriculture data
	d3.csv("2019.csv", function(data) {


		for (var i = 0; i < data.length; i++) {
      console.log("state: " +data[i].state);
      console.log("value: " + data[i].value);
		}

		//Set input domain for color scale
		color.domain([
			d3.min(data, function(d) { return d.value; }), 
			d3.max(data, function(d) { return d.value; })
		]);

		//Load in GeoJSON data
		d3.json("us-states.json", function(json) {

			//Merge the ag. data and GeoJSON
			//Loop through once for each ag. data value
			for (var i = 0; i < data.length; i++) {
		
				//Grab state name
				var dataState = data[i].state;

				
				//Grab data value, and convert from string to float
				var dataValue = parseFloat(data[i].value);
		
				//Find the corresponding state inside the GeoJSON
				for (var j = 0; j < json.features.length; j++) {
				
					var jsonState = json.features[j].properties.name;
		
					if (dataState == jsonState) {
				
						//Copy the data value into the JSON
						json.features[j].properties.value = dataValue;
						
						//Stop looking through the JSON
						break;
						
					}
				}		
			}

			//Bind data and create one path per GeoJSON feature
			svg.selectAll("path")
			   .data(json.features)
			   .enter()
			   .append("path")
			   .attr("fill", "#66ccff")
	        .on("mouseover", mouseover)
	        .on("mousemove", mousemove)
	        .on("mouseleave", mouseleave)
			   .attr("d", path)
			   .attr('class', 'states')
			   .style("fill", function(d) {
			   		//Get data value
			   		var value = d.properties.value;
			   		
			   		if (value) {
			   			//If value exists…

			   			console.log("value: " + value);
			   			console.log("color value: " + color(value));
				   		return color(value);

			   		} else {
			   			//If value is undefined…
				   		return "#ccc";
			   		}

			   	})

			});
	
});






// Adds the svg canvas
var svg2 = d3.select("#area2")
.append("svg")
	.style("border", "dashed")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




d3.csv("national_totals_national_totals_with_party_breakdown.csv",

function(data) {

		for (var i = 0; i < data.length; i++) {
    //  console.log("year: " +data[i].year);
    //  console.log("percent: " + data[i].percent_women);
		}
//title text 
svg2.append("text")
    .attr("x", (w/2))             
    .attr("y", (margin.top ))
    .attr("text-anchor", "middle")  
    .style("font-size", "24px") 
    .style("font-family", "optima") 
    .text("Total Women in State Legislatures (2009-2019)");

// Add X axis
var x = d3.scaleLinear()
.domain([2009, 2019])
.range([ 0, w ]);
svg2.append("g")
.attr("transform", "translate(0," + h + ")")
.call(d3.axisBottom(x)
  .tickFormat(d3.format("d"))); 



// Add Y axis
var y = d3.scaleLinear()
  .domain( [23, 29])
  .range([ h, 0 ]);
svg2.append("g")
  .call(d3.axisLeft(y)
    .tickFormat(d => d + "%"));


  // Add the line
svg2.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "#6baed6")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(d.percent_women) })
      )

  svg2.append("rect")
  .attr("fill", "#ff9900")
  .style("opacity", .4)
  .attr("width", 52)
  .attr("height", 400)
  .attr("x", 515)
  .attr("y", 1) 

  svg2.append("text")
.attr("x", 515)             
    .attr("y", 0 - (margin.top - 140))
    .attr("text-anchor", "middle")  
    .style("font-size", "12px") 
    .style("font-family", "optima") 
    .text("Midterm Election");


svg2.append("rect")
  .attr("fill", "#ff9900")
  .style("opacity", .4)
  .attr("width", 54)
  .attr("height", 400)
  .attr("x", 700)
  .attr("y", 10) 

  svg2.append("text")
.attr("x", 400)             
    .attr("y", 0 - (margin.top - 140))
    .attr("text-anchor", "middle")  
    .style("font-size", "12px") 
    .style("font-family", "optima") 
    .text("General Election");
// create a tooltip
var tooltip = d3.select("#area2")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html("Year: " + d.year + "<br/>"
        + "Women in State Legislatures: " + d.percent_women + '%' + "<br/>" 
        + "Party Breakdown of Female State Legislators:" + "<br/>" 
        + " Democrats: " + d.per_dem + '%' + "<br/>" 
        + " Republicans: " + d.per_repub + '%' + "<br/>"
        + " Third Party: " + d.per_third + '%' + "<br/>"  
        + " Nonpartisan: " + d.per_nonpartisan + '%'   
        )
      .style("left", (d3.mouse(this)[0]+100) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

 
// Add the points
svg2
  .append("g")     
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.year) } )
    .attr("cy", function(d) { return y(d.percent_women) } )
    .attr("r", 5)
    .attr("fill", "#6baed6")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave) 

})	