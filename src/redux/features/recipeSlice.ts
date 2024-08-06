// store/slices/recipeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Importing correctly

export interface Recipe {
  id: string;
  dateAdded: string;
  name: string;
  email: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  image: string;
  isFavorite: boolean;
}

interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: [],
};

const recipeSlice = createSlice({
  name: 'recipe',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Omit<Recipe, 'id'>>) => {
      const newRecipe = { id: uuidv4(), ...action.payload };
      state.recipes.push(newRecipe);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload;
      const recipe = state.recipes.find(recipe => recipe.id === recipeId);
      if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
      }
    },
  },
});

export const { addRecipe, updateRecipe, deleteRecipe, toggleFavorite } = recipeSlice.actions;

export default recipeSlice.reducer;
