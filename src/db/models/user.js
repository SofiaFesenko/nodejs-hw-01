import { model, Schema } from 'mongoose';
import { ROLES } from '../../constants/index.js';

const userSchema = new Schema(
    {
        name: {
           type: String,
           required: true, 
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: ROLES.USER
        }
    },
    {
      timestamps: true,
      versionKey: false,
    },
);

userSchema.methods.toJSON = function () {
    const obj = this.toObject()
    delete obj.password
    return obj
}

export const UserCollection = model('user', userSchema);