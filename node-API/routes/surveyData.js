const express = require('express');
const { db } = require('../server');
const router = express.Router();
const categoryFinder = require('../helpers/survey')


const surveyData = (db) => {

  router.post("/", async (req, res) => {
    //console.log("IN POST SURVEY", (req.body))
    let query = req.body
    let roomQuery = []
    let categoryQuery = []
    let categories = []
    for (const room of query.rooms) {
      roomQuery.push(`rooms.name = '${room}'`)
    }
    categories = categoryFinder(query)

    for (const category in categories) {
      categoryQuery.push(`categories.name = '${categories[category].name}'`)
    }
    let productsRoomOrCategories = []
    let filteredProducts = []
    // get all products that match the room or category requested
    let productsRoomAndCategories = (await db.query(`SELECT products.* 
                    FROM products 
                    WHERE products.room_id 
                    IN (SELECT DISTINCT rooms.id FROM rooms WHERE ${roomQuery.join(' OR ')}) 
                    AND products.category_id
                    IN (SELECT DISTINCT categories.id FROM categories WHERE ${categoryQuery.join(' OR ')})
                    ORDER BY products.price`
      )).rows
      filteredProducts = productsRoomAndCategories
    if (productsRoomAndCategories <= 4) {
      productsRoomOrCategories = (await db.query(`SELECT products.* 
                    FROM products 
                    WHERE products.room_id 
                    IN (SELECT DISTINCT rooms.id FROM rooms WHERE ${roomQuery.join(' OR ')}) 
                    OR products.category_id
                    IN (SELECT DISTINCT categories.id FROM categories WHERE ${categoryQuery.join(' OR ')})
                    ORDER BY products.price`
        )).rows
        filteredProducts = productsRoomOrCategories
      }
    let inspecificProducts = (await db.query(`
                    SELECT * 
                    FROM products
                    WHERE room_id = 1`
        )).rows
    // console.log(productsRoomAndCategories)
    // console.log(productsRoomOrCategories)

   

    console.log(inspecificProducts)
    res.json(filteredProducts)
    })


    let data = 'dogs'
    // let users = (await db.query(`SELECT * FROM users;`)).rows
    // await keyword essentially stops the code and completes the line before continuning one
    // data = await db.query(`SELECT * FROM users;`)
    // let users = data.rows

return router;
}


module.exports = surveyData