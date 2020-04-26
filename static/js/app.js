function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    d3.json("/metadata/"+sample).then((data) => {
      var metaTag = d3.select('#sample-metadata').html('')
      Object.entries(data).forEach( ([key, value]) => {
        metaTag.append('li').text(key + ": " + value)

      })
    })
  }


function buildCharts(sample) {

  d3.json('/samples/'+sample).then((data) => {

    // BUILD PIE CHART
 var simpleName = []
 data.otu_labels.forEach( label => {
   var splitString = label.split(';')
   simpleName.push(splitString[splitString.length - 1])

 })
 console.log(simpleName)
  var plotData = [{
    values: data.sample_values,
    labels: simpleName,
    type: 'pie'
  }];
  
  var layout = {
    height: 400,
    width: 500
  };
  Plotly.newPlot('pie', plotData, layout);

// BUILD BUBBLE PLOT 
var trace1 = {
  x: data.otu_ids,
  y: data.sample_values,
  text : simpleName,
  mode: 'markers',
  marker: {
    color: data.otu_ids,
    size: data.sample_values
  }
};

var bubbleData = [trace1];

var bubbleLayout = {
  title: 'Bacteria Colony Size',
  showlegend: false,
  height: 600,
  width: 1100
};

Plotly.newPlot('bubble', bubbleData, bubbleLayout);
 })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
