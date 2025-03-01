import nodemailer from "nodemailer";

// Creating a transporter with more explicit configuration
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,  // Use 587 for TLS, which is more commonly open
    secure: false, // Use STARTTLS instead of SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.USER_PASSWORD,
    },
    connectionTimeout: 15000,  // 15 seconds to timeout
    logger: true,
    debug: true,
});

// Function to send OTP with retry mechanism
export async function OPTVerifyEmail(userEmail, OTP, attempt = 1) {
    try {
        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Regarding setting up your Password",
            html: `Your OTP to set your password is: <strong>${OTP}</strong>. This OTP will expire within 15 minutes.`,
        });
        console.log(`Email sent successfully to ${userEmail}`);
        return true
    } catch (error) {
        console.error(`Error sending OTP to ${userEmail}, Attempt ${attempt}:`, error.message);

        if (attempt < 3) {  // Retry up to 3 times
            console.log(`Retrying sending email to ${userEmail}, attempt ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 3000));  // 3 second delay
            return OPTVerifyEmail(userEmail, OTP, attempt + 1);
        } else {
            console.error(`Failed to send email to ${userEmail} after 3 attempts.`);
            throw error;  // Let your controller catch this and return proper response
        }
    }
}
