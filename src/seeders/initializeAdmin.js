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

/***
 *  this is not the best approach as to create counselor, staff or tutor 
 * For this we can create a onboarding system but at this time for test practice i have created this way.
 */
export async function initializeConselor() {
    const existingAdmin = await UsersModel.findOne({ where: { role: 'Counselor' } });
    
    if (!existingAdmin) {
        await UsersModel.create({
            email: "counselor@gmail.com",
            password: await bcrypt.hash('counselor', 10),
            role: 'Counselor',
            registrationType: 'Email',
            status: 'REGISTERED'
        });
        console.log('Counselor user created.');
    } else {
        console.log('Counselor already exists.');
    }
}

export default initializeAdmin;
