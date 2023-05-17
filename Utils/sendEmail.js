const nodemailer=require("nodemailer");

const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT, //Port is 465 because 465 is Gmail port 
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,//SMPT=simple mail transfer protocol
            pass:process.env.SMPT_PASSWORD,
        }
    })

    const mailOptions = {
        from :process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message,
    }
    await transporter.sendMail(mailOptions);
};


module.exports=sendEmail;