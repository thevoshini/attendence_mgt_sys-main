import { useState, useEffect } from 'react';
import { getStudentAcademicInfo } from '../../lib/api';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';

interface AcademicInfoProps {
    studentId: string;
}

export default function AcademicInfo({ studentId }: AcademicInfoProps) {
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInfo() {
            try {
                const data = await getStudentAcademicInfo(studentId);
                setInfo(data);
            } catch (error) {
                console.error('Error fetching academic info:', error);
            } finally {
                setLoading(false);
            }
        }

        if (studentId) {
            fetchInfo();
        }
    }, [studentId]);

    if (loading) {
        return (
            <Card>
                <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
                    <Spinner />
                </div>
            </Card>
        );
    }

    if (!info) return null;

    return (
        <div style={{ maxWidth: '600px' }}>
            <Card>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <h2 style={{ margin: '0 0 var(--spacing-xs) 0', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        🎓 Academic Information
                    </h2>
                    <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)', margin: 0 }}>
                        Your department, class, and faculty details
                    </p>
                </div>

                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                    {/* Department Info */}
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-bg-muted)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <h3 style={{ margin: '0 0 var(--spacing-md) 0', fontSize: 'var(--font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            🏛️ Department
                        </h3>
                        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="text-muted">Name:</span>
                                <strong>{info.department?.name || 'N/A'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="text-muted">Code:</span>
                                <Badge variant="info">{info.department?.code || 'N/A'}</Badge>
                            </div>
                            {info.department?.hod_email && (
                                <div style={{ marginTop: 'var(--spacing-sm)', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--color-border)' }}>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                                        Head of Department (HOD)
                                    </div>
                                    <a href={`mailto:${info.department.hod_email}`} style={{
                                        color: 'var(--color-primary)',
                                        textDecoration: 'none',
                                        fontSize: 'var(--font-size-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-xs)'
                                    }}>
                                        📧 {info.department.hod_email}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Class Info */}
                    <div style={{
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-bg-muted)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <h3 style={{ margin: '0 0 var(--spacing-md) 0', fontSize: 'var(--font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            📚 Class Details
                        </h3>
                        <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="text-muted">Class:</span>
                                <strong>{info.class?.name || 'N/A'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="text-muted">Year:</span>
                                <Badge variant="success">{info.year ? `${info.year} Year` : 'N/A'}</Badge>
                            </div>
                            {info.class?.section && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="text-muted">Section:</span>
                                    <Badge variant="warning">{info.class.section}</Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Coordinators */}
                    {info.coordinators && info.coordinators.length > 0 && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-muted)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--color-border)'
                        }}>
                            <h3 style={{ margin: '0 0 var(--spacing-md) 0', fontSize: 'var(--font-size-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                👨‍🏫 Class Coordinators
                            </h3>
                            {info.coordinators.map((coord: any, index: number) => (
                                <div key={index} style={{
                                    padding: 'var(--spacing-sm)',
                                    background: 'rgba(59, 130, 246, 0.05)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    marginBottom: index < info.coordinators.length - 1 ? 'var(--spacing-sm)' : 0
                                }}>
                                    <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                        {coord.teacher?.name || 'N/A'}
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                                        {coord.teacher?.email && (
                                            <a href={`mailto:${coord.teacher.email}`} style={{
                                                color: 'var(--color-primary)',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-xs)'
                                            }}>
                                                📧 {coord.teacher.email}
                                            </a>
                                        )}
                                        {coord.teacher?.phone_no && (
                                            <a href={`tel:${coord.teacher.phone_no}`} style={{
                                                color: 'var(--color-primary)',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-xs)'
                                            }}>
                                                📱 {coord.teacher.phone_no}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
