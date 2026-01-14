
import React from 'react';
import { motion } from 'framer-motion';
import { useScene } from '../../context';
import './CategoryList.css';

/**
 * CategoryList Component
 * 
 * Vertical list of categories positioned next to the wheel.
 * Active category is highlighted, others are faded.
 * Updates on wheel rotation/interaction.
 */
const CategoryList: React.FC = () => {
    const {
        categories,
        activeCategory,
        setActiveCategory
    } = useScene();

    // Auto-scroll logic could go here if the list is long, 
    // but with ~5 items, static vertical layout is fine.

    return (
        <div className="category-list-container">
            <div className="category-list-track">
                {categories.map((category, index) => {
                    const isActive = activeCategory.id === category.id;

                    return (
                        <motion.div
                            key={category.id}
                            className={`category-list-item ${isActive ? 'active' : ''}`}
                            onClick={() => setActiveCategory(index)}
                            animate={{
                                opacity: isActive ? 1 : 0.3,
                                scale: isActive ? 1.1 : 1,
                                x: isActive ? 20 : 0,
                                filter: isActive ? 'blur(0px)' : 'blur(1px)',
                                color: isActive ? activeCategory.colors.primary : '#ffffff',
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30
                            }}
                        >
                            {category.name}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryList;
