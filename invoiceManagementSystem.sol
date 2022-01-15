// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Invoice {
    struct Company {
        string _name;
        string _email;

    }

    struct invoicePay {
        string txNum;
        string desc;
        string status;
        string method; // currency
        string nework; // network 
        uint total;
        uint val;
        uint bal;
        address payer;
    }
    struct RegisterC {
        string name;
        string email;
        address payD;
        
    }
    mapping (address => RegisterC) public _rcList;
    mapping (address => Company) public _listCompany;
    mapping (string => invoicePay) public _listInvoice; 
    function _registerCompany(string memory name,string memory email) public {
        Company memory c;
            c._name = name;
            c._email = email;
            _listCompany[msg.sender] = c;
    }

    function _createList(string memory name,address adr,string memory email) public {
            RegisterC memory rc;
            rc.name = name;
            rc.email = email;
            rc.payD = adr;
            _rcList[msg.sender] = rc;
    }

    function _invoiceCreate(string memory _tx,string memory _desc,string memory _method,string memory _network,uint _val,uint _total,address _pay) public {
        invoicePay memory ic;
        ic.txNum = _tx;
        ic.desc = _desc;
        ic.method = _method; // currency
        ic.nework = _network; // network 
        ic.payer = _pay; 
        ic.total = _total;
        ic.val = _val;
        ic.bal = _total - _val;
        if(ic.bal == ic.total) {
            ic.status = "unpaid";
        }else if(ic.bal < ic.total && ic.bal != 0) {
            ic.status = "partial";
        }
        else{
            ic.status = "paid";
        }
        _listInvoice[_tx] = ic;
    }
}