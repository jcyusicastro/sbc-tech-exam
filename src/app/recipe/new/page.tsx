import Header from '@/app/components/Header';
import React from 'react'
import RecipeForm from '@/app/recipe/components/RecipeForm';
function AddRecipeForm() {
  return (
    <div>
        <Header showSearch={false} />
        <RecipeForm />
    </div>
  )
}

export default AddRecipeForm;