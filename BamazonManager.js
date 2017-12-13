// Requiring dependencies.
var mysql = require('mysql');
var password = require('./password.js');
var prompt = require('prompt');

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
console.log("Welcome to Bamazonmgr!");
console.log(" ");
console.log("Select an option to continue:");
console.log(" ");
console.log("1) View Products For Sale");
console.log("2) View Low Inventory");
console.log("3) Add to Inventory");
console.log("4) Add New Product");
console.log(" ");

	// Asks the user which option they want.
	prompt.get('option', function(err, result) {

		// If they choose option 1...
		if (result.option == 1) {
			console.log(" ")
			console.log("===== Products For Sale =====")
			console.log(" ")
			connection.query('SELECT * FROM products', function(err, rows) {
				if (err) throw err;
				// Log all of the products to the console.
				for (var i = 0; i < rows.length; i++) {
					console.log("Item ID: " + rows[i].ItemID + " Name: " + rows[i].ProductName + " Price: $" + rows[i].Price + " Quantity: " + rows[i].StockQuantity);
				};
			});
		// If they choose option 2...
		} else if (result.option == 2) {
			console.log(" ")
			console.log("===== Low Inventory =====")
			console.log(" ")
			// mySQL query that selects all products with 5 items or less in inventory...
			connection.query('SELECT * FROM products WHERE StockQuantity <= 5', function(err, rows) {
				if (err) throw err;
				// ...and logs them to the console!
				for (var i = 0; i < rows.length; i++) {
					console.log("Item ID: " + rows[i].ItemID + " Name: " + rows[i].ProductName + " Price: $" + rows[i].Price + " Quantity: " + rows[i].StockQuantity);
				};
			});
		// If they choose option 3...
		} else if (result.option == 3) {
			console.log(" ")
			console.log("===== Add to Inventory =====")
			console.log(" ")
			console.log("Here is the current inventory for reference:")

			// Select everything from the product table.
			connection.query('SELECT * FROM products', function(err, rows) {
				if (err) throw err;
				for (var i = 0; i < rows.length; i++) {
					console.log("Item ID: " + rows[i].ItemID + " Name: " + rows[i].ProductName + " Quantity: " + rows[i].StockQuantity);
				};
				console.log(" ");
				var schema = {
					properties: {
						itemid: {
							description: 'What is the ID of the product you desire?'
						},
						quantity: {
							description: 'How many would you like to add?',
							type: 'number'
						}
					}
				}
				// Ask the user for information to update stock quantity.
				prompt.get(schema, function(err, result){
					var newTotal = rows[result.itemid-1].StockQuantity + result.quantity;
					connection.query('UPDATE products SET StockQuantity="'+newTotal+'" WHERE ItemID="'+result.itemid+'"', function(err, res) {
						if (err) throw err;
						console.log(" ")
						console.log("Inventory Successfully Updated!")
						console.log(" ")
						console.log(result.quantity + " units have been added to " + rows[result.itemid-1].ProductName)
						console.log('There are now '+newTotal+' units of '+rows[result.itemid-1].ProductName)
					});
				});
			});

			console.log(" ");
		// If they choose option 4...
		} else if (result.option == 4) {

			console.log(" ")
			console.log("===== Add New Product =====")
			console.log(" ")


			var schema = {
				properties: {
					name: {
						description: 'What is the name of the product?',
						required: true
					},
					departmentName: {
						description: 'What is the department name?',
						required: true
					},
					price: {
						description: 'What is the price?',
						type: 'number',
						required: true
					},
					stock: {
						description: 'How much stock?',
						type: 'number',
						required: true
					}
				}
			}
			// Getting the information to add a product to the databse.
			prompt.get(schema, function(err, result){
				connection.query('INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("'+result.name+'", "'+result.departmentName+'", '+result.price+', '+result.stock+');', function(err, res) {
					if (err) throw err;
					console.log(" ")
					console.log("Your product was added!")
				});
			});
		// If they enter something else.
		} else {
			console.log("Invalid Input")
		};
	});