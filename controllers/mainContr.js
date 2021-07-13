var path = require('path');
var fs = require('fs');
var pdfGen = require("pdf-creator-node");
const sgMail = require("@sendgrid/mail");
var emails=require('../models/emails')
sgMail.setApiKey('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');

exports.fileUpGet=function (req,res){
    res.render('fileUpload');
};
exports.saveFilePost=function (req,res){
    console.log(req.file)
    res.send('File saved successfully, to download hit http://localhost:3000/getFile/'+req.file.originalname);
}

exports.listUploadedFiles=function (req,res) {
    console.log("Listing files uploaded");
    console.log(__dirname)
    fs.readdir(path.join(__dirname, '../temp/fileUploads'), function (err, files) {
        if (err) {
            return res.end("Error occured searching files");
        }
        res.render("uploadedFiles",{
            files:files
        })
    });
}

exports.savePdfData=function (req,res){
    console.log("Request rec to generate the pdf");
    console.log(req.body)
    console.log(__dirname)
    var html = fs.readFileSync(path.join(__dirname, "../views/pdfOutLayout.html"), "utf8");

    var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Pdf Out: VenturePact</div>'
        }
    };

    var document = {
        html: html,
        data: {
            fname:req.body.fname,
            lname:req.body.lname,
            age:req.body.age,
            address:req.body.address
        },
        path: path.join(__dirname, `../temp/pdfFiles/${req.body.fname} ${req.body.lname}.pdf`),
        type: "",
    };

    pdfGen.create(document, options)
        .then((result) => {
            console.log("pdf gen success")
            console.log(result);
            res.download(path.join(__dirname, `../temp/pdfFiles/${req.body.fname} ${req.body.lname}.pdf`));
        })
        .catch((error) => {
            console.error(error);
            res.send("Error occured generating pdf")
        });
}

exports.listPdf=function (req,res) {
    console.log("Listing PDf uploaded");
    console.log(__dirname)
    fs.readdir(path.join(__dirname, '../temp/pdfFiles'), function (err, files) {
        if (err) {
            return res.end("Error occured searching files");
        }
        res.render("listPdfFiles",{
            files:files
        })
    });
}

exports.deliverEmail=function (req,res) {
    console.log("Request to send Email recieved");
    console.log(req.body);

    let message = {
        to: req.body.email, // list of receivers
        from: 'avinash.11804771@gmail.com', // sender address
        subject: "Hello Node js Test Email ✔", // Subject line
        text: "Hello This is your test mail", // plain text body
        html: `<b>${req.body.message}</b>`,
    };
    sgMail.send(message)
        .then(response=>{
            let nayaMail=new emails({
                reciever:req.body.email,
                message:req.body.message
            })
            nayaMail.save()
                .then(data=>{
                    res.redirect('/listEmails')
                })
                .catch(err=>{
                    res.send(err)
                })
        })
        .catch(err=>{
            console.log(err);
            res.send(err)
        })
}

exports.listEmails=function (req,res) {
    emails.find({}).lean()
        .then(data=>{
            res.render('listEmail',{
                emails:data,
                title: 'Express'
            })
        })
        .catch(err=>{
            res.send(err);
        })
}