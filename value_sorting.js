$(document).ready(function(){
  var dataTableView = findViewObject(this.getElementsByClassName("bk-data-table")[0], Bokeh.index[modelid])
  var dataSource = dataTableView.mget("source")
  var fields = dataSource.attributes.column_names

  $(".plotdiv").append("<form id='column-filters'><input type='submit'></form>")
})