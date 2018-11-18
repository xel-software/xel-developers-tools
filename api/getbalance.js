function xmlhttpPost(strURL) {
var xmlHttpReq = false;
var self = this;

self.xmlHttpReq = new XMLHttpRequest();
self.xmlHttpReq.open(`POST`, strURL , true);
self.xmlHttpReq.setRequestHeader(`Content-Type`, `application/x-www-form-urlencoded`);
self.xmlHttpReq.onreadystatechange = function() {
if (self.xmlHttpReq.readyState == 4) {
updatepage(self.xmlHttpReq.responseText);
}
}
self.xmlHttpReq.send(getquerystring());
}

function getquerystring() {
var form     = document.forms[`f1`];
var xelaccount = form.xelaccount.value;

//************* Here’s the get balance call to the XEL, API: *************
qstr = `requestType=getBalance&account=` + escape(xelaccount);

return qstr;
}
var rows;
$.each(request, function(key, data) {
        rows += '<tr>';
        rows += '<td>'+key+'</td>';
        rows += '<td>'+data+'</td>';
        rows += '</tr>';
      });
function updatepage(str){
document.getElementById("result").innerHTML = str;
}
