import { Server } from "./common/server";
import routes from './routes';
import dotenv from "dotenv"
dotenv.config()

const server = new Server()
const port = process.env.PORT! 

server.configureDb()
    .then(() => {
        server.router(routes)
        server.listen(Number(port))
    })
    .catch((error) => {
        console.log(error)
        throw error
    })

export default server