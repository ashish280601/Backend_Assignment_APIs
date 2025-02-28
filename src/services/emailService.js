import nodemailer from "nodemailer";

// creating a transporter
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.USER_PASSWORD,
    },
});

// creating email function to send an forgetPassword OTP link
export async function OPTVerifyEmail(userEmail, OTP) {
    try {
        await transport.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Regarding setting up your Password",
            html: `OTP to set your password: <strong>${OTP}</strong>. This OTP will expire within 15 minutes.`,
        });
        console.log("Email send successfully " + `to user ${userEmail}`);
    } catch (error) {
        console.log("Error While sending otp to user", error);
    }
}

