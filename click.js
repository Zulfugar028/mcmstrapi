

const servicesItems = document.querySelectorAll(".services_item");

servicesItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.stopPropagation(); // klik eventinin document-ə getməsinin qarşısını alır
        if (item.classList.contains("active")) {
            item.classList.remove("active");
        } else {
            servicesItems.forEach(el => el.classList.remove("active")); // başqalarını bağla
            item.classList.add("active");
        }
    });
});

// Boş yerə klik olunanda hamısını bağla
document.addEventListener("click", () => {
    servicesItems.forEach(el => el.classList.remove("active"));
});