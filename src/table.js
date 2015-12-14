
(function(){

	var ColumnConfig = function(options){

		options = options || {};

		this.isHidden = options.isHidden || false; //default false

		this.colTitle = options.title || "";

		this.data = options.data || this.colTitle;

		this.innerHtml = options.innerHtml || null;

		this.classes = options.classed || [];
	}

	var styleTable = function(table, styles){
		
		if(styles.indexOf("striped") < 0){
			table.classed("highlight", true);
		}
		
		styles.forEach(function(style){
			switch(style){
				case "borderless":
					return;
				case "bordered":
					table.classed("bordered", true);
					return;
				case "striped":
					table.classed("striped", true);
					return;
				default:
					table.classed(style, true);
					return;
			}
		})
	};

	var util = {
		prepUrl: function(url, qp) {
			var query = [];
			for(key in qp) {
				query.push(encodeURIComponent(key)+"="+encodeURIComponent(qp[key]));
			}
			query = query.join("&");
			if(url.indexOf("?") === -1){
				url += "?"
			}
			url += query;
			return url;
		},
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

	D3Table = function(options){
		
		this.data = null || options.data;

		this.table = null;

		this.dataUrl = options.dataUrl || "";

		this.dataType = options.dataType || "json"; // array of either json, csv, tsv

		this.tableTitle = options.title || null;

		this.columnOptions = options.columnOptions || null;

		this.pageSize = options.pageSize || 25;

		this.classes = options.classed || [];

		if(options.transform && typeof options.transform === "function"){
			this.transform = options.transform;
		}

		if(options.style){
			if(typeof options.style === "string"){
				this.style = [options.style];
			
			} else if(Array.isArray(options.style)){
				this.style = options.style;
			}
		} else {
			this.style = ["borderless"]; //options borderless, bordered, striped	
		}

		if(options.container_id){
			this.container_id = options.container_id;
		} else {
			throw new Error("'container_id' is a required field");
		}
	};

	// can override
	D3Table.prototype.fetchData = function(skip, limit, cb) {
		if(!this.dataUrl){
			throw new Error("D3Table: Please set the dataUrl");
		}
		var fixedUrl = util.prepUrl(this.dataUrl,{ skip: skip, limit: limit });
		cb = cb.bind(this);
		switch(this.dataType){
			case "json":
				d3.json(fixedUrl, cb);
				break;
			case "tsv":
				d3.tsv(fixedUrl, cb);
				break;
			case "csv":
				d3.csv(fixedUrl, cb);
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
			columnOptions.push(new ColumnConfig({ title: prop, data: prop }));
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

	// draws the initial table
	D3Table.prototype._tabulate = function(err, data) {
		var columnList, table, tableHeader, tableBody;

		if(err){
			throw new Error("There was an error in fetching the data: "+err);
		}

		data = this.transform(data);

		// if the table instance already exists, just update
		if(this.table !== null) {
			this.update(data);
		}

		if(!this.columnOptions){
			//send sample data for extraction
			this.columnOptions = this.extractColumnOptions(data[0]);
		} else {
			this.columnOptions = this.columnOptions.map(function(config){
				return new ColumnConfig(config);
			});
		}
		columnList = this.columnOptions;
		
		this.table = d3.select(this.container_id).append("table")
		styleTable(this.table, this.style);

		this.tableHeader = this.table.append("thead");

		if(this.tableTitle !== null) {
			this.tableHeader.append("tr")
				.classed("d3t-table-title", true)
				.append("th")
					.attr("colspan", columnList.length)
					.text(this.tableTitle);
		}

		this.tableHeader
		.append("tr")
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
				.attr("class", function(d){
					if(Array.isArray(d.classes) && d.classes.length > 0){
						return d.classes.join("");	
					} else if(typeof d.classes === "string"){
						return d.classes;
					} else {
						return null;
					}
				})
				.classed("d3t-table-col-header", true)
				.text(function(d){ return d.colTitle; });

		this.tableBody = this.table.append("tbody");

		this.update(data);
	};
	
	// updates and re-renders table
	D3Table.prototype.update = function(data){
		var tableRows, cells, columnList;

		columnList = this.columnOptions;

		tableRows = this.tableBody.selectAll(".d3t-table-row")
			.data(data);

		tableRows.enter().append("tr")
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

		cells.enter().append("td");

		cells.html(function(d){
			if(d.settings.innerHtml !== null 
				&& typeof d.settings.innerHtml !== "undefined" ){
				var innerHtml = "";
				if(util.isString(d.settings.innerHtml)){
					innerHtml = d.settings.innerHtml;
				} else if(util.isFunction(d.settings.innerHtml)){
					innerHtml = d.settings.innerHtml(d.row_data);
				}
				return innerHtml;
			} else {
				var cellValue = "";
				if(util.isString(d.settings.data)){
					cellValue = d.row_data[d.settings.data];
				} else if (util.isFunction(d.settings.data)){
					cellValue = d.settings.data(d.row_data);
				}
				return cellValue;
			}
		})
		.attr("class", function(d){
			if(Array.isArray(d.settings.classes) && d.settings.classes.length > 0){
				return d.settings.classes.join("");	
			} else if(typeof d.settings.classes === "string"){
				return d.settings.classes;
			} else {
				return null;
			}
		})
		.attr("colspan", function(d){
			if(d.settings.colspan && typeof d.settings.colspan === "number"){
				return d.settings.colspan;
			}else{
				return null;
			}
		});
			
		cells.exit().remove();	
	};

})();
