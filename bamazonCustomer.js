// open sql connection

var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');
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
    start();
});

//Displays total amount of the purchase
var displayTotalPurchase = (id,quantity) => {
    connection.query("SELECT price FROM products WHERE item_id=?", [id], function (err, result) {
        if (err) throw err;
        var itemPrice = result[0].price;
        var totalPurchase = itemPrice*quantity;
        console.log("Thank You");
        console.log("Your total purchase is $"+ totalPurchase);
        connection.end();
    })
} 
//update the stock
var updateStock = (id, quantity) => {
    connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [id], function (err, result) {
        if (err) throw err;
        var stockValue = result[0].stock_quantity;
        if (quantity > stockValue) {
            console.log("Sorry there is not enough stock available to fullfill your order")
            inquirer
            .prompt([
                //if the user tries to buy more than what is available in stock we ask then to try again
                // Here we create a basic text prompt.
                {
                    type: "confirm",
                    message: "Would you like to try again?",
                    name: "retry",
                    
                }
            ]).then(function (ans) {
                //Check if the user wants to try purchasing the item again.
                if (ans.retry){
                    start()
                }else{
                    console.log("Have a good day!")
                    connection.end();
                }
            });
        } else{
            //the stock gets updated based on the amount chosen by the user
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: stockValue - quantity
                    },
                    {
                        item_id: id
                    }
                ],
                function (error) {
                    if (error) throw error;
                    //   start();
                    
                    displayTotalPurchase(id,quantity)
                    
                }
            );
        };
    });

}
//open store and asks customer which product they would like to buy.
var start = () => {
    console.log("List of all available products...\n");
    connection.query("SELECT item_id,product_name,department_name,price FROM products", function (err, res) {
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log(table);


        inquirer
            .prompt([
                // Here we create a basic text prompt to prompt the user what item to purchase and how many.
                {
                    type: "input",
                    message: "Please choose the ID of the item you want to buy?",
                    name: "id",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                },

                {
                    type: "input",
                    message: "How many units would you like to buy?",
                    name: "quantity"
                },

            ])
            .then(function (answer) {
                updateStock(answer.id, answer.quantity);
            });
    });
}



