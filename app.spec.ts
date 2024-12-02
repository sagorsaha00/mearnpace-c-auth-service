
import app from "./src/app";
import CalculateDiscount from "./src/utils";
import  request from "supertest";
describe.skip("App", () => {
    it('should be true', () => {
        const discount = CalculateDiscount(100,10)
         expect(discount).toBe(10)

    
})
it('should be true with status 200', async () => {
    const responce = await request(app).get('/').send();
    expect(responce.statusCode).toBe(200)
 })
});


