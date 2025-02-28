export const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // 6 digit OTP

export const otpExpiryTime = () => {
    const expiry = new Date();
    // OTP expires in 15 minutes
    expiry.setMinutes(expiry.getMinutes() + 15);
    return expiry;
};
