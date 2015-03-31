$(document).ready(function(){
  var dataTableView = findViewObject(this.getElementsByClassName("bk-data-table")[0], Bokeh.index[findModelID("8dc6e575-0ae6-4b64-bc54-a9ffe282b510")])
  var dataSource = dataTableView.mget("source")
  var fields = getFieldNames(dataTableView.model.attributes.columns)
  $(".plotdiv").append("<form id='column-filters'><input type='submit'></form>")

  for (var i = 0; i < fields.length; i++){
    var optionsString = optionsConstructor(dataSource, fields[i].field)
    $("form#column-filters").append("<span>"+fields[i].title+"</span><select name=" + fields[i].field + ">"+ optionsString+"</select>")
  }

  $("form#column-filters").submit(function(e){
    e.preventDefault();
    var options = $(e.target).find("select");
    var workingFilters = [];
    for(var i = 0; i < options.length; i++){
      if(options[i].type != 'submit' && options[i].selectedOptions[0].value != ""){
        workingFilters.push({name: options[i].name, value: options[i].selectedOptions[0].value})
      }
    }
    var rowsToSelect = valueFilter(workingFilters, dataSource)
    dataTableView.grid.setSelectedRows(rowsToSelect)
    selectionShift(dataTableView)
  })
})

var valueFilter = function(workingFilters, dataSource){
  var rowIndices = []
  for(var i = 0; i < workingFilters.length; i++){
    var column = dataSource.attributes.data[workingFilters[i].name]
    for(var j = 0; j < column.length; j++){
      if(column[j] === workingFilters[i].value){
        rowIndices.push(j)
      }
    }
  }
  return getUniqueElements(rowIndices)
}

var getFieldNames = function(columns){
  var result = []
  for(var i = 0; i < columns.length; i++){
    var columnData = Bokeh.Collections("TableColumn").get(columns[i].id)
    result.push({field : columnData.attributes.field, title : columnData.attributes.title})
  }
  return result
}

var optionsConstructor = function(source, fieldName){
  var result = "<option value=''></option>";
  var elements = getUniqueElements(source.attributes.data[fieldName])
  for(var i = 0; i < elements.length; i++){
    result += "<option value="+ elements[i] +">" + elements[i] + "</option>"
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