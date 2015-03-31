$(document).ready(function(){
  var dataTableView = findViewObject(this.getElementsByClassName("bk-data-table")[0], Bokeh.index[findModelID("8dc6e575-0ae6-4b64-bc54-a9ffe282b510")])
  var dataSource = dataTableView.mget("source")
  var fields = getFieldNames(dataTableView.model.attributes.columns)
  $(".plotdiv").append("<form id='column-filters'><input type='submit'></form>")

  for (var i = 0; i < fields.length; i++){
    var optionsString = optionsConstructor(dataSource, fields[i])
    $("form#column-filters").append("<select name=" + fields[i] + ">"+ optionsString+"</select>")
  }
})

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