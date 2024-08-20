import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(infor);
    } catch (err) {
        console.log(err);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error when post booking appointment",
        });
    }
};

module.exports = {
    postBookAppointment: postBookAppointment,
};
