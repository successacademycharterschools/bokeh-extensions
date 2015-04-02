Bokeh.$(function() {
  linkStyleSheet({'href':"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.6.3/css/bootstrap-select.min.css", 'type':'text/css', 'location':'head', 'rel':'stylesheet'});
  linkScript({'url':"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.6.3/js/bootstrap-select.min.js", 'type':'text/javascript', 'location':'body'});
  $('.plotdiv').each(function(index, element){
    var modelId = findModelID(element.id);
    var tableEl = $(element).find(".bk-data-table")[0];
    var dataTableView = findViewObject(tableEl, Bokeh.index[modelId]);
    var fields = getFieldNames(dataTableView.model.attributes.columns, $(element).data("sortingFields"));
    var dataSource = dataTableView.mget("source");

    $(element).prepend("<form class='column-filters' id="+ element.id +"><div class='btn-group'><button type='submit' class='btn btn-default'>Sort Data</button></div></form>")

    for (var i = 0; i < fields.length; i++){
      if (fields[i].field != 'name') {
        var optionsString = optionsConstructor(dataSource, fields[i].field)
        $("form#" + element.id + ".column-filters").append("<select class='selectpicker' data-style='btn-primary' title='Sort by "+ fields[i].title +"' name=" + fields[i].field + ">"+ optionsString+"</select>")
      };
    }
  })

  $("form.column-filters").submit(function(e){
    e.preventDefault();
    var options = $(e.target).find("select");
    var workingFilters = [];
    for(var i = 0; i < options.length; i++){
      if(options[i].type !== 'submit' && options[i].selectedOptions[0].value !== ""){
        workingFilters.push({name: options[i].name, value: options[i].selectedOptions[0].value})
      }
    }
    var modelId = findModelID(this.id);
    var dataTableView = findViewObject($(document.getElementById(this.id)).find(".bk-data-table")[0], Bokeh.index[modelId])
    var dataSource = dataTableView.mget("source")
    var columns = dataSource.attributes.data
    var rows = []
    var rowsToSelect = applyValueFilter(workingFilters, columns, rows)

    dataTableView.grid.setSelectedRows(rowsToSelect)
    selectionShift(dataTableView)
  })
})

var linkScript = function(args){
  var script = document.createElement('script');
  script.type = args.type;
  script.src = args.url
  $(args.location).append(script);
}

var linkStyleSheet = function(args){
  var link = document.createElement('link')
  link.type = args.type
  link.rel = args.rel
  link.href = args.href
  $(args.location).append(link)
}

var applyValueFilter = function(workingFilters, columns, rows){
  if(workingFilters.length === 0){
    return rows;
  }
  else{
    var filterToApply = workingFilters.pop()
    var column = columns[filterToApply.name]
    if (rows.length > 0) {
      var newRows = []
      for(var j = 0; j < rows.length; j++){
        if(column[rows[j]] == filterToApply.value){
          newRows.push(rows.slice(j,j+1)[0])
        }
      }
      rows = newRows
    }
    else {
      for(var j = 0; j < column.length; j++){
        if(column[j] == filterToApply.value){
          rows.push(j)
        }
      }
    }
    return applyValueFilter(workingFilters, columns, rows);
  }
}

var rowsIndices = function(array){
  var result = []
  for(var i = 0; i < array.length; i++){
    result.push(i)
  }
  return result
}

var getFieldNames = function(columns, sortingFields){
  var result = []
  for(var j = 0; j < sortingFields.length; j++){
    for(var i = 0; i < columns.length; i++){
      var columnData = Bokeh.Collections("TableColumn").get(columns[i].id)
      if (columnData.attributes.field == sortingFields[j]) {
      result.push({field : columnData.attributes.field, title : columnData.attributes.title})
      };
    }
  }
  return result
}

var optionsConstructor = function(source, fieldName){
  var result = "<option value=''></option>";
  var elements = getUniqueElements(source.attributes.data[fieldName])
  for(var i = 0; i < elements.length; i++){
    result += "<option value='"+ elements[i].toString() +"'>" + elements[i] + "</option>"
  }
  return result
}

var getUniqueElements = function(array){
  var u = {}, a = [];
     for(var i = 0; i < array.length; ++i){
        if(u.hasOwnProperty(array[i])) {
           continue;
        }
        a.push(array[i]);
        u[array[i]] = 1;
     }
     return a;
}