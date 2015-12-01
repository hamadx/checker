$(document).ready(function () {
    function stripPassword(pwd) {
        return (pwd.replace(/[^a-zA-Z ]/g, ""));
    }

    function getPasswordStrength(pwd) {
        var passwordStrength = "";

        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        if (strongRegex.test(pwd)) {
            passwordStrength += "Strong";
        } else if (mediumRegex.test(pwd)) {
            passwordStrength += "Medium";
        } else {
            passwordStrength += "Weak";
        }

        return passwordStrength;
    }

    function lookupDict(word) {
        var dictAPI = "http://api.wordnik.com:80/v4/words.json/search/" + word + "?caseSensitive=false&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=-1&skip=0&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
        $.getJSON(dictAPI, function (data) {
                console.log("success");
                var inDict = (data.totalResults > 0); // if word is found in dictionary
                //console.log(data.totalResults,inDict);
                updateDict(inDict);
            })
            .done(function () {
                console.log("second success");
            })
            .fail(function () {
                console.log("error");
                updateDict(error);
            })
            .always(function () {
                console.log("complete");
            });
    }

    $("#pwdInput").keyup(function () {
        // window.alert("sometext");
        var m = $('#label1');
        var i = $('#pwdInput');
        //alert(getPasswordStrength(i.val()));
        m.text(getPasswordStrength(i.val()));
    });

    $("#btn1").click(function () {
        // alert(stripPassword("abcdedfg"));
        var m = $('#label2');
        var i = $('#pwdInput');

        m.text(stripPassword(i.val()));
    });

    function updateDict(ret) {
        var m = $('#label2');
        switch (ret) {
            case true:
                m.text("You chose a password that is easily found in English dictionary, bad idea!");
                break;
            case false:
                m.text("Password is not found in a dictionary, good thing!");
                break;
            default:
                m.text("Error with Dictionary API!");
        }
    }

    $("#btn2").click(function () {
        var i = $('#pwdInput');
        lookupDict(i.val());
    });
});

//$("#cartoon-msg").text("");