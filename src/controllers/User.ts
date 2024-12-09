import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/User'; 

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, role } = req.body;
        if (!name || !email) {
            throw {
                status: 400,
                message: 'name & email is required'
            }
        }
        const existingUser = await userService.getUserByEmail(email);
        console.log("Existing User: " , existingUser)
        if (existingUser.length !== 0) {
            throw {
                status: 400,
                message: 'email already exists'
            };
        }
        const userData = { name, email, role }; 
        const newUser = await userService.createUser(userData);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        next(error); 
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        if (!user) {
            throw {
                status: 404,
                message: 'no user found'
            };
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await userService.updateUser(id, userData);
        if (!updatedUser) {
            throw {
                status: 404,
                message: 'no user found'
            };
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) {
            throw {
                status: 404,
                message: 'no user found'
            };
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: deletedUser
        });
    } catch (error) {
        next(error);
    }
};

