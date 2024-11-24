const mongoose = require('mongoose');
const request = require('supertest'); // Assuming you're using Supertest for API testing
const app = require('../server'); // Import your app for testing

describe('User Authentication Tests', () => {
    it('should register a new user successfully', async () => {
        const newUser = {
            name: "Test Rhoda",
            email: "rhoda@example.com",
            password: "password123",
        };
        const response = await request(app).post('/api/users/register').send(newUser);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should login a user successfully', async () => {
        const loginDetails = {
            email: "rhoda@example.com",
            password: "password123",
        };
        const response = await request(app).post('/api/users/login').send(loginDetails);
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    it('should return 400 if invalid credentials are provided', async () => {
        const invalidLogin = {
            email: "invalid@example.com",
            password: "wrongpassword",
        };
        const response = await request(app).post('/api/users/login').send(invalidLogin);
        expect(response.status).toBe(400);
    });

    // Cleanup to ensure no open database connections
    afterAll(async () => {
        await mongoose.connection.close(); // Close the DB connection after tests
    });
});
