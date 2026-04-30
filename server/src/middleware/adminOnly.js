/**
 * Admin-only access middleware
 * Allows only users with 'admin' or 'super_admin' role
 */
export const adminOnly = (req, res, next) => {
  // auth middleware should have already set req.user
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const allowedRoles = ['admin', 'super_admin', 'staff']; // staff maybe allowed?
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions. Admin access required.' });
  }

  next();
};
