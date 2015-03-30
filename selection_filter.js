$(document).ready(function(){
  //Binds sorting function to click event
  $(".plotdiv").on('click', ".bk-ui-state-default.bk-slick-header-column.bk-ui-sortable-handle", function(e){
    if (this.id.match(/slickgrid_\d+_checkbox_selector/) != null) {
      console.log('hey')
      var columnData = $(this).data("column")
      var dataTableView = findViewObject(tableElement(this), Bokeh.index[modelid])
      selectionSort(dataTableView, columnData)
    }
  })
})