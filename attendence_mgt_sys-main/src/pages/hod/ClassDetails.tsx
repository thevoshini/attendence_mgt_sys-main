import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentsByClassId } from '../../lib/api';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

interface Student {
    id: string;
    name: string;
    regno: string;
    email: string;
    phone_no?: string;
    is_dayscholar: boolean;
    year: number;
}

export default function ClassDetails() {
    const { classId } = useParams<{ classId: string }>();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudents() {
            if (!classId) return;

            try {
                const data = await getStudentsByClassId(classId);
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStudents();
    }, [classId]);

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
                    <Link to="/hod/classes" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }}>
                        ← Back to Classes
                    </Link>
                    <h1 style={{ marginTop: 'var(--spacing-sm)' }}>Class Students</h1>
                    <p className="text-muted">
                        {students.length} {students.length === 1 ? 'Student' : 'Students'}
                    </p>
                </div>
            </div>

            {students.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>👨‍🎓</div>
                        <h3>No Students</h3>
                        <p className="text-muted">
                            No students are enrolled in this class yet.
                        </p>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {students.map((student) => (
                        <Link
                            key={student.id}
                            to={`/hod/students/${student.id}`}
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
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.25rem',
                                        color: 'white',
                                        fontWeight: '600'
                                    }}>
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                            <h3 style={{ margin: '0' }}>{student.name}</h3>
                                            {student.is_dayscholar && (
                                                <Badge variant="info">Day Scholar</Badge>
                                            )}
                                        </div>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '4px 0 0 0' }}>
                                            {student.regno} • Year {student.year}
                                        </p>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '4px 0 0 0' }}>
                                            📧 {student.email}
                                        </p>
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
