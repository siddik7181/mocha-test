import UserModel, { IUser } from "../models/User";

export const createUser = async (userData: IUser) => {
    try {
        const newUser = new UserModel(userData);
        await newUser.save();
        return newUser;
    } catch (error: any) {
        throw new Error('Error creating user: ' + error.message);
    }
};

export const getUserById = async (userId: string) => {
    try {
        return await UserModel.findById(userId);
    } catch (error: any) {
        throw new Error('Error getting user: ' + error.message);
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        return await UserModel.find({email});
    } catch (error: any) {
        throw new Error('Error getting user: ' + error.message);
    }
};


export const updateUser = async (userId: string, userData: Partial<IUser>) => {
    try {
        return await UserModel.findByIdAndUpdate(userId, userData, { new: true });
    } catch (error: any) {
        throw new Error('Error updating user: ' + error.message);
    }
};

export const deleteUser = async (userId: string) => {
    try {
        return await UserModel.findByIdAndDelete(userId);
    } catch (error: any) {
        throw new Error('Error deleting user: ' + error.message);
    }
};
