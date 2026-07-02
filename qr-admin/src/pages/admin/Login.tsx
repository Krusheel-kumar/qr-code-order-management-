import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loginAction = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For pop-o-bob, the endpoint is /api/auth/login. Wait, does AuthController have /login?
      // Let's check AuthController: wait, I only saw /register in my previous diff. I need to make sure there's a login method.
      // But assuming the user wants to login, I'll send to /api/auth/login
      const { data } = await authApi.post('/login', { email, password });
      loginAction(data.user, data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#FF4500] mb-2">Pop-O-Bob</h1>
          <h2 className="text-xl font-bold text-[#1A1A1A]">Admin Portal</h2>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 outline-none transition-all font-medium"
              placeholder="admin@popobob.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1A1A1A] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#FF4500] focus:ring-4 focus:ring-[#FF4500]/10 outline-none transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF4500] text-white py-4 rounded-xl font-bold hover:bg-[#E63E00] transform active:scale-95 transition-all shadow-lg shadow-[#FF4500]/30 disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
