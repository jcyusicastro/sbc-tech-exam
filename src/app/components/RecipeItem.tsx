import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Recipes.module.css';
import { Recipe } from '@/redux/features/recipeSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { toggleFavorite } from '@/redux/features/recipeSlice';
import { useAppDispatch } from '@/redux/hooks';

const RecipeItem = ({ recipe }: { recipe: Recipe }) => {

    console.log('recipe', recipe);
    const dispatch = useAppDispatch();
    const [showMore, setShowMore] = useState(false);

    const handleToggleShowMore = () => {
        setShowMore((prevShowMore) => !prevShowMore);
    };

    const handleFavoriteToggle = (id: string) => {
        dispatch(toggleFavorite(id));
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(recipe.dateAdded));

    return (
        <div key={recipe.id} className={styles.recipeItem}>
            <div className={styles.imageContainer}>
                <Image
                    src={recipe.image}
                    alt="Preview"
                    layout="responsive"
                    width={600}
                    height={400}
                    className={styles.imagePreview}
                    style={{ maxHeight: '150px', minHeight: '150px' }}
                />
                <button
                    className={styles.favoriteButton}
                    onClick={() => handleFavoriteToggle(recipe.id)}
                >
                   <FontAwesomeIcon icon={recipe.isFavorite ? solidStar : regularStar} />
                </button>
            </div>
            <div className={styles.contentContainer}>
                <Link href={`/recipe/${recipe.id}`}>
                    <h3>{recipe.title}</h3>
                </Link>
                <p className={showMore ? '' : styles.instructions}>
                    {recipe.instructions}
                </p>
                <span className={styles.showMore} onClick={handleToggleShowMore}>
                    {!showMore ? 'See more' : 'See less'}
                </span>
                <div className={styles.footerContainer}>
                    <p>{`Added by: ${recipe.name}`}</p>
                    <p>Date: {formattedDate} </p>
                </div>
            </div>
        </div>
    );
};

export default RecipeItem;
