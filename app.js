const { isWindows } = require("nodemon/lib/utils");
const Web3 = require("web3");
require('dotenv').config();
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    mongoose = require("mongoose"),
    localStrategy = require("passport-local");
var port = process.env.PORT || 3001;
var cAdd = "0xbda6Bcc1e95601493F15A3DFA187Bd41A5832f3d";
var abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "adr",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "email",
                "type": "string"
            }
        ],
        "name": "_createList",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_tx",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_desc",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_method",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_network",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_val",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_total",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_pay",
                "type": "address"
            }
        ],
        "name": "_invoiceCreate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "_listCompany",
        "outputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_email",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "_listInvoice",
        "outputs": [
            {
                "internalType": "string",
                "name": "txNum",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "desc",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "status",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "method",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "nework",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "total",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "val",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "bal",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "payer",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "_rcList",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "email",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "payD",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "email",
                "type": "string"
            }
        ],
        "name": "_registerCompany",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

//import required modles

//required modules ends

passportLocalMongoose = require("passport-local-mongoose");
app.use('/', express.static('public'));
var web3 = new Web3("https://rinkeby.infura.io/v3/e8d5474e44074334b5f281433b5c3b7c");
const contract = new web3.eth.Contract(abi,cAdd);
///mongoose and express setup

mongoose
    .connect("mongodb+srv://dbsmit:DBSMIT@cluster0.ff23x.mongodb.net/InvoiceOnBlockchain?retryWrites=true&w=majority", {
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


app.get("/invoice", async function (req, res) {
    //to do
    // sort via date and add a tab to search staus
    var t = await contract.methods._listInvoice("0x57fde39ffb811bebd71d3c72ff12536df58892f52e11d370d90061b826a4ce96").call();
    console.log(t);
    var c = await contract.methods._rcList("0x809C038a02791B18C06ed7947B2c74F41EC2700D").call();
    var invoices = [
        {
            company_name: c.name,
            email: c.email,
            payment_address: t.payer,
            invoice_date: "12/12/2022",
            status: t.status
        },
        {
            company_name: "karan",
            email: "karandchandi@gmail.com",
            payment_address: "sads",
            invoice_date: "12/12/2022",
            status: "not yet"
        }
    ]

    res.render("invoice", { invoices: invoices });
});

app.get("/invoiceData", function (req, res) {
    console.log(req.query);
    res.redirect('/');
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

app.get("/customers", function (req, res) {
    var customers = [
        {
            company_name: "karan",
            email: "karandchandi@gmail.com",
            address: "sads",
            ac_no: "12/12/2022",
            business: "653578"
        },
        {
            company_name: "karan",
            email: "karandchandi@gmail.com",
            address: "rourkela",
            ac_no: "12/12/2022",
            business: "653578"
        }
    ]

    res.render("customers", { customers: customers });
});



// *************************** Review ****************************
app.listen(port, function () {
    console.log("server is on");
});