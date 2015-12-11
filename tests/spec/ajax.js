describe("D3Table", function(){

	var fakeData = [
		{ name: "rajan", age: 25, email: "rajan@gmail.com" },
		{ name: "rajan2", age: 25, email: "rajan2@gmail.com" },
		{ name: "rajan3", age: 25, email: "rajan3@gmail.com" },
		{ name: "rajan4", age: 25, email: "rajan4@gmail.com" }
	];

	var customData = {
		headers: ["name", "age", "email"],
		data: [
			["rajan1", 25, "rajan1@gmail.com"],
			["rajan2", 25, "rajan2@gmail.com"],
			["rajan3", 25, "rajan3@gmail.com"]
		]
	}

	beforeEach(function(){
		// create an empty container with id 'table'
		d3.select("body").append("div").attr("id", "table");

		// ensure container is empty 
		expect(d3.select("#table table").node()).toBe(null);
	});

	it("can process json data", function(){
		var obsUrl = null;
		var originalFunc = d3.json;

		d3.json = function(url, cb){
			obsUrl = url;
			cb(null, fakeData)
		};

		var table = new D3Table({
			container_id: "#table",
			title: "Test table",
			style: "striped",
			dataUrl: "http://random.com/data",
			dataType: "json"
		});

		table.draw();

		expect(obsUrl).toBe('http://random.com/data?skip=0&limit=25');
		expect(d3.selectAll("#table tbody tr")[0].length).toBe(4);
		expect(d3.select("#table tbody td").text()).toBe("rajan");
	
		d3.json = originalFunc;
	})

	it("can process csv data", function(){
		var obsUrl = null;
		var originalFunc = d3.csv;

		d3.csv = function(url, cb){
			obsUrl = url;
			cb(null, fakeData)
		};

		var table = new D3Table({
			container_id: "#table",
			title: "Test table",
			style: "striped",
			dataUrl: "http://random.com/data",
			dataType: "csv"
		});

		table.draw();

		expect(obsUrl).toBe('http://random.com/data?skip=0&limit=25');
		expect(d3.selectAll("#table tbody tr")[0].length).toBe(4);
		expect(d3.select("#table tbody td").text()).toBe("rajan");
	
		d3.csv = originalFunc;
	})

	it("can process tsv data", function(){
		var obsUrl = null;
		var originalFunc = d3.tsv;

		d3.tsv = function(url, cb){
			obsUrl = url;
			cb(null, fakeData)
		};

		var table = new D3Table({
			container_id: "#table",
			title: "Test table",
			style: "striped",
			dataUrl: "http://random.com/data",
			dataType: "tsv"
		});

		table.draw();

		expect(obsUrl).toBe('http://random.com/data?skip=0&limit=25');
		expect(d3.selectAll("#table tbody tr")[0].length).toBe(4);
		expect(d3.select("#table tbody td").text()).toBe("rajan");
		
		d3.csv = originalFunc;
	})

	it("allows custom data transformers", function(){
		var obsUrl = null;
		var originalFunc = d3.json;

		d3.json = function(url, cb){
			obsUrl = url;
			cb(null, customData)
		};

		var table = new D3Table({
			container_id: "#table",
			title: "Test table",
			style: "striped",
			dataUrl: "http://random.com/data",
			dataType: "json"
		});

		// write the transformer to transform into array of objects
		table.transform = function(res){
			var headers = res.headers;
			var transformedData = [];
			res.data.forEach(function(data){
				var row = {};
				headers.forEach(function(header, index){
					row[header] = data[index];
				});
				transformedData.push(row);
			});
			return transformedData;
		}

		table.draw();

		expect(obsUrl).toBe('http://random.com/data?skip=0&limit=25');
		expect(d3.selectAll("#table tbody tr")[0].length).toBe(3);
		expect(d3.select("#table tbody td").text()).toBe("rajan1");
		
		d3.json = originalFunc;
	})

	afterEach(function(){
		d3.select("#table").remove();
	})
})