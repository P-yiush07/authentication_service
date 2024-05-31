import { login } from '../src/index'

// Define your API key and user data
const apiKey = '3ee476be-98da-4040-917e-60af4bcc3984';
const userData = {
    email: 'Man@example1.com234',
    password: 'man23456'
};

// Call the signUp function
login(apiKey, userData)
    .then(response => {
        console.log('User signed up successfully:', response);
    })
    .catch(error => {
        console.error('Error signing up:', error.message);
    });
