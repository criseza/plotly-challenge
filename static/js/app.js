// Checking connection
console.log('Connected - app.js');

// Getting data
let jsondata = 'static/js/samples.json';

// Initializing
function init(){
    fillDropdown();
    fillDemographics();
    initPlots();
}

// Filling dropdown menu
function fillDropdown(){
    d3.json(jsondata).then((data) => {
        console.log(data.names);
        let subjectnames = data.names;
        d3.select("#SelectDataset").append("option").text('- Select Subject -')
        for(x in subjectnames){
            d3.select("#SelectDataset").append("option").text(subjectnames[x]);
        }
    });
}

// Variables

// Getting demographics
function fillDemographics(subject){
    console.log(`Fill Demographics: ${subject}`);
    d3.select('#sample-metadata').html('');
    d3.json(jsondata).then((data) => {
        for (x in data.metadata){
            if(data.metadata[x].id == subject){
                d3.select('#sample-metadata').html(`
                    id: ${data.metadata[x].id} <br> 
                    ethnicity: ${data.metadata[x].ethnicity} <br>
                    gender: ${data.metadata[x].gender} <br>
                    age: ${data.metadata[x].age} <br>
                    location: ${data.metadata[x].location} <br>
                    bbtype: ${data.metadata[x].bbtype} <br>
                    wfreq: ${data.metadata[x].wfreq}
                `);
            }
        }
    });
}

// Initializing Plotly
function initPlots(){
    console.log('Init Plots');

// AYUDA CON LOS PLOTS POR FAVOR


    // Bar Plot
    var trace1 = {
        x:[1,2,3,4,5,6,7,8,9,10],
        y:['a','b','c','d','f','g','h','i','j','k'],
        type:'bar',
        orientation:'h'
    }
    var chartData=[trace1];
    var layout={
    }
    Plotly.newPlot("bar", chartData, layout);

    // Bubble Plot
    var trace2 = {
        x:[1,2,3,4,5,6,7,8,9,10],
        y:[10,20,30,40,50,60,70,80],
        text:['a','b','c','d','f','g','h','i','j','k'],
        mode:'markers',
        marker:{
            size: [5,10,15,20,25,30,35,40,45,50],
            color: [10,20,30,40,50,60,70,80]
        }
    }
    var chartData2=[trace2];
    var layout2={
        title:'Bubble Chart'
    }
    Plotly.newPlot("bubble", chartData2, layout2);

    // Gauge Plot
    var data = [
        {
          value: 0,
          title: {text: "Belly Button Washing Frequency"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "#F7F2EC"},
              { range: [1, 2], color: "#F3F0E4" },
              { range: [2, 3], color: "#E8E6C8" },
              { range: [3, 4], color: "#E4E8AF" },
              { range: [4, 5], color: "#D4E494" },
              { range: [5, 6], color: "#B6CC8A" },
              { range: [6, 7], color: "#86BF7F" },
              { range: [7, 8], color: "#84BB8A" },
              { range: [8, 9], color: "#7FB485" },
            ],
          }
        }
      ];
      Plotly.newPlot('gauge', data);
}

// Updating plots
function updatePlots(subject){
    console.log(`Update Plots for: ${subject}`);
    d3.json(jsondata).then((data)=>{
        for(x in data.samples){
            if(data.samples[x].id == subject){
                
                // Sorting and Selecting Top10
                let top10 = data.samples[x].sample_values.sort((firstNum, secondNum) => secondNum - firstNum);
                let top10ids = data.samples[x].otu_ids.sort(function(a,b){return top10.indexOf(a)-top10.indexOf(b)});
                let top10labels = data.samples[x].otu_labels.sort(function(a,b){return top10.indexOf(a)-top10.indexOf(b)});
                top10 = top10.slice(0,10).reverse();
                top10ids = top10ids.slice(0,10).reverse();
                top10ids = top10ids.map(i => 'OTU-' + i);
                top10labels = top10labels.slice(0,10).reverse();

                // Restyling Bar Plot
                Plotly.restyle("bar","x",[top10]);
                Plotly.restyle("bar","y",[top10ids]);
                Plotly.restyle("bar","text",[top10labels]);

                // Restyling Bubble Plot
                let x_bubble = data.samples[x].otu_ids
                let y_bubble = data.samples[x].sample_values
                let marker_bubble = {size:y_bubble, color:x_bubble}
                let text_bubble = data.samples[x].otu_labels
                Plotly.restyle("bubble","x",[x_bubble]);
                Plotly.restyle("bubble","y",[y_bubble]);
                Plotly.restyle("bubble","marker",[marker_bubble]);
                Plotly.restyle("bubble","text",[text_bubble]);
            }
        }
        // Restyling Gauge Plot
        for(y in data.metadata){
            if(data.metadata[y].id == subject){
                let wfreq = data.metadata[y].wfreq
                Plotly.restyle("gauge","value",[wfreq])
            }
        }
    });
}

// Refreshing all --data and plots
function optionChanged(subject){
    console.log(`Selected subject: ${subject}`);
    if(subject==='-Select Subject-'){
        fillDemographics();
        initPlots();
    }else{
        fillDemographics(subject);
        updatePlots(subject);
    }
}

init();