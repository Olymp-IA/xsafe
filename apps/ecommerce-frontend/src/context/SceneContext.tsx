import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { SceneContextType, SceneState } from '../types';
import { categories } from '../data/categories';

/**
 * Scene Context - Central state controller for all motion and UI
 * 
 * Philosophy:
 * - Motion is state-driven, not timeline-driven
 * - All animations respond to state changes
 * - Scroll and hover provide analog input to motion system
 */

// Default context value
const defaultContext: SceneContextType = {
    sceneState: 'EXPLORATION',
    activeCategory: categories[0],
    activeCategoryIndex: 0,
    categories,
    wheelPosition: 'left',
    wheelRotation: 0,
    wheelVelocity: 0.3,
    scrollVelocity: 0,
    isTransitioning: false,
    isHovering: false,
    setSceneState: () => { },
    setActiveCategory: () => { },
    nextCategory: () => { },
    prevCategory: () => { },
    selectCategory: () => { },
    resetToExploration: () => { },
    setScrollVelocity: () => { },
    setIsHovering: () => { },
};

const SceneContext = createContext<SceneContextType>(defaultContext);

export const useScene = () => {
    const context = useContext(SceneContext);
    if (!context) {
        throw new Error('useScene must be used within a SceneProvider');
    }
    return context;
};

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sceneState, setSceneState] = useState<SceneState>('EXPLORATION');
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [wheelVelocity, setWheelVelocity] = useState(0.3);
    const [scrollVelocity, setScrollVelocity] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const wheelPosition = sceneState === 'SELECTED' ? 'right' :
        sceneState === 'TRANSITION' ? 'center' : 'left';

    const activeCategory = categories[activeCategoryIndex];

    // ============================================
    // ANIMATION LOGIC - Intent-based rotation
    // ============================================

    // 1. Hover Effect - Micro-rotation
    useEffect(() => {
        if (sceneState === 'SELECTED') return;

        if (isHovering) {
            // Rotate slightly when hovering (3-6 degrees)
            setWheelRotation(prev => prev + 5);
        } else {
            // Optional: Return to nearest "slot" or just stop
            // For now, we just stop adding rotation
        }
    }, [isHovering, sceneState]);

    // 2. Category Change - Major Rotation
    // REMOVED: Generic +60 degrees. Now handled in next/prevCategory for directionality.

    // 3. Selection Transition - Controlled mechanical turn
    useEffect(() => {
        if (sceneState === 'TRANSITION') {
            setWheelRotation(prev => prev + 120);
        }
    }, [sceneState]);

    // ============================================
    // CATEGORY NAVIGATION
    // ============================================
    const setActiveCategory = useCallback((index: number) => {
        if (index >= 0 && index < categories.length && !isTransitioning) {
            // Speed boost on category change
            setWheelVelocity(prev => prev * 1.15);
            setActiveCategoryIndex(index);
            setSceneState('EXPLORATION_VARIANT');
        }
    }, [isTransitioning]);

    const nextCategory = useCallback(() => {
        if (!isTransitioning) {
            const nextIndex = (activeCategoryIndex + 1) % categories.length;
            setWheelRotation(prev => prev + 60); // Clockwise
            setActiveCategory(nextIndex);
        }
    }, [activeCategoryIndex, isTransitioning, setActiveCategory]);

    const prevCategory = useCallback(() => {
        if (!isTransitioning) {
            const prevIndex = activeCategoryIndex === 0 ? categories.length - 1 : activeCategoryIndex - 1;
            setWheelRotation(prev => prev - 60); // Counter-Clockwise
            setActiveCategory(prevIndex);
        }
    }, [activeCategoryIndex, isTransitioning, setActiveCategory]);

    // ============================================
    // CATEGORY SELECTION - Major transition with anticipation/overshoot
    // ============================================
    const selectCategory = useCallback(() => {
        if (!isTransitioning && sceneState !== 'SELECTED') {
            setIsTransitioning(true);

            // 1. ANTICIPATION - Move slightly backward
            setWheelRotation(prev => prev - 3);  // Small backwards motion

            setTimeout(() => {
                // 2. TRANSITION - Full motion across screen
                setSceneState('TRANSITION');

                setTimeout(() => {
                    // 3. OVERSHOOT & SETTLE
                    setSceneState('SELECTED');
                    setIsTransitioning(false);
                }, 1400); // Match GSAP transition duration

            }, 150); // Anticipation duration
        }
    }, [isTransitioning, sceneState]);

    const resetToExploration = useCallback(() => {
        setIsTransitioning(true);

        // Anticipation
        setTimeout(() => {
            setSceneState('TRANSITION');

            setTimeout(() => {
                setSceneState('EXPLORATION');
                setIsTransitioning(false);
            }, 1400);
        }, 150);
    }, []);

    // ============================================
    // SCROLL HANDLER - Gamification
    // ============================================
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (sceneState === 'EXPLORATION' || sceneState === 'EXPLORATION_VARIANT') {
                // Map scroll to velocity (capped)
                const scrollDelta = Math.abs(e.deltaY) / 100;
                const newVelocity = Math.min(scrollDelta * 0.5, 2);
                setScrollVelocity(prev => Math.min(prev + newVelocity, 3));

                // Scroll direction can change categories (optional navigation)
                if (Math.abs(e.deltaY) > 50) {
                    e.deltaY > 0 ? nextCategory() : prevCategory();
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [sceneState, nextCategory, prevCategory]);

    const value: SceneContextType = {
        sceneState,
        activeCategory,
        activeCategoryIndex,
        categories,
        wheelPosition,
        wheelRotation,
        wheelVelocity,
        scrollVelocity,
        isTransitioning,
        isHovering,
        setSceneState,
        setActiveCategory,
        nextCategory,
        prevCategory,
        selectCategory,
        resetToExploration,
        setScrollVelocity,
        setIsHovering,
    };

    return (
        <SceneContext.Provider value={value}>
            {children}
        </SceneContext.Provider>
    );
};

export default SceneContext;
