'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { addRecipe, deleteRecipe, Recipe, updateRecipe } from '@/redux/features/recipeSlice';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/redux/hooks';

import Image from 'next/image';
import styles from '../styles/RecipeForm.module.css';

const RecipeForm = ({ recipeId }: { recipeId?: string }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const recipes = useAppSelector((state) => state.recipes.recipes);
    const selectedRecipe = recipes.find(r => r.id === recipeId);

    const initialState: Recipe = {
        id: '',
        dateAdded: '',
        name: '',
        email: '',
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        image: '',
        isFavorite: false
    };

    const [formState, setFormState] = useState<Recipe>(initialState);
    const [isEmailValid, setEmailValid] = useState<boolean | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (selectedRecipe) {
            setFormState(selectedRecipe);
        }
    }, [selectedRecipe]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
            setEmailValid(isValid);
        }
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState({ ...formState, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formState.title) {
            toast.error('The title is required.');
            return;
        }

        const titleExists = recipes.some(recipe => recipe.title === formState.title);
        if (!recipeId && titleExists) {
            toast.error('The title must be unique.');
            return;
        }

        try {
            let imageUrl = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile, `${formState.title}.jpg`);
                formData.append('fileName', `${formState.title}.jpg`);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image.');
                }

                const uploadResult = await uploadResponse.json();
                if (uploadResult.Message === 'Success') {
                    imageUrl = `/uploads/${formState.title}.jpg`;
                } else {
                    throw new Error('Failed to upload image.');
                }
            } else {
                toast.error('Recipe image is required.');
                return;
            }

            const recipeData: Recipe = {
                ...formState,
                id: recipeId || uuidv4(),
                dateAdded: recipeId ? formState.dateAdded : new Date().toISOString(),
                image: imageUrl || formState.image,
            };

            if (recipeId) {
                dispatch(updateRecipe(recipeData));
                toast.success('Recipe updated.');
            } else {
                dispatch(addRecipe(recipeData));
                setFormState(initialState);
                toast.success('Recipe added.');
            }

            router.back();
        } catch (error) {
            console.error("Error:", error);
            toast.error('An error occurred while processing your request.');
        }
    };

    const handleDelete = () => {
        if (recipeId) {
            dispatch(deleteRecipe(recipeId));
            toast.success('Recipe deleted.');
            router.back();
        }
    };

    const handleClick = () => {
        document.getElementById('fileInput').click();
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.imageContainer}>
                <div className={styles.backButton} onClick={() => router.back()}>{'< Back'}</div>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <div className={styles.imagePlaceholder} onClick={handleClick}>
                    {formState.image ? (
                        <Image
                            src={formState.image}
                            alt="Preview"
                            layout="responsive"
                            width={600}
                            height={400}
                            className={styles.imagePreview}
                        />
                    ) : (
                        <div className={styles.placeholderText}>
                            <Image
                                src={'/uploads/placeholder.png'}
                                alt="Preview"
                                layout="responsive"
                                width={600}
                                height={400}
                                className={styles.imagePreview}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.fieldsContainer}>
                <label className={styles.fieldLabel}>YOUR NAME
                    <input
                        type="text"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className={`${styles.inputField} ${!formState.name ? styles.error : ''}`}
                        required
                    />
                </label>
                <label className={styles.fieldLabel}>EMAIL ADDRESS
                    <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className={`${styles.inputField} ${!formState.email || !isEmailValid ? styles.error : ''}`}
                        required
                    />
                </label>
                <label className={styles.fieldLabel}>TITLE
                    <input
                        type="text"
                        name="title"
                        value={formState.title}
                        onChange={handleChange}
                        className={`${styles.inputField} ${!formState.title ? styles.error : ''}`}
                        required
                        disabled={!!recipeId}
                    />
                </label>
                <label className={styles.fieldLabel}>DESCRIPTION
                    <textarea
                        name="description"
                        value={formState.description}
                        onChange={handleChange}
                        className={`${styles.textareaField} ${!formState.description ? styles.error : ''}`}
                        required
                    />
                </label>
                <label className={styles.fieldLabel}>INGREDIENTS
                    <textarea
                        name="ingredients"
                        value={formState.ingredients}
                        onChange={handleChange}
                        className={`${styles.textareaField} ${!formState.ingredients ? styles.error : ''}`}
                        required
                    />
                </label>
                <label className={styles.fieldLabel}>INSTRUCTIONS
                    <textarea
                        name="instructions"
                        value={formState.instructions}
                        onChange={handleChange}
                        className={`${styles.textareaField} ${!formState.instructions ? styles.error : ''}`}
                        required
                    />
                </label>
                <div className={styles.buttonContainer}>
                    {
                        recipeId &&
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={styles.deleteButton}>
                                Delete
                            </button>
                    }
                    <button
                        type="submit"
                        className={styles.saveButton}>
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default RecipeForm;

