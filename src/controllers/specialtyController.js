import SpecialtyService from "../services/specialtyService";

let createSpecialty = async (req, res) => {
    try {
        let data = await SpecialtyService.createSpecialty(req.body);
        return res.status(200).json(data);
    } catch (err) {
        console.log("Get all code err: ", err);
        return res.status(200).json({ errCode: -1, errMessage: "Error from server" });
    }
};

let getAllSpecialty = async (req, res) => {
    try {
        let data = await SpecialtyService.getAllSpecialty();
        return res.status(200).json(data);
    } catch (err) {
        console.log("Get all code err: ", err);
        return res.status(200).json({ errCode: -1, errMessage: "Error from server" });
    }
};

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
};
