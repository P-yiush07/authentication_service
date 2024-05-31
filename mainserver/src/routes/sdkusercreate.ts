import { Router, Request, Response, NextFunction } from 'express';
import CreateUser from '../models/CreateUser';
import createdUser from '../models/createdUser';

const router = Router();

interface CustomRequest extends Request {
    user?: any; 
}

const authenticateUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        // Extract API token from request headers or query parameters
        let apiToken: string | undefined = req.headers.authorization?.split(' ')[1] as string;
        
        if (!apiToken) {
            const queryApiToken = req.query.apiToken;
            if (typeof queryApiToken === 'string') {
                apiToken = queryApiToken;
            } else if (Array.isArray(queryApiToken)) {
                apiToken = queryApiToken[0] as string; // Use the first element if it's an array
            }
        }
        
        // If API token is not provided, return unauthorized response
        if (!apiToken) {
            return res.status(401).json({ message: 'API token is required' });
        }
        
        // Retrieve user based on API token
        const user = await CreateUser.findOne({ apiToken });
        
        // If user is not found, return unauthorized response
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Attach user information to request object for use in subsequent middleware or routes
        req.user = user;

        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// User Creation Endpoint
router.post('/users/create', authenticateUser, async (req: CustomRequest, res: Response) => {
    try {
        // Extract data from request body
        const { name, email, password }: { name: string, email: string, password: string } = req.body;

        // Create a new user instance
        const newUser = new createdUser({
            name,
            email,
            password,
            createdBy: req.user._id, // Associate user creation with the authenticated user
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Error in user creation endpoint:', error); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// User Listing Endpoint
router.get('/users', authenticateUser, async (req: CustomRequest, res: Response) => {
    try {
        // Retrieve users created by the authenticated user
        const users = await createdUser.find({ createdBy: req.user._id });

        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in user listing endpoint:', error); 
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;