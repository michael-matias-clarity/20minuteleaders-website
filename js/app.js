// 20MinuteLeaders - Main App JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initRotatingHero();
    initNavigation();
    renderFeaturedEpisode();
    initEpisodesBrowser();
    renderGuestDirectory();
    initSubscribeForm();
});

// Rotating Hero Headlines
const heroTexts = [
    "world's boldest leaders",
    "founders building the future",
    "visionaries shaping tomorrow",
    "innovators breaking barriers",
    "executives transforming industries"
];

let currentHeroIndex = 0;

function initRotatingHero() {
    const rotatingText = document.getElementById('rotating-text');
    if (!rotatingText) return;
    
    setInterval(() => {
        rotatingText.classList.add('fade-out');
        
        setTimeout(() => {
            currentHeroIndex = (currentHeroIndex + 1) % heroTexts.length;
            rotatingText.textContent = heroTexts[currentHeroIndex];
            rotatingText.classList.remove('fade-out');
        }, 300);
    }, 4000);
}

// Mobile Navigation
function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('active');
            });
        });
    }
}

// Featured Episode
function renderFeaturedEpisode() {
    const container = document.getElementById('featured-episode');
    if (!container || !EPISODES || EPISODES.length === 0) return;
    
    const episode = EPISODES[0]; // Latest episode
    const cleanDesc = episode.description
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .substring(0, 300);
    
    container.innerHTML = `
        <div class="featured-image">
            ${episode.image ? `<img src="${episode.image}" alt="${episode.guest}">` : ''}
        </div>
        <div class="featured-info">
            <h3>Episode ${episode.episode}</h3>
            <h2 class="featured-title">${episode.guest}: ${episode.topic}</h2>
            <p class="featured-description">${cleanDesc}...</p>
            <div class="featured-meta">
                <span>⏱️ ${episode.duration}</span>
                <span>📅 ${formatDate(episode.date)}</span>
            </div>
            <a href="${episode.link}" target="_blank" class="btn btn-primary">Listen Now →</a>
        </div>
    `;
}

// Episodes Browser
let displayedEpisodes = 12;
let filteredEpisodes = [];

function initEpisodesBrowser() {
    filteredEpisodes = [...EPISODES];
    renderEpisodes();
    initSearch();
    initTopicFilter();
    initLoadMore();
}

function renderEpisodes() {
    const grid = document.getElementById('episodes-grid');
    if (!grid) return;
    
    const episodesToShow = filteredEpisodes.slice(0, displayedEpisodes);
    
    grid.innerHTML = episodesToShow.map((ep, index) => {
        const cleanDesc = ep.description
            .replace(/<[^>]+>/g, '')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&')
            .substring(0, 150);
        
        return `
            <a href="${ep.link}" target="_blank" class="episode-card" style="animation-delay: ${index * 0.05}s">
                <div class="episode-number">Episode ${ep.episode}</div>
                <h3 class="episode-title">${ep.topic || ep.title}</h3>
                <p class="episode-guest">${ep.guest}</p>
                <p class="episode-description">${cleanDesc}...</p>
                <div class="episode-meta">
                    <span>⏱️ ${ep.duration}</span>
                    <span>📅 ${formatDate(ep.date)}</span>
                </div>
            </a>
        `;
    }).join('');
    
    // Update load more button visibility
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedEpisodes >= filteredEpisodes.length ? 'none' : 'inline-flex';
    }
}

function initSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                filteredEpisodes = [...EPISODES];
            } else {
                filteredEpisodes = EPISODES.filter(ep => 
                    ep.title.toLowerCase().includes(query) ||
                    ep.guest.toLowerCase().includes(query) ||
                    ep.topic.toLowerCase().includes(query) ||
                    ep.description.toLowerCase().includes(query)
                );
            }
            
            displayedEpisodes = 12;
            renderEpisodes();
        }, 300);
    });
}

function initTopicFilter() {
    const filterSelect = document.getElementById('topic-filter');
    if (!filterSelect) return;
    
    // Extract common topics/themes
    const topics = ['AI', 'Leadership', 'Startup', 'VC', 'Tech', 'Cybersecurity', 'Product', 'Marketing', 'Sales', 'Fintech'];
    
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.toLowerCase();
        option.textContent = topic;
        filterSelect.appendChild(option);
    });
    
    filterSelect.addEventListener('change', (e) => {
        const topic = e.target.value.toLowerCase();
        
        if (topic === '') {
            filteredEpisodes = [...EPISODES];
        } else {
            filteredEpisodes = EPISODES.filter(ep => 
                ep.title.toLowerCase().includes(topic) ||
                ep.topic.toLowerCase().includes(topic) ||
                ep.description.toLowerCase().includes(topic)
            );
        }
        
        displayedEpisodes = 12;
        renderEpisodes();
    });
}

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        displayedEpisodes += 12;
        renderEpisodes();
    });
}

// Guest Directory
function renderGuestDirectory() {
    const grid = document.getElementById('guests-grid');
    if (!grid || !EPISODES) return;
    
    // Get unique guests (taking most recent appearance)
    const guestMap = new Map();
    EPISODES.forEach(ep => {
        if (ep.guest && !guestMap.has(ep.guest)) {
            guestMap.set(ep.guest, {
                name: ep.guest,
                episode: ep.episode,
                link: ep.link,
                image: ep.image
            });
        }
    });
    
    // Get first 12 guests
    const guests = Array.from(guestMap.values()).slice(0, 12);
    
    grid.innerHTML = guests.map(guest => {
        const initials = guest.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        
        return `
            <a href="${guest.link}" target="_blank" class="guest-card">
                <div class="guest-avatar">${initials}</div>
                <h4 class="guest-name">${guest.name}</h4>
                <p class="guest-episodes">Ep ${guest.episode}</p>
            </a>
        `;
    }).join('');
}

// Subscribe Form
function initSubscribeForm() {
    const form = document.getElementById('subscribe-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        // For now, just show success message
        // In production, this would integrate with email service
        alert(`Thanks for subscribing! We'll send updates to ${email}`);
        form.reset();
    });
}

// Helper Functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}
