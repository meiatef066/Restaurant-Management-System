const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meals.controller');
const authenticateJWT=require('./../middleware/authonticate')
const authorizeRole=require('./../middleware/authorizeRole')


router.get('/', mealController.getMeals);

// router.get('/:name', mealController.getMealsByName);

// router.get('/category/:category', mealController.getMealsByCategory);

router.post('/',authenticateJWT,authorizeRole(['admin']),mealController.addMultipleMeals)

module.exports = router;