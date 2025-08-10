const Recipe=require('../models/recipeModel');

const createRecipe=async (req,res)=>{

       try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }


};


module.exports={createRecipe};