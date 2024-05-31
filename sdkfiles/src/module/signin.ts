import axios from 'axios';

interface LoginData {
    email: string;
    password: string;
}

export async function login(apiToken: string, userData: LoginData): Promise<any> {
    try {
        const response = await axios.post('http://127.0.0.1:3000/login', userData, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
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
