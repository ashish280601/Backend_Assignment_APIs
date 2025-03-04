// inbuilt import
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// custom import
import { generateOtp, otpExpiryTime } from "../../../utils/otpHelper.js";
import UserRepository from "../../repository/students/users.repository.js";
import { controllerLogger } from "../../../utils/logger.js";
import { OPTVerifyEmail } from "../../../services/emailService.js";

export default class UserController {
    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Step 1: Register via email - Save email and generate OTP
     */
    async registerByEmail(req, res) {
        const { email } = req.body;

        try {
            const existingUser = await this.userRepository.findUserByEmail(email);
            const otp = generateOtp();

            const expiresAt = otpExpiryTime();

            if (existingUser) {
                if (existingUser.status === 'REGISTERED') {
                    controllerLogger.warn(`Request OTP - Email already registered: ${email}`);
                    return res.status(400).json({
                        data: {
                            message: "Email already registered. Please login.",
                            code: 400,
                            status: false
                        }
                    });
                }

                // Resend OTP for pending user
                await this.userRepository.updateUserOtp(existingUser, otp, expiresAt);
                const emailResult = await OPTVerifyEmail(email, otp);
                console.log("emailResult", emailResult);

                if (!emailResult) {
                    controllerLogger.error(`Failed to send OTP to ${email}. Error: ${emailResult.error}`);
                    return res.status(500).json({
                        data: {
                            message: "Failed to send OTP email. Please try again later.",
                            code: 500,
                            status: false,
                        }
                    });
                }
                controllerLogger.info(`OTP resent to existing pending user: ${email}`);

                return res.status(200).json({
                    data: {
                        message: "OTP resent to your email.",
                        code: 200,
                        status: true
                    }
                });
            } else {
                // Create new user with PENDING status
                await this.userRepository.createPendingUser(email, otp, expiresAt, 'Student');
                await OPTVerifyEmail(email, otp)
                controllerLogger.info(`New OTP sent to new user: ${email}`);

                return res.status(200).json({
                    data: {
                        message: "OTP sent to your email.",
                        code: 200,
                        status: true
                    }
                });
            }
        } catch (error) {
            controllerLogger.error(`Error in registerByEmail for email ${email}: ${error.message}`);
            return res.status(500).json({
                data: {
                    message: "Something went wrong while requesting OTP.",
                    code: 500,
                    status: true
                }
            });
        }
    }

    /**
     * Step 2: Verify OTP
     */
    async verifyOtp(req, res) {
        const { email, otp } = req.body;

        try {
            const user = await this.userRepository.findUserByEmail(email);

            if (!user || user.status !== 'PENDING') {
                controllerLogger.warn(`Verify OTP - Invalid email or expired registration for: ${email}`);
                return res.status(400).json({
                    data: {
                        message: "Invalid email or registration expired. Please restart registration.", code: 400,
                        status: false
                    }
                });
            }

            if (new Date() > new Date(user.otpExpiresAt)) {
                controllerLogger.warn(`Verify OTP - OTP expired for: ${email}`);
                return res.status(400).json({
                    data: {
                        message: "OTP expired. Please request a new OTP.",
                        code: 400,
                        status: false
                    }
                });
            }

            if (user.otp !== parseInt(otp)) {
                controllerLogger.warn(`Verify OTP - Incorrect OTP for: ${email}`);
                return res.status(400).json({
                    data: {
                        message: "Invalid OTP. Please try again.",
                        code: 400,
                        status: false
                    }
                });
            }

            controllerLogger.info(`OTP successfully verified for: ${email}`);
            return res.status(200).json({
                data: {
                    message: "OTP verified successfully. Please set your password.",
                    code: 200,
                    status: true
                }
            });
        } catch (error) {
            controllerLogger.error(`Error in verifyOtp for email ${email}: ${error.message}`);
            return res.status(500).json({
                data: {
                    message: "Something went wrong while verifying OTP.",
                    code: 500,
                    status: false
                }
            });
        }
    }

    /**
     * Step 3: Set Password and Complete Registration
     */
    async setPassword(req, res) {
        const { email, password } = req.body;

        try {
            const user = await this.userRepository.findUserByEmail(email);

            if (!user || user.status !== 'PENDING') {
                controllerLogger.warn(`Set Password - Invalid or expired registration for: ${email}`);
                return res.status(400).json({
                    data: {
                        message: "Invalid request. Please request OTP again.",
                        code: 400,
                        status: false
                    }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await this.userRepository.completeUserRegistration(user, hashedPassword);
            controllerLogger.info(`User registration completed successfully for: ${email}`);

            return res.status(200).json({
                data: {
                    message: "Registration completed successfully. You can now login.",
                    code: 200,
                    status: true
                }
            });
        } catch (error) {
            controllerLogger.error(`Error in setPassword for email ${email}: ${error.message}`);
            return res.status(500).json({
                data: {
                    message: "Something went wrong while setting password.",
                    code: 500,
                    status: false
                }
            });
        }
    }

    // Login Methods
    async login(req, res) {
        const { email, password } = req.body;

        const JWT_EXPIRY = '1h';

        try {
            const user = await this.userRepository.findUserByEmail(email);
            
            if (!user) {
                return res.status(400).json({
                    data: {
                        message: "Invalid email. Please sign up.",
                        code: 400,
                        status: false
                    }
                });
            }

            // Compare provided password with hashed password in DB
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    data: {
                        message: "Incorrect password. Please try again.",
                        code: 400,
                        status: false
                    }
                });
            }

            // Generate JWT token if email and password are correct
            const token = jwt.sign(
                { email: user.email, userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: JWT_EXPIRY }
            );
            
            return res.status(200).json({
                data: {
                    message: "Login successful.",
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    },
                    code: 200,
                    status: true
                }
            });

        } catch (error) {
            console.error(`Error during login for email ${email}: ${error.message}`);
            return res.status(500).json({
                data: {
                    message: "Something went wrong while logging in.",
                    code: 500,
                    status: false
                }
            });
        }
    }
}
