function gridData(temp, N) {
	var data = new Array();
	var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = 1;
	var width = 500/N;
	var height = 500/N;
	var click = 0;
	
	var existing = generateArray(temp, N);
	// iterate for rows	
	for (var row = 0; row < N; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < N; column++) {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				value: existing[row][column]
			})
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += width;
		}
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += height;	
	}
	return data;
}

var gridData1 = gridData(0, 50);	
var gridData2 = gridData(1, 50);	
// I like to log the data to the console for quick debugging

var grid1 = d3.select("#grid1")
	.append("svg")
	.attr("width","500px")
	.attr("height","500px");

	
var row1 = grid1.selectAll("#grid1 .row")
	.data(gridData1)
	.enter().append("g")
	.attr("class", "row");

var column1 = row1.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", function(d){return (d.value == 1)?'red':'blue'});

var grid2 = d3.select("#grid2")
	.append("svg")
	.attr("width","500px")
	.attr("height","500px");

var row2 = grid2.selectAll("#grid2 .row")
	.data(gridData2)
	.enter().append("g")
	.attr("class", "row");
	
var column2 = row2.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", function(d){return (d.value == 1)?'red':'blue'});