import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import CreateUser from '../models/CreateUser';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
    try {
        // Extract data from request body
        const { name, email, password }: { name: string, email: string, password: string } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await CreateUser.findOne({ email });

        // If a user with the same email already exists, send an error response
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        let apiToken: string;

        // Generate a unique API token
        do {
            apiToken = uuidv4();
            // Check if the generated token already exists in the database
            const tokenExists = await CreateUser.findOne({ apiToken });
            // If the token does not exist, exit the loop
            if (!tokenExists) {
                break;
            }
            // If the token exists, generate a new one
        } while (true);

        // Create a new user instance
        const newUser = new CreateUser({
            name,
            email,
            password,
            apiToken,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Send a success response with the saved user data
        res.status(201).json(savedUser);
    } catch (error: any) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
});

router.get('/user', async (req: Request, res: Response) => {
    try {
        // Extract the API token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find the user with the provided API token
        const user = await CreateUser.findOne({ apiToken: token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;