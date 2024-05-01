export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  roundsOfHashing: 10,
});
