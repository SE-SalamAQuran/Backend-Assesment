const express = require('express');
const chai = require('chai');
const request = require('supertest');

const app = express();




describe('GET Posts where tags are history and/or culture, sorted in descending order according to popularity', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=history,culture&sortBy=popularity&direction=desc')
            .send({})
            .expect(200)
    });
});

describe('GET Posts where tags are sport and/or tech, sorted by id in ascending order "default values for sortBy & direction"', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=tech,sport')
            .send({})
            .expect(200)
    });
});

describe('GET Posts where tags are politics, sorted by likes in ascending order', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=politics&sortBy=likes')
            .send({})
            .expect(200)
    });
});

describe('GET Posts where tags are politics, sorted by likes in decending order', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=politics&sortBy=likes&direction=desc')
            .send({})
            .expect(200)
    });
});


describe('GET Posts where tags are health, sorted by likes in ascending order', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=health&sortBy=likes')
            .send({})
            .expect(200)
    });
});

describe('GET Posts where tags are health and/or tech and/or history, sorted by reads in ascending order', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=health,tech,history&sortBy=reads')
            .send({})
            .expect(200)
    });
});

describe('GET Posts where tags are politics and/or health, sorted by reads in descending order', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=politics,health&sortBy=reads&direction=desc')
            .send({})
            .expect(200)
    });
});

describe('GET Posts where tags are tech and/or science, sorted by id in descending order', () => {
    it('Should get unique posts according to query params', () => {
        request(app)
            .get('https://api.hatchways.io/assessment/solution/posts?tags=tech,science&direction=desc')
            .send({})
            .expect(200)
    });
});
