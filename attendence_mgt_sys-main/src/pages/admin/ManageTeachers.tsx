import { useState, useEffect } from 'react';
import { getDepartments, getAllTeachers, createTeacher, updateTeacher, deleteTeacher } from '../../lib/api';
import type { Teacher, Department } from '../../types/database';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

export default function ManageTeachers() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        phone_no: '',
        department_id: '',
        is_coordinator: false,
        clerk_user_id: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [teacherData, deptData] = await Promise.all([
                getAllTeachers(),
                getDepartments(),
            ]);
            setTeachers(teacherData);
            setDepartments(deptData);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Failed to load data. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    }

    const handleAddClick = () => {
        setFormData({
            name: '',
            email: '',
            dob: '',
            phone_no: '',
            department_id: departments[0]?.id || '',
            is_coordinator: false,
            clerk_user_id: '',
        });
        setEditingTeacher(null);
        setShowAddModal(true);
    };

    const handleEditClick = (teacher: Teacher) => {
        setFormData({
            name: teacher.name || '',
            email: teacher.email,
            dob: teacher.dob,
            phone_no: teacher.phone_no || '',
            department_id: teacher.department_id,
            is_coordinator: teacher.is_coordinator,
            clerk_user_id: teacher.clerk_user_id,
        });
        setEditingTeacher(teacher);
        setShowAddModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.dob || !formData.department_id) {
            alert('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            if (editingTeacher) {
                // Update existing teacher
                await updateTeacher(editingTeacher.id, formData);
                alert('Teacher updated successfully!');
            } else {
                // Create new teacher
                await createTeacher(formData);
                alert('Teacher created successfully!');
            }

            await fetchData();
            setShowAddModal(false);
        } catch (error: any) {
            console.error('Error saving teacher:', error);
            alert(error.message || 'Failed to save teacher. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (teacher: Teacher) => {
        if (!confirm(`Are you sure you want to deactivate ${teacher.name || teacher.email}?`)) {
            return;
        }

        try {
            await deleteTeacher(teacher.id);
            alert('Teacher deactivated successfully!');
            await fetchData();
        } catch (error) {
            console.error('Error deleting teacher:', error);
            alert('Failed to deactivate teacher. Please try again.');
        }
    };

    const getDepartmentName = (deptId: string) => {
        return departments.find(d => d.id === deptId)?.name || 'Unknown';
    };

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
                    <h1>Manage Teachers</h1>
                    <p className="text-muted">Create, edit, and manage teacher accounts</p>
                </div>
                <Button onClick={handleAddClick}>
                    ➕ Add Teacher
                </Button>
            </div>

            {teachers.length === 0 ? (
                <Card>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>👨‍🏫</div>
                        <h3>No Teachers Yet</h3>
                        <p className="text-muted" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            Get started by adding your first teacher.
                        </p>
                        <Button onClick={handleAddClick}>Add First Teacher</Button>
                    </div>
                </Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {teachers.map((teacher) => (
                        <Card key={teacher.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                                        <h3 style={{ margin: 0 }}>{teacher.name || 'Unnamed Teacher'}</h3>
                                        {teacher.is_coordinator && (
                                            <Badge variant="primary">Coordinator</Badge>
                                        )}
                                        {!teacher.profile_completed && (
                                            <Badge variant="warning">Incomplete Profile</Badge>
                                        )}
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 'var(--spacing-md)',
                                        marginTop: 'var(--spacing-md)'
                                    }}>
                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 4px 0' }}>
                                                Email
                                            </p>
                                            <p style={{ margin: 0 }}>{teacher.email}</p>
                                        </div>

                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 4px 0' }}>
                                                Phone
                                            </p>
                                            <p style={{ margin: 0 }}>{teacher.phone_no || 'Not provided'}</p>
                                        </div>

                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 4px 0' }}>
                                                Department
                                            </p>
                                            <p style={{ margin: 0 }}>{getDepartmentName(teacher.department_id)}</p>
                                        </div>

                                        <div>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', margin: '0 0 4px 0' }}>
                                                Date of Birth
                                            </p>
                                            <p style={{ margin: 0 }}>{new Date(teacher.dob).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginLeft: 'var(--spacing-lg)' }}>
                                    <Button variant="secondary" onClick={() => handleEditClick(teacher)}>
                                        ✏️ Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDelete(teacher)}>
                                        🗑️ Deactivate
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Teacher Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
            >
                <form onSubmit={handleSubmit} style={{ padding: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>

                        <Input
                            label="Full Name *"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Dr. John Doe"
                            required
                        />

                        <Input
                            label="Email Address *"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john.doe@college.edu"
                            required
                            disabled={!!editingTeacher}
                        />

                        <Input
                            label="Date of Birth *"
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            required
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone_no}
                            onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                            placeholder="+919876543210"
                        />

                        <div>
                            <label className="label">Department *</label>
                            <select
                                className="input"
                                value={formData.department_id}
                                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                required
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name} ({dept.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!editingTeacher && (
                            <Input
                                label="Clerk User ID *"
                                type="text"
                                value={formData.clerk_user_id}
                                onChange={(e) => setFormData({ ...formData, clerk_user_id: e.target.value })}
                                placeholder="user_2abc123xyz456"
                                helperText="Get this from Clerk dashboard after creating the teacher's account"
                                required
                            />
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <input
                                type="checkbox"
                                id="is_coordinator"
                                checked={formData.is_coordinator}
                                onChange={(e) => setFormData({ ...formData, is_coordinator: e.target.checked })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_coordinator" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                This teacher is a class coordinator
                            </label>
                        </div>

                        <div style={{
                            marginTop: 'var(--spacing-lg)',
                            display: 'flex',
                            gap: 'var(--spacing-sm)',
                            paddingTop: 'var(--spacing-md)',
                            borderTop: '1px solid var(--color-border)'
                        }}>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowAddModal(false)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                style={{ flex: 1 }}
                            >
                                {saving ? 'Saving...' : (editingTeacher ? 'Update Teacher' : 'Add Teacher')}
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
