import { where } from "sequelize";
import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

    return result;
};

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.date || !data.timeType || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                });
                // upsert patient
                const user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                    },
                });

                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType,
                        },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                        },
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "post book appointment successfully!",
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = "S2";
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Verify book appointment successfully!",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "An appointment doesn't exist or has been activated!",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
};
