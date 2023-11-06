import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('users',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    image:{
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    },
    url:{
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    },
    no_hp:{
        type: DataTypes.INTEGER,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    },
    alamat:{
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    },
    tgl_lahir:{
        type: DataTypes.DATE,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    }

},{
    freezeTableName: true
});

export default Users;