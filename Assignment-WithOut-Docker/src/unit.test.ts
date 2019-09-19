import request from 'supertest';
import app from './main';

  afterAll(done => {
    var server = app.listen(process.env.PORT)
    server.close(done)
  });


  
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
    describe('Post /register', ()  => {

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
    describe('Get /providers', () => {
        it('should get providers', (done) => {
            request(app).get('/providers')
                .expect(200)
                .then(response => response.body)
                .then(data => {
                    expect(data).toBeDefined();
                })
                .then(done)
        })
    })    
})