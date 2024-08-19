import { z } from 'zod'

const resendVerifySchema = z.object({
    email: z.string().email({ message: "Invalid Email" })
})

export default resendVerifySchema