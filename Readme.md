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

Creates an instance of a table. The following are the config parameters:

|    Key    |    Required    |    Default    |    Description    |
| --------- | -------------- | ------------- | ----------------- |
| container_id | Yes | - | ID of the element that will act as a container of the table. |
| title | No | - | If provided, adds a title row above the headers. It is given the class `d3t-table-title` which can be used for styling. By default no title is displayed. |
| style | No | `borderless` | There are 3 built in styles:
* `borderless` (default): Table has no borders all around
* `bordered`: Provides borders around the table
* `striped`: Shade alternate rows

`striped` can be combined with any of the other |


### Contribution Guidelines

This is something I need to figure out, but this section could be your first contribution!