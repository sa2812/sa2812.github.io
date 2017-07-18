function gridData(temp, N, size) {
	let data = new Array();
	let xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	let ypos = 1;
	const width = size/N;
	const height = size/N;
	const click = 0;
	
	const existing = generateArray(temp, N);
	// iterate for rows	
	for (let row = 0; row < N; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (let column = 0; column < N; column++) {
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

const gridWidth = d3.select("#grid1").node().getBoundingClientRect().width;
let gridData1 = gridData(0, 50, gridWidth);	

const d3grid1 = d3.select("#grid1").node();

const grid1 = d3.select("#grid1")
	.append("svg")
	.attr("width", d3grid1.getBoundingClientRect().width+"px")
	.attr("height", d3grid1.getBoundingClientRect().width+"px");
const row1 = grid1.selectAll("#grid1 .row")
	.data(gridData1)
	.enter().append("g")
	.attr("class", "row");

const column1 = row1.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", function(d){return (d.value == 1)?'red':'blue'});

let gridData2 = gridData(1, 50, gridWidth);	

const d3grid2 = d3.select("#grid2").node();
const grid2 = d3.select("#grid2")
	.append("svg")
	.attr("width", d3grid2.getBoundingClientRect().width+"px")
	.attr("height", d3grid2.getBoundingClientRect().width+"px");

const row2 = grid2.selectAll("#grid2 .row")
	.data(gridData2)
	.enter().append("g")
	.attr("class", "row");
	
const column2 = row2.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", function(d){return (d.value == 1)?'red':'blue'});