const STRAPI_URL = "http://localhost:1337";

fetch(`${STRAPI_URL}/api/services?populate=*`)
    .then(res => res.json())
    .then(data => {
        const servicesContainer = document.querySelector(".services");
        servicesContainer.innerHTML = "";

        data.data.forEach(item => {
            const title = item.title || "Başlıq yoxdur";
            const description = item.description || "Təsvir yoxdur";

            const image = item.image?.[0];
            const imgUrl = image?.url ? `${STRAPI_URL}${image.url}` : "img/default.jpg";

            const serviceItem = document.createElement("div");
            serviceItem.classList.add("services_item");
            serviceItem.innerHTML = `
                <div class="services_img">
                    <img src="${imgUrl}" alt="${title}" loading="lazy">
                </div>
                <div class="services_text">
                    <p>${title}</p>
                </div>
                <div class="services_details">
                    <p>${description}</p>
                </div>
            `;
            servicesContainer.appendChild(serviceItem);
        });

        const servicesItems = document.querySelectorAll(".services_item");
        servicesItems.forEach(item => {
            item.addEventListener("click", e => {
                e.stopPropagation();
                if (item.classList.contains("active")) {
                    item.classList.remove("active");
                } else {
                    servicesItems.forEach(el => el.classList.remove("active"));
                    item.classList.add("active");
                }
            });
        });

        document.addEventListener("click", () => {
            servicesItems.forEach(el => el.classList.remove("active"));
        });
    })
    .catch(err => console.error("Service məlumatları yüklənmədi:", err));
