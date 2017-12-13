// Requiring dependencies.
var mysql = require('mysql');
var password = require('./password.js');
var prompt = require('prompt');
var Table = require('cli-table');

// Setting up the connection to mySQL.
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: password,
	database: 'bamazon'
});

// Initializing the mySQL connection and prompt.
connection.connect();
prompt.start();

// Intro message for the user.
console.log(" ");
console.log("Welcome to Bamazonexec!");
console.log(" ");
console.log("Select an option to continue:");
console.log(" ");
console.log("1) View Product Sales by Department");
console.log("2) Create New Department");
console.log(" ");

// Prompt for the user to select what they want to do.
prompt.get('option', function(err, result){

	// If the user selects option 1..
	if (result.option == 1) {

		// Making a header for display.
		console.log(" ")
		console.log("===== View Product Sales by Department =====")
		console.log(" ")

		// Connecting to database and selecting everything from the department table.
		connection.query('SELECT * FROM departments', function(err, rows){
			
			// Error handling
			if (err) throw err;

			// Creating a table to display results. 
			var table = new Table({
				head: ['ID', 'Name', 'Overhead', 'Sales', 'Profit'], 
				colWidths: [10, 15, 10, 10, 10]
			});

			// Looping through the results of the mySQL query and adding them to the table.
			for (var i = 0; i < rows.length; i ++) {
				var tr = [];
				tr.push(rows[i].DepartmentID)
				tr.push(rows[i].DepartmentName)
				tr.push(rows[i].OverHeadCosts)
				tr.push(rows[i].TotalSales)
				tr.push((rows[i].TotalSales - rows[i].OverHeadCosts))
				table.push(tr)
			};

			// Logging the table to the console.
			console.log(table.toString());

		});

	// If the user selects option 2...
	} else if (result.option == 2) {

		// Making a header for display.
		console.log(" ")
		console.log("===== Create New Department =====")
		console.log(" ")

		// Defining what is going to be asked in the prompt.
		var schema = {
			properties: {
				depName: {
					description: 'Enter Department Name'
				},
				costs: {
					description: 'Enter Overhead Costs'
				},
				sales: {
					description: 'Enter Total Sales'
				}
			}
		}

		// Ask the user necessary information to set up new department.
		prompt.get(schema, function(err, result){

			// Making a mySQL query to add a new department to the database using the user input.
			connection.query('INSERT INTO departments (DepartmentName, OverHeadCosts, TotalSales) VALUES ("'+result.depName+'", "'+result.costs+'", '+result.sales+');', function(err, res) {
				if (err) throw err;
				console.log(" ")
				console.log("Department Successfully Added!")
			});

		});

	// If the user inputs something other than 1 or 2 they get an error message.
	} else {
		console.log('Invalid Input');
	};

});