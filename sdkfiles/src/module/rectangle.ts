import axios from 'axios';

export async function fetchUserDetails(apiToken: string): Promise<any> {
    try {
        // Make a GET request to your server to fetch user details
        const response = await axios.get('http://127.0.0.1:3000/user', {
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; 
    }
}