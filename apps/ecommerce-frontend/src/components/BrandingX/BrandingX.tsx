
import React from 'react';
import { motion } from 'framer-motion';
import { useScene } from '../../context';
import XSafeLogoVertical from '../ui/XSafeLogoVertical';
import './BrandingX.css';

/**
 * BrandingX Component - Animated X graphic
 * 
 * Uses the new Vertical Logo (X above SAFE).
 * X changes color based on active category.
 */
const BrandingX: React.FC = () => {
    const { activeCategory } = useScene();

    return (
        <motion.div
            className="branding-x-container"
            animate={{
                opacity: 1,
            }}
            transition={{
                duration: 1,
            }}
        >
            <XSafeLogoVertical
                className="branding-x-svg"
                primaryColor={activeCategory.colors.primary}
            />
        </motion.div>
    );
};

export default BrandingX;
