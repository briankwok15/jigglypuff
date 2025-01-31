const pool = require('../pool');

const GET_ALL = `SELECT "Product"."SKU", "Product"."product_name", "size", "inventory", "price", "Category"."category_name" from
"Product" join "Category" on "Product"."category_id"="Category"."category_id";`;

const GET_CATEGORY = `SELECT "Product"."SKU", "Product"."product_name", "size", "inventory", "price", "Category"."category_name" from
"Product" join "Category" on "Product"."category_id"="Category"."category_id" WHERE "Category"."category_name"=`;

const UPDATE_INVENTORY = `UPDATE "Product" SET "inventory" = "inventory" - `;

const UPDATE_SKU = ` WHERE "SKU"=`;

const MATCH_SKU = `SELECT * FROM "Product" WHERE "SKU"=`;

const DELETE_SKU = `DELETE FROM "Product" WHERE "SKU"=`;

const INSERT_PRODUCT = `INSERT INTO "Product" ("category_id", "product_name", "size", "inventory", "price") VALUES($1, $2, $3, $4, $5)`

const productModel = {
  //returns all shoes from database
  getAll() {
    return new Promise((resolve, reject) => {
      pool.query(GET_ALL, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    })
  },
  //returns all shoes based off brand name
  getCategory(categoryName) {
    return new Promise((resolve, reject) => {
      pool.query(GET_CATEGORY + `'${categoryName}'` + ";", (err, result) => {
        if (err) return reject(err);
        resolve(result);
      })
    })
  },
  //takes in cart obj with keys of SKU number and values of the quantities bought of each
  updateInventory(cart) {
    return new Promise((resolve, reject) => {
      const SKUs = Object.keys(cart);
      for (let i = 0; i < SKUs.length; i += 1) {
        pool.query(UPDATE_INVENTORY + cart[SKUs[i]] + " " + UPDATE_SKU + SKUs[i] + ";", (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
      }
    })
  },
  // method will take in the SKU from our client(req.body)
  // method will look for a match in our DB and if found it will be deleted
  // if there is no match, it will throw an error
  deleteProduct(SKU) {
    return new Promise((resolve, reject) => {
      const queryString = MATCH_SKU + `${SKU};`;
      pool.query(queryString, (err, result) => {
        if (err) return reject(err);
        if (!result) return reject('Product not found');
        pool.query(DELETE_SKU + `${SKU}`), (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
        resolve(result);
      })
    })
  },
  // attributes will be request.body
  addProduct(productInfo) {
    const productValues = [productInfo.category, productInfo.productName, productInfo.size, productInfo.inventory, productInfo.price];
    return new Promise((resolve, reject) => {
      pool.query(INSERT_PRODUCT, productValues, (err, result) => {
        if (err) return reject(err);
        resolve();
      })
    })
  }
};

module.exports = productModel;
