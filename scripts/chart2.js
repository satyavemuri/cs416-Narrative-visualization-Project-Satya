const marginChart2 = {top: 50, right: 20, bottom: 50, left: 60};
const widthChart2 = 600;
const heightChart2 = 400;

function renderChart2(slideId) {
  document.getElementById(slideId).setAttribute("style","display:block");
  // initialise layout variables

  var finalDataChart2 = [];
  var prevIMDBRating = 0;
  var declineStartedFlag = false;
  var leastIMDBRating = 10;

  // initialise charts
  const svg = d3.select('#svg2')
      .attr('width', widthChart2 + marginChart2.left + marginChart2.right)
      .attr('height', heightChart2 + marginChart2.top + marginChart2.bottom)
      .append('g')
      .attr('transform', 'translate(' + marginChart2.left + ',' + marginChart2.top + ')')
      .attr('id', 'svg-2-parent-g');

  const parseDateTime = d3.timeParse("%B %d, %Y");

   // get data
  const jsonFile = 'data/NetflixOriginals.json';
  var data;
  d3.json(jsonFile).then((data) => {
    this.data = data;
     data.forEach(function(d) {
    d.date = parseDateTime(d.Premiere);
  });
  data = data.filter(d => d.date != null);
  params.forEach(function(param) {
      if (!d3.select('#' + param.id).property('checked')) {
        data = data.filter(d => d['Genre'] != param.id);
      }
    });
  const dataGroupedByYear = data.reduce((group, d) => {
      const { date } = d;
      group[date.getFullYear()] = group[date.getFullYear()] ?? [];
      group[date.getFullYear()].push(d);
      return group;
    }, {});
    for(const key in dataGroupedByYear){
       var sumScores = 0;
       dataGroupedByYear[key].forEach(d => sumScores += d["IMDB Score"]);
       var obj = {} ;
       obj.year = key;
       obj.averageScore=sumScores/dataGroupedByYear[key].length;
       finalDataChart2.push(obj);
    }
    finalDataChart2.sort((a, b) => (a.year > b.year) ? 1 : -1);
    data = finalDataChart2;

  d3.select('#svg-2-parent-g').selectAll('*').remove();
  svg.selectAll('rect').remove();

  // X axis
  const x = d3.scaleBand()
      .range([0, widthChart2])
      .domain(data.map(function (d) {
        return d.year;
      }))
      .padding(0.2);
  svg.append("g")
      .attr("transform", "translate(0," + heightChart2 + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Add Y axis
  const y = d3.scaleLinear()
      .domain([0, 7])
      .range([heightChart2, 0]);
  svg.append("g")
      .call(d3.axisLeft(y));

  d3.select('#svg2').selectAll("rect")
      .data(data)
      .attr("height", function(d) { return heightChart2 - y(d.averageScore); });

  // Bars
  svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", function(d) { return y(d.averageScore); })
      .attr("width", x.bandwidth())
      .attr("height", function(d, i) {
        
        if (!declineStartedFlag ) {
            if(prevIMDBRating > d.averageScore) {
              declineStartedFlag = true;
            }
            prevIMDBRating = d.averageScore;
        }
        leastIMDBRating = Math.min(leastIMDBRating, d.averageScore);

       return heightChart2 - y(d.averageScore); 
     })
      .attr("fill", "#69b3a2")


  // Features of the annotation
  const annotations = [
    {
      note: {
        label: "Decline begins("+prevIMDBRating.toFixed(1)+")"
      },
      connector: {
        end: "arrow"
      },
      type: d3.annotationLabel,
      x: 250,
      y: 75,
      dx: 0,
      dy: -25
    },
    {
      note: {
        label: "Worst scores since 2014("+leastIMDBRating.toFixed(1)+")"
      },
      connector: {
        end: "arrow"
      },
      type: d3.annotationLabel,
      x: 615,
      y: 100,
      dx: 0,
      dy: -25
    }
  ]

  if (params.some(param => !d3.select('#' + param.id).property('checked'))) {
    // remove annotations
    d3.select('#svg-2-annotations').selectAll('*').remove();
    d3.select('#svg-2-annotations').remove();
  } else {
    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    d3.select("#svg2")
        .append("g")
        .attr('id', 'svg-2-annotations')
        .call(makeAnnotations);
  }
  });
}


const params = [
  {
    id: "Action",
  },
  {
    id: "Adventure",
  },
  {
    id: "Animation",
  },
  {
    id: "Anime",
  },
  {
    id: "Christmas",
  },
  {
    id: "Comedy",
  },
  {
    id: "Crime",
  },
  {
    id: "Documentary",
  },
  {
    id: "Drama",
  },
  {
    id: "Fantasy",
  },
  {
    id: "Family",
  },
  {
    id: "Musical",
  },
  {
    id: "Mystery",
  },
  {
    id: "Other",
  },
  {
    id: "Romance",
  },
  {
    id: "Science-Fiction",
  },
  {
    id: "Sports-film",
  },
  {
    id: "War",
  },
  {
    id: "Western",
  },
];

function updateChart2Data() {
   // get data
  const jsonFile = 'data/NetflixOriginals.json';
  var data;
  var finalDataChart2 = [];
  var prevIMDBRating = 0;
  var declineStartedFlag = false;
  var leastIMDBRating = 10;

  var annotation1X = 250;
  var annotation1Y = 75;
  var annotation1DX = 0;
  var annotation1DY = -25;

  var annotation2X = 615;
  var annotation2Y = 100;
  var annotation2DX = 0;
  var annotation2DY = -25;

  const parseDateTime = d3.timeParse("%B %d, %Y");
  d3.json(jsonFile).then((data) => {
    this.data = data;
     data.forEach(function(d) {
    d.date = parseDateTime(d.Premiere);
  });
  data = data.filter(d => d.date != null);
  params.forEach(function(param) {
      if (!d3.select('#' + param.id).property('checked')) {
        data = data.filter(d => d['Genre'] != param.id);
      }
    });
  const dataGroupedByYear = data.reduce((group, d) => {
      const { date } = d;
      group[date.getFullYear()] = group[date.getFullYear()] ?? [];
      group[date.getFullYear()].push(d);
      return group;
    }, {});
    for(const key in dataGroupedByYear){
       var sumScores = 0;
       dataGroupedByYear[key].forEach(d => sumScores += d["IMDB Score"]);
       var obj = {} ;
       obj.year = key;
       obj.averageScore=sumScores/dataGroupedByYear[key].length;
       finalDataChart2.push(obj);
    }
    finalDataChart2.sort((a, b) => (a.year > b.year) ? 1 : -1);
    data = finalDataChart2;

  // Add Y axis
  const y = d3.scaleLinear()
      .domain([0, 7])
      .range([heightChart2, 0]);
  const svg = d3.select('#svg-2-parent-g').selectAll("rect").data(data)
  .attr("y", function(d) { return y(d.averageScore); })
  .attr("height", function(d) {

    if (!declineStartedFlag ) {
        if(prevIMDBRating > d.averageScore) {
          declineStartedFlag = true;
        }
        prevIMDBRating = d.averageScore;
    }
    leastIMDBRating = Math.min(leastIMDBRating, d.averageScore);

   return heightChart2 - y(d.averageScore);
  });

  // Features of the annotation
  const annotations = [
    {
      note: {
        label: "Decline begins("+prevIMDBRating.toFixed(1)+")"
      },
      connector: {
        end: "arrow"
      },
      type: d3.annotationLabel,
      x: annotation1X,
      y: annotation1Y,
      dx: annotation1DX,
      dy: annotation1DY
    },
    {
      note: {
        label: "Worst scores since 2014("+leastIMDBRating.toFixed(1)+")"
      },
      connector: {
        end: "arrow"
      },
      type: d3.annotationLabel,
      x: annotation2X,
      y: annotation2Y,
      dx: annotation2DX,
      dy: annotation2DY
    }
  ]

 if (params.some(param => !d3.select('#' + param.id).property('checked'))) {
    // remove annotations
    d3.select('#svg-2-annotations').selectAll('*').remove();
    d3.select('#svg-2-annotations').remove();
  } else {
    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    d3.select("#svg2")
        .append("g")
        .attr('id', 'svg-2-annotations')
        .call(makeAnnotations);
  }
    });
}
// function updateChart2Data() {
//   renderChart2('slide3');
// }
