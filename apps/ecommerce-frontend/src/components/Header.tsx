import { Link } from 'react-router-dom';
import { useScene } from '../context';
import './Header.css';

import XSafeLogo from './ui/XSafeLogo';

const Header: React.FC = () => {
    const { activeCategory } = useScene();
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <XSafeLogo
                        className="header-logo"
                        style={{ height: '24px', color: '#E0E0E0' }}
                        primaryColor={activeCategory.colors.primary}
                    />
                </Link>
            </div>

            <nav className="nav-links mono">
                <Link to="/equipment">EQUIPMENT</Link>
                <Link to="/garage">GARAGE</Link>
                <Link to="/contact">CONTACT</Link>
            </nav>
        </header>
    );
};

export default Header;
