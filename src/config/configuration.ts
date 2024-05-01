export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  roundsOfHashing: 10,
  mail: {
    host: process.env.MAIL_HOST,
    pass: process.env.MAIL_PASS,
    user: process.env.MAIL_USER,
    from: process.env.MAIL_from,
  },
});
