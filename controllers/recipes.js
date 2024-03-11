import { Recipe } from "../models/recipe.js"
import { Profile } from "../models/profile.js"

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

export async function create(req, res) {
  // add an addedBy prop to req.body
  req.body.addedBy = req.user.profile
  // create new recipe
  const recipe = await Recipe.create(req.body)
  // find profile of logged in user (populate recipes)
  const profile = await Profile.findById(req.user.profile).populate('recipes')
  // add full recipe to profile
  profile.recipes.push(recipe)
  // save profile
  await profile.save()
  // respond to front end
  res.json(profile)
}