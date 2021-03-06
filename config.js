module.exports = {
  PORT: process.env.PORT || 2222,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://Ryuta@localhost/challenge-tracker',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '200000s',
  CLIENT_ORIGIN: ''
}
