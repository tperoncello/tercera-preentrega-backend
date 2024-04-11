import dotenv from "dotenv";

dotenv.config()

export default {
    app:{
        persistence:process.env.PERSISTENCE
    },
    nodemailer: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    },
}