require('dotenv').config();
import supertest from 'supertest';
import { expect } from 'chai';

const request = supertest('https://gorest.co.in/public-api/');
const TOKEN = process.env.USER_TOKEN;


describe('Users', () => {

    let userId;

    it('GET /users', () => {
        return request.get(`users?access-token= ${TOKEN}`).then((res) => {
            expect(res.body.data).to.not.be.empty;
        });
    });

    it('GET /users/:id', () => {
        return request.get(`users/26?access-token= ${TOKEN}`).then((res) => {
            expect(res.body.data.id).to.be.equal(26);
        });
    });

    it('GET /users with query params', () => {
        const url = `users?access-token=${TOKEN}&page=5&gender=Female&status=Active`

        return request.get(url).then((res) => {
            expect(res.body.data).to.not.be.empty;
            res.body.data.forEach(data => {
                expect(data.gender).to.be.eq('Female');
                expect(data.status).to.be.eq('Active');
            });
        });
    });

    it('POST /users', () => {
        const data = {
            email: `test-${Math.floor(Math.random() * 9999)}@mail.ca`,
            name: 'Test name',
            gender: 'Male',
            status: 'Inactive'
        };

        return request
            .post('users')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(data)
            .then((res) => {
                expect(res.body.data).to.deep.include(data);
                userId = res.body.data.id;
            });
        
    });

    it('PUT /users/:id', () => {
        const data = {
            name: `Luffy-${Math.floor(Math.random() * 9999)}`,
            status: 'Active'
        };

        return request
            .put(`users/${userId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(data)
            .then((res) => {
                expect(res.body.data).to.deep.include(data);
            });
        
    });

    it('DELETE /users/:id', () => {

        return request
            .delete('users/10')
            .set('Authorization', `Bearer ${TOKEN}`)
            .then((res) => {
                expect(res.body.data).to.be.eq(null);
            });
    });

});

