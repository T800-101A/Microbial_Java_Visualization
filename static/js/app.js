
////////////////////////////////////////////////////////////
function init() {
  var selector = d3.select("#selDataset");
  
  // Dropdown with subject ID's from the list of sample Names
  d3.json("../samples.json").then((data) => {
    var subjectIds = data.names;


    for(let i = 0; i < subjectIds.length; i++) {
      selector
      .append("option")
      .text(subjectIds[i])
      .property("value", subjectIds[i]);
    };
    
    
    const firstSubject = subjectIds[0];// First subjectIDs from the names to build initial plots
    updateCharts(firstSubject); //Calling update funtion for Charts
    updateMetadata(firstSubject); //Calling Function to Update Metadata
    
  });
};



//////////////////////////////Creating Function for Plots////////////////////////////////////////


function updateCharts(sample) {    
  d3.json("../samples.json").then((data) => {
  var samples = data.samples;
  var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
  var result = filterArray[0];



  var sample_values = result.sample_values;
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels; 
  
  
  //////////////////////////////Defining/Creating Bar Plot////////////////////////////////////////
      
  var trace1 = { 
    x: sample_values.slice(0,10).reverse(),
    y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
    text: otu_labels.slice(0,10).reverse(),
    name: "PLLT",
    type: "bar",
    orientation: "h"
  };
  var data = [trace1];
  var layout = {
    title: "Top Ten OTUs for Individual " +sample,
    margin: {l: 150, r: 50, t: 50, b: 50}
  };

  Plotly.newPlot("bar", data, layout);


  /////////////////////////////Defining/Creating val for bubble Plot/////////////////////////////////////////

  
  var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids,
      colorscale:"Ocean"
      }
  };

  var data = [trace1];
  var layout = {
      title: 'Bacteria Cultures / Sample',
      showlegend: false,
      hovermode: 'closest',
      xaxis: {title:"OTU (Operational Taxonomic Unit) ID " + sample},
      margin: {t:50}
    };    
    Plotly.newPlot('bubble', data, layout);
  });

};




//////////////////////////////Creating Function for Metadata ////////////////////////////////////////

function updateMetadata(sample) {
  d3.json("../samples.json").then((data) => {

    var metadata = data.metadata;
    var filterArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = filterArray[0];
    var metaPanel = d3.select("#sample-metadata");
    metaPanel.html("");
    
    var entries = Object.entries(result);
    for(let i = 0; i < entries.length; i++) {
      let key = entries[i][0];
      let value = entries[i][1];
      metaPanel.append("h5").text(`${key.toUpperCase()}: ${value}`);
    }});
  
  };
    


 ///////////////////////////Update new data each time a sample is selected it/////////////////////////////////////////


 function optionChanged(newSample) { // 
  updateCharts(newSample);
  updateMetadata(newSample);
};



init();