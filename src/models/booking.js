"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Booking.belongsTo(models.User, {
                foreignKey: "patientId", //FK o ben A (timeType cua bang "Schedule")
                targetKey: "id", // map voi kepMap cua bang "Allcode"
                as: "patientData", // tra lai voi ten la "timeTypeData"
            });

            Booking.belongsTo(models.Allcode, {
                foreignKey: "timeType", //FK o ben A (timeType cua bang "Schedule")
                targetKey: "keyMap", // map voi kepMap cua bang "Allcode"
                as: "timeTypeDataPatient", // tra lai voi ten la "timeTypeData"
            });
        }
    }
    Booking.init(
        {
            // id: DataTypes.INTEGER, (khong can khai bao PRIMARY KEY)
            statusId: DataTypes.STRING,
            doctorId: DataTypes.INTEGER,
            patientId: DataTypes.INTEGER,
            date: DataTypes.STRING,
            timeType: DataTypes.STRING,
            token: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Booking",
        }
    );
    return Booking;
};
