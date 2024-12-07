import app from '../../src/app'
import request from 'supertest'
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTabels } from '../utils';
import { User } from '../../src/entity/User';
 
describe("POST / auth/register" , () => {

  let connection:DataSource;

  beforeAll( async() => {
    connection = await AppDataSource.initialize();
  })

  beforeEach(async() => {
     await truncateTabels(connection);
  })


  afterAll(async() => {
  await  connection.destroy();
  })

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


        it("its shoud  persist the user data", async () => {
            const userdata = {
                firstname:'Sagor',
                lastname:'saha',
                email:'sahasagor650@gmail.com',
                password:'secret'
            }
            //act
             await request(app).post('/auth/register').send(userdata)
    
    
            //assent application/jsonutf-8
            const userRepository = connection.getRepository(User)
            const users = await userRepository.find();
            expect(users).toHaveLength(0)

        })
    
    }) 
describe("given invalid email" , () => {})
})