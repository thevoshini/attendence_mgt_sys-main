import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClassesByTeacherId } from '../../lib/api';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

interface TeacherClass {
    class_id: string;
    teacher_id: string;
    is_coordinator: boolean;
    class: {
        id: string;
        name: string;
        year: number;
        section: string;
    };
}

export default function TeacherDetails() {
    const { teacherId } = useParams<{ teacherId: string }>();
    const [classes, setClasses] = useState<TeacherClass[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTeacherClasses() {
            if (!teacherId) return;

            try {
                const data = await getClassesByTeacherId(teacherId);
                setClasses(data);
            } catch (error) {
                console.error('Error fetching teacher classes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchTeacherClasses();
    }, [teacherId]);

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <Link to="/hod/teachers" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>
                        ← Back to Teachers
                    </Link>
                    <h1 style={{ marginTop: 'var(--spacing-sm)' }}>Classes Assigned</h1>
                    <p className="text-muted">
                        {classes.length} {classes.length === 1 ? 'Class' : 'Classes'}
                    </p>
                </div>
            </div>

            {classes.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📚</div>
                        <h3>No Classes Assigned</h3>
                        <p className="text-muted">
                            This teacher is not assigned to any classes yet.
                        </p>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {classes.map((item) => (
                        <Link
                            key={item.class_id}
                            to={`/hod/classes/${item.class_id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Card style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                                        border: '2px solid rgba(34, 197, 94, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        📚
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 4px 0' }}>
                                            {item.class.name || `Year ${item.class.year} - ${item.class.section}`}
                                        </h3>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                                            <Badge variant="info">Year {item.class.year}</Badge>
                                            <Badge variant="success">Section {item.class.section}</Badge>
                                            {item.is_coordinator && <Badge variant="warning">Coordinator</Badge>}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '1.5rem', color: 'var(--color-text-secondary)' }}>
                                        →
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
