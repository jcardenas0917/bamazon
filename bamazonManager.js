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
    managerView();
});

//updated stock after manager enters the new amount
var updateStock = (id, quantity) => {
    connection.query("SELECT stock_quantity, product_name FROM products WHERE item_id=?", [id], function (err, result) {
        if (err) throw err;
        var stockValue = result[0].stock_quantity;
        var product = result[0].product_name;
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
                console.log("Adding " + quantity + " to " + product + " stock quantity");
                console.log("inventory updated " + quantity + " units added to item " + id);
                managerView();
            }
        );
    });
};

///create product
var createProduct = (name, department, price, quantity) => {
    console.log(name, department, price, quantity)
    var query = connection.query("INSERT INTO products SET ?",
        {
            product_name: name,
            department_name: department,
            price: parseFloat(price),
            stock_quantity: parseInt(quantity)
        },
        function (err) {
            if (err) throw err;
            console.log("New product " + name + " created");
            managerView();
        }

    );

};
//ALL MANAGER FUNCTIONS
//--------------------------------------------------------------------
var viewProduct = () => {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log("loading items....")
        console.log("Items loaded")
        console.log(table);

        managerView();
    });
}

var viewLowInventory = () => {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = cTable.getTable(res);
        console.log("loading items....")
        console.log("Items loaded")
        console.log(table);
        managerView();
    });
}

var addInventory = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please choose the ID of the item you want to add inventory stock",
                name: "id"
            },

            {
                type: "input",
                message: "How many units would you like to add?",
                name: "quantity",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            },
            
        ]).then(function (res) {
            updateStock(res.id, res.quantity);

        });
}

var addProduct = () => {
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
            createProduct(items.item_name, items.department, items.price, items.quantity);
        });

}

//Starts Managers view application
var managerView = () => {
    inquirer
        .prompt([
            // Here we create a list prompt to prompt the manager what options to use for data retrieval.
            {
                type: "rawlist",
                message: "What data would you like to do?",
                name: "data",
                choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`, `Add New Product`, "Exit"]
            },
        ]).then(function (res) {
            switch (res.data) {
                //If manager chooses to view products
                case "View Products for Sale":
                    viewProduct();
                    break;
                //If manager wants to check low inventory
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                //If manager wants to add stock to items
                case "Add to Inventory":
                    addInventory();
                    break;
                //If manager wants to add a new product for sale
                case "Add New Product":
                    addProduct();
                    break;
                default:
                    connection.end()

            };
        });

}
