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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
};
