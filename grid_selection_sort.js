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
  // dataSource.sort([{sortCol: columnData}])
}
// Uses Bokeh's DataProvider Sort method to sort by selection
var selectionSort = function(view, columnData){
  setSelectionSort(view.data, columnData)

  columns = [{sortCol: columnData}]
  sortBySelection(columns, view)
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

sortBySelection = function(columns, view) {
  var cols, column, i, record, records, _i, _len;

  cols = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      column = columns[_i];
      _results.push([column.sortCol.field, 1]);
    }
    return _results;
  })();

  records = view.data.getRecords();

  records.sort(function(record1, record2) {
    var field, result, sign, value1, value2, _i, _len, _ref;

    for (_i = 0, _len = cols.length; _i < _len; _i++) {
      _ref = cols[_i], field = _ref[0], sign = _ref[1];
      value1 = record1[field];
      value2 = record2[field];
      result = value1 === value2 ? 0 : value1 > value2 ? sign : -sign;
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });

  for (i = _i = 0, _len = records.length; _i < _len; i = ++_i) {
    record = records[i];
    this._setItem(i, record);
  }
  return this.updateSource();
}