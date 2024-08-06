'use client';
import React from 'react';
import Link from 'next/link';
import RecipeItem from './RecipeItem';
import styles from './Recipes.module.css';

import { Recipe } from '@/redux/features/recipeSlice';

const Recipes = ({ recipes } : { recipes: Recipe[] }) => {
    return (
        <main className={styles.listContainer}>
            <Link href="/recipe/new" className={styles.floatingButton}>+</Link>
            {recipes?.length > 0 ? (
                recipes.map((recipe: Recipe) => (
                    <RecipeItem key={recipe.id} recipe={recipe} />
                ))
            ) : (
                <div className={styles.noRecord}>No Record Found!</div>
            )}
        </main>
    );
};

export default Recipes;
