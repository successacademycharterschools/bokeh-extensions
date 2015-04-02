# bokeh-extensions
Hacks to extend Bokeh functionality

## Sorting.js

JS:
https://rawgit.com/successacademycharterschools/bokeh-extensions/master/sorting.js


CSS:
https://rawgit.com/successacademycharterschools/bokeh-extensions/master/filter_styles.css


This tool requires two data tags on each `div` of class `plotdiv`
```html
<div class="plotdiv" id="UUID" data-sorting-matcher="<Field Name>"
  data-sorting-fields='["Array", "Of", "Field", "Names"]'>
```

The `sorting-matcher` field is used to filter out selected rows from the datasource and push them to the top of the table.

The array of sorting field names is used to build drop down menus used to sort the data.
