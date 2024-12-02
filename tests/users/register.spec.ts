import request from 'supertest'
import app from '../../src/app'
describe("POST / auth/register" , () => {
    describe("given all field" , () => {
        it("should return the 201 status code", async () => {
            //AAA
            //arage
            const userdata = {
                firstname:'Sagor',
                lastname:'saha',
                email:'sahasagor650@gmail.com',
                password:'secret'
            }
            //act
            const responce = await request(app).post('/auth/register').send(userdata)
            //assent
            expect(responce.statusCode).toBe(201)
        })
        it("its shoud return valid json", async () => {
            const userdata = {
                firstname:'Sagor',
                lastname:'saha',
                email:'sahasagor650@gmail.com',
                password:'secret'
            }
            //act
            const responce = await request(app).post('/auth/register').send(userdata)
    
    
            //assent application/jsonutf-8
            expect((responce.headers as Record<string, string>)["content-type"]).toEqual(expect.stringContaining("json"));

        })
    }) 
describe("given invalid email" , () => {})
})