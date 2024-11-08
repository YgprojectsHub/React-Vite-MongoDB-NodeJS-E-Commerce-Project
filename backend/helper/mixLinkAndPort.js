dotenv.config();
import dotenv from "dotenv"

export const serverBaseLink = () => { return `${process.env.BASE_LINK}${process.env.PORT}/` }
