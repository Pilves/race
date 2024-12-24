import React, {useCallback, useEffect} from 'react';
import { Link } from 'react-router-dom';

/**
 * LandingPage Component
 * Displays a landing page with links to different interfaces of the application.
 */
const LandingPage = () => {
    const interfaces = {
        protected: [
            {
                path: '/front-desk',
                title: 'Front Desk Interface',
                description: 'Manage race sessions and driver registrations',
                keyType: 'RECEPTIONIST'
            },
            {
                path: '/race-control',
                title: 'Race Control Interface',
                description: 'Control race modes and monitor race progress',
                keyType: 'SAFETY'
            },
            {
                path: '/lap-line-tracker',
                title: 'Lap-line Tracker Interface',
                description: 'Record lap times for each car during races',
                keyType: 'OBSERVER'
            }
        ],
        public: [
            {
                path: '/leader-board',
                title: 'Leaderboard Display',
                description: 'View real-time race standings and lap times'
            },
            {
                path: '/next-race',
                title: 'Next Race Display',
                description: 'See upcoming race session details and driver assignments'
            },
            {
                path: '/countdown',
                title: 'Race Countdown Display',
                description: 'Monitor race time remaining'
            },
            {
                path: '/flag',
                title: 'Race Flag Display',
                description: 'View current race mode and safety status'
            }
        ]
    };

    /**
     * Tracks mouse movement over an element and updates its CSS properties.
     * @param {MouseEvent} e - The mouse event object.
     * @param {HTMLElement} element - The HTML element being tracked.
     */
    const handleMouseMove = useCallback((e, element) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        element.style.setProperty("--mouse-x", `${x}px`);
        element.style.setProperty("--mouse-y", `${y}px`);
    }, []);

    /**
     * Tracks mouse movement over a link and updates its CSS properties.
     * Stops event propagation to prevent affecting parent elements.
     * @param {MouseEvent} e - The mouse event object.
     * @param {HTMLElement} element - The link being tracked.
     */
    const handleLinkMouse = useCallback((e, element) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        e.stopPropagation();

        element.style.setProperty("--mouse-x", `${x}px`);
        element.style.setProperty("--mouse-y", `${y}px`);
    }, []);

    /**
     * Adds mouse tracking event listeners to all links when the component mounts.
     * Cleans up the event listeners when the component unmounts.
     */
    useEffect(() => {
        const links = document.querySelectorAll('.interface-link');
        links.forEach(link => {
            const handler = (e) => handleLinkMouse(e, link);
            link.addEventListener("mousemove", handler);
            return () => link.removeEventListener("mousemove", handler);
        });

        return () => {
            links.forEach(link => {
                link.removeEventListener("mousemove", handleLinkMouse);
            });
        };
    }, [handleMouseMove, handleLinkMouse]);

    /**
     * Renders a section of the interface with a list of links.
     * @param {string} title - The title of the section.
     * @param {string} description - The description of the section.
     * @param {Array} items - The list of items to display in the section.
     * @param {string} badgeType - The type of badge to display for each item.
     * @returns {JSX.Element} The rendered section.
     */
    const renderInterfaceSection = (title, description, items, badgeType) => (
        <section className="interface-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
                <p className="section-description">{description}</p>
            </div>
            <ul className="interface-list">
                {items.map((item, index) => (
                    <li
                        key={item.path}
                        className="interface-item"
                        style={{ '--i': index }}
                    >
                        <Link
                            to={item.path}
                            className="interface-link"
                        >
                            <div className="link-content">
                                <div className="link-title">
                                    {item.title}
                                    <span className={`${badgeType}-badge`}>
                                        {badgeType}
                                    </span>
                                </div>
                                <div className="link-description">
                                    {item.description}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );

    return (
        <div className="landing-container">
            <div className="landing-content">
                <header className="landing-header">
                    <h1 className="landing-title">Info-screens</h1>
                </header>

                <div className="interfaces-grid">
                    {renderInterfaceSection(
                        "",
                        "",
                        interfaces.protected,
                        "protected"
                    )}
                    {renderInterfaceSection(
                        "",
                        "",
                        interfaces.public,
                        "public"
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
