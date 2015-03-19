## Getting Started
This tool expects a button formatted like so:

```
<button type="button" class="save-selected" id="[ColumnDataSourceID]">Save Selected</button>
```

Where [ColumnDataSourceID] is the id of the Bokeh.ColumnDataSource object containing the data in question.

## Dependencies

[FileSaver.js](https://github.com/eligrey/FileSaver.js) handles writing the data to disk

[JSON2CSV](https://github.com/songpr/json2csv) is a Node module, so [Browserify](http://browserify.org/) is required to allow the browser access to module.

Browserify is available through [npm](https://www.npmjs.com/)

`npm install -g browserify` may require `sudo`

npm is installed via [Node.js](https://nodejs.org/)