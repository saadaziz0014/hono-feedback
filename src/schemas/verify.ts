import {z} from 'zod';

const verifySchema = z.string().min(6, {message: 'Code must be at least 6 characters long'});

export default verifySchema