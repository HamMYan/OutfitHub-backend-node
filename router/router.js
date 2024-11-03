const router = require('express').Router();
const passport = require('passport');
const MainController = require('../controller/MainController');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require('../model/model');
const { isLogin, isNotLogin } = require('../middleware/middlware');

router.get('/', isLogin, (req, res) => {
    res.send({ message: "Welcome" });
});
router.post('/getText', (req, res) => {
    res.send({ text: req.body.text })
})

router.get('/verify', MainController.verify);
router.post('/register', isLogin, MainController.register);

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return done(null, false, { message: "Incorrect email" });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        const userData = {
            name: user.name,
            surname: user.surname,
            email: user.email,
            age: user.age,
            type: user.type,
            isVerify: user.isVerify
        }
        done(null, userData);
    } catch (err) {
        done(err);
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(200).json({ error: err.message });
        }
        if (!user) {
            return res.status(200).json({ error: info.message }); 
        }
        
        req.login(user, (err) => {
            if (err) {
                return res.status(200).json({ error: "Login failed" });
            }
            return res.json({ message: "Login successful", user: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                age: user.age,
                type: user.type,
                isVerify: user.isVerify,
                ussss: req.user
            }});

        });

    })(req, res, next);
    
});

    
module.exports = router;
