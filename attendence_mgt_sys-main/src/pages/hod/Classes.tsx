import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import { getClassesByHODDepartment } from '../../lib/api';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

interface Class {
    id: string;
    name: string;
    year: number;
    section: string;
    department_id: string;
}

export default function Classes() {
    const { department } = useUserRole();
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClasses() {
            if (!department) return;

            try {
                const data = await getClassesByHODDepartment(department.id);
                setClasses(data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchClasses();
    }, [department]);

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
                    <h1>Classes</h1>
                    <p className="text-muted">
                        {department?.name} Department • {classes.length} Total Classes
                    </p>
                </div>
            </div>

            {classes.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>📚</div>
                        <h3>No Classes</h3>
                        <p className="text-muted">
                            No classes found in this department.
                        </p>
                    </div>
                </Card>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {classes.map((classItem) => (
                        <Link
                            key={classItem.id}
                            to={`/hod/classes/${classItem.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Card style={{
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        margin: '0 auto var(--spacing-md)',
                                        borderRadius: 'var(--radius-lg)',
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                                        border: '2px solid rgba(34, 197, 94, 0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2rem'
                                    }}>
                                        📚
                                    </div>
                                    <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>
                                        {classItem.name || `Year ${classItem.year} - ${classItem.section}`}
                                    </h3>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center', marginTop: 'var(--spacing-md)' }}>
                                        <Badge variant="info">Year {classItem.year}</Badge>
                                        <Badge variant="success">Section {classItem.section}</Badge>
                                    </div>
                                    <div style={{
                                        marginTop: 'var(--spacing-md)',
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--color-primary)',
                                        fontWeight: '600'
                                    }}>
                                        View Students →
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
