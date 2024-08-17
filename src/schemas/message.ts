import {z} from 'zod'

const messageSchema = z.string().min(3, {message: 'Message must be at least 3 characters long'}).max(100, {message: 'Message must be less than 200 characters long'});

export default messageSchema