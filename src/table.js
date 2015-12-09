
(function(){

	var ColumnConfig = function(options){

		options = options || {};

		this.isHidden = options.isHidden || false; //default false

		this.label = options.label || "";

		this.data = options.data || this.label;

		this.innerHtml = options.innerHtml || null;
	}

	var styleTable = function(table, style){
		switch(style){
			case "borderless":
				table.classed("highlight", true);
				return;
			case "bordered":
				table.classed("bordered highlight", true);
				return;
			case "striped":
				table.classed("striped", true);
				return;
			default: 
				table.classed("highlight", true);
				return;
		}
	}

	var D3Table = function(options){
		
		var noop = function(){};
		
		this.data = null || options.data;

		this.dataUrl = options.dataUrl || "";

		this.dataType = options.dataType || "json"; // array of either json, csv, tsv

		this.tableTitle = options.title || null;

		this.columnOptions = options.columnOptions || null;

		this.pageSize = options.pageSize || 25;

		this.style = options.style || "borderless"; //options borderless, bordered, striped

		if(options.container_id){
			this.container_id = options.container_id;
			console.log(this.container_id);
		} else {
			throw new Error("'container_id' is a required field");
		}
	};

	// can override
	D3Table.prototype.fetchData = function(skip, limit, cb) {
		if(!this.dataUrl){
			throw new Error("D3Table: Please set the dataUrl");
		}
		var fixedUrl = D3Table.prototype._prepUrl(this.dataUrl,{ skip: skip, limit: limit });
		switch(this.dataType){
			case "json":
				d3.json(fixedUrl, cb);
				break;
			case "tsv":
				d3.tsv(fixedUrl, cb);
				break;
			case "csv":
				d3.tsv(fixedUrl, cb);
				break;
			default:
				throw new Error("Invalid data type "+this.dataType);
				break;
		}
	};

	// can override
	D3Table.prototype.transform = function(data){ return data;}

	// can override
	D3Table.prototype.extractColumnOptions = function(sample_data){
		var columnOptions = [];
		for(prop in sample_data){
			columnOptions.push(new ColumnConfig({ label: prop, data: prop }));
		}
		return columnOptions;
	};

	D3Table.prototype.draw = function(){
		//check if we have column settings
		if(!this.data){
			this.fetchData(0, 25, this._tabulate);
		} else {
			this._tabulate(null, this.data);
		}
	};

	// removes the table from the dom
	D3Table.prototype.delete = function(){
		if(this.table){
			this.table.remove();
		}
	};

	D3Table.prototype._tabulate = function(err, data) {
		var columnList, table, tableHeader, tableBody;

		if(err){
			throw new Error("There was an error in fetching the data: "+err);
		}

		data = this.transform(data);

		if(!this.columnOptions){
			//send sample data for extraction
			this.columnOptions = this.extractColumnOptions(data[0]);
		}
		
		columnList = this.columnOptions;
		
		table = d3.select(this.container_id).append("table")
		styleTable(table, this.style);

		tableHeader = table.append("thead");

		if(this.tableTitle !== null) {
			tableHeader.append("tr")
				.classed("d3t-table-title", true)
				.append("th")
					.attr("colspan", columnList.length)
					.text(this.tableTitle);
		}

		tableHeader.append("tr")
			.selectAll("d3t-table-header")
			.data(function(){
				var displayedColumns = [];
				columnList.forEach(function(columnSettings){
					if(!columnSettings.isHidden){
						displayedColumns.push(columnSettings);
					}
				});
				return displayedColumns;
			})
			.enter()
			.append("th")
				.classed("d3t-table-col-header", true)
				.text(function(d){ return d.label; });

		tableBody = table.append("tbody");

		var update = function(data){
			var tableRows, cells, util = this.util;

			tableRows = tableBody.selectAll(".d3t-table-row")
				.data(data);

			tableRows.enter()
				.append("tr")
					.classed("d3t-table-row", true)

			tableRows.exit().remove();

			cells = tableRows.selectAll("td")
				.data(function(row_data){
					var bound_row_data = [];
					columnList.forEach(function(col_settings){
						if(!col_settings.isHidden){
							bound_row_data.push({ settings: col_settings, row_data: row_data })
						}
					});
					return bound_row_data;
				});
				
			cells.enter()
				.append("td")
					// only 1 item iterated in each
					// each can be replaced, not sure how though
				.each(function(d){
					// this could possibly be slow
					var td = d3.select(this);
					if(d.settings.innerHtml !== null 
						&& typeof d.settings.innerHtml !== "undefined" ){
						var innerHtml = "";
						if(util.isString(d.settings.innerHtml)){
							innerHtml = d.settings.innerHtml;
						} else if(util.isFunction(d.settings.innerHtml)){
							innerHtml = d.settings.innerHtml(d.row_data);
						}
						td.html(innerHtml);
					} else {
						var cellValue = "";
						if(util.isString(d.settings.data)){
							cellValue = d.row_data[d.settings.data];
						} else if (util.isFunction(d.settings.data)){
							cellValue = d.settings.data(d.row_data);
						}
						td.text(cellValue);
					}

					if(d.settings.colspan && typeof d.settings.colspan === "number"){
						td.attr("colspan", d.settings.colspan)
					}
				});

			cells.exit().remove();	
		};

		update = update.bind(this);
		update(data);
		this.table = table; 
		D3Table.prototype.update = update;
	};

	D3Table.prototype._prepUrl = function(url, qp) {
		var query = [];
		for(key in qp) {
			query.push(urlEncode(key)+"="+urlEncode(qp[key]));
		}
		query = query.join("&");
		if(url.indexOf("?") === -1){
			url += "?"
		}
		url += query;
		return url;
	};

	D3Table.prototype.util = {
		isFunction: function(d){
			if(typeof d === "function"){
				return true;
			} else {
				return false;
			}
		},
		isString: function(d){
			if(typeof d === "string"){
				return true;
			} else {
				return false;
			}
		}
	};

	window.D3Table = D3Table;

})();
