/* getters */
function getService() {
    //return document.getElementById("serviceType").value;
    return $("#serviceType option:selected").text();
}

function getDate() {
    return document.getElementById("date").value;
}

function getHours() {
    return document.getElementById("hours").value;
}

function getMins() {
    return document.getElementById("mins").value;
}

function getEmailCheckbox() {
    return document.getElementById("emailCheckbox").checked;
}

function getPhoneCheckbox() {
    return document.getElementById("phoneCheckbox").checked;
}

function getPolicyCheckbox() {
    return document.getElementById("policyCheckbox").checked;
}

function getNo() {
    return document.getElementById("no").value;
}

/* functions to check date validity */
function checkDatePattern(text) {
    let pattern = /^\d{2}\/\d{2}\/\d{4}$/;
    return result = pattern.test(text);
}

function checkDateIsValid(d) {
    return !isNaN(d.getTime());
}

function checkDateIsCorrect(text, d) {
    return (d.getMonth() + 1) == text.split("/")[0];
}

/* functions to check time validity */
function checkHoursIsValid(num) {
    if (num >= 0 && num < 24)
        return true;
    return false;
}

function checkMinsIsValid(num) {
    if (num >= 0 && num < 60)
        return true;
    return false;
}

/* functions to check time validity */
function checkNoOfCancelation(num) {
    if (num > 0 && num < ($("tbody > tr").length - 1))
        return true;
    return false;
}

/* send data with ajax */
function sendData(data) {
    var jsonText = JSON.stringify(data);

    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    $.post("https://jsonblob.com/api/jsonBlob", jsonText, function (data, textStatus, request) {
        var location = request.getResponseHeader('location');
        getData(location.replace("http", "https"));
    });
}

function sendData1(data) {
    var jsonText = JSON.stringify(data);
    $.ajax({
        url: "https://jsonblob.com/api/jsonBlob",
        type: 'post',
        data: jsonText,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        dataType: 'json',
        success: function (data, textStatus, request) {
            console.log(request.getResponseHeader('location'));
        },
        error: function (request, textStatus, errorThrown) {
            console.log(request.getResponseHeader('location'));
        }
    });
}

/* get data with ajax */
function getData(location) {

    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    $.get(location, function (data, textStatus, request) {
        updateTable(request.responseText);
    });
}

function getData1(location) {
    $.ajax({
        url: location,
        type: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        success: function (data, textStatus, request) {
            updateTable(request.responseText);
        },
        error: function (request, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}

/* add new reservation to table */
function updateTable(dataJson) {
    const jsonObj = JSON.parse(dataJson);
    table = $(".responceTable > tbody");
    table.append("<tr id=\"" + jsonObj.no + "\">" + "<td>" + jsonObj.no + "</td>" +
    "<td>" + jsonObj.date + "</td>" +
    "<td>" + jsonObj.time + "</td>" +
    "<td>" + jsonObj.serviceType + "</td>" + 
    "<td>" + jsonObj.email + "</td>" + 
    "<td>" + jsonObj.phone + "</td>" + "</tr>");
}

/* delete service of table*/
function deleteServiceOfTable(no) {
    $("#" + no).remove();
}

/* insert new element, set new style */
function updatePage() {
    $("form[name=\"registrationForm\"]").hide();
    $("#firstArticle").append("<p>Thank you! Your form was accepted and your reservations will be updated.</p>");
    $("p").css("display", "inline");
    $("#firstArticle").append("<img src=\"heart.png\" alt=\"thanks\" id=\"heart\">");
    $("#heart").css({"width":"20px", "height":"20px"});
}

/* upload all document */
$(document).ready(function () {

    $('#date').keyup(function () {
        let text = getDate();
        let d = new Date(text);

        if ((checkDatePattern(text) && checkDateIsValid(d) && checkDateIsCorrect(text, d))) {
            $("#errorMsgDate").hide();
        }
        else {
            //$("#errorMsgDate").show().fadeOut('slow');
            $("#errorMsgDate").show();
        }
    });

    $('#hours').keyup(function () {
        let text = getHours();

        if (checkHoursIsValid(text)) {
            $("#errorMsgTime").hide();
        }
        else {
            //$("#errorMsgDate").show().fadeOut('slow');
            $("#errorMsgTime").show();
        }
    });

    $('#mins').keyup(function () {
        let text = getMins();

        if (checkMinsIsValid(text)) {
            $("#errorMsgTime").hide();
        }
        else {
            //$("#errorMsgDate").show().fadeOut('slow');
            $("#errorMsgTime").show();
        }
    });

    $('#no').keyup(function () {
        let text = getNo();

        if (checkNoOfCancelation(text)) {
            $("#errorMsgNo").hide();
        }
        else {
            //$("#errorMsgNo").show().fadeOut('slow');
            $("#errorMsgNo").show();
        }
    });

    $('#submit').click(function () {

        $("#errorMsg").text("");

        let service = getService();
        let date = getDate();
        let d = new Date(date);
        let hours = getHours();
        let mins = getMins();
        let email = getEmailCheckbox();
        let phone = getPhoneCheckbox();
        let policy = getPolicyCheckbox();

        if (service == "Select service") {
            $("#errorMsg").text("Please select a service.");
            return;
        }

        if (!(checkDatePattern(date) && checkDateIsValid(d) && checkDateIsCorrect(date, d))) {
            $("#errorMsg").text("Please enter valid date.");
            return;
        }

        if (!checkHoursIsValid(hours) || hours == "") {
            $("#errorMsg").text("Please enter valid hours.");
            return;
        }

        if (!checkMinsIsValid(mins) || mins == "") {
            $("#errorMsg").text("Please enter valid minutes.");
            return;
        }

        if (policy != true) {
            $("#errorMsg").text("Please accept our policy.");
            return;
        }

        let time = hours + ":" + mins;
        let numberInTable = $("tbody > tr").length - 1;

        var reservation = {
            no: numberInTable,
            date: d.toLocaleDateString(),
            time: time,
            serviceType: service,
            email: email,
            phone: phone
        }

        sendData(reservation);
        updatePage();
    });

    $("#cancel").click(function () {
        var no = getNo();
        deleteServiceOfTable(no);
    });
});
