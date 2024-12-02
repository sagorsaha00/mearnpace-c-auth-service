import { AuthControllers } from './../controllers/AuthControllers';
import  express from "express";
 

const router = express.Router();
const authControllers = new AuthControllers();

router.post('/register', (res,req) =>  authControllers.register(res,req))

 export default router;