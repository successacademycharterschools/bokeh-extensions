# bokeh-extensions
Hacks to extend Bokeh functionality

## Grid Selection Sorting
This tool requires the `div` containing the DataTable to have a `data` tag that indicates the unique identifier field for that table (i.e. `scholar_id`).
```html
<div class="plotdiv" data-sorting-matcher="<Field Name>">
```
This `sorting-matcher` field is used to filter out selected rows from the datasource and push them to the top of the table.

## Value Soring
This requires another `data` tag:
```html
<div class="plotdiv" data-sorting-fields="[Array, Of, Field, Names]">
```
The array of field names is used to build drop down menus used to sort the data.