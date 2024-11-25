import app from "./app";
import { Config } from "./config";

const startserver = () =>  {
    const PORT = Config.PORT;

 try {
    app.listen(PORT, () => {
        console.log('server is running on port', PORT);
    })
 } catch (error) {
    console.log(error);
 }
}
startserver()