$(document).ready(function () {
    $("#statement").keyup(function () {
        var step2 = $("#step2");
        var step3 = $("#step3");
        var statement = $(this).val().split(' ');
        var statement2 = [];
        var password = "";
        statement.forEach(function(entry) {
            if(entry == "")
                return;
            statement2.push("<b>" + entry[0] + "</b>" + entry.substr(1));
            password += entry[0];
        });
        statement2 = statement2.join(' ');
        step2.html(statement2);
        step3.text(password);

        // Strong level (max = 10)
        var level;
        var strength = document.querySelector('#strength');
        var score = computeStrength(password);
        level = score / 5;
        if (level >= 10)
            level = 10;
        strength.MaterialProgress.setProgress(level * 10);

        if (level < 4)
            $(".mdl-progress > .progressbar").css('background-color', '#e74c3c');
        else if (level < 6)
            $(".mdl-progress > .progressbar").css('background-color', '#e67e22');
        else if (level < 8)
            $(".mdl-progress > .progressbar").css('background-color', '#f1c40f');
        else
            $(".mdl-progress > .progressbar").css('background-color', '#2ecc71');
    });

    // Strength Bar
    document.querySelector('#strength').addEventListener('mdl-componentupgraded', function () {
        this.MaterialProgress.setProgress(0);
        this.MaterialProgress.setBuffer(80);
    });
});

// Took from http://www.geekwisdom.com/js/passwordmeter.js
function computeStrength(passwd) {
    var score = 0;
    var length = passwd.length;

    if (length == 0) return 0;

    if (length < 5) {
        score += 3;
    } else if (length > 4 && length < 8) {
        score += 6;
    } else if (length > 7 && length < 16) {
        score += 12;
    } else if (length > 15) {
        score += 18;
    }

    if (passwd.match(/[a-z]/)) {
        score += 1;
    }

    if (passwd.match(/[A-Z]/)) {
        score += 5;
    }

    if (passwd.match(/\d+/)) {
        score += 5;
    }

    if (passwd.match(/(.*[0-9].*[0-9].*[0-9])/)) {
        score += 5;
    }

    if (passwd.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {
        score += 5;
    }

    if (passwd.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
        score += 5;
    }

    if (passwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
        score += 2;
    }

    if (passwd.match(/([a-zA-Z])/) && passwd.match(/([0-9])/)) {
        score += 2;
    }

    if (passwd.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
        score += 2;
    }

    return score;
}