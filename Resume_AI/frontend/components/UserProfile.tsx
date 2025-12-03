import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { User, Mail, Shield, Camera, Save, Loader2 } from 'lucide-react';
import { getMe, updateMe } from '../services/userApi';

interface UserProfileProps {
  user: UserProfile;
  onUpdate: (data: UserProfile) => void;
}

/**
 * 账户设置页面：与后端用户资料接口互联
 */
const UserProfilePage: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setFormData(prev => ({ ...prev, ...me }));
        onUpdate(me);
      } catch (e: any) {
        // 忽略未登录或加载失败情况
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  /**
   * 提交用户资料更新（昵称与邮箱）
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const updated = await updateMe(formData);
      onUpdate(updated);
      setFormData(updated);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header / Avatar */}
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center text-slate-300">
               {formData.avatar ? (
                 <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={48} />
               )}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-800">{formData.name}</h2>
            <p className="text-slate-500">{formData.role}</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="block w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="block w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Role / Status</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield size={18} />
                  </div>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="block w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Student">Student</option>
                    <option value="Graduate">Recent Graduate</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-medium h-5">
                <span className="text-green-600">{successMsg}</span>
                {errorMsg && <span className="text-red-600">{errorMsg}</span>}
              </p>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center shadow-lg shadow-indigo-200 transition-all"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    <Save size={18} className="mr-2" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;