
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};
var firebaseConfig = {
    apiKey: "AIzaSyA-u_frYotDqet6gv_w56OUpf6BkcaPdTQ",
    authDomain: "automator-db.firebaseapp.com",
    databaseURL: "https://automator-db.firebaseio.com",
    storageBucket: "automator-db.appspot.com"
};

var interval = setInterval(function () {
    if (document.readyState === 'complete') {
        clearInterval(interval);
        console.log('Essintial Scripts loaded');
        console.log('Starting execution..');
        setupFirebase();
        refreshOnTime(13, 58, 02);
        registerOnTime(13, 59, 58);
        registerOnTime(14, 00, 00);
        registerOnTime(14, 00, 05);
        registerOnTime(14, 00, 20);
        registerOnTime(14, 00, 45);
        sendDistribution(14, 05, 00)
        sleep(5000).then(() => {
            hasRegLoaded();
        });

    }
}, 100);

var database = null;
var clid = generate_random_data1(45);
var pnum = generatePhoneNumber();

function generatePhoneNumber() {
    let code = ["078", "077", "076", "075", "079"];
    let pre = ["0", "1", "2", "3"];
    let pnum = code[getRandomInt(0, code.length - 1)] + pre[getRandomInt(0, pre.length - 1)] + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9);
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

function registerOnTime(hours, minutes, seconds) {
    const f = function () {
        (function loop() {
            var now = new Date();
            if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === seconds) {
                register();
            }
            now = new Date();
            var delay = 400 - (now % 400);
            setTimeout(loop, delay);
        })();
    }
    f();
}

function sendDistribution(hours, minutes, seconds) {
    const f = function () {
        (function loop() {
            var now = new Date();
            if (now.getHours() === hours && now.getMinutes() === minutes && now.getSeconds() === seconds) {
                addOfficeToFirebase();
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

function register() {
    var response = grecaptcha.getResponse();
    var counter = 0;
    

    while (counter < 1) {
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
                }
                else {
                    console.log(results);
                }
            },
            error: function (results) {
                console.log('AJAX ERROR:' + results);
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
    try {
        register();
    }
    catch (error) {
        reloadPage();
    }
}

function setupFirebase() {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log('Firebase is configed');
}
