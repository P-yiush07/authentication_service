import axios from 'axios';

interface SignUpData {
    name: string;
    email: string;
    password: string;
}

export async function signUp(apiKey: string, userData: SignUpData): Promise<any> {
    try {
        const response = await axios.post('http://127.0.0.1:3000/users/create', userData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function getUsers(apiKey: string): Promise<any> {
    try {
        const response = await axios.get('http://127.0.0.1:3000/users', {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

function handleAxiosError(error: any) {
    console.error('Axios error:', error.message);
    throw new Error('Request failed');
}
