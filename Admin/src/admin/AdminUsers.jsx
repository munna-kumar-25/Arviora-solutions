import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, LogOut, Mail, RefreshCw, Save, Shield, User, Users, X } from 'react-feather';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { authAPI } from '../services/api';

const formatDate = (value, emptyLabel = '—') => {
    if (!value) return emptyLabel;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const getAdminId = (admin) => admin._id || admin.id;

export const AdminUsers = () => {
    const { isDark } = useContext(ThemeContext);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError('');

        authAPI.getAdmins()
            .then(({ data }) => {
                if (active) setAdmins(data.admins || []);
            })
            .catch((requestError) => {
                if (active) {
                    setError(requestError.response?.data?.message || 'Unable to load admin accounts.');
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [reloadKey]);

    const card = `rounded-2xl border shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`;
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';
    const heading = isDark ? 'text-white' : 'text-slate-900';

    return (
        <section className="mx-auto max-w-7xl space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>Workspace access</p>
                    <h2 className={`mt-1 text-3xl font-bold tracking-tight ${heading}`}>Admin Users</h2>
                    <p className={`mt-2 ${muted}`}>Accounts that can sign in to the Admin Panel.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setReloadKey((key) => key + 1)}
                    disabled={loading}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
                </button>
            </header>

            {loading ? (
                <div className={`${card} px-6 py-16 text-center ${muted}`}>Loading admin accounts…</div>
            ) : error ? (
                <div role="alert" className={`${card} px-6 py-10 text-center`}>
                    <p className="font-medium text-rose-500">{error}</p>
                    <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="mt-4 font-semibold text-indigo-500 hover:text-indigo-400">
                        Try again
                    </button>
                </div>
            ) : admins.length ? (
                <>
                    <div className="flex items-center gap-2">
                        <Users size={17} className={muted} />
                        <p className={`text-sm ${muted}`}>{admins.length} {admins.length === 1 ? 'account' : 'accounts'}</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {admins.map((admin) => {
                            const id = getAdminId(admin);
                            return (
                                <Link
                                    key={id}
                                    to={`/admin/users/${id}`}
                                    aria-label={`Open ${admin.name || admin.email} profile`}
                                    className={`${card} group p-5 transition hover:-translate-y-0.5 hover:border-indigo-400/70 hover:shadow-lg`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-lg font-bold text-indigo-500">
                                            {(admin.name || admin.email || 'A').slice(0, 1).toUpperCase()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <h3 className={`truncate font-semibold ${heading}`}>{admin.name || 'Admin account'}</h3>
                                            <p className={`mt-1 truncate text-sm ${muted}`}>{admin.email}</p>
                                            <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${admin.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {admin.isActive ? 'Active' : 'Inactive'} · {admin.role || 'admin'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`mt-5 border-t pt-4 text-xs ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <p className={muted}>Last login</p>
                                        <p className={`mt-1 font-medium ${heading}`}>{formatDate(admin.lastLoginAt, 'Never logged in')}</p>
                                    </div>
                                    <p className="mt-4 text-sm font-semibold text-indigo-500 group-hover:text-indigo-400">Open full profile →</p>
                                </Link>
                            );
                        })}
                    </div>
                </>
            ) : (
                <div className={`${card} px-6 py-16 text-center`}>
                    <Users size={32} className={`mx-auto ${muted}`} />
                    <p className={`mt-4 font-semibold ${heading}`}>No admin accounts found</p>
                    <p className={`mt-1 text-sm ${muted}`}>Admin accounts will appear here after they are registered.</p>
                </div>
            )}
        </section>
    );
};

export const AdminUserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { adminUser: currentAdmin, logout, updateUserProfile } = useContext(AuthContext);
    const { isDark } = useContext(ThemeContext);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let active = true;
        setAdmin(null);
        setLoading(true);
        setError('');

        authAPI.getAdminById(id)
            .then(({ data }) => {
                if (active) {
                    setAdmin(data.admin);
                    setProfileName(data.admin.name || '');
                }
            })
            .catch((requestError) => {
                if (active) {
                    setError(requestError.response?.data?.message || 'Unable to load this admin profile.');
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [id]);

    const panel = `rounded-2xl border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'}`;
    const heading = isDark ? 'text-white' : 'text-slate-900';
    const muted = isDark ? 'text-slate-400' : 'text-slate-500';
    const isCurrentAdmin = currentAdmin?.id === id || currentAdmin?._id === id;
    const displayName = admin?.name || (isCurrentAdmin ? currentAdmin?.name : '') || 'Admin account';

    const saveProfile = async (event) => {
        event.preventDefault();
        setSaving(true);
        setSaveError('');
        try {
            const updatedUser = await updateUserProfile({ name: profileName.trim() });
            setAdmin((previousAdmin) => ({ ...previousAdmin, ...updatedUser }));
            setIsEditing(false);
        } catch (requestError) {
            console.error('Could not save admin profile:', requestError);
            setSaveError(requestError.response?.data?.message || 'Unable to save profile changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <section className="mx-auto max-w-5xl space-y-6">
            <Link to="/admin/users" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 hover:text-indigo-400">
                <ArrowLeft size={16} /> All admin users
            </Link>

            {loading ? (
                <div className={`${panel} py-16 text-center ${muted}`}>Loading admin profile…</div>
            ) : error ? (
                <div role="alert" className={`${panel} text-center text-rose-500`}>{error}</div>
            ) : admin ? (
                <>
                    <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-800 p-7 text-white shadow-xl md:p-10">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            {isCurrentAdmin && currentAdmin?.profilePicture ? (
                                <img src={currentAdmin.profilePicture} alt="" className="h-20 w-20 rounded-3xl object-cover ring-4 ring-white/15" />
                            ) : (
                                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold">
                                    {(displayName || admin.email || 'A').slice(0, 1).toUpperCase()}
                                </span>
                            )}
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-indigo-200">Admin account profile</p>
                                <h2 className="mt-1 break-words text-3xl font-bold">{displayName}</h2>
                                <p className="mt-2 break-all text-indigo-100">{admin.email}</p>
                                <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize">
                                    {admin.role || 'admin'}{isCurrentAdmin ? ' · You' : ''}
                                </span>
                            </div>
                        </div>
                    </header>

                    {isCurrentAdmin && (
                        <div className="flex flex-wrap gap-3">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileName(admin.name || '');
                                        setSaveError('');
                                        setIsEditing(true);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                                >
                                    <User size={16} /> Edit profile
                                </button>
                            ) : null}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/20"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}

                    {isCurrentAdmin && isEditing && (
                        <form onSubmit={saveProfile} className={panel}>
                            <h3 className={`text-lg font-semibold ${heading}`}>Edit your profile</h3>
                            <label htmlFor="admin-profile-name" className={`mt-4 block text-sm font-medium ${muted}`}>Display name</label>
                            <input
                                id="admin-profile-name"
                                type="text"
                                value={profileName}
                                onChange={(event) => setProfileName(event.target.value)}
                                maxLength={100}
                                className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-indigo-500 ${isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900'}`}
                                placeholder="Enter your display name"
                            />
                            {saveError && <p role="alert" className="mt-3 text-sm text-rose-500">{saveError}</p>}
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                                >
                                    <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setSaveError('');
                                    }}
                                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <article className={panel}>
                            <div className="flex items-center gap-3">
                                <Mail className="text-indigo-500" size={19} />
                                <div>
                                    <p className={`text-xs font-medium uppercase tracking-wide ${muted}`}>Email address</p>
                                    <p className={`mt-1 break-all font-semibold ${heading}`}>{admin.email}</p>
                                </div>
                            </div>
                        </article>
                        <article className={panel}>
                            <div className="flex items-center gap-3">
                                <Shield className="text-indigo-500" size={19} />
                                <div>
                                    <p className={`text-xs font-medium uppercase tracking-wide ${muted}`}>Account access</p>
                                    <p className={`mt-1 font-semibold capitalize ${heading}`}>{admin.role || 'admin'} · {admin.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                            </div>
                        </article>
                        <article className={panel}>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-indigo-500" size={19} />
                                <div>
                                    <p className={`text-xs font-medium uppercase tracking-wide ${muted}`}>Account created</p>
                                    <p className={`mt-1 font-semibold ${heading}`}>{formatDate(admin.createdAt)}</p>
                                </div>
                            </div>
                        </article>
                        <article className={panel}>
                            <div className="flex items-center gap-3">
                                <Clock className="text-indigo-500" size={19} />
                                <div>
                                    <p className={`text-xs font-medium uppercase tracking-wide ${muted}`}>Last successful login</p>
                                    <p className={`mt-1 font-semibold ${heading}`}>{formatDate(admin.lastLoginAt, 'Never logged in')}</p>
                                </div>
                            </div>
                        </article>
                    </div>

                    {isCurrentAdmin && (
                        <p className={`flex items-center gap-2 text-sm ${muted}`}>
                            <User size={16} /> This is the profile currently signed in to the Admin Panel.
                        </p>
                    )}
                </>
            ) : null}
        </section>
    );
};
