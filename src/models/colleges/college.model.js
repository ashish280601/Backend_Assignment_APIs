import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const CollegeModel = sequelize.define("College_Details",{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    history: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    vision: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rankings: {
        type: DataTypes.JSONB, 
        allowNull: false
    },
    availableIntakes: {
        type: DataTypes.JSONB, 
        allowNull: false
    },
    coursesOffered: {
        type: DataTypes.JSONB, 
        allowNull: false
    },
    contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    contactPhone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    accreditation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    establishedYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mediaLibrary: {
        type: DataTypes.JSONB,
        allowNull: true
    },
    applicationFee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    eligibilityCriteria: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    features: {
        type: DataTypes.JSONB, 
        allowNull: true
    }
},{
    tableName: "college_details",
    freezeTableName: true,
    timestamps: true
});

export default CollegeModel
