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
    start()
});

//open store and asks customer which product they would like to buy.
var start = () => {
    console.log("List of all available products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("| " + "Product Name |" + " " + "Department |" + " " + "Price |");
        console.log("----------------------------------------");
        for (var i = 0; i < res.length; i++) {

            console.log("| " + res[i].item_id + " | " + res[i].product_name + "     |" + res[i].department_name + "    |" + res[i].price + "  |");

        }


        inquirer
            .prompt([
                // Here we create a basic text prompt.
                {
                    type: "input",
                    message: "Pleas choose the ID of the item you want to buy?",
                    name: "id"
                },

                {
                    type: "input",
                    message: "How many units would you like to buy?",
                    name: "quantity"
                },

            ])
            .then(function (answer) {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: answer.quantity
                        },
                        {
                            item_id: answer.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Bid placed successfully!");
                        //   start();
                        connection.end();
                    }
                );
            });
    });
}



