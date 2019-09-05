const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var interval = setInterval(function () {
    if (document.readyState === 'complete') {
        clearInterval(interval);
        console.log('Essintial Scripts loaded');
        console.log('Starting execution..');
        refreshOnTime(13, 58, 02);
        registerOnTime(13, 59, 56, 15);
        registerOnTime(13, 59, 58, 15);
        registerOnTime(13, 59, 59, 15);
        registerOnTime(14, 00, 00, 10);
        registerOnTime(14, 00, 05, 10);
        registerOnTime(14, 00, 20, 5);
        registerOnTime(14, 00, 45, 5);
        sendDistribution(14, 02, 30);
        sleep(5000).then(() => {
            hasRegLoaded();
        });

        sleep(20000).then(()=> {
            window.stop();
        });
    }
}, 100);

var clid = generate_random_data1(45);
var pnum = generatePhoneNumber();
var isRegOnline = false;

function generatePhoneNumber() {
    let code = ["078", "077", "076", "075", "079"];
    let pre = ["0", "1", "2", "3"];
    let pnum = code[getRandomInt(0, code.length - 1)] + pre[getRandomInt(0, pre.length - 1)] + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9);
    return pnum;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function refreshOnTime(hours, minutes, seconds) {
    const f = function () {
        (function loop() {
            var now = new Date();
            if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === seconds) {
                reloadPage();
            }
            now = new Date();
            var delay = 80 - (now % 80);
            setTimeout(loop, delay);
        })();
    };
    f();
}

function registerOnTime(hours, minutes, seconds, tries) {
    const f = function () {
        (function loop() {
            var now = new Date();
            if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === seconds) {
                register(tries);
            }
            now = new Date();
            var delay = 400 - (now % 400);
            setTimeout(loop, delay);
        })();
    }
    f();
}

function stopExecution() {
    
}

function sendDistribution(hours, minutes, seconds) {
    const f = function () {
        (function loop() {
            var now = new Date();
            if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === seconds) {
                addOfficeToFirebase();
                sleep(10000).then(()=> {
                    throw new Error("Something went badly wrong!");
                });
            }
            now = new Date();
            var delay = 999 - (now % 999);
            setTimeout(loop, delay);
        })();
    }
    f();
}

function reloadPage() {
    location.reload();
}

function generate_random_data1(size) {
    var chars = 'abcdefghijklmnopqrstuvwxyz4732847159116123'.split('');
    var len = chars.length;
    var random_data = [];

    while (size--) {
        random_data.push(chars[Math.random() * len | 0]);
    }

    return random_data.join('');
}

function register(count) {
    var response = grecaptcha.getResponse();
    var counter = 0;
    while (counter < count) {
        jQuery.ajax({
            url: "https://reg.nid-moi.gov.iq/reg",
            method: "post",
            data: {
                "name": (name),
                "phone": (pnum),
                "fNum": (faNum),
                "office": (officeNum),
                "shift": 1,
                "bookNo": (bookNum),
                "clientId": (clid),
                "captcha": (response)
            },
            crossDomain: true,
            success: function (results) {
                if (results.success == true) {
                    $.extend(data, results);
                    console.log(data);
                    addRecordToFirebase();
                    secondRoundEligible = false
                }
                else {
                    console.log(results);
                }
            },
            error: function(xhr, status, errorText) {
                console.log(xhr);
                console.log(status);
                console.log(errorText);
            }

        });
        counter = counter + 1;
    }
}

function addRecordToFirebase() {
    var eldate = getEldate();
    firebase.database().ref(eldate + '/' + browserID).set({
        name: data.name,
        fnum: data.fnum,
        office: data.office,
        id: data.data.id,
        date: data.data.date,
        vmID: vmID,
        browsertovmID: browsertovmID
    });
}

function addOfficeToFirebase() {
    var now = new Date();
    var day = now.getDay();
    if (day == 2 || day == 5) {
        firebase.database().ref('Distribution/' + vmID + '/' + browsertovmID).set({
            Office: officeNum
        });
    }

}

function getEldate() {
    Date.prototype.yyyymmdd = function () {
        var yyyy = this.getFullYear().toString();
        var mm = (this.getMonth() + 1).toString();
        var dd = this.getDate().toString();
        return yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + (dd[1] ? dd : "0" + dd[0]);
    };
    var date = new Date();
    return date.yyyymmdd();
}

function hasRegLoaded() {
    if (window.location.href == "https://reg.nid-moi.gov.iq/") {
        try {
            register(1);
        }
        catch (error) {
            reloadPage();
        }
    }
    else {
        console.log("NOT ON REG, ABORTING")
    }
}
