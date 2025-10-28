function toggleLangMenu() {
    document.querySelector(".lang-menu").classList.toggle("show");
}

function setLanguage(lang) {
    alert("Dil seçildi: " + lang);
    // Burada tərcümə funksiyanı əlavə edə bilərsən
}

window.addEventListener("click", function (e) {
    if (!e.target.closest(".language-dropdown")) {
        document.querySelector(".lang-menu").classList.remove("show");
    }
});

