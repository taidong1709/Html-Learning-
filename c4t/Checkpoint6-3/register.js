function insertDateMonthYear(rangeStart, rangeEnd, dom) {
    for (let i = rangeStart; i <= rangeEnd; i++) {
        let element = document.createElement("option", {
            value: i
        });
        element.appendChild(document.createTextNode(i.toString()))
        dom.appendChild(element);
    }
}

async function fadeAway() {
    document.getElementById("errorMsg").animate([
        { opacity: 1 },
        { opacity: 0 }
    ], {
        duration: 2000,
        delay: 2000
    });
    await new Promise(r => setTimeout(r, 4000));
    document.getElementById("errorMsg").innerHTML = "";
}

function throwErr(msg, isSuccess) {
    if (isSuccess) {
        document.getElementById("errorMsg").innerHTML = `<b style="color: darkgreen">${msg}</b>`;
    } else {
        document.getElementById("errorMsg").innerHTML = `<b style="color: red">${msg}</b>`;
        fadeAway();
        throw new Error(msg);
    }
}

window.onload = async function onLoad() {
    insertDateMonthYear(1, 31, document.getElementById("ngaysinh"));
    insertDateMonthYear(1, 12, document.getElementById("thangsinh"));
    insertDateMonthYear(1900, new Date().getFullYear(), document.getElementById("namsinh"));

    document.getElementById("regform").onsubmit = async function onSubmit(e) {
        e.preventDefault();

        let target = e.target;
        if (!target[12].checked) throwErr("Bạn chưa đồng ý với các điều lệ.");

        // Kiểm tra giới tính
        let gender = "";
        if (target[6].checked) gender = "male";
        if (target[7].checked) gender = "female";
        if (target[8].checked) gender = "other";
        if (gender === "") throwErr("Bạn chưa chọn giới tính.");

        let ngaysinh = parseInt(target[9].value);
        let thangsinh = parseInt(target[10].value);
        let namsinh = parseInt(target[11].value);

        if (isNaN(ngaysinh) || isNaN(thangsinh) || isNaN(namsinh)) throwErr("Bạn chưa nhập ngày tháng năm sinh.");
        // Kiểm tra năm nhuận + kiểm tra ngày sinh có hợp lệ hay không.
        if (thangsinh % 2 === 0 && thangsinh !== 2) {
            if (ngaysinh === 31) throwErr("Ngày sinh không hợp lệ.");
        } else if (thangsinh === 2) {
            switch (ngaysinh) {
                case 30:
                case 31:
                    throwErr("Ngày sinh không hợp lệ.");
                case 29:
                    let isLeapYear = namsinh % 4 === 0 && (namsinh % 100 !== 0 || namsinh % 400 === 0);
                    if (!isLeapYear) throwErr("Ngày sinh không hợp lệ.");
            }
        }

        let password = target[4].value;
        let confirmPass = target[5].value;
        if (password !== confirmPass) throwErr("Mật khẩu và mật khẩu nhập lại không khớp.");
        if (!password.length) throwErr("Mật khẩu không được bỏ trống.");

        let firstname = target[0].value.trim();
        let lastname = target[1].value.trim();
        if (!firstname.length || !lastname.length) throwErr("Vui lòng nhập đầy đủ họ và tên.");

        let email = target[2].value.trim();
        console.log(email, /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email));
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) throwErr("Vui lòng nhập đúng địa chỉ email.");

        let username = target[3].value.trim().replace(/ /g, "");
        if (!username.length) throwErr("Vui lòng nhập tên đăng nhập hợp lệ (khoảng trống sẽ tự động bị loại bỏ).");

        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            
            throwErr("Đăng kí tài khoản thành công! Chuyển hướng sau 3s...", true);

            await new Promise(r => setTimeout(r, 3000));
            window.location.href = "login.html";
        } catch (ex) {
            throwErr(ex.message ?? ex, false);
        }
    }
}