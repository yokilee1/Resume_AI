import React, { useState, useEffect } from 'react';
import { AppView, UserProfile } from '../types';
import { User, Mail, Shield, Camera, Save, Loader2, Lock } from 'lucide-react';
import { getMe, updateMe } from '../services/userApi';

interface UserProfileProps {
  user: UserProfile;
  onUpdate: (data: UserProfile) => void;
  onNavigate?: (view: AppView) => void;
}

/**
 * 账户设置页面：与后端用户资料接口互联
 */
const UserProfilePage: React.FC<UserProfileProps> = ({ user, onUpdate, onNavigate }) => {
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
      setSuccessMsg('个人资料更新成功！');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">账户设置</h1>

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
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-800">{formData.name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
              <span className="text-slate-500">{formData.role === 'Student' ? '学生' : formData.role === 'Graduate' ? '应届生' : formData.role === 'Professional' ? '职场人士' : '管理员'}</span>
              {formData.role === 'Admin' && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-indigo-200">员工</span>}
            </div>
          </div>

          {/* Admin Entry Point */}
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => onNavigate && onNavigate(AppView.ADMIN)}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200"
            >
              <Lock size={16} className="mr-2" /> 管理后台
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">全名</label>
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
                <label className="text-sm font-medium text-slate-700">电子邮箱</label>
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
                <label className="text-sm font-medium text-slate-700">角色 / 身份</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield size={18} />
                  </div>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="block w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="Student">学生</option>
                    <option value="Graduate">应届毕业生</option>
                    <option value="Professional">职场人士</option>
                    <option value="Admin">管理员</option>
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
                    <Save size={18} className="mr-2" /> 保存修改
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
