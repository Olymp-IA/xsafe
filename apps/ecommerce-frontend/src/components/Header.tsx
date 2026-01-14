import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useScene } from '../context';
import './Header.css';

import XSafeLogo from './ui/XSafeLogo';

const Header: React.FC = () => {
    const { activeCategory } = useScene();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 50) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });

    return (
        <motion.header
            className="header"
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
        >
            <div className="logo-container">
                <XSafeLogo
                    className="header-logo"
                    style={{ height: '24px', color: '#E0E0E0' }}
                    primaryColor={activeCategory.colors.primary}
                />
            </div>

            <nav className="nav-links mono">
                <a href="#">EQUIPMENT</a>
                <a href="#">GARAGE</a>
                <a href="#">CONTACT</a>
            </nav>
        </motion.header>
    );
};

export default Header;
