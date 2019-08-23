var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});
//connect to DB and update the stock after purchase
connection.connect(function (err) {
    if (err) throw err;
    managerView();
});
var managerView = () => {
    inquirer
        .prompt([
            // Here we create a basic text prompt to prompt the user what item to purchase and how many.
            {
                type: "rawlist",
                message: "What data would you like to view?",
                name: "data",
                choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`, `Add New Product`]
            },
        ]).then(function (res) {
            switch (res.data) {
                case "View Products for Sale":
                    connection.query("SELECT * FROM products", function (err, res) {
                        console.log("| " + "Product Name |" + " " + "Department |" + " " + "Price |" + "Stock "+" |");
                        console.log("----------------------------------------");
                        for (var i = 0; i < res.length; i++) {

                            console.log("| " + res[i].item_id + " | " + res[i].product_name + "     |" + res[i].department_name + "    |" + res[i].price + "  |" + res[i].stock_quantity );

                        }

                    });
            };
        });   
}
