import { Recipe } from "../models/recipe.js"

const edamamUrl = `https://api.edamam.com/api/recipes/v2`

export async function search(req, res) {
  try {
    const apiResponse = await fetch(`${edamamUrl}?type=public&q=${req.body.query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`)
    const apiData = await apiResponse.json()
    apiData.hits.forEach(recipe => delete recipe['_links'] )
    res.json(apiData.hits)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export async function show(req, res) {
  try {
    const apiResponse = await fetch(`${edamamUrl}/${req.params.edamamId}?type=public&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_APP_KEY}`)
    const apiData = await apiResponse.json()
    delete apiData['_links']
    res.json(apiData.recipe)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}