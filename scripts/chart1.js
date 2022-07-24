function renderChart1(slideId) {

  document.getElementById(slideId).setAttribute("style","display:block");
  // initialise layout variables
  const margin = {top: 50, right: 20, bottom: 50, left: 60};
  const width = 600;
  const height = 400;
  var numberOfMoviesInTheFirstYear = 0;
  var peakNumberOfMoviesInAnYear = 0;

  const parseDateTime = d3.timeParse("%B %d, %Y");

  // initialise charts
  const svg = d3.select('#svg1')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // get data
  const jsonFile = 'data/NetflixOriginals.json';
  var data;
  d3.json(jsonFile).then((data) => {
    this.data = data;
    data.forEach(function(d) {
      d.date = parseDateTime(d.Premiere);
    });
    data = data.filter(d => d.date != null);
    const dataGroupedByYear = data.reduce((group, d) => {
        const { date } = d;
        group[date.getFullYear()] = group[date.getFullYear()] ?? [];
        group[date.getFullYear()].push(d);
        return group;
      }, {});
    let finalData = new Array();
    for(const key in dataGroupedByYear){
      var obj = new Object() ;
      obj.year = key;
      obj.numOriginals=dataGroupedByYear[key].length;
      finalData.push(obj);
    }
    finalData.sort((a, b) => (a.year > b.year) ? 1 : -1);
    data = finalData;
    // X axis
    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) {
          return d.year;
        }))
        .padding(0.2);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 200])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.year); })
        .attr("y", function(d) { return y(d.numOriginals); })
        .attr("width", x.bandwidth())
        .attr("height", function(d, i) {
          var result  = d.numOriginals;
          if(i == 0) {
            numberOfMoviesInTheFirstYear = result;
          }
          peakNumberOfMoviesInAnYear = Math.max(peakNumberOfMoviesInAnYear, result);
         return height - y(d.numOriginals); 
       })
        .attr("fill", "#69b3a2");

    // Features of the annotation
    const annotations = [
      {
        note: {
          title: "Starts producing(" + numberOfMoviesInTheFirstYear + ")"
        },
        connector: {
          end: "arrow"
        },
        type: d3.annotationLabel,
        x: 125,
        y: 450,
        dx: 0,
        dy: -25
      },
      {
        note: {
          label: "Peak so far("+ peakNumberOfMoviesInAnYear + ")"
        },
        connector: {
          end: "arrow"
        },
        type: d3.annotationLabel,
        x: 545,
        y: 85,
        dx: 0,
        dy: -25
      }
    ]

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
        .annotations(annotations)
    d3.select("#svg1")
        .append("g")
        .call(makeAnnotations)

  });

}