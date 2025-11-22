import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API);

export const sendMailOtp = async (email, otp) => {
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: "OTP for your email verification.",
            html: `
                <div>
                    <h2>Use this code to verify your email.</h2>
                    <b>${otp}</b>
                    <p>This code will expire in 10 mins.</p>
                    <p>If you didn't request for this code please ignore.</p>
                </div>
            `
        });
        console.log('OTP sent successfully to: ', data.id);
        return {success: true, emailId: data.id };
    } catch (err) {
        console.log("OTP could not be sent successfully to: ", data.id);
        return { success: false, error: err};
    }
}