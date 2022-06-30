var foldernames = ['MUPPET CAPER', 'MUPPET MOVIE', 'MUPPETS TAKE MANHATTAN', 'MUPPET TREASURE ISLAND', 'MUPPETS MOST WANTED', 'MUPPET SHOW']
d3.select("#selectButton")
  .selectAll('myOptions')
  .data(foldernames)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; })

var foldername = 'Admin'


function update(foldername) {


d3.csv(foldername +".csv", function(data){

  var treeData = d3.stratify()
    .id(function(d) { return d.Doc; })
    .parentId(function(d) { return d.Folder; })
    (data);

  var width = 500;
  var height = 700;
  var radius = Math.min(width, height) / 2;



  var formatDateIntoYear = d3.timeFormat("%Y");
  var formatDate = d3.timeFormat("%b %Y");
  var parseDate = d3.timeParse("%d/%m/%Y %I:%M");

  //var parseDate2 = d3.timeParse("%b %Y")

  var startDate = new Date("2014-01-01"),
      endDate = new Date("2016-12-31");

  var svg = d3.select("#chart").append("svg")
              .append("g");

  var g = d3.select('svg').attr('width', width).attr('height', 760)
          .select('g').attr('transform', 'translate(' + width / 2 + ',' + height/2.25  + ')');

  var x = d3.scaleLinear()
      .range([0, 2 * Math.PI]);

  var y = d3.scaleLinear()
      .range([0, radius]);

  var cat20 = d3.schemeCategory20
  var blues = ["#FFFFFF","#E5007B","#E5007B","#E20095","#DF00AF","#DC00C8","#D400DA","#B700D7","#9B00D4","#7F00D2","#6500CF","#4A00CC","#3100C9","#1800C7","#0000C4","#0017C1","#002EBF"]
  var rainbow2 = d3.scaleSequential(d3.interpolateRainbow).domain([0,15]);
  var black = ["#E5007B","#000000","#FFFFFF"]



  var nest = d3.nest()
    .key(function(d) {
        return d.Category})
    .sortKeys(d3.descending)
    .entries(data)

  var colors = d3.scaleOrdinal()
    .domain(function(d) {
      return nest(d.key);
    })
    .range(cat20);

  var partition = d3.partition()
          .size([2*Math.PI, radius]);


  var arc = d3.arc()
      .startAngle(function (d) { return d.x0 })
      .endAngle(function (d) { return d.x1 })
      .innerRadius(function (d) { return d.y0})
      .outerRadius(function (d) { return d.y1 });

  var root = d3.hierarchy(treeData)
  .sum(function(d) {return d.height === 0 ? 1 : "none"; })
  .sort(function(a, b) { return b.value - a.value; });

var legend = d3
  .select('#legend')
  //Make the legend
  .append('svg')
  .attr('height', '1000px')
  .attr('width', '150px')
  .attr('class', 'legend');

// initial draw
drawLegend('Category');

// function to redraw legend
// based on d3 enter, update, exit
function drawLegend(currentSelection) {

// apply nest function for new selection
    let nestedData = d3
      .nest()
      .sortKeys(d3.descending)
      .key(function (d) {
      return d[currentSelection];
      }).entries(data);

    // update selection
    let lu = legend
      .selectAll('g')
    // the key function here is important
    // so that d3 can calculate the enter, update, exit
      .data(nestedData, d => d.key);

    // exit selection
      lu.exit().remove();

    // enter selection
    // add container g
      let le = lu
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
        return 'translate(0,' + i * 25 + ')';
        });

    // on enter add rect
    le.append('rect')
        .attr('class', 'rect')
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', function (d,i) {
        return colors(d.key);
        })
        .style('stroke', 'Grey');

    // on enter add text
    le.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em');

    // enter + update
        lu = le.merge(lu);

    // on enter or update, change text
        lu.selectAll('text')
        .text(function(d){
        return d.key;
        });
        }



d3.selectAll("input[name='stack']").on('change', function (d) {
drawLegend(this.value);
  var colVar = this.value;
  if (colVar == 'Category') {
  d3.selectAll(".node").style("fill", function(d) {
     return colors(d.data.data.Category)});
  }
  else if (colVar == 'Owner') {
    d3.selectAll(".node").style("fill", function(d) {
     return colors(d.data.data.Owner)});
  } else if (colVar == 'Dup') {
    d3.selectAll(".node").style("fill", function(d) {
     return colors(d.data.data.Dup)});
  } else if (colVar == 'Passed') {
    d3.selectAll(".node").style("fill", function(d) {
     return colors(d.data.data.Passed)});
    }
   else if (colVar == 'YearRange') {
    d3.selectAll(".node").style("fill", function(d) {
     return colors(d.data.data.YearRange)});
    }
    else if (colVar == 'Year') {
     d3.selectAll(".node").style("fill", function(d) {
      return colors(d.data.data.Year)});
     }

});


    g.selectAll("path")
        .data(partition(root).descendants())
        .enter().append("g")
        .append("path")
        .attr("class", "node")
        .attr("d", arc)
        .attr("display", function (d) { return d.depth ? null : "none"; })
        .style('stroke-width',.1)
        .style("fill", function(d) {return colors(d.data.data.Category)})//changes colour



  var svg = d3.select("svg"),
      margin = {right: 50, left: 50},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height");


var div = d3.select("body").append("div")
     .attr("class", "tooltip")
     .style("opacity", 0);

g.selectAll("path")
.on('mouseover', function (d, i) {
   d3.select(this).transition()
        .duration('50')
        .attr('opacity', '.2')
        updateData(d.data.data.FileHash);
          i++;
   div.transition()
        .duration(50)
        .style("opacity", 1);

   div.html(d.data.data.Doc)
    .style("left", function() {
    return d3.event.pageX+50 > (window.innerWidth * .75) ? d3.event.pageX - window.pageYOffset - 50 + "px" : d3.event.pageX + 50 + "px"
    })
    .style("top", function() {
    var clientrect = d3.select(this).node().getBoundingClientRect();
    return (d3.event.pageY + clientrect.height ) > (window.innerHeight) ? (window.innerHeight - clientrect.height + window.pageYOffset - (clientrect.height *.25) )+ "px" : d3.event.pageY + "px"
    })


});
g.selectAll("path")
.on('mouseout', function (d, i) {
d3.select(this).transition()
    .duration('50')
    .attr('opacity', '1');
div.transition()
    .duration('50')
    .style("opacity", 0);
});


function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

g.selectAll("path")
  .on('click', function (d, i) {
    copyToClipboard(d.data.data.FullName)});




      function updateData(h)
         {

      g.selectAll(".node").attr('opacity', function(d, i) {
        return d.data.data.FileHash == h ?  ".6": "1";
     })
        g.selectAll(".node").style('stroke-width', function(d, i) {
           return d.data.data.FileHash == h ?  "2": "0";
         })


      }


      const searchInput = document.querySelector('#txtName input');


      searchInput.onkeyup = (event) => {
        if (event.keyCode === 13) {
          openSearchPage();
        }
        else {
          closeSearchPage()
          };

      };



function openSearchPage() {
var txtName = d3.select("#searchInput").node().value;
var meow = function(frat) {return frat.includes(txtName.toLowerCase())};
g.selectAll(".node").style('opacity', function(d, i) {
  return meow((d.data.data.FullName).toLowerCase()) ?  "1": "0"});

}

function closeSearchPage() {
  g.selectAll(".node").style('opacity','1')
}



})
}
d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        document.getElementById("chart").innerHTML = ""
        document.getElementById("legend").innerHTML = ""
        d3.select(".tooltip").remove()
        var foldername = d3.select(this).property("value")

        // run the updateChart function with this selected option
        update(foldername)
    })
