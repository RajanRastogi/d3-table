describe("D3Table's ColumnOption ", function(){

	beforeEach(function(){
		// create an empty container with id 'table'
		d3.select("body").append("div").attr("id", "table");

		// ensure container is empty 
		expect(d3.select("#table table").node()).toBe(null);
	});

	it("lets you pick data to be displayed in the column cells", function(){
		// table to just show the email addresses
		var table = new D3Table({
			container_id: "#table",
			style: "striped bordered",
			columnOptions: [
				{
					title: "Blackisted Ids",
					data: "email"
				}
			],
			data: [
				{ name: "rajan", age: 25, email: "rajan@gmail.com" },
				{ name: "rajan2", age: 25, email: "rajan2@gmail.com" }
			]
		});

		table.draw();
		
		var d3_table = d3.select("#table table");
		expect(d3_table.node()).not.toBe(null);
		expect(d3_table.selectAll("thead tr")[0].length).toBe(1);
		expect(d3_table.selectAll("thead tr th").text()).toBe("Blackisted Ids");
		expect(d3_table.selectAll("tbody tr").size()).toBe(2);
		
		var ids = ["rajan@gmail.com", "rajan2@gmail.com"];
		d3_table.selectAll("tbody tr").selectAll("td")
		.each(function(d, i){
			expect(d3.select(this).text()).toBe(ids.shift());
		});
	});

	it("lets you customize the column title", function(){
		var table = new D3Table({
			container_id: "#table",
			style: "striped bordered",
			columnOptions: [
				{
					title: "Warriors",
					data: "name"
				}
			],
			data: [
				{ name: "rajan", age: 25, email: "rajan@gmail.com" },
				{ name: "rajan2", age: 25, email: "rajan2@gmail.com" }
			]
		});

		table.draw();
		
		var d3_table = d3.select("#table table");
		expect(d3_table.node()).not.toBe(null);
		expect(d3_table.selectAll("thead tr")[0].length).toBe(1);
		expect(d3_table.selectAll("thead tr th").text()).toBe("Warriors");
		expect(d3_table.selectAll("tbody tr").size()).toBe(2);
		
		var names = ["rajan", "rajan2"];
		d3_table.selectAll("tbody tr").selectAll("td")
		.each(function(d, i){
			expect(d3.select(this).text()).toBe(names.shift());
		});
	});

	it("lets you compute column values", function(){
		var table = new D3Table({
			container_id: "#table",
			style: "Product Dimensions",
			columnOptions: [
				{
					title: "Length",
					data: "length"
				},
				{
					title: "Breadth",
					data: "breadth"
				},
				{
					title: "Area",
					data: function(d){
						return d.length * d.breadth;
					}
				}
			],
			data: [
				{ length: 5,  breadth: 5 },
				{ length: 100, breadth: 0.5 }
			]
		});

		table.draw();
		
		var d3_table = d3.select("#table table");
		expect(d3_table.node()).not.toBe(null);
		expect(d3_table.selectAll("tbody tr").size()).toBe(2);
		
		var values = ["5", "5", "25", "100", "0.5", "50"];
		d3_table.selectAll("tbody").selectAll("tr").selectAll("td").each(function(){
			expect(d3.select(this).text()).toBe(values.shift());
		});
	});

	it("lets you combine columns", function(){
		var table = new D3Table({
			container_id: "#table",
			style: "striped bordered",
			columnOptions: [
				{
					title: "Full Name",
					data: function(d){
						return d.first_name + " " + d.last_name;
					}
				}
			],
			data: [
				{ first_name: "rajan",  last_name: "rastogi" },
				{ first_name: "rajan2", last_name: "rastogi" }
			]
		});

		table.draw();
		
		var d3_table = d3.select("#table table");
		expect(d3_table.node()).not.toBe(null);
		expect(d3_table.selectAll("thead tr")[0].length).toBe(1);
		expect(d3_table.selectAll("thead tr th").text()).toBe("Full Name");
		expect(d3_table.selectAll("tbody tr").size()).toBe(2);
		
		var names = ["rajan rastogi", "rajan2 rastogi"];
		d3_table.selectAll("tbody tr").selectAll("td")
		.each(function(d, i){
			expect(d3.select(this).text()).toBe(names.shift());
		});
	});

	it("lets you hide colums", function(){
		var table = new D3Table({
			container_id: "#table",
			style: "striped",
			columnOptions: [
				{
					title: "Name",
					data: "name"
				},
				{
					title: "Age",
					data: "age"
				},
				{
					title: "Email",
					data: "email",
					isHidden: true
				}
			],
			data: [
				{ name: "rajan", age: 25, email: "rajan@gmail.com" },
				{ name: "rajan2", age: 25, email: "rajan2@gmail.com" },
				{ name: "rajan3", age: 25, email: "rajan3@gmail.com" },
				{ name: "rajan4", age: 25, email: "rajan4@gmail.com" }
			]
		});

		table.draw();

		var headers = ["Name", "Age"];
		d3.select("#table thead").select("tr").selectAll("th").each(function(){
			expect(d3.select(this).text()).toBe(headers.shift());
		});
		expect(d3.selectAll("#table tbody tr")[0].length).toBe(4);
	});

	it("lets you insert custom html into cells", function(){
		var table = new D3Table({
			container_id: "#table",
			style: "striped",
			columnOptions: [
				{
					title: "First Name",
					data: "name"
				},
				{
					title: "Age",
					data: "age"
				},
				{
					title: "Custom HTML",
					innerHtml: function(data){
						return "<span>"+data.name+"</span>";
					}
				}
			],
			data: [
				{ name: "rajan1", age: 25, email: "rajan1@gmail.com" },
				{ name: "rajan2", age: 25, email: "rajan2@gmail.com" },
				{ name: "rajan3", age: 25, email: "rajan3@gmail.com" },
				{ name: "rajan4", age: 25, email: "rajan4@gmail.com" }
			]
		});

		table.draw();

		var rowContent = ["rajan1", "25", "<span>rajan1</span>"];

		d3.select("#table tbody").select("tr").selectAll("td").each(function(){
			expect(d3.select(this).html()).toBe(rowContent.shift());
		});		
	});

	it("lets you apply classes to columns", function(){
		var table = new D3Table({
			container_id: "#table",
			style: "striped",
			columnOptions: [
				{
					title: "First Name",
					data: "name",
					classed: "highlight"
				},
				{
					title: "Age",
					data: "age"
				}
			],
			data: [
				{ name: "rajan1", age: 25, email: "rajan1@gmail.com" },
				{ name: "rajan2", age: 25, email: "rajan2@gmail.com" },
				{ name: "rajan3", age: 25, email: "rajan3@gmail.com" },
				{ name: "rajan4", age: 25, email: "rajan4@gmail.com" }
			]
		});

		table.draw();
		expect(d3.select("#table thead tr th").attr("class")).toBe("highlight d3t-table-col-header");
		expect(d3.select("#table tbody tr td").attr("class")).toBe("highlight");
	});

	afterEach(function(){
		d3.select("#table").remove();
	});

});