module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        name: Sequelize.STRING,
        surname: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        password: Sequelize.STRING,
        code: Sequelize.STRING,
        type:{
            type:Sequelize.INTEGER,
            defaultValue: 0
        },
        isVerify: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });
    return User;
};
