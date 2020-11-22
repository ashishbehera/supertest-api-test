require('dotenv').config();
import request from '../config/common';

import { expect } from 'chai';
import { createRandomUser,createRandomUserWithFaker } from './helper/user_helper';
const faker = require('faker');
const TOKEN = process.env.USER_TOKEN;
const userData = require('../config/data/user.json');
describe.only('User Posts', () => {

    let postId, userId;

    before(async () => {
        userId = await createRandomUserWithFaker();
    });

    it('POST /posts', async () => {

        const data = {
            user_id: userId,
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraph(),
        }

        const postRes = await request
            .post('posts')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(data);

        expect(postRes.body.data).to.deep.include(data);
        postId = postRes.body.data.id;
    });

    it('GET /posts/:id', async () => {

        await request
            .get(`posts/${postId}`)
            .set('Authorization', `Bearer ${TOKEN}`)
            .expect(200);
        
    });

    describe('Negative Tests', () => {
        it('401 Authentication Failed', async () => {

            const data = {
                user_id: userId,
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraph(),
            }
    
            const postRes = await request
                .post('posts')
                .send(data);
            
            expect(postRes.body.code).to.eq(401);
            expect(postRes.body.data.message).to.eq('Authentication failed');
        });

        it('422 Data Validation Failed', async () => {

            const data = {
                user_id: userId,
                title: faker.lorem.sentence(),
            }
    
            const postRes = await request
                .post('posts')
                .set('Authorization', `Bearer ${TOKEN}`)
                .send(data);
            
            expect(postRes.body.code).to.eq(422);
            expect(postRes.body.data[0].field).to.eq('body');
            expect(postRes.body.data[0].message).to.eq("can't be blank");

        });

        it('422 for Invalid Data for userID', async () => {

            const data = {
                user_id: userData.invalidUserId,
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraph(),

            }
    
            const postRes = await request
                .post('posts')
                .set('Authorization', `Bearer ${TOKEN}`)
                .send(data);
            
            console.log(postRes.body);
                expect(postRes.body.code).to.eq(422);
                expect(postRes.body.data[1].field).to.eq('user_id');
                expect(postRes.body.data[1].message).to.eq("is not a number");            
          

        });

    });

});
