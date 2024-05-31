// Import necessary modules and dependencies
import { Router, Request, Response, NextFunction } from 'express';
import CreateUser from '../models/CreateUser';
import createdUser from '../models/createdUser';
import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: any; // Modify 'any' to the type of your user object if possible
    }
}

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

// Define a router
const router = Router();

// Configure session middleware
router.use(session({
    secret: '5467839gugjfju88', // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // Set session expiry time to 1 hour (in milliseconds)
    }
}));

router.post('/login', authenticateUser, async (req: CustomRequest, res: Response) => {
    const { email, password } = req.body;


    try {
        // Find user by email
        const user = await createdUser.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Find user by createdBy field in CreateUser model to retrieve the apiToken
        const createUser = await CreateUser.findById(user.createdBy);

        if (!createUser) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

         // Check if the retrieved apiToken matches the one provided in the request
         if (req.user.apiToken !== createUser.apiToken) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        // Set user data in session
        req.session.user = user;

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Logout endpoint
router.post('/logout', authenticateUser, (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Logout successful' });
    });
});


export default router;
