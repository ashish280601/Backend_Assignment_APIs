import UsersModel from "../../../models/students_portal/users.model.js";
import { repositoryLogger } from "../../../utils/logger.js";

export default class UserRepository {
    // write your code logic here.
    async findUserByEmail(email) {
        try {
            const user = await UsersModel.findOne({ where: { email } });
            repositoryLogger.info(`Fetched user by email: ${email}`);
            return user;
        } catch (error) {
            console.log("Error while finding email", error.message);
            repositoryLogger.error(`Failed to fetch user by email ${email}: ${error.message}`);
            throw  error; // Let controller handle the response
        }
    };

    async createPendingUser(email, otp, otpExpiresAt) {
        try {
            const user = await UsersModel.create({
                email,
                otp,
                otpExpiresAt,
                status: 'PENDING',
                registrationType: 'Email'
            });
            
            repositoryLogger.info(`Created new pending user: ${email}`);
            return user;
        } catch (error) {
            console.error("Error while adding user email", error.message);
            repositoryLogger.error(`Failed to create pending user ${email}: ${error.message}`);
            throw error;
        }
    };

    async updateUserOtp(user, otp, otpExpiresAt) {
        try {
            const updatedUser = await user.update({
                otp,
                otpExpiresAt
            });
            repositoryLogger.info(`Updated OTP for user: ${user.email}`);
            return updatedUser;
        } catch (error) {
            repositoryLogger.error(`Failed to update OTP for user ${user.email}: ${error.message}`);
            throw error;
        }
    };

    async completeUserRegistration(user, hashedPassword) {
        try {
            const updatedUser = await user.update({
                password: hashedPassword,
                status: 'REGISTERED',
                otp: null,
                otpExpiresAt: null
            });
            repositoryLogger.info(`User registration completed: ${user.email}`);
            return updatedUser;
        } catch (error) {
            repositoryLogger.error(`Failed to complete registration for user ${user.email}: ${error.message}`);
            throw error;
        }
    };
}