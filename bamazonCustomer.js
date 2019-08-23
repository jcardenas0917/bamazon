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
//connect to DB and update the stock after purchase
connection.connect(function (err) {
    if (err) throw err;
    start();
});

var displayTotalPurchase = (iId,quan) => {
    connection.query("SELECT price FROM products WHERE item_id=?", [iId], function (err, result) {
        if (err) throw err;
        var itemPrice = result[0].price;
        var totalPurchase = itemPrice*quan;
        console.log("Your total purchase is $"+ totalPurchase);
        connection.end();
    })
} 
var updateStock = (id, quantity) => {
    connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [id], function (err, result) {
        if (err) throw err;
        var stockValue = result[0].stock_quantity;
        if (quantity > stockValue) {
            console.log("Sorry there is not enough stock available to fullfill your order")
            inquirer
            .prompt([
                // Here we create a basic text prompt.
                {
                    type: "input",
                    message: "Would you like to enter a different amount? Enter Y or N?",
                    name: "retry",
                    
                }
            ]).then(function (ans) {
                if (ans.retry==="Y"|| ans.retry==="y"){
                    start()
                }else if(ans.retry==="N"|| ans.retry==="n"){
                    console.log("Have a good day!")
                    connection.end();
                }
            });
        } else{

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
                    // connection.end();
                }
            );
        };
    });

}
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
                    message: "Please choose the ID of the item you want to buy?",
                    name: "id"
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



