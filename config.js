module.exports = {
  PORT: process.env.PORT || 2222,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://Ryuta@localhost/challenge-tracker',
}
