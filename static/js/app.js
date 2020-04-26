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


 })
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
