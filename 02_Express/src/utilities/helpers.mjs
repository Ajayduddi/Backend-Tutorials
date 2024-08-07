import bcrypt from 'bcrypt';

export const hashPassword = async (password) => { 
    const saltRounds = 10;
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.log(error);
    }
}


export const comparePassword = async (password, hash) => {
    try {
        const isMatch = await bcrypt.compare(password, hash,);
        return isMatch;
    } catch (error) {
        console.log(error);
    }
}