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

//updated stock after manager enters the new amount
var updateStock = (id, quantity) => {
    connection.query("SELECT stock_quantity FROM products WHERE item_id=?", [id], function (err, result) {
        if (err) throw err;
        var stockValue = result[0].stock_quantity;
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: stockValue + parseInt(quantity)
                },
                {
                    item_id: id
                }
            ],
            function (error) {
                if (error) throw error;
                //   start();
                
                console.log("inventory updated "+quantity+ " units added to item " + id);
                managerView();
            }
        );
    });
};

///create product
var createProduct = (name,department,price,quantity) => {
    console.log(name,department,price,quantity)
    var query = connection.query("INSERT INTO products SET ?",
        {
            product_name: name,
            department_name: department,
            price: parseFloat(price),
            stock_quantity:  parseInt(quantity)
        },
        function (err) {
            if (err) throw err;
            console.log("New product "+ name + " inserted"); 
            console.log(query.sql);
            managerView();
        }
       
    );
    
};

//Starts Managers view application
var managerView = () => {
    inquirer
        .prompt([
            // Here we create a list prompt to prompt the manager what options to use for data retrieval.
            {
                type: "rawlist",
                message: "What data would you like to do?",
                name: "data",
                choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`, `Add New Product`,"Exit"]
            },
        ]).then(function (res) {
            switch (res.data) {
                case "View Products for Sale":
                    connection.query("SELECT * FROM products", function (err, res) {
                        if (err) throw err;
                        console.log("| " + "Product Name |" + " " + "Department |" + " " + "Price |" + "Stock " + " |");
                        console.log("----------------------------------------");
                        for (var i = 0; i < res.length; i++) {

                            console.log("| " + res[i].item_id + " | " + res[i].product_name + "     |" + res[i].department_name + "    |" + res[i].price + "  |" + res[i].stock_quantity);

                        }
                        managerView();
                    });
                    break;
                case "View Low Inventory":
                        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
                            if (err) throw err;
                            console.log("| " + "Product Name |" + " " + "Department |" + " " + "Price |" + "Stock " + " |");
                            console.log("----------------------------------------");
                            for (var i = 0; i < res.length; i++) {
    
                                console.log("| " + res[i].item_id + " | " + res[i].product_name + "     |" + res[i].department_name + "    |" + res[i].price + "  |" + res[i].stock_quantity);
    
                            }
                            managerView();
                        });
                        break;
                case "Add to Inventory":
                        inquirer
                        .prompt([
                            // Here we create a basic text prompt to prompt the user what item to purchase and how many.
                            {
                                type: "input",
                                message: "Please choose the ID of the item you want to add inventory stock",
                                name: "id"
                            },
            
                            {
                                type: "input",
                                message: "How many units would you like to add?",
                                name: "quantity"
                            },
                        ]).then(function (res) {
                            updateStock(res.id, res.quantity);

                        });
                        break;
                case "Add New Product":
                        inquirer
                        .prompt([
                            {
                                type: "input",
                                message: "Enter product name",
                                name: "item_name"
                            },
                            {
                                type: "input",
                                message: "Enter department name",
                                name: "department"
                            },
                            {
                                type: "input",
                                message: "Enter price",
                                name: "price"
                            },
                            {
                                type: "input",
                                message: "Enter stock quantity",
                                name: "quantity"
                            },
                            
                            
                        ])
                        .then(function (items) {
                            createProduct(items.item_name,items.department,items.price,items.quantity);
                        });
                        break;
                    default :
                    connection.end()

            };
        });

}
