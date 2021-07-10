const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: [true, 'Username is required.'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        campus: {
            type: String,
            enum: ['Madrid', 'Barcelona', 'Miami', 'Paris', 'Berlin', 'Amsterdam', 'México', 'Sao Paulo', 'Lisbon']
        },
        course: {
            type: String,
            enum: ['Web Dev', 'UX/UI', 'Data Analytics']
        },
        image: String
    },
    {
        timestamps: true
    }
);

module.exports = model('Users', userSchema)