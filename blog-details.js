
console.log('blog-details.js загружен');


function getBlogIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


async function loadBlogPost() {
    console.log('Начинаем загрузку поста');
    
    const BLOG_STRAPI_URL = (typeof window.STRAPI_URL !== 'undefined') ? window.STRAPI_URL : 'http://localhost:1337';
    console.log('Используем STRAPI URL:', BLOG_STRAPI_URL);
    
    const blogHeader = document.getElementById('blogHeader');
    const blogBanner = document.getElementById('blogBanner');
    const blogContent = document.getElementById('blogContent');
    
    console.log('Элементы DOM:', {
        blogHeader: !!blogHeader,
        blogBanner: !!blogBanner,
        blogContent: !!blogContent
    });
    
    if (!blogHeader || !blogBanner || !blogContent) {
        console.error('Не найдены необходимые DOM элементы');
        return;
    }
    
    const blogId = getBlogIdFromUrl();
    console.log('ID блога из URL:', blogId);
    
    console.log('Загрузка поста с ID:', blogId);
    
    if (!blogId) {
        console.error('ID поста не найден в URL');
        showError('Пост не найден - ID отсутствует в URL');
        return;
    }
    showLoading();

    try {
        const apiUrl = `${BLOG_STRAPI_URL}/api/blogs/${blogId}?populate=*`;
        console.log('URL запроса к API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        console.log('Ответ от API:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Данные поста:', data);
        
        if (data.data) {
            renderBlogPost(data.data, BLOG_STRAPI_URL);
        } else {
            showError('Пост не найден в базе данных');
        }
    } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
        showError(`Ошибка при загрузке поста: ${error.message}`);
    }
}

function renderBlogPost(blog, strapiUrl) {
    const attributes = blog;
    
    const blogHeader = document.getElementById('blogHeader');
    if (blogHeader) {
        const publishedDate = attributes.published ? 
            new Date(attributes.published).toLocaleDateString('ru-RU') : 
            new Date().toLocaleDateString('ru-RU');
            
        blogHeader.innerHTML = `
            <h1>${attributes.title || 'Без названия'}</h1>
            <div class="blog_meta">
                <span>📅 ${publishedDate}</span>
                <span>✍️ By MCM Team</span>
            </div>
        `;
    }

    const blogBanner = document.getElementById('blogBanner');
    if (blogBanner && attributes.images && attributes.images.length > 0) {
        const image = attributes.images[0];
        const imageUrl = image.url;
        const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${strapiUrl}${imageUrl}`;
        
        blogBanner.innerHTML = `
            <img src="${fullImageUrl}" alt="${attributes.title || 'Blog image'}" onerror="this.style.display='none'">
        `;
    } else {
        blogBanner.style.display = 'none';
    }


    const blogContent = document.getElementById('blogContent');
    if (blogContent) {
        let contentHtml = '';
        
        if (attributes.description) {
            contentHtml += `<p class="blog-description">${attributes.description}</p>`;
        }
        
        if (attributes.content) {
            if (Array.isArray(attributes.content)) {
                attributes.content.forEach(block => {
                    if (block.type === 'paragraph' && block.children) {
                        let paragraphText = '';
                        block.children.forEach(child => {
                            if (child.type === 'text') {
                                paragraphText += child.text;
                            }
                        });
                        if (paragraphText.trim()) {
                            contentHtml += `<p>${paragraphText}</p>`;
                        }
                    }
                });
            } else if (typeof attributes.content === 'string') {


                if (attributes.content.includes('<')) {
                    contentHtml += attributes.content;
                } else {
                    const paragraphs = attributes.content.split('\n\n');
                    paragraphs.forEach(paragraph => {
                        if (paragraph.trim()) {
                            contentHtml += `<p>${paragraph.trim()}</p>`;
                        }
                    });
                }
            }
        }
        
        if (!contentHtml) {
            contentHtml = '<p>Контент поста недоступен.</p>';
        }
        
        blogContent.innerHTML = contentHtml;
    }


    document.title = `${attributes.title || 'Пост'} - MCM`;
}


function showLoading() {
    const blogHeader = document.getElementById('blogHeader');
    const blogBanner = document.getElementById('blogBanner');
    const blogContent = document.getElementById('blogContent');
    
    if (blogHeader) {
        blogHeader.innerHTML = `<h1>Загрузка...</h1>`;
    }
    
    if (blogBanner) {
        blogBanner.style.display = 'none';
    }
    
    if (blogContent) {
        blogContent.innerHTML = `
            <div class="loading-message">
                <p>Загружаем пост...</p>
            </div>
        `;
    }
}


function showError(message) {
    const blogHeader = document.getElementById('blogHeader');
    const blogBanner = document.getElementById('blogBanner');
    const blogContent = document.getElementById('blogContent');
    
    if (blogHeader) {
        blogHeader.innerHTML = `<h1>Ошибка</h1>`;
    }
    
    if (blogBanner) {
        blogBanner.style.display = 'none';
    }
    
    if (blogContent) {
        blogContent.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
                <a href="blog.html" class="btn">← Вернуться к списку постов</a>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded событие сработало');
    loadBlogPost();
});