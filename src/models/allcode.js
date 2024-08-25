"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        static associate(models) {
            // ForeignKey: tham chieu den khoa chinh cua ban khac
            // 1 Allcode co the lien ket voi nhieu ban ghi User => lien ket 1-n
            Allcode.hasMany(models.User, {
                foreignKey: "positionId", // FK cua bang User la "positionId"
                as: "positionData",
            });
            Allcode.hasMany(models.User, {
                foreignKey: "gender",
                as: "genderData",
            });

            Allcode.hasMany(models.Schedule, {
                foreignKey: "timeType",
                as: "timeTypeData",
            });
            Allcode.hasMany(models.Doctor_Infor, {
                foreignKey: "priceId",
                as: "priceTypeData",
            });
            Allcode.hasMany(models.Doctor_Infor, {
                foreignKey: "paymentID",
                as: "paymentTypeData",
            });
            Allcode.hasMany(models.Doctor_Infor, {
                foreignKey: "provinceId",
                as: "provinceTypeData",
            });
            Allcode.hasMany(models.Booking, {
                foreignKey: "timeType",
                as: "timeTypeDataPatient",
            });
        }
    }
    Allcode.init(
        {
            keyMap: DataTypes.STRING,
            type: DataTypes.STRING,
            valueEn: DataTypes.STRING,
            valueVi: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Allcode",
        }
    );
    return Allcode;
};
