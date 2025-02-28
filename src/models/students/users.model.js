// inbuilt imports package
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

// customs import package
import withTimestamps from "../../utils/timestampHelper.js";

const userSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    opt: {
        type: DataTypes.NUMBER,
        allowNull: true,
    },
    registrationType: {
        type: DataTypes.ENUM("Email", "Google", "Apple"),
        allowNull: false,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    appleId: {
        type: DataTypes.STRING,
        allowNull: true,  
    }
}

const Users = sequelize.define("Users", withTimestamps(userSchema));

export default Users;

