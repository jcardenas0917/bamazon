// open sql connection

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

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
    // connection.end();
});

// display list of products for user to choose from.
var displayProduct = list => {
    console.log("| " + "Product Name |" + " " + "Department |" + " " + "Price |");
    console.log("----------------------------------------");
    for (var i = 0; i < list.length; i++) {

        console.log("| "+ list[i].item_id+" | " + list[i].product_name + "     |" + list[i].department_name + "    |" + list[i].price + "  |");
        // console.log("----------------------------------------")
    }
    // connection.end();
    start()
}
console.log("List of all available products...\n");
connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    displayProduct(res)
    // console.log(res);

});

//open store and asks customer which product they would like to buy.
var start = () => {

    inquirer
        .prompt([
            // Here we create a basic text prompt.
            {
                type: "input",
                message: "Please enter the id of the item you would like to buy?",
                name: "item_id"
            },
            {
                type: "input",
                message: "How many units would you like to buy?",
                name: "item_id"
            },

        ])

    connection.end()
}