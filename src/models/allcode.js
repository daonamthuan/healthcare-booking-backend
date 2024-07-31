"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        static associate(models) {
            // ForeignKey: tham chieu den khoa chinh cua ban khac
            // 1 Allcode co the lien ket voi nhieu ban ghi User => lien ket 1-n
            Allcode.hasMany(models.User, {
                foreignKey: "positionId", // FR cua bang User la "positionId"
                as: "positionData",
            });
            Allcode.hasMany(models.User, {
                foreignKey: "gender",
                as: "genderData",
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
