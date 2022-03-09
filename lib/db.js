const { Sequelize, Model, DataTypes } = require('sequelize');

const { DB_NAME, DB_PASSWORD, DB_USER,DB_PORT,HOST } = process.env
var sequelize = new Sequelize(DB_NAME, DB_USER,DB_PASSWORD, {
    host: DB_HOST,
    dialect: "mysql",
    port: 3306,
    define: {
        paranoid: true
    }
});

sequelize.authenticate().then(()=>{
    console.log("connected");
}).catch(err=>{
    console.log(err);
})

module.exports={sequelize};
