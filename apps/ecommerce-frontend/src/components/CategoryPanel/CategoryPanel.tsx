import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useScene } from '../../context';
import './CategoryPanel.css';

/**
 * CategoryPanel - Industrial Edition
 * 
 * - Left aligned typography
 * - Technical details (Index 01 / 05)
 * - Minimalist buttons (Tools, not toys)
 */
const CategoryPanel: React.FC = () => {
    const {
        activeCategory,
        activeCategoryIndex,
        categories,
        nextCategory,
        prevCategory,
        selectCategory,
        sceneState,
    } = useScene();

    const panelRef = useRef<HTMLDivElement>(null);

    // GSAP entrance
    useEffect(() => {
        if (!panelRef.current) return;
        gsap.fromTo(panelRef.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 1, delay: 0.8, ease: 'power3.out' }
        );
    }, []);

    return (
        <motion.div
            ref={panelRef}
            className="category-panel"
            // Panel stays visible even when selected, maybe just dimmed?
            // User request: "Increase negative space".
            animate={{
                opacity: sceneState === 'SELECTED' ? 0.2 : 1,
                x: sceneState === 'SELECTED' ? '-10%' : 0,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <div className="category-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory.id}
                        className="category-text-container"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Technical Index */}
                        <div className="mono-index">
                            <span className="current">{String(activeCategoryIndex + 1).padStart(2, '0')}</span>
                            <span className="divider">/</span>
                            <span className="total">{String(categories.length).padStart(2, '0')}</span>
                        </div>

                        {/* Huge Industrial Title */}
                        <h1 className="industrial-title" style={{ color: activeCategory.colors.text }}>
                            {activeCategory.name}
                        </h1>

                        {/* Description */}
                        <p className="industrial-desc">
                            {activeCategory.description}
                        </p>

                        {/* Specs / Details in Mono */}
                        <div className="specs-row mono">
                            <span>RHYTHM: {activeCategory.motion.rhythm}</span>
                            <span>// INERTIA: {activeCategory.motion.inertia}</span>
                        </div>

                        {/* Tool-like CTA */}
                        <button
                            className="industrial-cta"
                            onClick={selectCategory}
                            style={{
                                borderColor: activeCategory.colors.primary,
                                color: activeCategory.colors.primary
                            }}
                        >
                            {activeCategory.cta}
                            <span className="cta-icon">→</span>
                        </button>

                    </motion.div>
                </AnimatePresence>

                {/* Minimal Navigation Controls */}
                <div className="nav-controls">
                    <button onClick={prevCategory} className="nav-btn">PREV</button>
                    <div className="nav-line" />
                    <button onClick={nextCategory} className="nav-btn">NEXT</button>
                </div>

            </div>
        </motion.div>
    );
};

export default CategoryPanel;
