import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AccessRestricted from '../../pages/AccessRestricted';

interface ProtectedRouteProps {
  portal: 'citizen' | 'government';
  children: React.ReactNode;
}

export default function ProtectedRoute({ portal, children }: ProtectedRouteProps) {
  const user = authService.getCurrentUser();

  // 1. Not authenticated -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Validate Citizen Portal access
  if (portal === 'citizen') {
    if (!authService.isCitizen(user)) {
      return <AccessRestricted requiredPortal="citizen" userRole={user.role} />;
    }
  }

  // 3. Validate Government Portal access
  if (portal === 'government') {
    if (!authService.isGovernment(user)) {
      return <AccessRestricted requiredPortal="government" userRole={user.role} />;
    }
  }

  // 4. Authorized -> Render portal layout & child routes
  return <>{children}</>;
}
