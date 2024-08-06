'use client'
import Header from '@/app/components/Header';
import React from 'react'
import RecipeForm from '../components/RecipeForm';

import { useParams } from 'next/navigation';

function RecipeDetails() {
    const { id } = useParams();
    return (
        <div>
            <Header showSearch={false} />
            <RecipeForm recipeId={id as string}/>
        </div>
    )
}

export default RecipeDetails;