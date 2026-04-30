export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
};
