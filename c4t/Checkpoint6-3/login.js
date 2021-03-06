document.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault();

    try {
        await firebase.auth().signInWithEmailAndPassword(e.target[0].value, e.target[1].value);
        location.href = "index.html";
    } catch (ex) {
        document.querySelector("#errorMsg").innerHTML = ex.message ?? ex;
    }
});
