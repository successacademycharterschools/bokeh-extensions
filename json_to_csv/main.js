var json2csv = require('json2csv');

var linkScript = function(args){
  var script = document.createElement('script');
  script.type = args.type;
  script.src = args.url
  $(args.location).append(script);
}

$(document).ready(function(){
  linkScript({'url':"https://rawgit.com/eligrey/FileSaver.js/master/FileSaver.js", 'type':'text/javascript', 'location':'head'});

  $("button.save-selected").click(function(e){
      e.preventDefault();
      var dataTable = Bokeh.Collections("ColumnDataSource").get(this.id)
      var selectedData = []
      if (dataTable.attributes.selected.length > 0) {
        var iterIndices = dataTable.attributes.selected
      }
      else{
        var iterIndices = []
        i = 0
        while(iterIndices.push(i++) < dataTable.attributes.data['index'].length){}
      }
      for (el in iterIndices){
        var dataToPush = {}
        for (key in dataTable.attributes.data){
            dataToPush[key] = dataTable.attributes.data[key][iterIndices[el]]
        }
        selectedData.push(dataToPush)
      }
      json2csv({data: selectedData, fields: Object.keys(dataTable.attributes.data)}, function(err, csv) {
        if (err){console.log(err)}
            var blob = new Blob([csv],{type:"text/plain;charset=utf-8"})
            //var filename = prompt("Save File As...")
            var filename = 'data_download'
            if (filename != null){ saveAs(blob, filename + ".csv")}
      });
  })
})
