// inbuitl import
import bcrypt from "bcrypt";

// custom import
import UsersModel from "../models/students_portal/users.model.js";

async function initializeAdmin() {
    const existingAdmin = await UsersModel.findOne({ where: { role: 'Admin' } });
    
    if (!existingAdmin) {
        await UsersModel.create({
            email: process.env.ADMIN_EMAIL,
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
            role: 'Admin',
            registrationType: 'Email',
            status: 'REGISTERED'
        });
        console.log('Admin user created.');
    } else {
        console.log('Admin already exists.');
    }
}

export default initializeAdmin;
