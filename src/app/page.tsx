'use client'
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Recipes from "./components/Recipes";
import styles from './page.module.css'
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const recipes = useAppSelector((state) => state.recipes.recipes);

  const [sortOrder, setSortOrder] = useState<'Select' | 'ASC' | 'DESC'>('Select');
  const [filterYes, setFilterYes] = useState(false);
  const [filterNo, setFilterNo] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let updatedRecipes = [...recipes];

    if (filterYes && !filterNo) {
      updatedRecipes = updatedRecipes.filter(recipe => recipe.isFavorite);
    } else if (filterNo && !filterYes) {
      updatedRecipes = updatedRecipes.filter(recipe => !recipe.isFavorite);
    }

    if (sortOrder !== 'Select') {
      updatedRecipes.sort((a, b) => {
        if (sortOrder === 'ASC') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });
    }

    if (searchQuery) {
      updatedRecipes = updatedRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRecipes(updatedRecipes);
  }, [recipes, sortOrder, filterYes, filterNo, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div>
      <Header onSearch={handleSearch} />
      <main className={styles.main}>
        <div className={styles.sortAndFilterContainer}>
          {recipes.length > 0 && (
            <>
              <div className={styles.sortContainer}>
                <label className={styles.label}>Sort by Title</label>
                <select
                  className={styles.select}
                  onChange={(e) => setSortOrder(e.target.value as 'ASC' | 'DESC')}
                  value={sortOrder}
                >
                  <option value="">Select</option>
                  <option value="ASC">ASC</option>
                  <option value="DESC">DESC</option>
                </select>
              </div>
              <div className={styles.filterContainer}>
                <label className={styles.label}>Filter</label>
                <div className={styles.filterOptions}>
                  <p className={styles.filterTitle}>Favorites?</p>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filterYes}
                      onChange={() => setFilterYes(!filterYes)}
                    />
                    Yes
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filterNo}
                      onChange={() => setFilterNo(!filterNo)}
                    />
                    No
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
        <Recipes recipes={filteredRecipes} />
      </main>
    </div>
  )
}
