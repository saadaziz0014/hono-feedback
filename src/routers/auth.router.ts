import { Hono } from "hono";
import { validator } from 'hono/validator'
import { sign } from 'hono/jwt'
import signupSchema from "../schemas/signup";
import prisma from "../prisma-client";
import { comparePassword, generateSixDigitCode, hashPassword, send } from "../helper";
import loginSchema from "../schemas/login";
import resendVerifySchema from "../schemas/resend-verify";
const auth = new Hono();

auth.post("/signup", validator("json", (value, c) => {
    let result = signupSchema.safeParse(value)
    if (!result.success) {
        return c.json({ message: result.error.errors[0].message }, 400)
    }
    return result.data
}), async (c) => {
    try {
        const { name, email, password } = c.req.valid("json");
        let exist = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (exist) {
            return c.json({ message: "User already exists" }, 400)
        }
        let hashedPassword = await hashPassword(password);
        let user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })
        let code = String(generateSixDigitCode());
        let verifyTable = await prisma.verifyUser.create({
            data: {
                userId: user.id,
                token: code,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        })
        await send(email, code);
        let payload = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        return c.json({ message: "User created successfully", payload }, 200)
    } catch (error: any) {
        return c.json({ message: error.message }, 500)
    }
});

auth.post("/login", validator("json", (value, c) => {
    let result = loginSchema.safeParse(value)
    if (!result.success) {
        return c.json({ message: result.error.errors[0].message }, 400)
    }
    return result.data
}), async (c) => {
    try {
        const { email, password } = c.req.valid("json");
        let user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            return c.json({ message: "User not found" }, 400)
        }
        if (user.isActive === false) {
            return c.json({ message: "User is not active" }, 400)
        }
        let match = await comparePassword(password, user.password);
        if (!match) {
            return c.json({ message: "Invalid password" }, 400)
        }
        let payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            exp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).getTime()
        }
        let token = sign(payload, process.env.JWT_USER_SECRET! || "secret");
        return c.json({ message: "Login successful", payload: { payload, token } }, 200)
    } catch (error: any) {
        return c.json({ message: error.message }, 500)
    }
});

auth.post("/resend-verify", validator("json", (value, c) => {
    let result = resendVerifySchema.safeParse(value)
    if (!result.success) {
        return c.json({ message: result.error.errors[0].message }, 400)
    }
    return result.data
}), async (c) => {
    try {
        const { email } = c.req.valid("json");
        let user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            return c.json({ message: "User not found" }, 400)
        }
        let code = String(generateSixDigitCode());
        let deleteVerify = await prisma.verifyUser.delete({
            where: {
                userId: user.id
            }
        })
        let verifyTable = await prisma.verifyUser.create({
            data: {
                userId: user.id,
                token: code,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            }
        })
        await send(email, code);
        return c.json({ message: "Verification code sent successfully" }, 200)
    } catch (error: any) {
        return c.json({ message: error.message }, 500)
    }
})

export default auth