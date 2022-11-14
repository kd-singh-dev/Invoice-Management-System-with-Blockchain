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
var cAdd = "0xd17b10e7bb964ff191b0180de329b571f1fbf606";
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

passportLocalMongoose = require("passport-local-mongoose");
app.use('/', express.static('public'));
var web3 = new Web3("https://goerli.infura.io/v3/a579372465184818bef2111003a87713");
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
    var t = await contract.methods._listInvoice("0x809C038a02791B18C06ed7947B2c74F41EC2700D").call();
    console.log(t);
    // var c = await contract.methods._rcList("0x809C038a02791B18C06ed7947B2c74F41EC2700D").call();
    var invoices = [
        {
            company_name: t.desc,
            amount: t.total,
            payment_address: t.payer,
            network: t.nework,
            status: t.status
        }
    ]

    res.render("invoice", { invoices: invoices });
});

app.get("/invoiceData", async function (req, res) {
    //const account = await window.ethereum.getAccounts();
    //console.log(account);
    const a = "0x809C038a02791B18C06ed7947B2c74F41EC2700D";
    try{
        console.log(req.query);
        const id = await contract.methods._invoiceCreate(a,req.query.productName1,"Dai",req.query.network,req.query.rate1,10,`${"0xD817F7BF414B9226431EeC0C8eAe11780B81A831"}`).call();
        console.log(id);    
    }catch(err){
        console.log(err);
    }
    
    res.redirect('/');
});




app.get("/generateInvoice", function (req, res) {
    res.render("generateInvoice");
});

app.get("/customers", function (req, res) {
	
    var customers = [
        {
            company_name: "shubham",
            email: "shubhamd@gmail.com",
            address: "sads",
            ac_no: "12/12/2022",
            business: "653578"
        },
        {
            company_name: "shubham",
            email: "shubhamd@gmail.com",
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