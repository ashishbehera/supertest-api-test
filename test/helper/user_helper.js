require('dotenv').config();
import supertest from 'supertest';

const request = supertest('https://gorest.co.in/public-api/');
const faker = require('faker');

const TOKEN = process.env.USER_TOKEN;

export const createRandomUserWithFaker = async () => {

    const userData = {
        email: faker.internet.email(),
        name: faker.name.firstName(),
        gender: 'Male',
        status: 'Inactive'
    };

    const res = await request
        .post('users')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(userData);
    return res.body.data.id;

};

export const createRandomUser = async () => {

    const userData = {
        email: `test-${Math.floor(Math.random() * 9999)}@mail.ca`,
        name: 'Test name',
        gender: 'Male',
        status: 'Inactive'
    };

    const res = await request
        .post('users')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(userData);   
    return res.body.data.id;

};
