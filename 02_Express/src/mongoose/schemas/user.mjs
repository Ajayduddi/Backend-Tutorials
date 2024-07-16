import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
    },
});

export const user = mongoose.model('user', userSchema);