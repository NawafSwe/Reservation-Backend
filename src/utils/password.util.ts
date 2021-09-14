import bcrypt from 'bcryptjs';
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 8);
}

export const isValidPassword = async (password: string, encryptedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, encryptedPassword);
}