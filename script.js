const groupTabs = document.getElementById("groupTabs");
const subTabs = document.getElementById("subTabs");
const portfolioGrid = document.getElementById("portfolioGrid");
const servicesGrid = document.getElementById("servicesGrid");
const casesTitle = document.getElementById("casesTitle");
const casesCount = document.getElementById("casesCount");
const libraryIntro = document.getElementById("libraryIntro");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const heroCarouselTrack = document.getElementById("heroCarouselTrack");
const heroCarouselDots = document.getElementById("heroCarouselDots");
const heroCarouselTitle = document.getElementById("heroCarouselTitle");
const heroCarouselMeta = document.getElementById("heroCarouselMeta");

let activeGroup = siteData.groups[0].id;
let activeCategory = siteData.groups[0].categories[0].id;
let heroIndex = 0;
let heroTimer = null;

const services = [
  "平面设计",
  "海报设计",
  "展板设计",
  "门头设计",
  "活动全套设计",
  "文化墙设计",
  "3d效果图设计",
  "工装设计",
  "家装设计"
];

function getGroup(groupId) {
  return siteData.groups.find((group) => group.id === groupId);
}

function getCategory(groupId, categoryId) {
  return getGroup(groupId).categories.find((category) => category.id === categoryId);
}

function buildImageList(category) {
  const images = [];
  for (let i = 1; i <= category.count; i++) {
    const index = String(i).padStart(2, "0");
    images.push(`${category.folder}${index}.jpg`);
  }
  return images;
}

function getHeroSlides() {
  return [
    {
      title: "平面广告作品",
      meta: "主KV / 海报 / 展板 / 活动物料",
      image: "./assets/轮播图/01.jpg"
    },
    {
      title: "3D效果图作品",
      meta: "展厅 / 展位 / 文化墙 / 景观",
      image: "./assets/轮播图/02.jpg"
    },
    {
      title: "空间装修效果图",
      meta: "工装 / 家装",
      image: "./assets/轮播图/03.jpg"
    }
  ];
}

function updateHeroCarousel() {
  const slides = getHeroSlides();
  heroCarouselTitle.textContent = slides[heroIndex].title;
  heroCarouselMeta.textContent = slides[heroIndex].meta;

  heroCarouselTrack.querySelectorAll(".hero-slide").forEach((slide, index) => {
    slide.classList.toggle("is-active", index === heroIndex);
  });

  heroCarouselDots.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("is-active", index === heroIndex);
  });
}

function startHeroCarousel() {
  if (heroTimer) {
    clearInterval(heroTimer);
  }

  heroTimer = setInterval(() => {
    const slides = getHeroSlides();
    heroIndex = (heroIndex + 1) % slides.length;
    updateHeroCarousel();
  }, 3500);
}

function renderHeroCarousel() {
  const slides = getHeroSlides();

  heroCarouselTrack.innerHTML = slides.map((slide) => `
    <div class="hero-slide">
      <img src="${slide.image}" alt="${slide.title}" loading="eager" draggable="false">
    </div>
  `).join("");

  heroCarouselDots.innerHTML = slides.map((_, index) => `
    <button
      type="button"
      class="${index === heroIndex ? "is-active" : ""}"
      data-index="${index}"
      aria-label="切换到第${index + 1}张"
    ></button>
  `).join("");

  heroCarouselDots.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      heroIndex = Number(button.dataset.index);
      updateHeroCarousel();
      startHeroCarousel();
    });
  });

  updateHeroCarousel();
}

function openLightbox(imageUrl, caption) {
  lightboxImage.src = imageUrl;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.showModal();
}

function renderGroupTabs() {
  groupTabs.innerHTML = siteData.groups.map((group) => `
    <button type="button" class="${group.id === activeGroup ? "is-active" : ""}" data-group="${group.id}">
      ${group.name}
    </button>
  `).join("");

  groupTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeGroup = button.dataset.group;
      activeCategory = getGroup(activeGroup).categories[0].id;
      renderAll();
    });
  });
}

function renderSubTabs() {
  const group = getGroup(activeGroup);

  subTabs.innerHTML = group.categories.map((category) => `
    <button type="button" class="${category.id === activeCategory ? "is-active" : ""}" data-category="${category.id}">
      ${category.name}
    </button>
  `).join("");

  subTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      renderPortfolio();
    });
  });
}

function renderPortfolio() {
  const group = getGroup(activeGroup);
  const category = getCategory(activeGroup, activeCategory);
  const images = buildImageList(category);

  casesTitle.textContent = `${group.name} / ${category.name}`;
  casesCount.textContent = `${category.count}张`;
  libraryIntro.textContent = `${group.intro} 当前浏览：${category.name}`;

  portfolioGrid.innerHTML = images.map((imageUrl, index) => `
    <button class="gallery-card is-entering" type="button" data-image="${imageUrl}" data-caption="${category.name} 第 ${index + 1} 张">
      <div class="gallery-image" style="aspect-ratio: ${category.thumbRatio || "2 / 1"};">
        <img src="${imageUrl}" alt="${category.name} 第 ${index + 1} 张" loading="lazy" draggable="false">
      </div>
      <div class="gallery-info">
        <strong>${category.name}</strong>
        <span>${String(index + 1).padStart(2, "0")}</span>
      </div>
    </button>
  `).join("");

  portfolioGrid.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      openLightbox(card.dataset.image, card.dataset.caption);
    });
  });
}

function renderServices() {
  servicesGrid.innerHTML = services.map((service) => `
    <article class="service-card">
      <strong>${service}</strong>
      <span>支持案例展示与分类浏览</span>
    </article>
  `).join("");
}

function bindProtection() {
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  document.addEventListener("dragstart", (event) => {
    if (event.target.tagName === "IMG") {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.ctrlKey || event.metaKey) && (key === "s" || key === "u")) {
      event.preventDefault();
    }
  });
}

function renderAll() {
  renderGroupTabs();
  renderSubTabs();
  renderPortfolio();
}

lightboxClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

renderHeroCarousel();
startHeroCarousel();
renderServices();
renderAll();
bindProtection();
