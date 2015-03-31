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
      if(options[i].type !== 'submit' && options[i].selectedOptions[0].value !== ""){
        workingFilters.push({name: options[i].name, value: options[i].selectedOptions[0].value})
      }
    }


    var columns = dataSource.attributes.data

    var rows = []
    var rowsToSelect = applyValueFilter(workingFilters, columns, rows)

    dataTableView.grid.setSelectedRows(rowsToSelect)
    selectionShift(dataTableView)
  })
})

var applyValueFilter = function(workingFilters, columns, rows){
  if(workingFilters.length === 0){
    return rows;
  }
  else{
    var filterToApply = workingFilters.pop()
    var column = columns[filterToApply.name]
    if (rows.length > 0) {
      for(var j = 0; j < rows.length; j++){
        if(column[rows[j]] != filterToApply.value){
          rows.splice(j,1)
        }
      }
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