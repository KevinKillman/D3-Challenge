// @TODO: YOUR CODE HERE!

function xScale(data, chosenX){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenX])*.95, d3.max(data,d=>d[chosenX]*1.1)])
        .range([0,width]);
        return xLinearScale;
};

function yScale(data, chosenY){
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenY])*.8, d3.max(data, d=>d[chosenY])*1.1])
        .range([height, 0]);
        return yLinearScale;
};

function renderCircles( circlesGroup,text, newXScale, newYScale, xAxis, yAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx",d => {return newXScale(d[xAxis])})
        .attr("cy",d => {return newYScale(d[yAxis])});

        text.transition()
        .duration(1000)
        .attr("x",d => {return newXScale(d[xAxis])})
        .attr("y",d => {return newYScale(d[yAxis])});
    
    return circlesGroup,text;
}


function renderAxis( newXScale, newYScale, xAxis, yAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    var leftAxis = d3.axisLeft(newYScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return xAxis, yAxis;
}

function updateToolTip(xAxis, yAxis, circles) {
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`${d.state} <br>${yAxis} : ${d[yAxis]}<br>${xAxis} : ${d[xAxis]}`);
    });
    circles.call(toolTip);
    circles.on("mouseover", function(d) {
        toolTip.show(d, this)
    }).on("mouseout", function(d,i)  {
        toolTip.hide(d)
    });
    return circles;
}


var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
    top: 100,
    bottom: 100,
    right: 100,
    left: 100
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;


var chosenX = "poverty";
var chosenY = "healthcare";



function MakeResponsive() {
    var svgArea = d3.select("body").select("svg")
    if (!svgArea.empty()) {
        svgArea.remove();
    };
    svgWidth = window.innerWidth;
    svgHeight = window.innerHeight;

    height = svgHeight - margin.top - margin.bottom;
    width = svgWidth - margin.left - margin.right;

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
        
        var xLinearScale = xScale(data, chosenX);

        var yLinearScale = yScale(data, chosenY);
        
        var bottomAxis = d3.axisBottom(xLinearScale)
        var leftAxis = d3.axisLeft(yLinearScale)

        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        var yAxis = chartGroup.append("g").call(leftAxis)


        var circlesGroup = chartGroup.append("g")
            // .attr("transform", `translate(${margin.right}, ${margin.top})`)
        var circles = circlesGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "12")
            .attr("fill", "blue")
            .attr("stroke-width", "0.5")
            .attr("stroke", "black")
            .attr("opacity", .5);
        
        var text = circlesGroup.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare)*1.01)
            .text(d => {return d.abbr})
            .classed('stateText', true)
        var circles = updateToolTip(chosenX, chosenY, circles)
        var text = updateToolTip(chosenX, chosenY, text)





        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`)

        var povertyLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("Poverty (%)")

        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age (Median)");

        var incomeLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Income (Median)");

        xLabelsGroup.selectAll("text").on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenX){
                chosenX = value;
                xLinearScale = xScale(data, chosenX);
                circles, text = renderCircles(circles,text, xLinearScale, yLinearScale, chosenX, chosenY);
                xAxis, yAxis = renderAxis(xLinearScale, yLinearScale, xAxis, yAxis);
                circles = updateToolTip(chosenX, chosenY, circles)
                text = updateToolTip(chosenX, chosenY, text)
            }

            if (chosenX === "age") {
                povertyLabel.classed("inactive", true).classed("active", false)
                ageLabel.classed("active", true).classed("inactive", false)
                incomeLabel.classed("inactive", true).classed("active", false)

            } else if (chosenX ==="poverty") {
                povertyLabel.classed("active", true).classed("inactive", false)
                ageLabel.classed("inactive", true).classed("active", false)
                incomeLabel.classed("inactive", true).classed("active", false)

            } else if (chosenX ==="income") {
                incomeLabel.classed("active", true).classed("inactive", false)
                povertyLabel.classed("inactive", true).classed("active", false)
                ageLabel.classed("inactive", true).classed("active", false)


            }
            // console.log(value)
        })

        var yLabelsGroup = chartGroup.append("g")
            
            .attr("transform", `translate(0, ${height / 2})`)

        var healthcareLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(270)")
            .attr("x", 0)
            .attr("y", -23)
            .attr("value", "healthcare")
            .classed("active", true)
            .text("Lack Healthcare (%)");
        var obesityLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(270)")
            .attr("x", 0)
            .attr("y", -40)
            .attr("value", "obesity")
            .classed("inactive", true)
            .text("Obesity (%)");
        var smokesLabel = yLabelsGroup.append("text")
            .attr("transform", "rotate(270)")
            .attr("x", 0)
            .attr("y", -60)
            .attr("value", "smokes")
            .classed("inactive", true)
            .text("Smokes (%)");
        yLabelsGroup.selectAll("text").on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenY){
                chosenY = value;
                yLinearScale = yScale(data, chosenY);
                circles, text = renderCircles(circles,text, xLinearScale, yLinearScale, chosenX, chosenY);
                xAxis, yAxis = renderAxis(xLinearScale, yLinearScale, xAxis, yAxis);
                circles = updateToolTip(chosenX, chosenY, circles)
                text = updateToolTip(chosenX, chosenY, text)
            }

            if (chosenY === "healthcare") {
                healthcareLabel.classed("active", true).classed("inactive", false)
                obesityLabel.classed("inactive", true).classed("active", false)
                smokesLabel.classed("inactive", true).classed("active", false)

            } else if (chosenY ==="obesity") {
                obesityLabel.classed("active", true).classed("inactive", false)
                healthcareLabel.classed("inactive", true).classed("active", false)
                smokesLabel.classed("inactive", true).classed("active", false)

            } else if (chosenY ==="smokes") {
                smokesLabel.classed("active", true).classed("inactive", false)
                healthcareLabel.classed("inactive", true).classed("active", false)
                obesityLabel.classed("inactive", true).classed("active", false)


            }
            // console.log(value)
        })

        // var toolTip = d3.select("body").append("div").attr("class", "d3-tip")

        // circles.on("mouseover", function(d)  {

        //     toolTip.style("display", "block");
      
        //     toolTip.html(`<p>Healthcare: ${d.healthcare} <br/> Poverty: ${d.poverty}<p>`)
        //         .style("left", d3.event.pageX + "px")
        //         .style("top", d3.event.pageY + "px");

            
        // });
        // circles.on("mouseout", function(){
        //     toolTip.style("display", "none");
        // });

        // textGroup.on("mouseover", function(d)  {

        //     toolTip.style("display", "block");
      
        //     toolTip.html(`<p>Healthcare: ${d.healthcare} <br/> Poverty: ${d.poverty}<p>`)
        //         .style("left", d3.event.pageX + "px")
        //         .style("top", d3.event.pageY + "px");

            
        //     console.log(d.abbr)
        // });
        // textGroup.on("mouseout", function(){
        //     toolTip.style("display", "none");
        // });
    });
};


MakeResponsive()

d3.select(window).on("resize", MakeResponsive)