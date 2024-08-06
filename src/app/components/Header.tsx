'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './Header.module.css';

interface HeaderProps {
    showSearch?: boolean;
    onSearch?: (query: string) => void;
}

const Header = ({ showSearch = true, onSearch }: HeaderProps) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch && onSearch(e.target.value);
    };

    return (
        <header className={styles.header}>
            {showSearch && (
                <div className={styles.search}>
                    <input
                        type="text"
                        placeholder="Search here..."
                        onChange={handleInputChange}
                    />
                    <FontAwesomeIcon icon={faSearch} className={styles.icon} />
                </div>
            )}
        </header>
    );
};

export default Header;
