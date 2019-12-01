const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

var interval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(interval);
    console.log("Essintial Scripts loaded");
    console.log("Starting execution..");
    console.clear();
    statusRed();
    decideCaptcha(13, 59, 50);
    registerOnTime(13, 59, 56, 5);
    registerOnTime(13, 59, 57, 5);
    registerOnTime(13, 59, 58, 5);
    registerOnTime(13, 59, 59, 10);
    registerOnTime(14, 00, 00, 10);
    registerOnTime(14, 00, 05, 5);
    sleep(5000).then(() => {
      hasRegLoaded();
    });
    firebaseReady();
  }
}, 100);

var clid = generate_random_data1(45);
var pnum = generatePhoneNumber();
var refresh = false;
var status = "";
var theError = "";
var red = true;
var waitReg = true;
var lateReg = false;
var recordMore = true;
var response = null;
var snapshot = null;
var reCaptchaToken = null;
var shift = 1;
var successTime = "";

function statusRed() {
  console.log("RED STATUS INIT");
  var now = new Date();
  if (
    (now.getHours() == 14 && now.getMinutes() >= 15) ||
    (now.getHours() >= 15 && red == true)
  ) {
    window.red = false;
    console.log("STARTED SOLVING CAPTCHA");
    $(".captchaButton").click();
    var redBooking = setInterval(function() {
      if (grecaptcha.getResponse() != "") {
        sleep(5000).then(() => {
          register(1);
          clearInterval(redBooking);
        });
      }
    }, 5000);
  }
}

function decideCaptcha(hours, minutes, seconds) {
  var decideCap = function() {
    (function loop() {
      var now = new Date();
      if (
        now.getHours() === hours &&
        now.getMinutes() === minutes &&
        now.getSeconds() === seconds
      ) {
        if (grecaptcha.getResponse() != "") {
          sendCaptcha();
        } else {
          sleep(2500).then(() => {
            getCaptcha();
          });
        }
      }
      now = new Date();
      var delay = 999 - (now % 999);
      setTimeout(loop, delay);
    })();
  };
  decideCap();
}

function sendCaptcha() {
  if (grecaptcha.getResponse() != "") {
    console.log("SENDING CAPTCHA");
    window.reCaptchaToken = grecaptcha.getResponse();
    firebase
      .database()
      .ref("CAPTCHAs/" + browserID)
      .set({
        CaptchaToken: reCaptchaToken
      });
  }
}

function getCaptcha() {
  if (reCaptchaToken == null) {
    console.log("RECEIVING CAPTCHA");
    firebase
      .database()
      .ref("CAPTCHAs/" + browserID + "/CaptchaToken")
      .once("value")
      .then(function(captchaKey) {
        window.reCaptchaToken = captchaKey.val();
      });
    console.log(reCaptchaToken);
  }
}

function resetCaptcha() {
  if (grecaptcha.getResponse() != "") {
    grecaptcha.reset();
  }
}

function getFirebaseData() {
  firebase
    .database()
    .ref("Distribution/")
    .once("value")
    .then(function(snapshot) {
      window.snapshot = snapshot.val();
    });
}

function firebaseReady() {
  var interval3 = setInterval(() => {
    if (database != undefined) {
      clearInterval(interval3);
      getFirebaseData();
      var interval4 = setInterval(() => {
        if (snapshot != null) {
          clearInterval(interval4);
          window.name = snapshot[vmID][browsertovmID]["Name"];
          window.faNum = snapshot[vmID][browsertovmID]["Fnum"];
          window.officeNum = snapshot[vmID][browsertovmID]["Office"];
          window.bookNum = snapshot[vmID][browsertovmID]["bookNo"];
          var status = snapshot[vmID][browsertovmID]["status"];
          if (status == "success" || status == "critical") {
            window.recordMore = false;
          }
          data = {
            fnum: faNum,
            name: name,
            office: officeNum
          };
          console.log(
            "name: " +
              name +
              "\n" +
              "fnum: " +
              faNum +
              "\n" +
              "office: " +
              officeNum +
              "\nbrowserID: " +
              browserID
          );
        }
      }, 100);
    }
  }, 100);
}

function generatePhoneNumber() {
  let code = ["078", "077", "076", "075", "079"];
  let pre = ["0", "1", "2", "3"];
  let pnum =
    code[getRandomInt(0, code.length - 1)] +
    pre[getRandomInt(0, pre.length - 1)] +
    getRandomInt(0, 9) +
    getRandomInt(0, 9) +
    getRandomInt(0, 9) +
    getRandomInt(0, 9) +
    getRandomInt(0, 9) +
    getRandomInt(0, 9) +
    getRandomInt(0, 9);
  return pnum;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function refreshOnTime(hours, minutes, seconds) {
  const f = function() {
    (function loop() {
      var now = new Date();
      if (
        now.getHours() === hours &&
        now.getMinutes() === minutes &&
        now.getSeconds() === seconds &&
        refresh === true
      ) {
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
  console.log("SCHEDULED EXECUTION AT" + hours + ":" + minutes + ":" + seconds);
  const f = function() {
    (function loop() {
      var now = new Date();
      if (
        now.getHours() === hours &&
        now.getMinutes() === minutes &&
        now.getSeconds() === seconds
      ) {
        register(tries);
      }
      now = new Date();
      var delay = 999 - (now % 999);
      setTimeout(loop, delay);
    })();
  };
  f();
}

function reloadPage() {
  location.reload();
}

function generate_random_data1(size) {
  var chars = "abcdefghijklmnopqrstuvwxyz4732847159116123".split("");
  var len = chars.length;
  var random_data = [];

  while (size--) {
    random_data.push(chars[(Math.random() * len) | 0]);
  }

  return random_data.join("");
}

function register(count) {
  try {
    if (officeNum == "194") {
      shift = 2;
    }
  } catch (error) {
    console.log(error);
  }
  if (grecaptcha.getResponse() != "") {
    response = grecaptcha.getResponse();
  } else {
    response = reCaptchaToken;
  }

  var counter = 0;
  while (counter < count && recordMore == true) {
    jQuery.ajax({
      url: "https://reg.nid-moi.gov.iq/reg",
      method: "post",
      data: {
        name: name,
        phone: pnum,
        fNum: faNum,
        office: officeNum,
        shift: shift,
        bookNo: bookNum,
        clientId: clid,
        captcha: response
      },
      crossDomain: true,
      success: function(results) {
        if (results.success == true) {
          var now = new Date();
          window.recordMore = false;
          window.successTime =
            now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
          $.extend(data, results);
          console.log(data);
          addRecordToFirebase();
          addToFirebase_S();
        } else {
          console.log(results);
          if (
            results.errNo == 4 ||
            results.errNo == 8 ||
            (results.errNo == 7 && recordMore == true)
          ) {
            window.status = "critical";
            window.recordMore = false;
            window.theError = JSON.stringify(results.msg);
            addToFirebase_F();
          } else if (results.errNo == 2) {
            window.recordMore = false;
          }
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
  firebase
    .database()
    .ref(eldate + "/" + browserID)
    .set({
      name: data.name,
      fnum: data.fnum,
      office: data.office,
      id: data.data.id,
      date: data.data.date,
      vmID: vmID,
      browsertovmID: browsertovmID
    });
}

function addToFirebase_S() {
  firebase
    .database()
    .ref("Distribution/" + vmID + "/" + browsertovmID)
    .set({
      Name: data.name,
      Fnum: data.fnum,
      Office: data.office,
      bookNo: bookNum,
      Id: data.data.id,
      Date: data.data.date,
      status: "success",
      successTime: successTime
    });
}

function addToFirebase_F() {
  firebase
    .database()
    .ref("Distribution/" + vmID + "/" + browsertovmID)
    .update({
      Name: data.name,
      Fnum: data.fnum,
      Office: data.office,
      bookNo: bookNum,
      status: status,
      Error: theError
    });
}

function getEldate() {
  Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return (
      yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + (dd[1] ? dd : "0" + dd[0])
    );
  };
  var date = new Date();
  return date.yyyymmdd();
}

function hasRegLoaded() {
  if (window.location.href == "https://reg.nid-moi.gov.iq/") {
    try {
      register(1);
    } catch (error) {
      reloadPage();
    }
  } else {
    console.log("NOT ON REG, ABORTING");
  }
}
