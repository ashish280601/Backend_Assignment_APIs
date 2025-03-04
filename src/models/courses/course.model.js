import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const CourseModel = sequelize.define("Course", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courseCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    duration: {
        type: DataTypes.STRING,  // e.g., "4 years"
        allowNull: false
    },
    tuitionFees: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    overview: {
        type: DataTypes.TEXT
    },
    eligibilityCriteria: {
        type: DataTypes.JSONB 
    },
    courseFeatures: {
        type: DataTypes.JSONB
    },
    applicationDeadline: {
        type: DataTypes.DATE
    },
    modeOfStudy: {
        type: DataTypes.ENUM("Full-time", "Part-time", "Online", "Hybrid")
    },
    totalSeats: {
        type: DataTypes.INTEGER
    },
    accreditation: {
        type: DataTypes.STRING
    },
    faculty: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    careerOpportunities: {
        type: DataTypes.TEXT
    },
    courseBrochureUrl: {
        type: DataTypes.STRING
    },
    collegeId: {
        type: DataTypes.UUID,
        references: {
            model: "college_details", 
            key: "id"
        },
        onDelete: "CASCADE"
    }
}, {
    timestamps: true,  
    tableName: "courses" 
});

export default CourseModel;
