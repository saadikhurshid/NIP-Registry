import request from 'supertest';
import app from './main';
import em from "./eventEmitter";
describe('Providers', () => {
    describe('Get /', () => {
        it('should get render', (done) => {
            request(app).get('/')
                .expect(200)
                .then(response => response.body)
                .then(data => {
                    expect(data).toBeDefined();
                })
                .then(done)
        })
    })    
    describe('Post /register', () => {

        it('should add provider', (done) => {
            let info = {
                "addresses": "Empty",
                "taxonomies": "Empty",
                "identifiers":"Empty"
            }
            request(app).post('/register')
            .send({NPINumber: 1234567890,firstName:"Saad",lastName:"qureshi",info:info})
                .expect(200)
                .then(response => response.body)
                .then(data => {
                    expect(data).toBeDefined();
                })
                .then(done)
        })
    })    
    // it('should be a function', function() {
    //     expect(em.emit("NIPRegistery",1234567890)).toBeInstanceOf(Function);
    //   });
})