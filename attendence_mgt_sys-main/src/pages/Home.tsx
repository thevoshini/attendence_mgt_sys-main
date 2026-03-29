import { SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="ifet-home">
            {/* Animated background blobs */}
            <div className="bg-blob blob-1" />
            <div className="bg-blob blob-2" />
            <div className="bg-blob blob-3" />

            {/* Navbar */}
            <header className="ifet-navbar">
                <div className="ifet-navbar-inner">
                    <div className="ifet-nav-brand">
                        <div className="ifet-nav-logo">
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                <rect width="36" height="36" rx="10" fill="url(#navGrad)" />
                                <path d="M18 8L10 16h4v12h8V16h4L18 8Z" fill="white" />
                                <defs>
                                    <linearGradient id="navGrad" x1="0" y1="0" x2="36" y2="36">
                                        <stop offset="0%" stopColor="#7C3AED" />
                                        <stop offset="100%" stopColor="#2563EB" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div>
                            <span className="ifet-nav-title">IFET College</span>
                            <span className="ifet-nav-subtitle">Attendance System</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="ifet-nav-links">
                        <a href="#" className="ifet-nav-link">About IFET</a>

                        {/* Academics Mega Menu */}
                        <div className="ifet-nav-dropdown-wrapper">
                            <button className="ifet-nav-link ifet-nav-link-btn">
                                Academics
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ifet-chevron">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>
                            <div className="ifet-mega-menu">
                                <div className="ifet-mega-inner">
                                    {/* Column 1 */}
                                    <div className="ifet-mega-col">
                                        <div className="ifet-mega-col-title">Under Graduation</div>
                                        <a href="#" className="ifet-mega-link">B.E. Computer Science &amp; Engineering</a>
                                        <a href="#" className="ifet-mega-link">B.E. Electrical &amp; Electronics Engineering</a>
                                        <a href="#" className="ifet-mega-link">B.E. Mechanical Engineering</a>
                                        <a href="#" className="ifet-mega-link">B.E. Civil Engineering</a>
                                        <a href="#" className="ifet-mega-link">B.E. Electronics &amp; Communication Engineering</a>
                                    </div>
                                    {/* Column 2 */}
                                    <div className="ifet-mega-col">
                                        <div className="ifet-mega-col-title">Under Graduation</div>
                                        <a href="#" className="ifet-mega-link">B.Tech. Information Technology</a>
                                        <a href="#" className="ifet-mega-link">B.Tech. Artificial Intelligence &amp; Data Science</a>
                                        <a href="#" className="ifet-mega-link">B.Tech. Artificial Intelligence &amp; Machine Learning</a>
                                        <a href="#" className="ifet-mega-link">B.E. CSE (Cyber Security)</a>
                                    </div>
                                    {/* Column 3 */}
                                    <div className="ifet-mega-col">
                                        <div className="ifet-mega-col-title">Post Graduation</div>
                                        <a href="#" className="ifet-mega-link">M.E. Computer Science &amp; Engineering</a>
                                        <a href="#" className="ifet-mega-link">M.E. Applied Electronics</a>
                                        <a href="#" className="ifet-mega-link">Master Of Business Administration</a>
                                        <a href="#" className="ifet-mega-link">Science &amp; Humanities</a>
                                    </div>
                                    {/* Column 4 */}
                                    <div className="ifet-mega-col">
                                        <div className="ifet-mega-col-title">Research Programmes (Ph.D)</div>
                                        <a href="#" className="ifet-mega-link">Computer Science &amp; Engineering</a>
                                        <a href="#" className="ifet-mega-link">Electronics &amp; Communication Engineering</a>
                                        <a href="#" className="ifet-mega-link">Mechanical Engineering</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a href="#" className="ifet-nav-link">Admissions</a>
                        <a href="#" className="ifet-nav-link">Campus Life</a>
                        <a href="#" className="ifet-nav-link">Placements</a>
                        <a href="#" className="ifet-nav-link">Research</a>
                    </nav>

                    <div className="ifet-nav-actions">
                        {/* Counselling Code badge */}
                        <div className="ifet-counselling-badge">
                            <span className="ifet-counselling-label">Counselling Code</span>
                            <span className="ifet-counselling-code">1408</span>
                        </div>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" forceRedirectUrl="/">
                                <button className="ifet-btn-nav">Sign In</button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </header>

            <main className="ifet-main">
                <SignedOut>
                    {/* Hero Section */}
                    <section className="ifet-hero animate-up">
                        <div className="ifet-hero-badge">
                            <span className="badge-dot" />
                            IFET College of Engineering
                        </div>
                        <h1 className="ifet-hero-title">
                            Smart Attendance<br />
                            <span className="gradient-text">Management System</span>
                        </h1>
                        <p className="ifet-hero-desc">
                            A unified platform for students, teachers, HODs and administrators to manage
                            leave applications, track attendance, and streamline academic workflows.
                        </p>
                        <div className="ifet-hero-actions">
                            <SignInButton mode="modal" fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" forceRedirectUrl="/">
                                <button className="ifet-btn-primary">
                                    <span>Get Started</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </SignInButton>
                            <a href="#features" className="ifet-btn-ghost">Learn More</a>
                        </div>

                        {/* Stats Row */}
                        <div className="ifet-stats">
                            <div className="ifet-stat-item">
                                <span className="stat-number">5000+</span>
                                <span className="stat-label">Students</span>
                            </div>
                            <div className="ifet-stat-divider" />
                            <div className="ifet-stat-item">
                                <span className="stat-number">200+</span>
                                <span className="stat-label">Faculty</span>
                            </div>
                            <div className="ifet-stat-divider" />
                            <div className="ifet-stat-item">
                                <span className="stat-number">20+</span>
                                <span className="stat-label">Departments</span>
                            </div>
                            <div className="ifet-stat-divider" />
                            <div className="ifet-stat-item">
                                <span className="stat-number">NAAC</span>
                                <span className="stat-label">Accredited</span>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="ifet-features" id="features">
                        <div className="ifet-section-label">What We Offer</div>
                        <h2 className="ifet-section-title">Designed for Every Role</h2>
                        <div className="ifet-features-grid">
                            <div className="ifet-feature-card animate-up" style={{ animationDelay: '0.1s' }}>
                                <div className="ifet-feature-icon student-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                    </svg>
                                </div>
                                <h3>Students</h3>
                                <p>Apply for leave online, track application status in real-time, and manage your academic profile with ease.</p>
                                <ul className="ifet-feature-list">
                                    <li>Submit leave requests</li>
                                    <li>Track approval status</li>
                                    <li>View attendance records</li>
                                </ul>
                            </div>

                            <div className="ifet-feature-card animate-up" style={{ animationDelay: '0.2s' }}>
                                <div className="ifet-feature-icon teacher-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <path d="M8 21h8M12 17v4" />
                                    </svg>
                                </div>
                                <h3>Teachers</h3>
                                <p>Review and process student leave applications, monitor class attendance, and coordinate efficiently.</p>
                                <ul className="ifet-feature-list">
                                    <li>Review leave applications</li>
                                    <li>Manage class attendance</li>
                                    <li>Generate reports</li>
                                </ul>
                            </div>

                            <div className="ifet-feature-card animate-up" style={{ animationDelay: '0.3s' }}>
                                <div className="ifet-feature-icon hod-icon">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3>HOD &amp; Admin</h3>
                                <p>Complete departmental oversight, final leave approvals, comprehensive reporting, and system-wide management.</p>
                                <ul className="ifet-feature-list">
                                    <li>Department oversight</li>
                                    <li>Final approvals</li>
                                    <li>Analytics dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="ifet-cta animate-up">
                        <div className="ifet-cta-glow" />
                        <h2>Ready to get started?</h2>
                        <p>Sign in with your college credentials to access your personalized dashboard.</p>
                        <SignInButton mode="modal" fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" forceRedirectUrl="/">
                            <button className="ifet-btn-primary ifet-btn-lg">
                                <span>Sign In to Dashboard</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </SignInButton>
                    </section>
                </SignedOut>

                <SignedIn>
                    {/* Role Selection for signed-in users */}
                    <section className="ifet-role-section animate-up">
                        <div className="ifet-hero-badge">
                            <span className="badge-dot" />
                            IFET College of Engineering
                        </div>
                        <div className="ifet-user-header">
                            <UserButton afterSignOutUrl="/" />
                            <div>
                                <h2>Welcome back!</h2>
                                <p className="ifet-user-subtitle">Choose your portal to continue</p>
                            </div>
                        </div>

                        <div className="ifet-role-grid">
                            <button className="ifet-role-card student-role" onClick={() => navigate('/student')}>
                                <div className="ifet-role-bg" />
                                <div className="ifet-role-icon">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                    </svg>
                                </div>
                                <h3>Student Portal</h3>
                                <p>Leave applications, attendance &amp; profile management</p>
                                <span className="ifet-role-arrow">→</span>
                            </button>

                            <button className="ifet-role-card teacher-role" onClick={() => navigate('/teacher')}>
                                <div className="ifet-role-bg" />
                                <div className="ifet-role-icon">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <path d="M8 21h8M12 17v4" />
                                    </svg>
                                </div>
                                <h3>Teacher Portal</h3>
                                <p>Review applications and manage class records</p>
                                <span className="ifet-role-arrow">→</span>
                            </button>

                            <button className="ifet-role-card hod-role" onClick={() => navigate('/hod')}>
                                <div className="ifet-role-bg" />
                                <div className="ifet-role-icon">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3>HOD Portal</h3>
                                <p>Department oversight, final approvals &amp; analytics</p>
                                <span className="ifet-role-arrow">→</span>
                            </button>

                            <button className="ifet-role-card admin-role" onClick={() => navigate('/admin')}>
                                <div className="ifet-role-bg" />
                                <div className="ifet-role-icon">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                                    </svg>
                                </div>
                                <h3>Admin Portal</h3>
                                <p>System-wide management and configuration</p>
                                <span className="ifet-role-arrow">→</span>
                            </button>
                        </div>
                    </section>
                </SignedIn>
            </main>

            {/* Footer */}
            <footer className="ifet-footer">
                <p>© 2024 IFET College of Engineering. Attendance Management System.</p>
            </footer>
        </div>
    );
}
