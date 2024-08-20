"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Schedule.belongsTo(models.Allcode, {
                foreignKey: "timeType", //FK o ben A (timeType cua bang "Schedule")
                targetKey: "keyMap", // map voi kepMap cua bang "Allcode"
                as: "timeTypeData", // tra lai voi ten la "timeTypeData"
            });

            Schedule.belongsTo(models.User, {
                foreignKey: "doctorId", //FK o ben A (timeType cua bang "Schedule")
                targetKey: "id", // map voi kepMap cua bang "Allcode"
                as: "doctorData", // tra lai voi ten la "timeTypeData"
            });
        }
    }
    Schedule.init(
        {
            currentNumber: DataTypes.INTEGER,
            maxNumber: DataTypes.INTEGER,
            date: DataTypes.STRING,
            timeType: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Schedule",
        }
    );
    return Schedule;
};
