Bokeh.$(function() {
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
        $("form#" + element.id + ".column-filters").append("<select class='selectpicker' data-style='btn-primary' multiple title='Sort by "+ fields[i].title +"' name=" + fields[i].field + ">"+ optionsString+"</select>")
      };
    }
  })

  $("form.column-filters").submit(function(e){
    e.preventDefault();
    var options = $(e.target).find("select");
    var workingFilters = [];
    for(var i = 0; i < options.length; i++){
      if(options[i].type !== 'submit' && options[i].selectedOptions.length > 0){
        var filterValues = $(options[i].selectedOptions).map(function(i, e){return e.value})
        workingFilters.push({name: options[i].name, values: filterValues })
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

  $(".plotdiv").on('click', ".bk-ui-state-default.bk-slick-header-column.bk-ui-sortable-handle", function(e){
    if (this.id.match(/slickgrid_\d+_checkbox_selector/) != null) {
      var columnData = $(this).data("column")
      var parentId = $(this).closest(".plotdiv").get(0).id
      var modelid = findModelID(parentId)
      var dataTableView = findViewObject(tableElement(this), Bokeh.index[modelid])
      selectionShift(dataTableView);
    }
  })
})
var findModelID = function(parentId){
  return $.grep(Object.keys(Bokeh.index), function(k){
    return Bokeh.index[k].el.id === parentId
  })
}
// Used to recursively search Bokeh.index
var findViewObject = function(el, currentNode){
  if (el == currentNode.el ) {
    return currentNode;
  }
  else {
    for(key in currentNode.views){
      currentChild = currentNode.views[key]
      result = findViewObject(el, currentChild);
      if (result !== false){
        return result
      }
    }
    return false;
  }
}
// Grabs the top level parent element of the datatable in the DOM
var tableElement = function(el){
  var result;
  $(el).parents().each(function(i){
    if(this.classList.contains("bk-data-table")){
      result = this
    }
  })
  return result
}

var selectionShift = function(view){

  var selectedRowIndices = view.grid.getSelectedRows()
  var data = view.data.getRecords()

  var rowsToShift = collectRowsToShift(data, selectedRowIndices)

  spliceOutRows(data, rowsToShift);

  for(i = 0; i < rowsToShift.length; i++){
    data.unshift(rowsToShift[i])
  }
  updateData(view, data, selectedRowIndices)
}

var collectRowsToShift = function(data, selectedRowIndices){
  var result = []
  for(i = 0; i < selectedRowIndices.length; i++){
    result.push(data.slice(selectedRowIndices[i], (selectedRowIndices[i] + 1))[0])
  }
  return result;
}

var spliceOutRows = function(data, rowsToSplice){
  var attributeMatcher = $(".plotdiv").data().sortingMatcher
  for(i = 0; i < rowsToSplice.length; i++){
    for(j = 0; j < data.length; j++){
      if(data[j][attributeMatcher] === rowsToSplice[i][attributeMatcher]){
        data.splice(j, 1)
      }
    }
  }
}

var updateData = function(view, data, selectedRowIndices){
  for(i = 0; i < data.length; i++){
    view.data._setItem(i, data[i])
  }
  var updateSel = []
  for(i=0; i < selectedRowIndices.length; i++){
    updateSel.push(i)
  }
  view.data.updateSource()
  view.grid.setSelectedRows(updateSel)
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
  var result = "";
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

var linkScript = function(args){
  var script = document.createElement('script');
  script.type = args.type;
  script.src = args.url
  $(args.location).append(script);
}