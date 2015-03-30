// $(document).ready(function(){
//   //Binds sorting function to click event
//   $(".plotdiv").on('click', ".bk-ui-state-default.bk-slick-header-column.bk-ui-sortable-handle", function(e){
//     if (this.id.match(/slickgrid_\d+_checkbox_selector/) != null) {
//       console.log('hey')
//       var columnData = $(this).data("column")
//       var dataTableView = findViewObject(tableElement(this), Bokeh.index[modelid])
//       selectionSort(dataTableView, columnData)
//     }
//   })
// })
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
// Creates Sel field and appropriately sets values
var setSelectionSort = function(dataSource, columnData){
  columnData.sortable = true
  dataSource.data.sel = []

  var selectedRows = dataSource.source.attributes.selected
  var recordsLength = dataSource.getRecords().length

  for (i = 0; i < recordsLength; i++){
    dataSource.data.sel[i] = ""
  }
  for(i=0; i<selectedRows.length;i++){
    dataSource.data.sel[selectedRows[i]] = "selected"
  }
  dataSource.sort([{sortCol: columnData, sortAsc:false}])
}
// Uses Bokeh's DataProvider Sort method to sort by selection
var selectionSort = function(view, columnData){
  setSelectionSort(view.data, columnData)

  columns = [{sortCol: columnData, sortAsc:false}]
  view.data.sort(columns)
  updateSelection(view)
}
// Updates view so the rows are highlighted at top
var updateSelection = function(view){
  var newSelection = [];
  for (var i = 0; i < view.data.data.sel.length; i++) {
    if(view.data.data.sel[i] == "selected"){
      newSelection.push(i);
    }
  };
  view.grid.invalidate()
  view.grid.render()
  view.grid.setSelectedRows(newSelection)
}