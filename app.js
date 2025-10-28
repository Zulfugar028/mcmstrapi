function toggleMenu() {
    const navList = document.querySelector(".nav_list");
    const openBtn = document.querySelector(".openMenu");
    const exitBtn = document.querySelector(".exit");

    navList.classList.toggle("active");
    openBtn.classList.toggle("hide");
    exitBtn.classList.toggle("show");

    if (navList.classList.contains("active")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
}


const newsData = {
    1: {
        img: "img/news1.png",
        title: "Noventiq Vietnam Earns ISO Certifications",
        desc: "Noventiq Vietnam has successfully achieved ISO/IEC 27001:2022 & ISO 9001:2015 certifications, demonstrating commitment to quality and information security."
    },
    2: {
        img: "img/news2.png",
        title: "Noventiq & AWS Partners with MoIAT",
        desc: "Noventiq & AWS join hands with the UAE Ministry of Industry to accelerate industrial digital transformation through cutting-edge cloud and AI solutions."
    },
    3: {
        img: "img/news3.png",
        title: "Noventiq Vietnam Earns ISO/IEC 27001:2022 & ISO 9001:2015 Certifications"
    },
    4: {
        img: "img/news4.png",
        title: "Noventiq Vietnam Earns ISO/IEC 27001:2022 & ISO 9001:2015 Certifications"
    }
    // digər xəbərləri buraya əlavə edə bilərsən
};

function openNews(id) {
    document.getElementById("newsImage").src = newsData[id].img;
    document.getElementById("newsTitle").innerText = newsData[id].title;
    document.getElementById("newsDesc").innerText = newsData[id].desc;
    document.getElementById("newsModal").style.display = "flex";
}

function closeNews() {
    document.getElementById("newsModal").style.display = "none";
}

function openDemo() {
    document.getElementById("demoModal").style.display = "flex";
}

function closeDemo() {
    document.getElementById("demoModal").style.display = "none";
}

// Kənara klikləyəndə modal bağlansın
window.onclick = function (event) {
    const modal = document.getElementById("demoModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}



function scrollToIndustry(id) {
    const section = document.getElementById(id);
    const headerOffset = 100; // burda header-in hündürlüyünü yaz
    const elementPosition = section.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });

    // aktiv span
    document.querySelectorAll(".industries-list span").forEach(s => s.classList.remove("active"));
    event.target.classList.add("active");
}



document.querySelector(".demo-form").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.querySelector(".demo-input.name").value.trim();
    let email = document.querySelector(".demo-input.email").value.trim();
    let phone = document.querySelector(".demo-input.phone").value.trim();
    let message = document.querySelector(".form-message");

    // Reset bütün input border rənglərini
    document.querySelectorAll(".demo-input").forEach(input => {
        input.style.borderColor = "#ddd";
    });

    // Ad yoxlaması
    if (name.length < 3) {
        message.textContent = "Ad ən azı 3 simvol olmalıdır.";
        document.querySelector(".demo-input.name").style.borderColor = "red";
        return;
    }

    // Email yoxlaması (regex)
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        message.textContent = "Düzgün email ünvanı daxil edin.";
        document.querySelector(".demo-input.email").style.borderColor = "red";
        return;
    }

    // Telefon yoxlaması
    let phonePattern = /^[0-9]{7,15}$/;
    if (!phonePattern.test(phone)) {
        message.textContent = "Telefon nömrəsi yalnız rəqəmlərdən ibarət olmalı və 7-15 simvol arasında olmalıdır.";
        document.querySelector(".demo-input.phone").style.borderColor = "red";
        return;
    }

    // Əgər hər şey düzəlibsə ✅
    message.style.color = "green";
    message.textContent = "Məlumat uğurla göndərildi ✅";

    // Bütün input-ları yaşıl göstər
    document.querySelectorAll(".demo-input").forEach(input => {
        input.style.borderColor = "green";
    });

    // Formu təmizləyək
    document.querySelector(".demo-form").reset();
});



const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

if (blogId) {
    fetch(`http://localhost:1337/api/blogs/${blogId}?populate=*`)
        .then(res => res.json())
        .then(data => {
            const blog = data.data;
            document.querySelector("h1").textContent = blog.title;
            document.querySelector("p").textContent = blog.description;
            const img = blog.images?.[0]?.url || blog.attributes?.images?.data?.[0]?.attributes?.url;
            document.querySelector("img").src = "http://localhost:1337" + img;
        })
        .catch(err => console.error("Detallar yüklənmədi:", err));
}



window.STRAPI_URL = "http://localhost:1337"; 
const STRAPI_URL = window.STRAPI_URL;
const API_URL = `${STRAPI_URL}/api/sliders?populate=*`; 

let currentSlide = 0;
let slides = [];


fetch(API_URL)
    .then(res => res.json())
    .then(({ data }) => {
        slides = data.map(item => ({
            video: item.video?.[0]?.url ? STRAPI_URL + item.video[0].url : '',
            title: item.title,
            description: item.description
        }));

        if (slides.length > 0) showSlide(0);

        // Avtomatik slayder
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    })
    .catch(err => console.error("Slayder məlumatı yüklənmədi:", err));

// Slayd göstərmək funksiyası
function showSlide(index) {
    const videoEl = document.querySelector(".slider_video video source");
    const videoParent = document.querySelector(".slider_video video");
    const titleEl = document.querySelector(".slider_content h1");
    const descEl = document.querySelector(".slider_content p");

    if (slides[index].video) {
        videoEl.src = slides[index].video;
        videoParent.load();
    }

    titleEl.textContent = slides[index].title;
    descEl.textContent = slides[index].description;
}