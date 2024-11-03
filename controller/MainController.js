const { User } = require("../model/model")
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { transporter } = require('../emailService/config')


class MainController {
    static async verify(req, res) {
        try {
            const { email } = req.query

            const user = await User.findOne({
                where: { email }    
            })
            if (!user) throw new Error("User not found")

            await User.update(
                { code: null, isVerify: true },
                { where: { email } }
            )

            res.send({ message: "User is verified" })
        } catch (err) {
            res.status(200).send({ error: err.message })
        }
    }

    static async register(req, res) {
        try {
            const { name, surname, email, age, password } = req.body;
            const us = await User.findOne({
                where: { email }
            });
            if (us) throw new Error(`${email} - already registered`);


            const hashedPass = bcrypt.hashSync(password, 10)
            const code = uuid.v4()
            const user = await User.create({ name, surname, email, age, password: hashedPass, code });

            const url = `http://localhost:8080/verify?email=${user.email}&token=${code}`
            const mailOptions = {
                from: 'hammkrtchyan7@gmail.com',
                to: user.email,
                subject: 'Check email',
                html: `Hii dear ${user.name}, an attempt has been made to register with your email on OutfitHub click <a href="${url}">here</a> to confirm.`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.log(error.message);
                console.log("Email sent: " + info.response);
            })

            res.send({ message: "User account is created" });
        } catch (error) {
            res.status(200).send({ error: error.message });
        }
    }

    static async login(req, res) {      
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error('Wrong Email')

            const comp = bcrypt.compareSync(password, user.password);
            if (!comp) throw new Error("Wrong password")
            if(!user.isVerify) throw new Error("You have not passed verification, please check your email address")

            const userData = {
                name: user.name,
                surname: user.surname,
                email: user.email,
                age: user.age,
                type: user.type,
                isVerify: user.isVerify
            }

            res.send(userData);
        } catch (err) {
            console.log(err);

            res.status(200).send({ error: err.message });
        }
    }

}

module.exports = MainController