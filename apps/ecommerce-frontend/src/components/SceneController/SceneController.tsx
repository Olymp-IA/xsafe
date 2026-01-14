import { useRef } from 'react';
import { useScene } from '../../context';
import Wheel from '../Wheel/Wheel';
import CategoryPanel from '../CategoryPanel/CategoryPanel';
import BrandingX from '../BrandingX/BrandingX';
import CategoryList from '../CategoryList/CategoryList';

import './SceneController.css';

/**
 * SceneController - Industrial Edition
 * 
 * - Removes BrandingX (Background graphics)
 * - Implements Noise Texture
 * - Controls minimal layout
 */
const SceneController: React.FC = () => {
    const { activeCategory } = useScene();
    const backgroundRef = useRef<HTMLDivElement>(null);

    return (
        <div className="scene-container">
            {/* Dynamic Background (Subtle) */}
            <div
                ref={backgroundRef}
                className="scene-background"
                style={{
                    backgroundColor: activeCategory.colors.background,
                }}
            />

            {/* Noise Texture Overlay */}
            <div className="noise-overlay" />

            {/* Global Vignette */}
            <div className="vignette-overlay" />

            {/* Components */}

            {/* Wheel on Left */}
            <Wheel />

            {/* Category List next to wheel */}
            <CategoryList />

            {/* Category Content (Left/Center) */}
            <CategoryPanel />

            {/* Branding X (Right) */}
            <BrandingX />

        </div>
    );
};

export default SceneController;
