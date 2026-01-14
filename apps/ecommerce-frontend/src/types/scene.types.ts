/**
 * Scene State Types for X-SAFE Ecommerce
 * Defines the global state system for controlling animations and UI
 */

// Scene state enum
export type SceneState =
    | 'EXPLORATION'
    | 'EXPLORATION_VARIANT'
    | 'TRANSITION'
    | 'SELECTED';

// Motion identity for each category
export interface MotionIdentity {
    rotationMultiplier: number;  // Speed multiplier (1.0 = base speed)
    inertia: number;             // How heavy the motion feels (higher = heavier)
    rhythm: 'heavy' | 'smooth' | 'solid' | 'nervous' | 'precise';
    anticipationScale: number;   // How much anticipation before transitions
}

// Category definition
export interface Category {
    id: string;
    name: string;
    description: string;
    cta: string;
    colors: CategoryColors;
    image?: string;
    motion: MotionIdentity;      // Category-specific motion parameters
}

// Color palette for each category
export interface CategoryColors {
    primary: string;      // Main accent color
    secondary: string;    // Secondary color
    background: string;   // Background color
    text: string;         // Text color
    brandingX: string;    // X graphic color
}

// Global scene context state
export interface SceneContextState {
    sceneState: SceneState;
    activeCategory: Category;
    activeCategoryIndex: number;
    categories: Category[];
    wheelPosition: 'left' | 'center' | 'right';
    wheelRotation: number;
    wheelVelocity: number;         // Current rotation velocity
    scrollVelocity: number;        // Scroll input velocity
    isTransitioning: boolean;
    isHovering: boolean;           // Mouse hovering on wheel area
}

// Scene context actions
export interface SceneContextActions {
    setSceneState: (state: SceneState) => void;
    setActiveCategory: (index: number) => void;
    nextCategory: () => void;
    prevCategory: () => void;
    selectCategory: () => void;
    resetToExploration: () => void;
    setScrollVelocity: (velocity: number) => void;
    setIsHovering: (hovering: boolean) => void;
}

export type SceneContextType = SceneContextState & SceneContextActions;
