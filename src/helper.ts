import { Resend } from "resend";
import * as bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

async function send(email: string, code: string) {
    return new Promise(async (resolve, reject) => {
        const { data, error } = await resend.emails.send({
            from: "Hono Feedback <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email",
            html: "<p>Hi there! You requested to verify your email. Please verify your email by clicking on the link below</p><a href=`${process.env.NEXT_APP_URL}/verify?code=${code}`>Verify</a>",
        })
        if (error) {
            reject(error)
        }
        resolve(data)
    })
}

function generateSixDigitCode() {
    return Math.floor(100000 + Math.random() * 900000)
}

async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

async function comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
}

export { send, generateSixDigitCode, hashPassword, comparePassword }