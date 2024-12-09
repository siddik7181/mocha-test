import { model, Schema } from "mongoose";

type Role = 'User' | 'SuperUser';

export interface IUser {
    name: string, 
    email: string,
    role?: Role,
}

const userSchema = new Schema<IUser> ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'User'
    }
}, {
    timestamps: true
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;