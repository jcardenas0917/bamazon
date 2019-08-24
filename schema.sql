DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
  item_id INTEGER AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(50)NOT NULL,
  department_name VARCHAR(50)NOT NULL,
  price DECIMAL()NOT NULL,
  stock_quantity INTEGER()NOT NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;