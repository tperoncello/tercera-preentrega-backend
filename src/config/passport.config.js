import passport from "passport";
import local from 'passport-local';
import passportJWT from 'passport-jwt';
import { Strategy as GitHubStrategy } from 'passport-github2'
import userModel from "../dao/models/user.model.js";
import cartModel from "../dao/models/cart.model.js";
import { crateHash, isValidPassword, extractCookie, JWT_PRIVATE_KEY, generateToken } from "../utils.js";
import logger from "../logger.js";

const localStrategy = local.Strategy;
const JWTStrategy = passportJWT.Strategy

const initializePassport = () => {
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField:'email'
    }, async(req, username, password, done) => {
        const{firstName, lastName, email, age, role } = req.body
        try{
            const user = await userModel.findOne({ email: username})
            if (user) {
                return done(null, false)
            }
            const cartNewUser = await cartModel.create({})
            const newUser = {
                firstName, lastName, email, age, password:crateHash(password), cart: cartNewUser._id,
                role
            }

            const result = await userModel.create(newUser)
            return done(null, result)

        } catch(err) {
            logger.error("initializePassport: ", err.message);
            return done(err)
        }
    }))

    passport.use('login', new localStrategy({
        usernameField: 'email',
    }, async(username, password, done) => {
        try{
            const user = await userModel.findOne({ email: username})
            if (!user) return done(null, false)
            if (!isValidPassword(user, password)) return done(null, false)
            const token = generateToken(user)
            user.token = token
            return done(null, user)
        }catch(err){
            logger.error("passportlogin: ", err.message);
            return done(err)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.7c072ec6d6d9bc50',
        clientSecret: '6290637406d668a37b9e8d5449c5b3d3027d0514',
        callbackURL: 'http://localhost:8080/session/githubcallback',
        scope: ["user:email"],
		passReqToCallback: true,
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;

            const existingUser = await userModel.findOne({ email });

            if (existingUser) {
                const token = generateToken(existingUser);

                existingUser.token = token;

                req.session.cartID = existingUser.cart;
                return done(null, existingUser);
            }

            const newCart = new cartModel({ userEmail: email, products: [] });

            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: "GitHub User",
                email: email,
                password: "github-user-password",
                role: "user",
                cart: newCart,
            });

            await newCart.save();
            const token = generateToken(newUser);

            newUser.token = token;


            return done(null, newUser);
        } catch (error) {
            console.error("Error logging into GitHub:", error);
            return done(error);
        }
    }
)
);

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.use('current', new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            const user = jwt_payload; // Accede directamente a la propiedad 'user'
            console.log('current user: ', user);
    
            if (!user) {
                return done(null, false);
            }
    
            return done(null, user);
        } catch (err) {
            logger.error("passport current: ", err.message);
            return done(err, false);
        }
    }));
    
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport