// import "../../env.js";
import dotenv from 'dotenv';

dotenv.config(); 
console.log(process.env.PGPASSWORD);
console.log(process.env.PORT);
console.log(process.env.PGHOST);
console.log(process.env.PGDATABASE);
console.log(process.env.PGPORT);
console.log(process.env.PGUSER);

export default {
    development: {
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD ? String(process.env.PGPASSWORD).trim() : '',
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        port: parseInt(process.env.PGPORT, 10),
        dialect: "postgres"
    },
    test: {
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: "student_platform_test",
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        dialect: "postgres"
    },
    production: {
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        dialect: "postgres"
    }
};
