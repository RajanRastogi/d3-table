describe("D3Table", function(){

	beforeEach(function(){
		// create an empty container with id 'table'
		d3.select("body").append("div").attr("id", "table");

		// 
		expect(d3.select("#table table").node()).toBe(null);
	});

	it("lets you draw basic tables", function(){
		
		var table = new D3Table({
			container_id: "#table",
			title: "Test table",
			style: "striped",
			data: [
				{ name: "rajan", age: 25, email: "rajan@gmail.com" },
				{ name: "rajan2", age: 25, email: "rajan2@gmail.com" }
			]
		});

		table.draw();
		
		var d3_table = d3.select("#table table");
		expect(d3_table.node()).not.toBe(null);
		expect(d3_table.selectAll("tbody tr")[0].length).toBe(2);
	});

	it("lets you easily update table data", function(){
		var table = new D3Table({
			container_id: "#table",
			title: "Test table",
			style: "striped",
			data: [
				{ name: "rajan init", age: 25, email: "rajan@gmail.com" }
			]
		});

		table.draw();

		expect(d3.selectAll("#table tbody tr")[0].length).toBe(1);
		expect(d3.select("#table tbody td").text()).toBe("rajan init");

		// update table data
		table.update([
			{ name: "rajan", age: 25, email: "rajan@gmail.com" },
			{ name: "rajan2", age: 25, email: "rajan2@gmail.com" },
			{ name: "rajan3", age: 25, email: "rajan3@gmail.com" },
			{ name: "rajan4", age: 25, email: "rajan4@gmail.com" }
		]);

		expect(d3.selectAll("#table tbody tr")[0].length).toBe(4);
		expect(d3.select("#table tbody td").text()).toBe("rajan");
	});

	afterEach(function(){
		d3.select("#table").remove();
	})
});