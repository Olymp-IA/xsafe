import React from 'react';
import { useScene } from '../../context';
import { MorphingText } from '../ui/MorphingText';
import './CategoryList.css';

/**
 * CategoryList Component
 * 
 * Vertical list of categories positioned next to the wheel.
 * Active category is highlighted, others are faded.
 * Updates on wheel rotation/interaction.
 */
const CategoryList: React.FC = () => {
    const { categories, activeCategory, setActiveCategory } = useScene();

    const activeIndex = categories.findIndex(c => c.id === activeCategory.id);

    // Initial load fallback
    const safeIndex = activeIndex === -1 ? 0 : activeIndex;

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 0) {
            setActiveCategory((safeIndex + 1) % categories.length);
        } else {
            setActiveCategory((safeIndex - 1 + categories.length) % categories.length);
        }
    };

    const handleClick = () => {
        setActiveCategory((safeIndex + 1) % categories.length);
    };

    return (
        <div
            className="category-list-container"
            onWheel={handleWheel}
            onClick={handleClick}
            style={{ pointerEvents: 'auto', cursor: 'grab' }} // Enable events
        >
            <MorphingText
                texts={categories.map(c => c.name)}
                selectedIndex={safeIndex}
            />
        </div>
    );
};

export default CategoryList;
