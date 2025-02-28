import { Sequelize } from "sequelize";

const dbConfig = {
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  };

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: "postgres"
});

const connectDB = async() => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  } 
}

// Handle graceful shutdown
const closeDB = async () => {
  try {
      await sequelize.close();
      console.log('Database connection closed.');
  } catch (error) {
      console.error('Error closing database connection:', error);
  }
};

export { connectDB, closeDB }