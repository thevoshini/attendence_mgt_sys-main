import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';
import { getTeachersByHODDepartment } from '../../lib/api';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Input from '../../components/ui/Input';

interface Teacher {
    id: string;
    name: string;
    email: string;
    phone_no?: string;
    department_id: string;
}

export default function Teachers() {
    const { department } = useUserRole();
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchTeachers() {
            if (!department) return;

            try {
                const data = await getTeachersByHODDepartment(department.id);
                setTeachers(data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchTeachers();
    }, [department]);

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <h1>Teachers</h1>
                    <p className="text-muted">
                        {department?.name} Department • {teachers.length} Total Teachers
                    </p>
                </div>
            </div>

            {teachers.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <Input
                        label=""
                        type="text"
                        placeholder="🔍 Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            )}

            {filteredTeachers.length === 0 && teachers.length > 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🔍</div>
                        <h3>No Teachers Found</h3>
                        <p className="text-muted">
                            No teachers match your search.
                        </p>
                    </div>
                </Card>
            ) : teachers.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>👨‍🏫</div>
                        <h3>No Teachers</h3>
                        <p className="text-muted">
                            No teachers found in this department.
                        </p>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {filteredTeachers.map((teacher) => (
                        <Link
                            key={teacher.id}
                            to={`/hod/teachers/${teacher.id}`}
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
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        color: 'white',
                                        fontWeight: '600'
                                    }}>
                                        {teacher.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 4px 0' }}>{teacher.name}</h3>
                                        <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                                            📧 {teacher.email}
                                        </p>
                                        {teacher.phone_no && (
                                            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: '4px 0 0 0' }}>
                                                📱 {teacher.phone_no}
                                            </p>
                                        )}
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
