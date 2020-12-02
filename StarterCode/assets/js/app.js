// @TODO: YOUR CODE HERE!

function MakeResponsive() {
    var svgArea = d3.select("body").select("svg")
    if (!svgArea.empty()) {
        svgArea.remove();
    };
    
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 30,
        bottom: 30,
        right: 200,
        left: 20
    };

    var height = svgHeight - margin.top-margin.bottom
    var width = svgWidth -margin.left-margin.right

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)



    d3.csv("assets/data/data.csv").then(data => {
        data.forEach(element =>{
            element.age = +element.age;
            element.ageMoe = +element.ageMoe;
            element.healthcare = +element.healthcare;
            element.healthcareHigh = +element.healthcareHigh;
            element.healthcareLow = +element.healthcareLow;
            element.id = +element.id;
            element.income = +element.income;
            element.incomeMoe = +element.incomeMoe
            element.obesity = +element.obesity
            element.obesityHigh = +element.obesityHigh
            element.obesityLow = +element.obesityLow
            element.poverty = +element.poverty
            element.povertyMoe = +element.povertyMoe
            element.smokes = +element.smokes
            element.smokesHigh = +element.smokesHigh
            element.smokesLow = +element.smokesLow
        });

        
        var xLinearScale = d3.scaleLinear().domain(d3.extent(data, d=>d.poverty))
            .range([0, width]);

        var yLinearScale = d3.scaleLinear().domain(d3.extent(data, d=> d.healthcare))
            .range([height, 0]);
        
        var xAxis = d3.axisBottom(xLinearScale)
        var yAxis = d3.axisLeft(yLinearScale)

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        chartGroup.append("g").call(yAxis);

        // var line = d3.line()
        //     .x(d => xLinearScale(d.poverty))
        //     .y(d => yLinearScale(d.healthcare))

        // chartGroup.append("path")
        //     .data([data])
        //     .attr("d", line)
        //     .attr("fill", "none")
        //     .attr("stroke", "black")

        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "8")
            .attr("fill", "blue")
            .attr("stroke-width", "0.5")
            .attr("stroke", "black")
            .attr("opacity", .5);

        
        // chartGroup.selectAll("text")
        //     .data(data)
        //     .enter()
        //     .append("text")
        //     .attr("dx", d=>xLinearScale(d.poverty))
        //     .attr("dy", d=>yLinearScale(d.healthcare))
        //     .text(d => d.abbr)






        var textGroup = chartGroup.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => `${xLinearScale(d.poverty)}px`)
            .attr("y", d => `${yLinearScale(d.healthcare)+3}px`)
            .style("font-size", "9px")
            .attr("text-anchor", "middle")
            .classed("stateText", true)
            .text(d => d.abbr)
            

        // var circular = chartGroup.selectAll("g").data(data).enter().append("g")
        //     .attr("transform", d=> `translate(${xLinearScale(d.poverty)}, ${yLinearScale(d.healthcare)})`) 


        // var circle = circular.append("circle")
        //     .attr("r", "10")
        //     .classed("stateCircle", true)
        // circular.append("text")
        //     .text(d => d.abbr)
        //     .classed("stateText", true)

        var toolTip = d3.select("body").append("div").attr("class", "d3-tip")

        circlesGroup.on("mouseover", function(d)  {

            toolTip.style("display", "block");
      
            toolTip.html(`<p>Healthcare: ${d.healthcare} <br/> Poverty: ${d.poverty}<p>`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");

            console.log(d.healthcare);
            console.log(d);
            console.log(this);
            console.log(toolTip);
        });
        circlesGroup.on("mouseout", function(){
            toolTip.style("display", "none");
        });

        textGroup.on("mouseover", function(d)  {

            toolTip.style("display", "block");
      
            toolTip.html(`<p>Healthcare: ${d.healthcare} <br/> Poverty: ${d.poverty}<p>`)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");

            console.log(d.healthcare);
            console.log(d);
            console.log(this);
            console.log(toolTip);
        });
        textGroup.on("mouseout", function(){
            toolTip.style("display", "none");
        });
    });
};


MakeResponsive()

d3.select(window).on("resize", MakeResponsive)