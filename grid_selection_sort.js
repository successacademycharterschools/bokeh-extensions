$(document).ready(function(){
  //Binds sorting function to click event
  $(".plotdiv").on('click', ".bk-ui-state-default.bk-slick-header-column.bk-ui-sortable-handle", function(e){
    if (this.id.match(/slickgrid_\d+_checkbox_selector/) != null) {
      var columnData = $(this).data("column")
      var dataTableView = findViewObject(tableElement(this), Bokeh.index[modelid])
      // selectionSort(dataTableView, columnData)
      selectionShift(dataTableView);
    }
  })
})
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
  var rowsToShift = []
  var data = view.data.getRecords()
  var attributeMatcher = $(".plotdiv").data().sortingMatcher

  for(i = 0; i < selectedRowIndices.length; i++){
    rowsToShift.push(data.slice(selectedRowIndices[i], (selectedRowIndices[i] + 1))[0])
  }

  for(i = 0; i < rowsToShift.length; i++){
    for(j = 0; j < data.length; j++){
      if(data[j][attributeMatcher] === rowsToShift[i][attributeMatcher]){
        console.log(data[j].name === rowsToShift[i].name)
        rowsSpliced.push(data.splice(j, 1)[0])
      }
    }
  }
  for(i = 0; i < rowsToShift.length; i++){
    data.unshift(rowsToShift[i])
  }

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