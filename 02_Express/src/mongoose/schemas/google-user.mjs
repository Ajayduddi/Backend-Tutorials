import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
    googleid: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 5,
        maxlength: 50,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    // email: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     minlength: 5,
    //     maxlength: 50,
    //     unique: true,
    //     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    // },
});

export const googleUser = mongoose.model('GoogleUser', googleUserSchema);