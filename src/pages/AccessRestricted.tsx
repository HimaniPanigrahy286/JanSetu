import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { Role } from '../types';

interface AccessRestrictedProps {
  requiredPortal?: 'citizen' | 'government';
  userRole?: Role;
}

export default function AccessRestricted({ requiredPortal: _requiredPortal, userRole }: AccessRestrictedProps) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const currentRole = userRole || currentUser?.role;
  const isCitizen = currentRole === 'citizen';

  const handleGoToAllowedPortal = () => {
    if (isCitizen) {
      navigate('/citizen/dashboard');
    } else {
      navigate('/government/overview');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-brand-yellow flex flex-col font-body text-black">
      {/* Top Header */}
      <header className="h-20 bg-brand-yellow border-b-2 border-black flex items-center justify-between px-6 md:px-12">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer text-left">
          <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black">
            <svg className="w-6 h-6 fill-brand-yellow" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl tracking-tight leading-none">JANSETU</span>
            <span className="font-body text-xs font-bold tracking-wider text-black">BRICS PLATFORM</span>
          </div>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="btn-brutal-secondary px-4 py-2 text-xs font-bold rounded-xl"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Restriction Card */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white card-brutal-lg rounded-2xl p-8 md:p-10 space-y-6 text-center">
            {/* Warning / Lock Badge Icon */}
            <div className="w-20 h-20 bg-red-100 border-2 border-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-brutal-sm">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* Title */}
            <div>
              <div className="inline-block px-3 py-1 bg-red-100 border-2 border-red-600 rounded-lg text-red-700 font-heading font-extrabold text-xs uppercase tracking-wider mb-3">
                Strict Access Control
              </div>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight text-black">
                Access Restricted
              </h1>
            </div>

            {/* Description Message based on role */}
            <div className="bg-gray-50 border-2 border-black/20 rounded-xl p-5 text-sm font-medium text-black/80 leading-relaxed text-left space-y-2">
              {isCitizen ? (
                <p>
                  This account is registered as a <span className="font-extrabold text-black">Citizen</span> account. The Government Portal is available only to authorized Government accounts.
                </p>
              ) : (
                <p>
                  This account is registered as a <span className="font-extrabold text-black">Government</span> account. The Citizen Portal is not available for this account.
                </p>
              )}
              {currentUser && (
                <div className="pt-2 border-t border-black/10 text-xs text-black/60 flex items-center justify-between">
                  <span>Logged in as: <strong>{currentUser.name}</strong></span>
                  <span className="capitalize px-2 py-0.5 bg-black text-white rounded font-bold">
                    {currentUser.role === 'official' ? 'Government' : currentUser.role}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {isCitizen ? (
                <button
                  onClick={handleGoToAllowedPortal}
                  className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold"
                >
                  Go to Citizen Portal &rarr;
                </button>
              ) : (
                <button
                  onClick={handleGoToAllowedPortal}
                  className="btn-brutal-primary w-full py-4 rounded-xl text-base font-extrabold"
                >
                  Go to Government Portal &rarr;
                </button>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={handleLogout}
                  className="btn-brutal-secondary py-3 px-4 rounded-xl text-xs font-bold"
                >
                  Switch Account
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn-brutal-secondary py-3 px-4 rounded-xl text-xs font-bold"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
