import { DataSource } from 'typeorm'
import { AppDataSource } from '../../src/config/data-source'
import request from 'supertest'
import app from '../../src/app'
import { Tenants } from '../../src/entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { ROLES } from '../../constants'

describe('POST /tanents', () => {
   let connection: DataSource
   let jwks: ReturnType<typeof createJWKSMock>
   let adminToken: string

   beforeAll(async () => {
      jwks = createJWKSMock('http://localhost:5500')
      connection = await AppDataSource.initialize()
   })

   beforeEach(async () => {
      jwks.start()
      await connection.dropDatabase()
      await connection.synchronize()
   })

   afterAll(async () => {
      jwks.stop()
      if (connection && connection.isInitialized) {
         await connection.destroy()
      } else {
         console.log('Connection was not initialized, skipping cleanup')
      }
   })

   describe('given all field', () => {
      it('should 201 status code', async () => {
         // Increase timeout to 30 seconds

         const tenantData = {
            name: 'tenant name',
            address: 'tenant address',
         }

         const adminToken = jwks.token({
            sub: '1',
            role: ROLES.ADMIN,
         })
         const response = await request(app)
            .post('/tanents')
            .set('Cookie', [`accessToken=${adminToken};`])
            .send(tenantData)
         console.log('Response:', response.body)
         expect(response.statusCode).toBe(201)
      })

      it('should create a tanent in database', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         const adminToken = jwks.token({
            sub: '1',
            role: ROLES.ADMIN,
         })
         await request(app)
            .post('/tanents')
            .set('Cookie', [`accessToken=${adminToken};`])
            .send(tanantdata)

         console.log('responce request complete')

         const tanentRepository = connection.getRepository(Tenants)
         const tanents = await tanentRepository.find()
         expect(tanents).toHaveLength(1)
         expect(tanents[0].name).toBe(tanantdata.name)
         expect(tanents[0].address).toBe(tanantdata.address)
      })
      it('should not create a tanent database without authnatecate', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         const response = await request(app).post('/tanents').send(tanantdata)

         expect(response.statusCode).toBe(401)

         const tanentRepository = connection.getRepository(Tenants)
         const tanents = await tanentRepository.find()
         expect(tanents).toHaveLength(0)
      })
      it('should throw 403 if user not admin and dont have any permisson', async () => {
         const tanantdata = {
            name: 'tanent name',
            address: 'tanent addess',
         }
         const RolesToken = jwks.token({
            sub: '1',
            role: ROLES.MANAGER,
         })
         const response = await request(app)
            .post('/tanents')
            .set('Cookie', [`accessToken=${RolesToken};`])
            .send(tanantdata)

         expect(response.statusCode).toBe(403)

         const tanentRepository = connection.getRepository(Tenants)
         const tanents = await tanentRepository.find()
         expect(tanents).toHaveLength(0)
      })
   })
})

// import { DataSource } from "typeorm";
// import request from "supertest";
// import { AppDataSource } from "../../src/config/data-source";
// import app from "../../src/app";
// import { Tenants } from '../../src/entity/Tenant'
// import createJWKSMock from "mock-jwks";
// import { ROLES } from "../../constants";

// describe("POST /tenants", () => {
//     let connection: DataSource;
//     let jwks: ReturnType<typeof createJWKSMock>;
//     let adminToken: string;

//     beforeAll(async () => {
//         connection = await AppDataSource.initialize();
//         jwks = createJWKSMock("http://localhost:5500");
//     });

//     beforeEach(async () => {
//         await connection.dropDatabase();
//         await connection.synchronize();
//         jwks.start();

//         adminToken = jwks.token({
//             sub: "1",
//             role: ROLES.ADMIN,
//         });
//     });

//     afterAll(async () => {
//         await connection.destroy();
//     });

//     afterEach(() => {
//         jwks.stop();
//     });

//     describe("Given all fields", () => {
//       //   it("should return a 201 status code", async () => {
//       //       const tenantData = {
//       //           name: "Tenant name",
//       //           address: "Tenant address",
//       //       };
//       //       const response = await request(app)
//       //           .post("/tenants")
//       //           .set("Cookie", [`accessToken=${adminToken}`])
//       //           .send(tenantData);

//       //       expect(response.statusCode).toBe(201);
//       //   });
//         it('should return  201 status code', async () => {
//                     // Increase timeout to 30 seconds

//                   const tenantData = {
//                      name: 'tenant name',
//                      address: 'tenant address',
//                   };

//                   const response = await request(app)
//                      .post('/tenants')
//                      .set('Cookie', [`accessToken=${adminToken};`])
//                      .send(tenantData);

//                   console.log('Response:', response.body);
//                   expect(response.statusCode).toBe(201);
//                });

//         it("should create a tenant in the database", async () => {
//             const tenantData = {
//                 name: "Tenant name",
//                 address: "Tenant address",
//             };

//             await request(app)
//                 .post("/tenants")
//                 .set("Cookie", [`accessToken=${adminToken}`])
//                 .send(tenantData);
//                 const tenantRepository = connection.getRepository(Tenants);

//             const tenants = await tenantRepository.find();
//             expect(tenants).toHaveLength(1);
//             expect(tenants[0].name).toBe(tenantData.name);
//             expect(tenants[0].address).toBe(tenantData.address);
//         });

//         it("should return 401 if user is not autheticated", async () => {
//             const tenantData = {
//                 name: "Tenant name",
//                 address: "Tenant address",
//             };

//             const response = await request(app)
//                 .post("/tenants")
//                 .send(tenantData);
//             expect(response.statusCode).toBe(401);

//             const tenantRepository = connection.getRepository(Tenants);
//             const tenants = await tenantRepository.find();

//             expect(tenants).toHaveLength(0);
//         });

//         it("should return 403 if user is not an admin", async () => {
//             const managerToken = jwks.token({
//                 sub: "1",
//                 role: ROLES.MANAGER,
//             });

//             const tenantData = {
//                 name: "Tenant name",
//                 address: "Tenant address",
//             };

//             const response = await request(app)
//                 .post("/tenants")
//                 .set("Cookie", [`accessToken=${managerToken}`])
//                 .send(tenantData);
//             expect(response.statusCode).toBe(403);

//             const tenantRepository = connection.getRepository(Tenants);
//             const tenants = await tenantRepository.find();

//             expect(tenants).toHaveLength(0);
//         });
//     });
// });
