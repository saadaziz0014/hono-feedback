import {z} from 'zod'

const signupSchema = z.object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters long'}).max(20, {message: 'Name must be less than 20 characters long'}),
    email: z.string().email({message: 'Invalid email'}),
    password: z.string().min(6, {message: 'Password must be at least 6 characters long'})
})

export default signupSchema