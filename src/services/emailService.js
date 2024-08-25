require("dotenv").config();
import nodemailer from "nodemailer";

let getBodyHTMLEmail = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn đã nhận email này vì đã đặt lịch khám bệnh online tại trang web của chúng tôi</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và 
        hoàn tất thủ tục đặt lịch khám bệnh tại trang web của chúng tôi!</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank">Nhấn vào đây</a>
        </div>
        <p>Xin chân thành cảm ơn</p>`;
    } else if (dataSend.language === "en") {
        result = `<h3>Dear ${dataSend.patientName},</h3>
        <p>You have received this email because you have booked an appointment online at our website.</p>
        <p>Appointment information: </p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If the above information is correct, please click on the link below to confirm and complete 
        the procedure to make an appointment on our website!</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <p>Best regard.</p>`;
    }

    return result;
};

let sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Dao Nam Thuan 👻" test nodemailer!', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmail(dataSend),
    });
};

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn đã nhận email này vì đã sử dụng dịch vụ khám bệnh từ chúng tôi</p>
        <p>Thông tin khám bệnh: </p>
        <div><b>Thời gian: ${dataSend.timeTypeData.valueVi} - ${dataSend.dateData.valueVi}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Kết quả khám bệnh và đơn thuốc được gửi trong file đính kèm</p>
        
        <p>Xin chân thành cảm ơn!</p>`;
    } else if (dataSend.language === "en") {
        result = `<h3>Dear ${dataSend.patientName},</h3>
        <p>You have received this email because you have used examination service at our website.</p>
        <p>Appointment information: </p>
        <div><b>Time: ${dataSend.timeTypeData.valueEn} - ${dataSend.dateData.valueEn}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>The examination results and remedy are sent in attached files.!</p>
       
        <p>Best regard.</p>`;
    }

    return result;
};

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let info = await transporter.sendMail({
                from: '"Dao Nam Thuan 👻" test nodemailer!', // sender address
                to: dataSend.email, // list of receivers
                subject: "Hóa đơn và kết quả khám bệnh", // Subject line
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `ket-qua-kham-benh.jpg`,
                        content: dataSend.imageBase64.split("base64,")[1],
                        encoding: "base64",
                    },
                ],
            });

            resolve();
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
};
