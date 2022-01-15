require('dotenv').config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    localStrategy = require("passport-local");
var port = process.env.PORT || 3001;
//import required modles

//required modules ends

passportLocalMongoose = require("passport-local-mongoose");
app.use('/', express.static('public'));

///mongoose and express setup
mongoose
    .connect(process.env.Mongo_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log("fail");
        console.log(err);
    });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//routes

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/login", function (req, res) {
    res.render("login");
});


app.get("/invoice", function (req, res) {
    //to do
    // sort via date and add a tab to search staus
    var invoices = [
        {
            company_name:"karan",
            email:"karandchandi@gmail.com",
        payment_address:"sads",
        invoice_date:"12/12/2022",
        status:"paid"
    },
    {
        company_name:"karan",
        email:"karandchandi@gmail.com",
        payment_address:"sads",
        invoice_date:"12/12/2022",
        status: "not yet"
    }
]

res.render("invoice",{invoices:invoices});
});



app.get("/invoiceView", function (req, res) {
    var product = [
        {
            productName: "Karan",
                    productQuantity: "productQuantity",
                    productRate: "",
                    tax: "",
                    discount: "",
                    lineTotal: ""
        },
        {
            productName: "",
                    productQuantity: "",
                    productRate: "",
                    tax: "",
                    discount: "",
                    lineTotal: ""
        }
    ];
    res.render("invoiceView", {
        ownerCompanyName: "ownerCompanyName", ownerCompanyEmail: "ownerCompanyEmail", CompanyName: "CompanyName",
        CompanyEmail: "CompanyEmail",
        invoiceDate: "12/12/2022",
        lastDate: "lastDate",
        paymentOption: "1",
        product: product,

        subTotal: "subTotal",
        totalDiscount: "totalDiscount",
        totalAmount: "totalAmount"

    });
});



app.get("/generateInvoice", function (req, res) {
    res.render("generateInvoice");
});



// *************************** Review ****************************
app.listen(port, function () {
    console.log("server is on");
});