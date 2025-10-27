document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:1337/api/blogs?populate=*")
    .then(res => res.json())
    .then(data => {
      const blogs = data.data;
      const container = document.getElementById("blogGrid");
      container.innerHTML = ""; // əvvəlkini təmizləyir

      blogs.forEach(blog => {
        const title = blog.title || blog.attributes?.title;
        const description = blog.description || blog.attributes?.description;
        const date = new Date(blog.publishedAt || blog.attributes?.publishedAt)
          .toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

        const imageUrl = blog.images?.[0]?.url 
                      || blog.attributes?.images?.data?.[0]?.attributes?.url;

        const blogCard = `
          <div class="blog_card">
            <div class="blog_img">
              <a href="blog-details.html?id=${blog.id}">
                <img src="http://localhost:1337${imageUrl}" alt="${title}">
              </a>
            </div>
            <div class="blog_content">
              <span class="blog_date">${date}</span>
              <h2><a href="blog-details.html?id=${blog.id}">${title}</a></h2>
              <p>${description}</p>
              <a href="blog-details.html?id=${blog.id}" class="read_more">Read More →</a>
            </div>
          </div>
        `;
        container.innerHTML += blogCard;
      });
    })
    .catch(err => console.error("Bloglar yüklənmədi:", err));
});



