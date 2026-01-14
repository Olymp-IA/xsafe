import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScene } from '../../context';
import WheelIcon from './WheelIcon';
import './Wheel.css';

/**
 * Wheel Component - Core interactive element
 * 
 * Refined Motion:
 * - Positioned STRICTLY on the left.
 * - Static when idle.
 * - Rotates only on interaction (hover/change).
 * - Physical easing for all motions.
 */
const Wheel: React.FC = () => {
    const {
        wheelRotation,
        activeCategory,
        // categories, // Unused now
        setIsHovering
    } = useScene();

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="wheel-container"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <motion.div
                className="wheel-inner"
                animate={{ rotate: wheelRotation }}
                transition={{
                    type: "spring",
                    stiffness: 40, // Physical feel
                    damping: 15,   // Stops naturally without endless oscillation
                    mass: 1.2
                }}
            >
                <WheelIcon primaryColor={activeCategory.colors.primary} />
            </motion.div>
        </div>
    );
};

export default Wheel;
