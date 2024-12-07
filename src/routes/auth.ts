import  express from "express";
import { AuthControllers } from './../controllers/AuthControllers';

 

const router = express.Router();
const authControllers = new AuthControllers();

router.post('/register', (res,req) =>  authControllers.register(res,req))

 export default router;