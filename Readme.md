## D3Table

This project mainly aims at leveraging D3's data binding capabilities to easily create tables.

The project is just a hobby project, so it might not be ready for production use, so your suggestions and contributions are welcomed.

### Features

Following are the features currently supported (v 0.0.1):

* Support for json, csv, tsv data via ajax
* Support for custom data formats
* Fully customizable table look

Following are the features that are in pipeline:

* Pagination support

I know that's slim, so feel free to make feature requests.


### API

```
new D3Table(config)
```

Creates an instance of a table with the following possible configuration parameters.

|    Key    |    Required    |    Default    |    Description    |
| --------- | -------------- | ------------- | ----------------- |
| container_id | Yes | - | ID of the element that will act as a container of the table. |
| title | No | - | If provided, adds a title row above the headers. It is given the class `d3t-table-title` which can be used for styling. By default no title is displayed. |
| style | No | `borderless` | There are 3 built in styles, default `borderless` does not apply any borders to the table. `bordered` provides borders around the table and `striped` shades alternate rows .`striped` can be combined with any of the other 2.|
| dataUrl | No | - | Url used to fetch the data via ajax. |
| dataType | No | `json` | When data is fetched via ajax, this denotes the data type of the response. Other possible values are `tsv` and `csv` |
| columnOptions | No | - | An array of column configuration objects. You can read about column configurations further in this document. |

#### Column Configuration

Column configuration defines how the column needs to be displayed and what data it needs to bind. Following are the options that can be configured.

|    Key    |    Required    |    Default    |    Description    |
| --------- | -------------- | ------------- | ----------------- |
| isHidden | No | `false` | Flag that can be used to hide a column. Can be either `true` or `false` |
| title | No | - | Column's display title. If not provided, it tries to identify headers from the data (keys in case of json data, first row in case of csv and tsv|
| data | No | - | `data` is used to resolve the value displayed in the column. It can be either the string denoting the key or a callback. In case of the callback, the complete row data is passed in as argument and the returned value is displayed. |
| innerHtml | No | - | In case column content is to be html, string or a  callback returning the html can be passed in. 

### Tests

Tests are included in the `tests` folder. Before you run the tests, you need to run:
```
bower install
npm install
```

and then directly run the tests via karma:
```
npm test
```

The test suite is slim but we will make sure test coverage is high.

### Contribution Guidelines

This is something I need to figure out, but this section could be your first contribution!