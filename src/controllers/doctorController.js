import db from "../models/index";
import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        let response = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(response);
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            errCode: -1,
            message: "Error when getting top doctor from server",
        });
    }
};

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (err) {
        console.log("Error from server: ", err);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error post infor doctor",
        });
    }
};

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorById(req.query.id);
        return res.status(200).json(infor);
    } catch (err) {
        console.log("Error when geting doctor detail by ID: ", err);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error when geting doctor detail by ID",
        });
    }
};

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(infor);
    } catch (err) {
        console.log("Error when bulk create schedule: ", err);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error when bulk create schedule",
        });
    }
};

let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(
            req.query.doctorId,
            req.query.date
        );
        return res.status(200).json(infor);
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error when get schedule by date",
        });
    }
};

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    postInforDoctor: postInforDoctor,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
};
