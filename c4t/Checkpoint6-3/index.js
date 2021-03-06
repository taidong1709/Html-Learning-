window.onload = async () => {
    let signedIn = false;
    const SI = document.querySelector("#si");

    window.probSignIn = async function probSignIn() {
        if (signedIn) {
            await firebase.auth().signOut();
            SI.innerHTML = "Sign in";
        } else {
            location.href = "login.html";
        }
    }

    firebase.auth().onAuthStateChanged(() => {
        if (firebase.auth().currentUser) {
            signedIn = true;
            SI.innerHTML = "Sign out";
        } else {
            signedIn = false;
            SI.innerHTML = "Sign in";
        }
    });
}
