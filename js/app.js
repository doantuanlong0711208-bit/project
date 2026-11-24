document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. KHỞI TẠO GIAO DIỆN SÁNG MẶC ĐỊNH & CHẾ ĐỘ ĐÊM KHI DI CHUYỂN
  // =========================================================================
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeToggleLabel = document.getElementById("theme-toggle-label");
  const metaThemeColor = document.getElementById("meta-theme-color");

  const savedTheme = sessionStorage.getItem("phuot_active_theme") || "light";
  applyTheme(savedTheme, false);

  function applyTheme(theme, notify = true) {
    htmlEl.setAttribute("data-theme", theme);
    sessionStorage.setItem("phuot_active_theme", theme);
    if (themeToggleLabel) {
      themeToggleLabel.textContent = theme === "dark" ? "Đi đêm" : "Sáng";
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#0F1713" : "#FAF8F4");
    }
    if (notify) {
      showToast(
        theme === "dark"
          ? "🌙 Đã bật Chế độ Đi đêm (Giảm chói mắt khi di chuyển)"
          : "☀️ Đã bật Giao diện Sáng tiêu chuẩn (Tối ưu ngoài trời)"
      );
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = htmlEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark", true);
    });
  }

  const topNav = document.getElementById("top-nav");
  const scrollProgressBar = document.getElementById("scroll-progress-bar");
  window.addEventListener(
    "scroll",
    () => {
      if (topNav) {
        topNav.classList.toggle("scrolled", window.scrollY > 16);
      }
      if (scrollProgressBar) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
        scrollProgressBar.style.width = `${pct}%`;
      }
    },
    { passive: true }
  );

  // =========================================================================
  // 2. HIỆU ỨNG ĐA TẦNG CHIỀU SÂU 3D PARALLAX (MULTI-LAYER SPATIAL UI)
  // =========================================================================
  const heroStage = document.getElementById("hero-parallax-stage");
  const parallaxLayers = document.querySelectorAll(".parallax-layer");

  if (heroStage && parallaxLayers.length > 0) {
    heroStage.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 900) return;
      const rect = heroStage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      parallaxLayers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth || "0.1");
        const moveX = relX * depth * -65;
        const moveY = relY * depth * -50;
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    heroStage.addEventListener("mouseleave", () => {
      parallaxLayers.forEach((layer) => {
        layer.style.transform = "translate3d(0, 0, 0)";
      });
    });
  }

  // Nền Canvas Bản đồ Tương tác: Tọa độ nối mạng, Vòng sóng Radar & Hạt nắng vàng
  const particlesCanvas = document.getElementById("sunlit-particles-canvas");
  if (particlesCanvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = particlesCanvas.getContext("2d");
    let width = (particlesCanvas.width = window.innerWidth);
    let height = (particlesCanvas.height = window.innerHeight);
    let scrollDelta = 0;
    let lastScrollY = window.scrollY;
    const pointer = { x: -9999, y: -9999 };

    window.addEventListener(
      "resize",
      () => {
        width = particlesCanvas.width = window.innerWidth;
        height = particlesCanvas.height = window.innerHeight;
      },
      { passive: true }
    );

    window.addEventListener(
      "mousemove",
      (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      "scroll",
      () => {
        const currentY = window.scrollY;
        scrollDelta = (currentY - lastScrollY) * 0.12;
        lastScrollY = currentY;
      },
      { passive: true }
    );

    const particleCount = window.innerWidth < 768 ? 22 : 42;
    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.6 + 1.2,
      vx: (Math.random() - 0.5) * 0.38,
      vy: -Math.random() * 0.32 - 0.08,
      alpha: Math.random() * 0.5 + 0.25,
      isGold: idx % 2 === 0,
      hasRing: idx % 7 === 0,
      pulse: Math.random() * Math.PI * 2
    }));

    function animateParticles() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, width, height);
        const isDark = htmlEl.getAttribute("data-theme") === "dark";
        scrollDelta *= 0.9;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.pulse += 0.03;
          p.x += p.vx;
          p.y += p.vy - scrollDelta * 0.22;

          // Tương tác nhẹ với trỏ chuột
          const dxMouse = p.x - pointer.x;
          const dyMouse = p.y - pointer.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 140 && distMouse > 1) {
            p.x += (dxMouse / distMouse) * 0.55;
            p.y += (dyMouse / distMouse) * 0.55;
          }

          if (p.y < -15) p.y = height + 15;
          if (p.y > height + 15) p.y = -15;
          if (p.x < -15) p.x = width + 15;
          if (p.x > width + 15) p.x = -15;

          // Vẽ đường nối tọa độ giữa các điểm gần nhau (như bản đồ hành trình)
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 135) {
              const lineAlpha = (1 - dist / 135) * (isDark ? 0.16 : 0.13);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = isDark
                ? `rgba(52, 211, 153, ${lineAlpha})`
                : `rgba(20, 99, 56, ${lineAlpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }

          // Vẽ vòng sóng radar tại các điểm mốc chính
          if (p.hasRing) {
            const ringRadius = p.r + 6 + Math.sin(p.pulse) * 4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
            ctx.strokeStyle = p.isGold
              ? `rgba(217, 119, 6, ${isDark ? 0.28 : 0.22})`
              : `rgba(20, 99, 56, ${isDark ? 0.28 : 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          if (p.isGold) {
            ctx.fillStyle = isDark
              ? `rgba(251, 191, 36, ${p.alpha * 0.9})`
              : `rgba(217, 119, 6, ${p.alpha * 0.78})`;
          } else {
            ctx.fillStyle = isDark
              ? `rgba(52, 211, 153, ${p.alpha * 0.85})`
              : `rgba(20, 99, 56, ${p.alpha * 0.65})`;
          }
          ctx.fill();
        }
      }
      requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
  }

  // BỘ ĐIỀU KHIỂN CHUYỂN CẢNH 4 KỲ QUAN CUNG ĐƯỜNG VIỆT NAM TRÊN HERO
  const HERO_SCENES = [
    {
      hudTitle: "CỘT CỜ QUỐC GIA LŨNG CÚ · HÀ GIANG",
      hudElev: "ĐỈNH NÚI RỒNG · 1.470M",
      hudCoord: "🚩 Cực Bắc Tổ Quốc · 23°21'49\"N, 105°18'58\"E ↗",
      sceneTag: "01 / 04 · ĐỊA ĐẦU TỔ QUỐC",
      searchTerm: "Hà Giang",
      desc: "Khởi đầu từ <strong>Cột cờ Lũng Cú nơi địa đầu Tổ quốc</strong> đến những đỉnh đèo mây phủ, cung đường ven biển ngọc bích và đại ngàn hùng vĩ — trải nghiệm bản đồ phượt đa tầng 3D trực quan nhất."
    },
    {
      hudTitle: "ĐÈO MÃ PÍ LÈNG & SÔNG NHO QUẾ · HÀ GIANG",
      hudElev: "HẺM VỰC TU SẢN · ĐỘ CAO 1.500M",
      hudCoord: "🏔️ Đèo Mã Pí Lèng · 23°14'36\"N, 105°24'18\"E ↗",
      sceneTag: "02 / 04 · TỨ ĐẠI ĐỈNH ĐÈO",
      searchTerm: "Hà Giang",
      desc: "Chinh phục <strong>Đèo Mã Pí Lèng — Vua của những con đèo Việt Nam</strong> uốn lượn bên vách đá dựng đứng, phóng tầm mắt xuống dòng sông Nho Quế xanh ngọc bích xuyên qua hẻm vực Tu Sản."
    },
    {
      hudTitle: "CUNG ĐƯỜNG VEN BIỂN VĨNH HY – BÌNH TIÊN",
      hudElev: "DUYÊN HẢI NINH THUẬN · DT702",
      hudCoord: "🌊 Vịnh Vĩnh Hy · 11°43'15\"N, 109°11'42\"E ↗",
      sceneTag: "03 / 04 · CUNG BIỂN ĐẸP NHẤT",
      searchTerm: "Vĩnh Hy",
      desc: "Lướt bánh xe trên <strong>cung đường ven biển Bình Tiên – Vĩnh Hy – Cà Ná</strong> nơi một bên là vách đá trắng Vườn quốc gia Núi Chúa, một bên là làn nước biển trong vắt nhìn thấu rạn san hô."
    },
    {
      hudTitle: "THÁC BẢN GIỐC & MÙA VÀNG CAO BẰNG",
      hudElev: "KỲ QUAN ĐÔNG BẮC · BIÊN CƯƠNG",
      hudCoord: "🌿 Thác Bản Giốc · 22°51'18\"N, 106°43'22\"E ↗",
      sceneTag: "04 / 04 · KỲ QUAN THIÊN NHIÊN",
      searchTerm: "Bản Giốc",
      desc: "Đi giữa <strong>mùa lúa chín vàng rực rỡ miền biên viễn Cao Bằng</strong>, chiêm ngưỡng dòng Thác Bản Giốc hùng vĩ tung bọt trắng xóa giữa núi rừng Đông Bắc trầm mặc."
    }
  ];

  const heroSlides = document.querySelectorAll(".hero-slide");
  const sceneThumbCards = document.querySelectorAll(".scene-thumb-card");
  const heroHudTitle = document.getElementById("hero-hud-title");
  const heroHudElev = document.getElementById("hero-hud-elev");
  const heroHudCoordBtn = document.getElementById("hero-hud-coord-btn");
  const heroSceneTag = document.getElementById("hero-scene-tag");
  const heroSceneDesc = document.getElementById("hero-scene-desc");

  let currentSceneIndex = 0;
  let sceneIntervalId = null;

  function activateHeroScene(index) {
    currentSceneIndex = index % HERO_SCENES.length;
    const scene = HERO_SCENES[currentSceneIndex];

    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentSceneIndex);
    });

    sceneThumbCards.forEach((btn, idx) => {
      const isAct = idx === currentSceneIndex;
      btn.classList.toggle("active", isAct);
      // Reset progress bar animation cleanly
      const bar = btn.querySelector(".scene-progress-bar");
      if (bar) {
        bar.style.animation = "none";
        void bar.offsetWidth;
        bar.style.animation = isAct ? "sceneTimer 6.5s linear forwards" : "none";
      }
    });

    if (heroHudTitle) heroHudTitle.textContent = scene.hudTitle;
    if (heroHudElev) heroHudElev.textContent = scene.hudElev;
    if (heroHudCoordBtn) {
      heroHudCoordBtn.textContent = scene.hudCoord;
      heroHudCoordBtn.dataset.searchTerm = scene.searchTerm;
    }
    if (heroSceneTag) heroSceneTag.textContent = scene.sceneTag;
    if (heroSceneDesc) heroSceneDesc.innerHTML = scene.desc;
  }

  function startHeroSlideshowTimer() {
    if (sceneIntervalId) clearInterval(sceneIntervalId);
    sceneIntervalId = setInterval(() => {
      if (!document.hidden) {
        activateHeroScene((currentSceneIndex + 1) % HERO_SCENES.length);
      }
    }, 6500);
  }

  if (heroSlides.length > 0 && sceneThumbCards.length > 0) {
    sceneThumbCards.forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.scene, 10) || 0;
        activateHeroScene(idx);
        startHeroSlideshowTimer();
      });
    });
    startHeroSlideshowTimer();
  }

  // =========================================================================
  // 3. KHỞI TẠO BIẾN TRẠNG THÁI & ĐIỀU HƯỚNG ĐA TẦNG (TẦNG 1 -> TẦNG 2 -> TẦNG 3)
  // =========================================================================
  const routeGrid = document.getElementById("route-grid");
  const macroRegionGrid = document.getElementById("macro-region-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("search-input");
  const searchClearBtn = document.getElementById("search-clear");
  const sortSelect = document.getElementById("sort-select");
  const filterInSeasonCheckbox = document.getElementById("filter-in-season");
  const resultsCountText = document.getElementById("results-count-text");
  const btnResetFilters = document.getElementById("btn-reset-filters");

  const regionalContextBanner = document.getElementById("regional-context-banner");
  const crumbTier1 = document.getElementById("crumb-tier1");
  const crumbTier2 = document.getElementById("crumb-tier2");
  const crumbTier2Text = document.getElementById("crumb-tier2-text");
  const crumbTier3 = document.getElementById("crumb-tier3");
  const crumbTier3Text = document.getElementById("crumb-tier3-text");

  const modal = document.getElementById("route-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalClose = document.getElementById("modal-close");

  const inputDays = document.getElementById("input-days");
  const inputPeople = document.getElementById("input-people");
  const vehicleButtons = document.querySelectorAll(".vehicle-btn");

  let activeRoute = null;
  let currentWaypoints = [];
  let draggedWpIndex = null;
  let currentRegion = "all";
  let selectedVehicle = "motorbike";
  let userCurrentCoords = null;
  let lastCalculatedSummary = "";
  let lastCalculatedTotal = 0;
  const currentMonth = new Date().getMonth() + 1;

  // Cập nhật thông tin tháng trên thanh điều hướng
  const navMonthLabel = document.getElementById("nav-month-label");
  if (navMonthLabel && typeof ROUTES_DATA !== "undefined") {
    const inSeasonTotal = ROUTES_DATA.filter((r) => r.bestMonths.includes(currentMonth)).length;
    navMonthLabel.textContent = `Tháng ${currentMonth} · ${inSeasonTotal} cung mùa đẹp`;
  }

  if (typeof ROUTES_DATA !== "undefined") {
    filterButtons.forEach((btn) => {
      const reg = btn.dataset.region;
      if (reg === "all") {
        btn.textContent = `Tất cả (${ROUTES_DATA.length})`;
      } else {
        const count = ROUTES_DATA.filter((r) => r.region === reg).length;
        const prefix = reg === "Bộ Sưu Tập Tứ Đại" ? "🏆 Bộ Tứ Đại" : reg;
        btn.textContent = `${prefix} (${count})`;
      }
    });
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "all 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, 2600);
  }

  const formatVND = (amount) => Math.round(amount).toLocaleString("vi-VN") + "đ";

  const calculateDefaultEstimate = (route) => {
    const nights = Math.max(1, route.defaultDays - 1);
    const fuel = route.distanceKm * route.costConfig.fuelPerKm;
    const food = route.defaultDays * route.costConfig.foodPerDay;
    const stay = nights * route.costConfig.stayPerNight;
    return fuel + food + stay + route.costConfig.buffer;
  };

  // =========================================================================
  // 4. RENDER TẦNG 1 (MACRO REGIONAL ATLAS) & ĐỒNG BỘ BREADCRUMB ĐA TẦNG
  // =========================================================================
  const REGION_COVER_PHOTOS = {
    "Miền Bắc": "assets/images/hero-ma-pi-leng.jpg",
    "Miền Trung": "assets/images/hero-vinh-hy.jpg",
    "Tây Nguyên & Nam Bộ": "assets/images/cau-dat-da-lat.jpg",
    "Bộ Sưu Tập Tứ Đại": "assets/images/lung-cu-hero.jpg"
  };

  function renderTier1MacroAtlas() {
    if (!macroRegionGrid || !window.phuotService) return;
    const stats = window.phuotService.getRegionalOverviewStats(ROUTES_DATA, currentMonth);
    macroRegionGrid.innerHTML = "";

    stats.forEach((reg) => {
      const isSelected = currentRegion === reg.regionName;
      const coverImg = REGION_COVER_PHOTOS[reg.regionName] || "assets/images/lung-cu-hero.jpg";
      const card = document.createElement("div");
      card.className = `macro-region-card has-photo-cover ${isSelected ? "active-region" : ""}`;
      card.innerHTML = `
        <div class="mrc-cover-banner">
          <img src="${coverImg}" alt="${reg.title}" loading="lazy">
          <div class="mrc-cover-scrim"></div>
          <div class="mrc-top">
            <span class="mrc-code">${reg.code}</span>
            <span class="mrc-icon">${reg.icon}</span>
          </div>
          <span class="mrc-cover-peak">⛰️ Đỉnh ${reg.elevationPeak}</span>
        </div>
        <div class="mrc-content-wrap">
          <div>
            <h3 class="mrc-title">${reg.title}</h3>
            <p class="mrc-desc">${reg.description}</p>
          </div>
          <div>
            <div class="mrc-stats">
              <span>🛣️ ${reg.totalKm.toLocaleString("vi-VN")} km</span>
              <span>📍 ${reg.routeCount} cung</span>
              <span>✨ ${reg.inSeasonCount} mùa đẹp</span>
            </div>
            <div class="mrc-cta" style="margin-top: 0.72rem;">
              <span>Khám phá vùng này (Tầng 2)</span>
              <span>➔</span>
            </div>
          </div>
        </div>
      `;

      card.addEventListener("mouseenter", () => {
        if (typeof focusMasterAtlasRegion === "function") {
          focusMasterAtlasRegion(reg.regionName);
        }
      });

      card.addEventListener("click", () => {
        selectRegionTier2(reg.regionName, true);
      });

      macroRegionGrid.appendChild(card);
    });
  }

  function selectRegionTier2(regionName, scrollToExplore = false) {
    currentRegion = regionName;
    filterButtons.forEach((b) => {
      b.classList.toggle("active", b.dataset.region === regionName);
    });

    renderTier1MacroAtlas();
    updateTierNavigationUI();
    renderRoutes();

    if (typeof syncMasterAtlasRegionState === "function") {
      syncMasterAtlasRegionState(regionName);
    }

    if (scrollToExplore) {
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function updateTierNavigationUI() {
    // Cập nhật Banner Ngữ cảnh Vùng ở Tầng 2
    if (regionalContextBanner && window.REGION_METADATA) {
      if (currentRegion !== "all" && window.REGION_METADATA[currentRegion]) {
        const meta = window.REGION_METADATA[currentRegion];
        regionalContextBanner.classList.remove("hidden");
        document.getElementById("rcb-code").textContent = `TẦNG 2 · PHÂN VÙNG ${meta.code}`;
        document.getElementById("rcb-title").textContent = `${meta.icon} ${meta.title}`;
        document.getElementById("rcb-desc").textContent = meta.description;
        document.getElementById("rcb-elevation").textContent = meta.elevationPeak;
        document.getElementById("rcb-terrain").textContent = meta.terrainType;
      } else {
        regionalContextBanner.classList.add("hidden");
      }
    }

    // Cập nhật Breadcrumb Đa tầng
    if (crumbTier1 && crumbTier2 && crumbTier2Text) {
      const isSpecificRegion = currentRegion !== "all";
      crumbTier1.classList.toggle("active", !isSpecificRegion && !activeRoute);
      crumbTier2.classList.toggle("active", isSpecificRegion && !activeRoute);
      crumbTier2Text.textContent = isSpecificRegion
        ? `Vùng: ${currentRegion}`
        : `Tất cả Cung đường (${ROUTES_DATA.length})`;
    }

    if (crumbTier3 && crumbTier3Text) {
      if (activeRoute) {
        crumbTier3.classList.remove("tier-crumb-muted");
        crumbTier3.classList.add("active");
        crumbTier3Text.textContent = activeRoute.title.split("—")[0].trim();
      } else {
        crumbTier3.classList.add("tier-crumb-muted");
        crumbTier3.classList.remove("active");
        crumbTier3Text.textContent = "Chọn cung để mở Buồng lái Chi tiết Chặng";
      }
    }
  }

  const btnToggleAtlas = document.getElementById("btn-toggle-atlas");
  const atlasCollapsibleBody = document.getElementById("atlas-collapsible-body");
  if (btnToggleAtlas && atlasCollapsibleBody) {
    btnToggleAtlas.addEventListener("click", () => {
      const isHidden = atlasCollapsibleBody.classList.toggle("hidden");
      btnToggleAtlas.textContent = isHidden ? "Mở rộng Tầng 1 ▼" : "Thu gọn Tầng 1 ▲";
      if (!isHidden && typeof masterAtlasMap !== "undefined" && masterAtlasMap) {
        setTimeout(() => masterAtlasMap.resize(), 120);
      }
    });
  }

  const btnBackAllRegions = document.getElementById("btn-back-all-regions");
  if (btnBackAllRegions) {
    btnBackAllRegions.addEventListener("click", () => {
      selectRegionTier2("all", false);
    });
  }

  if (crumbTier1) {
    crumbTier1.addEventListener("click", () => {
      selectRegionTier2("all", false);
      document.getElementById("tier1-atlas")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (crumbTier2) {
    crumbTier2.addEventListener("click", () => {
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // =========================================================================
  // 5. RENDER TẦNG 2 (ROUTE GRID & BỘ LỌC)
  // =========================================================================
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  let selectedMonthFilter = 0; // 0 = Tất cả 12 tháng, 1..12 = Lọc theo tháng cụ thể
  let compareRouteIds = []; // Tối đa 2 cung đường trên Bàn cân so sánh (Mục 3)
  let currentRouteLiveWeather = null; // Lưu thời tiết thực tế để tự động gợi ý Hành trang (Mục 5)

  function renderRoutes() {
    routeGrid.innerHTML = "";
    const keyword = searchInput.value.trim().toLowerCase();
    const onlyInSeason = filterInSeasonCheckbox.checked;
    const sortBy = sortSelect ? sortSelect.value : "default";

    if (searchClearBtn) {
      searchClearBtn.classList.toggle("hidden", !keyword);
    }

    const filtered = ROUTES_DATA.filter((route) => {
      const matchRegion = currentRegion === "all" || route.region === currentRegion;
      const matchSeason = !onlyInSeason || route.bestMonths.includes(currentMonth);
      const matchPickedMonth =
        selectedMonthFilter === 0 || route.bestMonths.includes(selectedMonthFilter);
      const matchSearch =
        !keyword ||
        route.title.toLowerCase().includes(keyword) ||
        route.excerpt.toLowerCase().includes(keyword) ||
        route.description.toLowerCase().includes(keyword) ||
        route.waypoints.some((w) => w.name.toLowerCase().includes(keyword));

      return matchRegion && matchSeason && matchPickedMonth && matchSearch;
    });

    if (sortBy === "distance-asc") {
      filtered.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === "distance-desc") {
      filtered.sort((a, b) => b.distanceKm - a.distanceKm);
    } else if (sortBy === "cost-asc") {
      filtered.sort((a, b) => calculateDefaultEstimate(a) - calculateDefaultEstimate(b));
    } else if (sortBy === "days-asc") {
      filtered.sort((a, b) => a.defaultDays - b.defaultDays);
    }

    const isFiltered =
      currentRegion !== "all" ||
      onlyInSeason ||
      selectedMonthFilter !== 0 ||
      keyword.length > 0 ||
      sortBy !== "default";
    if (btnResetFilters) {
      btnResetFilters.classList.toggle("hidden", !isFiltered);
    }
    if (resultsCountText) {
      resultsCountText.innerHTML = `Hiển thị <strong>${filtered.length}</strong> / ${ROUTES_DATA.length} cung đường tuyển chọn`;
    }

    if (filtered.length === 0) {
      routeGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-strong);">
          <p style="color: var(--text-secondary); font-weight: 600; margin-bottom: 0.75rem;">Không tìm thấy cung đường phù hợp với bộ lọc hiện tại.</p>
          <button type="button" class="btn-outline-small" id="empty-reset-btn">Khôi phục toàn bộ ${ROUTES_DATA.length} cung đường</button>
        </div>
      `;
      const emptyReset = document.getElementById("empty-reset-btn");
      if (emptyReset) emptyReset.addEventListener("click", resetAllFilters);
      return;
    }

    const activePassportUser = window.phuotDB ? window.phuotDB.getCurrentUser() : null;
    const conqueredSet = new Set(
      activePassportUser && Array.isArray(activePassportUser.conqueredRoutes)
        ? activePassportUser.conqueredRoutes
        : []
    );

    let catalogViewMode = localStorage.getItem("phuot_catalog_view_mode") || "grid";
    routeGrid.classList.toggle("list-view-mode", catalogViewMode === "list");

    filtered.forEach((route, idx) => {
      const targetCheckMonth = selectedMonthFilter !== 0 ? selectedMonthFilter : currentMonth;
      const isBestSeason = route.bestMonths.includes(targetCheckMonth);
      const isConquered = conqueredSet.has(route.id);
      const estimatedTotal = calculateDefaultEstimate(route);
      const elevMeta = window.phuotService
        ? window.phuotService.getRouteElevationAndCulinary(route, route.waypoints)
        : null;
      const firstWp = route.waypoints[0]?.name || "";
      const midWp = route.waypoints[Math.floor(route.waypoints.length / 2)]?.name || "";
      const lastWp = route.waypoints[route.waypoints.length - 1]?.name || "";
      const isFeaturedCard = catalogViewMode === "grid" && idx === 0 && filtered.length >= 3;

      const card = document.createElement("article");
      card.className = `route-card ${isFeaturedCard ? "is-featured-editorial" : ""}`;
      card.style.transitionDelay = `${(idx % 3) * 55}ms`;
      card.innerHTML = `
        <div class="card-img-wrap">
          <span class="card-badge ${isBestSeason ? "in-season" : ""}">
            ${
              selectedMonthFilter !== 0
                ? `✨ Mùa đẹp Tháng ${selectedMonthFilter}`
                : isBestSeason
                  ? "✨ Đang mùa đẹp nhất"
                  : "🗓️ " + route.bestTimeText
            }
          </span>
          <span class="card-index-pill">#${String(idx + 1).padStart(2, "0")}</span>
          ${isConquered ? `<span class="card-conquered-stamp">🏆 ĐÃ CHINH PHỤC</span>` : ""}
          <img 
            src="${route.image}" 
            alt="${route.title}" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${route.fallbackImage}';"
          >
        </div>
        <div class="card-body">
          ${isFeaturedCard ? `<span class="featured-editorial-kicker">★ TIÊU ĐIỂM HÀNH TRÌNH · FEATURED ROUTE</span>` : ""}
          <div class="card-meta">
            <span>📍 ${route.region}</span>
            <span>🛣️ ~${route.distanceKm} km</span>
            <span>⏱️ ${route.defaultDays}N${Math.max(1, route.defaultDays - 1)}Đ</span>
            ${elevMeta ? `<span class="card-elev-pill">⛰️ ${elevMeta.maxElev.toLocaleString("vi-VN")}m</span>` : `<span>🚩 ${route.waypoints.length} chặng</span>`}
          </div>
          <h3 class="card-title">${route.title}</h3>
          <p class="card-excerpt">${route.excerpt}</p>
          <div class="card-waypoints-preview">
            <span class="wp-dot">●</span>
            <span>${firstWp}</span>
            <span>→</span>
            <span>${midWp}</span>
            <span>→</span>
            <span>${lastWp}</span>
          </div>
          <div class="card-footer">
            <span>Dự kiến: <span class="cost-highlight">~${formatVND(estimatedTotal)}</span>/người</span>
            <div class="card-footer-actions">
              <button type="button" class="btn-card-compare ${compareRouteIds.includes(route.id) ? "selected" : ""}" data-compare-id="${route.id}" title="Đặt cung đường này lên Bàn cân so sánh">
                ${compareRouteIds.includes(route.id) ? "✔ Đã chọn" : "⚖️ So sánh"}
              </button>
              <span class="link-detail">Chi tiết →</span>
            </div>
          </div>
        </div>
      `;

      const compareBtn = card.querySelector(".btn-card-compare");
      if (compareBtn) {
        compareBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleCompareRoute(route.id);
        });
      }

      card.addEventListener("click", () => openRouteModal(route));
      routeGrid.appendChild(card);
      cardObserver.observe(card);
    });
  }

  function resetAllFilters() {
    currentRegion = "all";
    selectedMonthFilter = 0;
    filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.region === "all"));
    document.querySelectorAll(".srb-month-pill").forEach((p) => {
      p.classList.toggle("active", parseInt(p.dataset.month, 10) === 0);
    });
    const srbDesc = document.getElementById("srb-active-desc");
    if (srbDesc) {
      srbDesc.textContent = "Chạm vào từng tháng để cảm nhận mùa hoa, mùa lúa chín & biển êm";
    }
    document.documentElement.removeAttribute("data-season-mood");
    searchInput.value = "";
    filterInSeasonCheckbox.checked = false;
    if (sortSelect) sortSelect.value = "default";
    renderTier1MacroAtlas();
    updateTierNavigationUI();
    renderRoutes();
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener("click", resetAllFilters);
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      renderRoutes();
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectRegionTier2(btn.dataset.region, false);
    });
  });

  document.querySelectorAll(".hero-Tag-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const term = chip.dataset.searchTerm || "";
      searchInput.value = term;
      renderRoutes();
      document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-quick-region]").forEach((link) => {
    link.addEventListener("click", () => {
      const targetRegion = link.dataset.quickRegion;
      selectRegionTier2(targetRegion, true);
    });
  });

  searchInput.addEventListener("input", renderRoutes);
  filterInSeasonCheckbox.addEventListener("change", renderRoutes);
  if (sortSelect) {
    sortSelect.addEventListener("change", renderRoutes);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCommandPalette();
      return;
    }

    if (
      e.key === "/" &&
      document.activeElement !== searchInput &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA" &&
      modal.classList.contains("hidden")
    ) {
      e.preventDefault();
      openCommandPalette();
    } else if (e.key === "Escape") {
      if (!modal.classList.contains("hidden")) closeModal();
      [
        "saved-trips-modal",
        "passport-modal",
        "chat-hub-modal",
        "custom-route-modal",
        "pocket-card-modal",
        "compare-routes-modal",
        "command-palette-modal"
      ].forEach((id) => {
        const m = document.getElementById(id);
        if (m && !m.classList.contains("hidden")) m.classList.add("hidden");
      });
    }
  });

  let selectedVehicleModel = "underbone"; // underbone | manual | scooter | sedan | suv
  const vehicleModelPills = document.querySelectorAll(".vr-model-pill");
  const fuelQuickVehicleChips = document.querySelectorAll(".frg-veh-chip");

  function syncVehicleModelPillsUI() {
    vehicleModelPills.forEach((pill) => {
      pill.classList.toggle("active", pill.dataset.model === selectedVehicleModel);
    });
    fuelQuickVehicleChips.forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.model === selectedVehicleModel);
    });
    vehicleButtons.forEach((b) => {
      b.classList.toggle("active", b.dataset.vehicle === selectedVehicle);
    });
  }

  fuelQuickVehicleChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      selectedVehicleModel = chip.dataset.model || "underbone";
      selectedVehicle = chip.dataset.cat || "motorbike";
      syncVehicleModelPillsUI();
      updateVehicleNotice();
      renderStageBreakdownTimeline();
      updateGoogleMapsNavLink();
      updateCostCalculator();
    });
  });

  function renderVehicleReadiness() {
    if (!activeRoute || !window.phuotService) return;
    const res = window.phuotService.evaluateVehicleReadiness(activeRoute, selectedVehicleModel);
    const cardEl = document.getElementById("vr-result-card");
    const statusEl = document.getElementById("vr-status-pill");
    const titleEl = document.getElementById("vr-model-title");
    const scoreEl = document.getElementById("vr-score-num");
    const meterEl = document.getElementById("vr-meter-fill");
    const loadEl = document.getElementById("vr-load-advice");
    const fuelEl = document.getElementById("vr-fuel-spec");
    const tipEl = document.getElementById("vr-riding-tip");
    const hintEl = document.getElementById("vr-check-hint");

    if (cardEl) {
      cardEl.classList.remove("optimal", "caution", "warning");
      cardEl.classList.add(res.level);
    }
    if (statusEl) statusEl.textContent = res.statusLabel;
    if (titleEl) titleEl.textContent = res.name;
    if (scoreEl) scoreEl.textContent = `${res.score}%`;
    if (meterEl) meterEl.style.width = `${res.score}%`;
    if (loadEl) loadEl.textContent = `👥 ${res.loadAdvice}`;
    if (fuelEl) fuelEl.textContent = `⛽ ${res.fuelLabel}`;
    if (tipEl) tipEl.textContent = `💡 Kinh nghiệm thực địa: ${res.ridingTip}`;
    if (hintEl) hintEl.textContent = `🔧 Chuẩn bị xe: ${res.checklistHint}`;
  }

  vehicleModelPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      selectedVehicleModel = pill.dataset.model || "underbone";
      selectedVehicle = pill.dataset.cat || "motorbike";
      syncVehicleModelPillsUI();
      updateVehicleNotice();
      renderStageBreakdownTimeline();
      updateGoogleMapsNavLink();
      updateCostCalculator();
    });
  });

  vehicleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedVehicle = btn.dataset.vehicle;
      if (selectedVehicle === "car" && !["sedan", "suv"].includes(selectedVehicleModel)) {
        selectedVehicleModel = "suv";
      } else if (
        selectedVehicle === "motorbike" &&
        !["underbone", "manual", "scooter"].includes(selectedVehicleModel)
      ) {
        selectedVehicleModel = "underbone";
      }
      syncVehicleModelPillsUI();
      updateVehicleNotice();
      renderStageBreakdownTimeline();
      updateGoogleMapsNavLink();
      updateCostCalculator();
    });
  });

  document.querySelectorAll(".step-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      const step = parseInt(btn.dataset.step, 10) || 0;
      const inputEl = document.getElementById(targetId);
      if (!inputEl) return;
      const min = parseInt(inputEl.min, 10) || 1;
      const max = parseInt(inputEl.max, 10) || 30;
      const nextVal = Math.min(max, Math.max(min, (parseInt(inputEl.value, 10) || 1) + step));
      inputEl.value = nextVal;
      updateCostCalculator();
      if (targetId === "input-days") renderStageBreakdownTimeline();
    });
  });

  function updateVehicleNotice() {
    renderVehicleReadiness();
    const noticeEl = document.getElementById("vehicle-notice");
    if (!noticeEl || !activeRoute) return;

    if (selectedVehicle === "motorbike") {
      if (activeRoute.id === "san-may-ta-xua-tram-tau") {
        noticeEl.textContent =
          "⚠️ Lưu ý xe máy: Đoạn Tà Xùa – Trạm Tấu nhiều đá hộc & dốc đứng, nên đi xe số hoặc xe côn tay (hạn chế xe tay ga).";
      } else if (activeRoute.id === "deo-hai-van-hue-da-nang") {
        noticeEl.textContent =
          "🏍️ Chế độ Xe máy: Đã bật tự động tránh cao tốc. Khi mở Google Maps, nhớ chọn biểu tượng Xe máy để đi đường đèo (hầm Hải Vân cấm xe máy).";
      } else {
        noticeEl.textContent =
          "🏍️ Chế độ Xe máy: Google Maps sẽ tự động né đường cao tốc cấm xe máy. Kiểm tra phanh, lốp và nhông sên dĩa trước khi đi.";
      }
    } else {
      if (activeRoute.id === "san-may-ta-xua-tram-tau") {
        noticeEl.textContent =
          "⚠️ Lưu ý Ô tô: Đường nối Xím Vàng – Trạm Tấu hẹp và nhiều đá hộc, chỉ phù hợp xe SUV/bán tải gầm cao, không đi xe sedan gầm thấp.";
      } else {
        noticeEl.textContent =
          "🚗 Chế độ Ô tô: Đã điều chỉnh định mức nhiên liệu (~2.000đ/km) và mở dẫn đường đầy đủ cao tốc/quốc lộ trên Google Maps.";
      }
    }
  }

  async function fetchDestinationWeather(route) {
    const weatherEl = document.getElementById("modal-weather");
    const strip3DayEl = document.getElementById("weather-3day-strip");
    const targetPoint = route.waypoints[Math.floor(route.waypoints.length / 2)];
    weatherEl.textContent = `⏳ Đang cập nhật thời tiết & radar săn mây 3 ngày tới tại ${targetPoint.name}...`;
    if (strip3DayEl) {
      strip3DayEl.classList.add("hidden");
      strip3DayEl.innerHTML = "";
    }
    currentRouteLiveWeather = null;

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${targetPoint.lat}&longitude=${targetPoint.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,wind_speed_10m,cloud_cover_low&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=Asia%2FBangkok&forecast_days=3`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();

      const temp = Math.round(data.current.temperature_2m);
      const wind = Math.round(data.current.wind_speed_10m);
      const rainProb = data.daily?.precipitation_probability_max?.[0] ?? 0;

      currentRouteLiveWeather = {
        temp,
        wind,
        rainProb,
        pointName: targetPoint.name
      };

      let warning = "Thời tiết thuận lợi để chạy xe.";
      if (rainProb >= 60) warning = "⚠️ Khả năng mưa cao, cẩn thận đường đèo trơn trượt!";
      else if (temp <= 14) warning = "🧥 Trời lạnh vùng cao, nhớ mang đủ áo giữ nhiệt!";

      weatherEl.innerHTML = `
        <span>🌤️ <strong>Hiện tại tại ${targetPoint.name}:</strong> ${temp}°C</span>
        <span>💨 Gió: ${wind} km/h</span>
        <span>🌧️ Mưa hôm nay: ${rainProb}%</span>
        <span>— <em>${warning}</em></span>
      `;

      // Render Radar Dự Báo 3 Ngày Tới & Chỉ Số Săn Mây / Biển Xanh (Mục 1)
      if (strip3DayEl && window.phuotService && typeof window.phuotService.analyze3DayWeatherAndCloudRadar === "function") {
        const radar = window.phuotService.analyze3DayWeatherAndCloudRadar(route, data);
        if (radar.days.length > 0) {
          strip3DayEl.innerHTML = radar.days
            .map(
              (d) => `
              <div class="w3d-card ${d.isBestDay ? "best-day" : ""}">
                <div class="w3d-top">
                  <span class="w3d-date">${d.relLabel} <small>${d.dateBadge}</small></span>
                  ${d.isBestDay ? `<span class="w3d-best-pill">⭐ Đẹp nhất</span>` : ""}
                </div>
                <div class="w3d-mid">
                  <span class="w3d-temp-group">${d.emoji} ${d.minT}°–${d.maxT}°C</span>
                  <span class="w3d-rain">🌧️ ${d.rainProb}%</span>
                </div>
                <div class="w3d-radar-row">
                  <div class="w3d-radar-head">
                    <span>${d.specialShort}</span>
                    <span style="font-family:var(--font-mono); font-size:0.66rem;">💧${d.dawnRh}%</span>
                  </div>
                  <div class="w3d-radar-track">
                    <div class="w3d-radar-fill" style="width:${d.specialScore}%"></div>
                  </div>
                  <span class="w3d-radar-sub" title="${d.specialLabel}">${d.specialLabel}</span>
                </div>
              </div>
            `
            )
            .join("");
          strip3DayEl.classList.remove("hidden");
        }
      }

      if (activeRoute && activeRoute.id === route.id) {
        renderChecklist(activeRoute);
      }
    } catch {
      weatherEl.textContent = "📡 Đang ở chế độ Offline — Đã áp dụng cấu hình khí hậu đặc trưng theo vùng.";
      currentRouteLiveWeather = {
        temp: route.region === "Miền Bắc" ? 15 : 26,
        wind: 14,
        rainProb: 25,
        pointName: targetPoint.name
      };
      if (activeRoute && activeRoute.id === route.id) {
        renderChecklist(activeRoute);
      }
    }
  }

  function updateGoogleMapsNavLink() {
    const gmapsBtn = document.getElementById("btn-start-gmaps");
    if (!gmapsBtn || !currentWaypoints || currentWaypoints.length === 0) return;

    const destination = currentWaypoints[currentWaypoints.length - 1];
    let originParam = "";
    let middleWaypoints = [];

    if (userCurrentCoords) {
      originParam = `${userCurrentCoords.lat},${userCurrentCoords.lng}`;
      middleWaypoints = currentWaypoints.slice(0, -1);
    } else {
      const firstWp = currentWaypoints[0];
      originParam = `${firstWp.lat},${firstWp.lng}`;
      middleWaypoints = currentWaypoints.slice(1, -1);
    }

    const waypointsParam = middleWaypoints.map((wp) => `${wp.lat},${wp.lng}`).join("|");

    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(originParam)}&destination=${encodeURIComponent(`${destination.lat},${destination.lng}`)}&travelmode=driving`;

    if (waypointsParam) {
      url += `&waypoints=${encodeURIComponent(waypointsParam)}`;
    }

    if (selectedVehicle === "motorbike") {
      url += `&avoid=highways`;
    }

    gmapsBtn.href = url;
  }

  // =========================================================================
  // 6. TẦNG 3: WAYPOINTS KÉO THẢ, TỪ NHÀ BẠN -> ĐẦU CUNG (MỤC 2) & GIỜ VÀNG
  // =========================================================================
  const HOME_CITY_STORAGE_KEY = "phuot_home_city_origin";
  const homeCitySelect = document.getElementById("home-city-select");
  const dttResultBody = document.getElementById("dtt-result-body");

  if (homeCitySelect) {
    const savedOrigin = localStorage.getItem(HOME_CITY_STORAGE_KEY) || "none";
    homeCitySelect.value = savedOrigin;
    homeCitySelect.addEventListener("change", () => {
      const val = homeCitySelect.value;
      localStorage.setItem(HOME_CITY_STORAGE_KEY, val);
      if (val === "gps" && !userCurrentCoords) {
        const modalStatus = document.getElementById("modal-gps-status");
        startRealtimeGPS((msg, coords) => {
          if (modalStatus) modalStatus.textContent = msg;
          if (coords) updateEmergencyLinks(coords);
        });
      }
      renderDoorToTrailheadTransfer();
    });
  }

  function renderDoorToTrailheadTransfer() {
    if (!dttResultBody || !homeCitySelect || !activeRoute || !window.phuotService) return;
    const originKey = homeCitySelect.value;
    const firstWp = currentWaypoints && currentWaypoints[0] ? currentWaypoints[0] : activeRoute.waypoints[0];
    const info = window.phuotService.computeTrailheadTransfer(
      originKey,
      userCurrentCoords,
      firstWp,
      selectedVehicle
    );

    if (!info) {
      dttResultBody.classList.add("hidden");
      dttResultBody.innerHTML = "";
      return;
    }

    if (info.needsGps) {
      dttResultBody.classList.remove("hidden");
      dttResultBody.innerHTML = `
        <p class="dtt-advice-text">⏳ Đang dò tín hiệu GPS hiện tại của bạn để tính đường đến <strong>${firstWp.name}</strong>...</p>
      `;
      return;
    }

    dttResultBody.classList.remove("hidden");
    dttResultBody.innerHTML = `
      <div class="dtt-stats-row">
        <span class="dtt-distance-badge">🧭 ${info.originName} → ${info.destName}: ~${info.roadKm.toLocaleString("vi-VN")} km (${info.durationText})</span>
        <span class="dtt-strategy-pill ${info.badgeLevel}">${info.strategyBadge}</span>
      </div>
      <p class="dtt-advice-text">💡 ${info.strategyAdvice}</p>
      <div class="dtt-footer-row">
        <small style="color:var(--text-muted); font-size:0.72rem;">Tổng cự ly gồm chặng trung chuyển (1 chiều): <strong>~${(info.roadKm + activeRoute.distanceKm).toLocaleString("vi-VN")} km</strong></small>
        <a href="${info.gmapsTransferUrl}" target="_blank" rel="noopener" class="dtt-gmaps-link">🗺️ Dẫn đường từ nhà → ${info.destName} ↗</a>
      </div>
    `;
  }

  const pacingStartInput = document.getElementById("pacing-start-time");
  const pacingSpeedSelect = document.getElementById("pacing-speed-mode");
  const pacingNightAlert = document.getElementById("pacing-night-alert");

  if (pacingStartInput) {
    pacingStartInput.addEventListener("input", renderStageBreakdownTimeline);
  }
  if (pacingSpeedSelect) {
    pacingSpeedSelect.addEventListener("change", renderStageBreakdownTimeline);
  }

  function renderStageBreakdownTimeline() {
    renderDoorToTrailheadTransfer();
    const listEl = document.getElementById("stage-timeline-list");
    if (!listEl || !activeRoute || !window.phuotService) return;

    const chosenDays = Math.max(1, parseInt(inputDays.value, 10) || activeRoute.defaultDays || 2);
    const startTimeVal = pacingStartInput ? pacingStartInput.value : "05:30";
    const speedModeVal = pacingSpeedSelect ? pacingSpeedSelect.value : "standard";

    const scheduleResult = window.phuotService.buildTimedDayByDaySchedule(
      activeRoute,
      currentWaypoints,
      chosenDays,
      startTimeVal,
      speedModeVal,
      selectedVehicle
    );

    if (pacingNightAlert) {
      pacingNightAlert.classList.toggle("hidden", !scheduleResult.hasNightWarning);
    }

    listEl.innerHTML = "";
    let lastRenderedDay = 0;

    scheduleResult.stages.forEach((st, idx) => {
      if (st.dayNumber !== lastRenderedDay) {
        lastRenderedDay = st.dayNumber;
        const dayHeader = document.createElement("div");
        dayHeader.className = "stage-day-divider";
        dayHeader.innerHTML = `<span>📅 NGÀY ${st.dayNumber} / ${scheduleResult.totalDays} · Xuất phát ${startTimeVal}</span>`;
        listEl.appendChild(dayHeader);
      }

      const gasUrl = `https://www.google.com/maps/search/tr%E1%BA%A1m+x%C4%83ng/@${st.lat},${st.lng},14z`;
      const foodUrl = `https://www.google.com/maps/search/qu%C3%A1n+%C4%83n+ngon/@${st.lat},${st.lng},14z`;
      const stayUrl = `https://www.google.com/maps/search/homestay/@${st.lat},${st.lng},14z`;

      const item = document.createElement("div");
      item.className = "stage-item";
      item.innerHTML = `
        <div class="stage-left">
          <span class="stage-badge">Chặng ${st.index}</span>
          <div class="stage-info">
            <strong>
              <span class="stage-eta-pill">🕒 ${st.etaStr}</span>
              ${st.name} ${st.legKm > 0 ? `<span style="color: var(--accent-amber); font-family: var(--font-mono);">+${st.legKm} km</span>` : ""}
            </strong>
            <small>${st.role} · ${st.note}</small>
            <div><span class="stage-time-tag ${st.timeLevel}">${st.timeTag}</span></div>
            <div class="stage-nearby-links" aria-label="Tra cứu tiện ích quanh chặng ${st.name}">
              <a href="${gasUrl}" target="_blank" rel="noopener" class="stage-nearby-pill" title="Tìm trạm xăng gần ${st.name} trên Google Maps">⛽ Cây xăng</a>
              <a href="${foodUrl}" target="_blank" rel="noopener" class="stage-nearby-pill" title="Tìm quán ăn bản địa quanh ${st.name}">🍜 Quán ăn</a>
              <a href="${stayUrl}" target="_blank" rel="noopener" class="stage-nearby-pill" title="Tìm homestay / nhà nghỉ gần ${st.name}">🏡 Homestay</a>
            </div>
          </div>
        </div>
        <button type="button" class="btn-fly-stage" data-idx="${idx}">🎯 Bay 3D</button>
      `;

      item.querySelector(".btn-fly-stage").addEventListener("click", () => {
        switchCockpitLeftTab("map");
        setTimeout(() => {
          if (typeof flyToStageWaypoint === "function") {
            flyToStageWaypoint(st.lat, st.lng, idx);
          }
        }, 120);
      });

      listEl.appendChild(item);
    });

    renderElevationAndCulinary();
  }

  function renderElevationAndCulinary() {
    if (!activeRoute || !window.phuotService) return;
    const info = window.phuotService.getRouteElevationAndCulinary(activeRoute, currentWaypoints);

    // 1. Render Dải Ẩm thực & Đặc sản Bản địa
    const culinaryEl = document.getElementById("modal-culinary-strip");
    if (culinaryEl) {
      culinaryEl.innerHTML =
        `<span class="culinary-label">🍜 Đặc sản dọc cung đường:</span>` +
        info.dishes.map((d) => `<span class="culinary-pill">${d}</span>`).join("");
    }

    // 2. Render Biểu đồ Mặt cắt Độ cao Đèo SVG tương tác
    const maxElevEl = document.getElementById("modal-max-elev");
    const diffEl = document.getElementById("modal-difficulty");
    const svgWrap = document.getElementById("elevation-svg-wrap");

    if (maxElevEl) maxElevEl.textContent = `⛰️ Đỉnh cao nhất: ${info.maxElev.toLocaleString("vi-VN")}m`;
    if (diffEl) diffEl.textContent = `🧭 Độ khó: ${info.difficulty}`;
    if (!svgWrap || info.points.length === 0) return;

    const w = 640;
    const h = 110;
    const padX = 38;
    const padTop = 24;
    const padBot = 24;
    const chartW = w - padX * 2;
    const chartH = h - padTop - padBot;
    const maxE = Math.max(500, info.maxElev * 1.12);

    const coords = info.points.map((pt, i) => {
      const x =
        info.points.length > 1
          ? padX + (i / (info.points.length - 1)) * chartW
          : padX + chartW / 2;
      const y = padTop + chartH - (pt.elevation / maxE) * chartH;
      return { ...pt, x, y, idx: i };
    });

    const linePts = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" L ");
    const areaPath = `M ${coords[0].x.toFixed(1)},${padTop + chartH} L ${linePts} L ${coords[coords.length - 1].x.toFixed(1)},${padTop + chartH} Z`;

    svgWrap.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#146338" stop-opacity="0.38"/>
            <stop offset="100%" stop-color="#146338" stop-opacity="0.02"/>
          </linearGradient>
        </defs>
        <line x1="${padX}" y1="${padTop + chartH}" x2="${w - padX}" y2="${padTop + chartH}" stroke="rgba(120,130,120,0.28)" stroke-dasharray="4 4"/>
        <path d="${areaPath}" fill="url(#elevGrad)" />
        <path d="M ${linePts}" fill="none" stroke="#146338" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
        ${coords
          .map(
            (c) => `
          <g class="elev-node-group" data-idx="${c.idx}">
            <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="4.8" fill="#FFFFFF" stroke="#146338" stroke-width="2.5"/>
            <text x="${c.x.toFixed(1)}" y="${(c.y - 8).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor" font-family="JetBrains Mono, monospace">${c.elevation}m</text>
            <text x="${c.x.toFixed(1)}" y="${h - 6}" text-anchor="middle" font-size="9.5" font-weight="600" fill="currentColor">Chặng ${c.idx + 1}</text>
          </g>
        `
          )
          .join("")}
      </svg>
    `;

    svgWrap.querySelectorAll(".elev-node-group").forEach((node) => {
      node.addEventListener("click", () => {
        const idx = parseInt(node.dataset.idx, 10) || 0;
        const pt = coords[idx];
        if (pt && typeof flyToStageWaypoint === "function") {
          flyToStageWaypoint(pt.lat, pt.lng, idx);
          showToast(`⛰️ Đang bay tới ${pt.name} (Độ cao ~${pt.elevation}m)`);
        }
      });
    });

    renderFieldSurvivalRadar();
  }

  // Render Hồ Sơ Sinh Tồn Đường Đèo: Quãng trắng Cây xăng, Sóng 4G & Mặt đường thực tế (Mục 2)
  function renderFieldSurvivalRadar() {
    if (!activeRoute || !window.phuotService) return;
    const surv = window.phuotService.getFieldSurvivalProfile(
      activeRoute,
      currentWaypoints,
      selectedVehicle
    );

    const vehTag = document.getElementById("surv-vehicle-tag");
    const fuelBadge = document.getElementById("surv-fuel-badge");
    const fuelNote = document.getElementById("surv-fuel-note");
    const sigBadge = document.getElementById("surv-signal-badge");
    const sigNote = document.getElementById("surv-signal-note");
    const roadSurf = document.getElementById("surv-road-surface");
    const mechTip = document.getElementById("surv-mech-tip");

    if (vehTag) {
      vehTag.textContent =
        selectedVehicle === "motorbike" ? "🏍️ Theo chuẩn Xe máy" : "🚗 Theo chuẩn Ô tô";
    }
    if (fuelBadge) fuelBadge.textContent = `Quãng trắng ~${surv.maxFuelGapKm} km`;
    if (fuelNote) fuelNote.textContent = surv.refuelNote;
    if (sigBadge) sigBadge.textContent = `4G ~${surv.signalPct}%`;
    if (sigNote) sigNote.textContent = surv.signalNote;
    if (roadSurf) roadSurf.textContent = surv.roadSurface;
    if (mechTip) mechTip.textContent = surv.mechanicalTip;

    const survSummaryPill = document.getElementById("surv-summary-pill");
    if (survSummaryPill) {
      survSummaryPill.textContent = `📶 4G ~${surv.signalPct}% · Trắng ~${surv.maxFuelGapKm}km`;
    }

    renderFuelRangeGuard();
    renderSolarArcPanel();
  }

  // 1. RENDER CẢNH BÁO TẦM CHẠY BÌNH XĂNG & VÙNG "KHÁT XĂNG" (FUEL RANGE GUARD)
  function renderFuelRangeGuard() {
    if (!activeRoute || !window.phuotService || typeof window.phuotService.analyzeFuelRangeGuard !== "function") {
      return;
    }
    const fuel = window.phuotService.analyzeFuelRangeGuard(
      activeRoute,
      currentWaypoints,
      selectedVehicleModel
    );

    const terrainNoteEl = document.getElementById("frg-terrain-note");
    const riskBadgeEl = document.getElementById("frg-risk-badge");
    const tankEl = document.getElementById("frg-tank-metric");
    const safeEl = document.getElementById("frg-safe-metric");
    const gapEl = document.getElementById("frg-gap-metric");
    const litersEl = document.getElementById("frg-liters-metric");
    const trackEl = document.getElementById("frg-stage-track");
    const adviceEl = document.getElementById("frg-advice-box");

    if (terrainNoteEl) {
      terrainNoteEl.textContent = `${fuel.vehicleName} (Bình ${fuel.tankLiters}L · ${fuel.actualLPer100}L/100km) · ${fuel.terrainNote}`;
    }
    if (riskBadgeEl) {
      riskBadgeEl.className = `frg-risk-badge ${fuel.riskLevel}`;
      riskBadgeEl.textContent = fuel.riskLabel;
    }
    if (tankEl) tankEl.textContent = `~${fuel.effectiveRangeKm} km`;
    if (safeEl) safeEl.textContent = `~${fuel.safeReserveRangeKm} km`;
    if (gapEl) {
      gapEl.textContent = `~${fuel.dryGapKm} km`;
      gapEl.style.color =
        fuel.riskLevel === "critical"
          ? "var(--accent-danger)"
          : fuel.riskLevel === "caution"
            ? "var(--accent-amber)"
            : "var(--accent-green)";
    }
    if (litersEl) litersEl.textContent = `~${fuel.totalLiters} L`;

    if (trackEl) {
      trackEl.innerHTML = fuel.stageNodes
        .map((node, idx) => {
          const shortName = node.name.length > 22 ? node.name.slice(0, 21) + "…" : node.name;
          const pct = node.pctArrival;
          const barClass = node.mustRefuelHere ? "refuel" : node.gaugeState;
          return `
            <button type="button" class="frg-stage-node ${node.mustRefuelHere ? "is-refuel-stop" : ""}" data-idx="${idx}" title="${node.refuelReason || `${node.name} — Còn ~${pct}% bình`}">
              <div class="frg-node-top">
                <span class="frg-node-idx">C${node.index}</span>
                <span class="frg-node-pct ${barClass}">${pct}%</span>
              </div>
              <div class="frg-mini-gauge">
                <span class="frg-mini-fill ${barClass}" style="width: ${pct}%;"></span>
              </div>
              <span class="frg-node-name">${shortName}</span>
              ${
                node.mustRefuelHere
                  ? `<span class="frg-refuel-pill">⛽ Đổ đầy!</span>`
                  : idx === 0
                    ? `<span class="frg-start-pill">🏁 Đầy 100%</span>`
                    : `<span class="frg-km-pill">+${node.legKm} km</span>`
              }
            </button>
          `;
        })
        .join("");

      trackEl.querySelectorAll(".frg-stage-node").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx, 10) || 0;
          const node = fuel.stageNodes[idx];
          if (node && typeof flyToStageWaypoint === "function") {
            flyToStageWaypoint(node.lat, node.lng, idx);
            showToast(
              node.mustRefuelHere
                ? `⛽ Điểm đổ xăng chiến lược: ${node.name} (Còn ~${node.pctArrival}% bình)`
                : `📍 Bay tới Chặng ${node.index}: ${node.name} (Ước tính còn ~${node.pctArrival}% bình)`
            );
          }
        });
      });
    }

    if (adviceEl) {
      adviceEl.className = `frg-advice-box ${fuel.riskLevel}`;
      adviceEl.innerHTML = `
        <strong>${fuel.needsSpareCan ? "🚨 Khuyến cáo mang chai xăng dự phòng 1.5–2L:" : "💡 Chiến lược đổ xăng:"}</strong>
        ${fuel.summaryAdvice}
      `;
    }
  }

  // 2. RENDER VÒNG CUNG MẶT TRỜI & HƯỚNG NẮNG THỰC TẾ (SOLAR ARC & GLARE COMPASS)
  const solarDateInput = document.getElementById("solar-date-input");
  if (solarDateInput) {
    const localNow = new Date();
    const todayIso = `${localNow.getFullYear()}-${String(localNow.getMonth() + 1).padStart(2, "0")}-${String(localNow.getDate()).padStart(2, "0")}`;
    solarDateInput.value = todayIso;
    solarDateInput.addEventListener("change", () => {
      renderSolarArcPanel();
    });
  }

  function renderSolarArcPanel() {
    if (!activeRoute || !window.phuotService || typeof window.phuotService.calculateSolarArcAndGlare !== "function") {
      return;
    }
    const chosenDate = solarDateInput && solarDateInput.value ? solarDateInput.value : null;
    const depTimeVal = pacingStartInput ? pacingStartInput.value : "05:30";

    const solar = window.phuotService.calculateSolarArcAndGlare(
      activeRoute,
      currentWaypoints,
      chosenDate,
      depTimeVal
    );

    const subEl = document.getElementById("solar-location-sub");
    const glareBadgeEl = document.getElementById("solar-glare-badge");
    const solarSummaryPill = document.getElementById("solar-summary-pill");
    const svgWrapEl = document.getElementById("solar-arc-svg-wrap");
    const timesEl = document.getElementById("solar-times-strip");
    const glareAdviceEl = document.getElementById("solar-glare-advice");
    const photoTipEl = document.getElementById("solar-photo-tip");

    if (subEl) {
      subEl.textContent = `📍 ${solar.pointName} (${solar.lat.toFixed(2)}°N, ${solar.lng.toFixed(2)}°E) · Ngày ${solar.displayDate}`;
    }
    if (solarSummaryPill) {
      solarSummaryPill.textContent = `🌅 ${solar.sunriseStr} – ${solar.sunsetStr} · ${solar.routeDir}`;
    }
    if (glareBadgeEl) {
      glareBadgeEl.className = `solar-glare-badge ${solar.glareLevel}`;
      glareBadgeEl.textContent = solar.glareBadge;
    }

    if (svgWrapEl) {
      // Vẽ Vòng cung Mặt Trời SVG chuẩn xác + La bàn hướng chạy cung đường
      const cx = 135;
      const cy = 104;
      const r = 78;
      // Vị trí mặt trời dọc vòng cung từ 180° (Đông/trái) -> 0° (Tây/phải)
      const prog = solar.isBeforeSunrise ? 0.03 : solar.isAfterSunset ? 0.97 : solar.sunProgress;
      const theta = Math.PI * (1 - prog);
      const sunX = cx + r * Math.cos(theta);
      const sunY = cy - r * Math.sin(theta);

      // Góc mũi tên hướng cung đường trong mini la bàn (trung tâm 270, 62)
      const compX = 278;
      const compY = 62;
      const compR = 36;
      const bearingRad = ((solar.routeBearing - 90) * Math.PI) / 180;
      const arrowX = compX + (compR - 7) * Math.cos(bearingRad);
      const arrowY = compY + (compR - 7) * Math.sin(bearingRad);

      const riseRad = ((solar.sunriseAzimuth - 90) * Math.PI) / 180;
      const setRad = ((solar.sunsetAzimuth - 90) * Math.PI) / 180;
      const riseDotX = compX + (compR - 2) * Math.cos(riseRad);
      const riseDotY = compY + (compR - 2) * Math.sin(riseRad);
      const setDotX = compX + (compR - 2) * Math.cos(setRad);
      const setDotY = compY + (compR - 2) * Math.sin(setRad);

      svgWrapEl.innerHTML = `
        <svg viewBox="0 0 335 128" width="100%" height="100%" aria-label="Biểu đồ vòng cung mặt trời và la bàn hướng nắng">
          <defs>
            <linearGradient id="solarSkyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.34"/>
              <stop offset="50%" stop-color="#FBBF24" stop-opacity="0.14"/>
              <stop offset="100%" stop-color="#EA580C" stop-opacity="0.34"/>
            </linearGradient>
            <linearGradient id="solarArcStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#F59E0B"/>
              <stop offset="50%" stop-color="#FDE047"/>
              <stop offset="100%" stop-color="#F97316"/>
            </linearGradient>
          </defs>

          <!-- Vùng vòm trời ban ngày -->
          <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} Z" fill="url(#solarSkyGrad)" />
          <!-- Đường chân trời -->
          <line x1="22" y1="${cy}" x2="226" y2="${cy}" class="solar-horizon-line" stroke-width="1.4" stroke-dasharray="4 3"/>
          <!-- Quỹ đạo vòng cung Mặt Trời -->
          <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="url(#solarArcStroke)" stroke-width="3" stroke-linecap="round"/>

          <!-- Dải giờ vàng sáng & chiều -->
          <circle cx="${cx - r}" cy="${cy}" r="4.5" fill="#F59E0B"/>
          <circle cx="${cx + r}" cy="${cy}" r="4.5" fill="#EA580C"/>

          <!-- Vị trí Mặt Trời theo giờ xuất phát -->
          <circle cx="${sunX.toFixed(1)}" cy="${sunY.toFixed(1)}" r="10.5" fill="#F59E0B" opacity="0.28"/>
          <circle cx="${sunX.toFixed(1)}" cy="${sunY.toFixed(1)}" r="5.5" fill="#FBBF24" stroke="#FFFFFF" stroke-width="1.6"/>
          <text x="${cx}" y="18" text-anchor="middle" class="solar-svg-label-strong" font-size="9.5">☀️ Đứng bóng ${solar.solarNoonStr}</text>
          <text x="${cx - r}" y="${cy + 16}" text-anchor="middle" class="solar-svg-label" font-size="9.5">🌅 ${solar.sunriseStr}</text>
          <text x="${cx + r}" y="${cy + 16}" text-anchor="middle" class="solar-svg-label" font-size="9.5">🌇 ${solar.sunsetStr}</text>
          <text x="${cx}" y="${cy + 16}" text-anchor="middle" class="solar-svg-muted" font-size="8.5">Ban ngày: ${solar.daylightText}</text>

          <!-- La bàn mini so sánh Hướng chạy cung đường vs Hướng Mặt Trời -->
          <circle cx="${compX}" cy="${compY}" r="${compR}" class="solar-compass-ring" fill="none" stroke-width="1.5"/>
          <line x1="${compX}" y1="${compY - compR + 4}" x2="${compX}" y2="${compY + compR - 4}" class="solar-horizon-line" stroke-width="0.9" stroke-dasharray="2 2"/>
          <line x1="${compX - compR + 4}" y1="${compY}" x2="${compX + compR - 4}" y2="${compY}" class="solar-horizon-line" stroke-width="0.9" stroke-dasharray="2 2"/>
          <text x="${compX}" y="${compY - compR - 4}" text-anchor="middle" class="solar-svg-muted" font-size="8.5" font-weight="800">B</text>
          <text x="${compX + compR + 8}" y="${compY + 3}" text-anchor="middle" class="solar-svg-muted" font-size="8">Đ</text>
          <text x="${compX - compR - 8}" y="${compY + 3}" text-anchor="middle" class="solar-svg-muted" font-size="8">T</text>
          <text x="${compX}" y="${compY + compR + 11}" text-anchor="middle" class="solar-svg-muted" font-size="8">N</text>

          <!-- Chấm Bình minh (vàng) & Hoàng hôn (cam đỏ) trên vành la bàn -->
          <circle cx="${riseDotX.toFixed(1)}" cy="${riseDotY.toFixed(1)}" r="4.2" fill="#F59E0B" stroke="#FFFFFF" stroke-width="1.2"/>
          <circle cx="${setDotX.toFixed(1)}" cy="${setDotY.toFixed(1)}" r="4.2" fill="#EA580C" stroke="#FFFFFF" stroke-width="1.2"/>

          <!-- Mũi tên hướng chạy chính của cung đường -->
          <line x1="${compX}" y1="${compY}" x2="${arrowX.toFixed(1)}" y2="${arrowY.toFixed(1)}" class="solar-heading-arrow" stroke-width="3" stroke-linecap="round"/>
          <circle cx="${arrowX.toFixed(1)}" cy="${arrowY.toFixed(1)}" r="3.4" class="solar-heading-dot"/>
          <circle cx="${compX}" cy="${compY}" r="3" class="solar-heading-dot"/>

          <text x="${compX}" y="${cy + 16}" text-anchor="middle" class="solar-svg-label-strong" font-size="8.8">🧭 ${solar.routeDir} (${solar.routeBearing}°)</text>
        </svg>
      `;
    }

    if (timesEl) {
      timesEl.innerHTML = `
        <div class="solar-time-pill">
          <small>🌅 Giờ Vàng Sáng</small>
          <strong>${solar.goldenMorningRange}</strong>
        </div>
        <div class="solar-time-pill">
          <small>🌇 Giờ Vàng Chiều</small>
          <strong>${solar.goldenEveningRange}</strong>
        </div>
        <div class="solar-time-pill">
          <small>🧭 Hướng Mặt Trời</small>
          <strong>${solar.sunriseDir} ➔ ${solar.sunsetDir}</strong>
        </div>
        <div class="solar-time-pill">
          <small>🕒 Giờ xuất phát</small>
          <strong>${solar.departureTimeStr} ${solar.isBeforeSunrise ? "(Trước bình minh)" : solar.isAfterSunset ? "(Sau hoàng hôn)" : "(Trong ngày)"}</strong>
        </div>
      `;
    }

    if (glareAdviceEl) glareAdviceEl.innerHTML = `<strong>🕶️ Phân tích hướng nắng:</strong> ${solar.glareAdvice}`;
    if (photoTipEl) photoTipEl.textContent = solar.photoTip;
  }

  const btnFitAllStages = document.getElementById("btn-fit-all-stages");
  if (btnFitAllStages) {
    btnFitAllStages.addEventListener("click", () => {
      if (activeRoute) {
        renderRouteMap(activeRoute, currentWaypoints);
        showToast("🗺️ Đã thu phóng toàn tuyến hành trình.");
      }
    });
  }

  function renderDraggableWaypoints() {
    const container = document.getElementById("draggable-waypoints");
    container.innerHTML = "";

    currentWaypoints.forEach((wp, index) => {
      const chip = document.createElement("div");
      chip.className = "wp-chip";
      chip.draggable = true;
      chip.dataset.index = index;
      chip.innerHTML = `<span class="wp-num">${index + 1}</span><span>${wp.name}</span>`;

      chip.addEventListener("dragstart", () => {
        draggedWpIndex = index;
        chip.classList.add("dragging");
      });

      chip.addEventListener("dragend", () => {
        chip.classList.remove("dragging");
        document.querySelectorAll(".wp-chip").forEach((c) => c.classList.remove("drag-over"));
      });

      chip.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (draggedWpIndex !== index) chip.classList.add("drag-over");
      });

      chip.addEventListener("dragleave", () => {
        chip.classList.remove("drag-over");
      });

      chip.addEventListener("drop", (e) => {
        e.preventDefault();
        chip.classList.remove("drag-over");
        if (draggedWpIndex === null || draggedWpIndex === index) return;

        const movedItem = currentWaypoints.splice(draggedWpIndex, 1)[0];
        currentWaypoints.splice(index, 0, movedItem);
        draggedWpIndex = null;

        renderDraggableWaypoints();
        renderStageBreakdownTimeline();
        updateGoogleMapsNavLink();
        renderRouteMap(activeRoute, currentWaypoints);
        updateCostCalculator();
        showToast("🗺️ Đã cập nhật thứ tự lộ trình & cự ly từng chặng!");
      });

      container.appendChild(chip);
    });

    renderStageBreakdownTimeline();
  }

  const btnReverseWaypoints = document.getElementById("btn-reverse-waypoints");
  if (btnReverseWaypoints) {
    btnReverseWaypoints.addEventListener("click", () => {
      if (!activeRoute) return;
      currentWaypoints.reverse();
      renderDraggableWaypoints();
      updateGoogleMapsNavLink();
      renderRouteMap(activeRoute, currentWaypoints);
      updateCostCalculator();
      showToast("⇄ Đã đảo ngược chiều lộ trình!");
    });
  }

  document.getElementById("btn-reset-waypoints").addEventListener("click", () => {
    if (!activeRoute) return;
    currentWaypoints = [...activeRoute.waypoints];
    renderDraggableWaypoints();
    updateGoogleMapsNavLink();
    renderRouteMap(activeRoute, currentWaypoints);
    updateCostCalculator();
    showToast("↩️ Đã khôi phục lộ trình mặc định.");
  });

  // =========================================================================
  // 6.B ĐÁNH GIÁ CUNG ĐƯỜNG (1-5 SAO), BÌNH CHỌN HỮU ÍCH & CHINH PHỤC CUNG
  // =========================================================================
  let selectedReviewRating = 5;
  const starPicker = document.getElementById("review-star-picker");
  if (starPicker) {
    const starBtns = starPicker.querySelectorAll(".star-btn");
    starBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedReviewRating = parseInt(btn.dataset.val, 10) || 5;
        starBtns.forEach((b) => {
          b.classList.toggle("active", (parseInt(b.dataset.val, 10) || 0) <= selectedReviewRating);
        });
      });
    });
  }

  function updateConquerButtonState() {
    const btnConquer = document.getElementById("btn-conquer-route");
    if (!btnConquer || !activeRoute || !window.phuotDB) return;
    const user = window.phuotDB.getCurrentUser();
    const isConquered = user && user.conqueredRoutes && user.conqueredRoutes.includes(activeRoute.id);
    btnConquer.classList.toggle("conquered", !!isConquered);
    btnConquer.innerHTML = isConquered
      ? `✔ Đã Chinh Phục (+${activeRoute.distanceKm} km)`
      : `🏆 Đánh dấu Đã Chinh Phục`;
  }

  const btnConquerRoute = document.getElementById("btn-conquer-route");
  if (btnConquerRoute) {
    btnConquerRoute.addEventListener("click", () => {
      if (!activeRoute || !window.phuotDB) return;
      const { user, added } = window.phuotDB.toggleConqueredRoute(activeRoute.id);
      updateConquerButtonState();
      syncPassportUserUI();
      renderRoutes();
      syncMasterAtlasPinsAndStats();
      if (added) {
        triggerConquestCelebration(btnConquerRoute);
      }
      showToast(
        added
          ? `🏆 Chúc mừng! Đã cộng +${activeRoute.distanceKm} km vào Hộ chiếu của ${user.name}!`
          : `↩️ Đã bỏ đánh dấu chinh phục cung đường này.`
      );
    });
  }

  function renderCommunityReviews(routeId) {
    const container = document.getElementById("community-reviews-list");
    const countLabel = document.getElementById("route-review-count-label");
    const avgStarEl = document.querySelector("#route-rating-summary .rating-star-big");
    if (!container || !window.phuotDB) return;

    const reviews = window.phuotDB.getReviewsForRoute(routeId);
    container.innerHTML = "";

    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
        : "5.0";
    if (avgStarEl) avgStarEl.textContent = `⭐ ${avgRating}`;
    if (countLabel) countLabel.textContent = `(${reviews.length} chia sẻ)`;
    const tabRevBadge = document.getElementById("tab-review-count-badge");
    if (tabRevBadge) tabRevBadge.textContent = String(reviews.length);

    reviews.forEach((rev) => {
      const div = document.createElement("div");
      div.className = "review-card";
      const starsStr = "★".repeat(rev.rating || 5) + "☆".repeat(5 - (rev.rating || 5));
      div.innerHTML = `
        <div class="review-head">
          <div class="chat-user-info">
            <span class="review-author">👤 ${rev.author}</span>
            ${rev.rank ? `<span class="chat-user-rank">${rev.rank}</span>` : ""}
          </div>
          <span class="review-meta">${rev.vehicle} · ${rev.date} · <strong style="color:#F59E0B;">${starsStr}</strong></span>
        </div>
        <p class="review-note">${rev.note}</p>
        <div class="review-foot">
          <span class="review-topic-tag">${rev.topic || "⭐ Chia sẻ thực địa"}</span>
          <button type="button" class="btn-like-helpful">👍 Hữu ích (<span>${rev.likes || 1}</span>)</button>
        </div>
      `;

      const likeBtn = div.querySelector(".btn-like-helpful");
      likeBtn.addEventListener("click", () => {
        if (likeBtn.classList.contains("liked")) return;
        likeBtn.classList.add("liked");
        const numSpan = likeBtn.querySelector("span");
        numSpan.textContent = parseInt(numSpan.textContent, 10) + 1;
        showToast("👍 Cảm ơn bạn đã bình chọn chia sẻ hữu ích!");
      });

      container.appendChild(div);
    });
  }

  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!activeRoute || !window.phuotDB) return;
      const authorEl = document.getElementById("review-author");
      const vehicleEl = document.getElementById("review-vehicle");
      const topicEl = document.getElementById("review-topic");
      const noteEl = document.getElementById("review-note");
      const broadcastEl = document.getElementById("review-broadcast-chat");

      const author = authorEl.value.trim();
      const note = noteEl.value.trim();
      if (!author || !note) return;

      const currentUser = window.phuotDB.getCurrentUser();
      const rank = currentUser ? currentUser.rankTitle : "Phượt Thủ Thực Địa";
      const topic = topicEl ? topicEl.value : "⚠️ Kinh nghiệm đường đèo";

      window.phuotDB.addReviewForRoute(activeRoute.id, {
        author,
        rank,
        vehicle: vehicleEl.value,
        rating: selectedReviewRating,
        topic,
        note
      });

      // Đồng bộ lên Kênh Chat Cộng Đồng nếu người dùng tích chọn
      if (broadcastEl && broadcastEl.checked) {
        window.phuotDB.addChatMessage("toan-quoc", {
          author,
          rank,
          avatar: currentUser ? currentUser.avatar : "🏍️",
          tag: topic,
          routeId: activeRoute.id,
          routeName: activeRoute.title.split("—")[0].trim(),
          text: `[Đánh giá ${selectedReviewRating}★] ${note}`
        });
      }

      noteEl.value = "";
      renderCommunityReviews(activeRoute.id);
      showToast("💬 Đã đăng đánh giá & đồng bộ lên Kênh Cộng Đồng!");
    });
  }

  // Điều khiển 3 Tab Gọn Mượt trong Buồng lái Tầng 3 (Mục 3)
  const cockpitTabBtns = document.querySelectorAll(".cockpit-tab-btn");
  const cockpitTabPanels = document.querySelectorAll(".cockpit-tab-panel");

  function switchCockpitLeftTab(tabKey = "map") {
    cockpitTabBtns.forEach((btn) => {
      const isAct = btn.dataset.cockpitTab === tabKey;
      btn.classList.toggle("active", isAct);
      btn.setAttribute("aria-selected", isAct ? "true" : "false");
    });
    cockpitTabPanels.forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.cockpitPanel !== tabKey);
    });
    if (tabKey === "map" && typeof map3d !== "undefined" && map3d) {
      setTimeout(() => map3d.resize(), 80);
    }
  }

  cockpitTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchCockpitLeftTab(btn.dataset.cockpitTab || "map");
    });
  });

  // Bộ chuyển đổi chế độ xem Lưới đẹp / Danh sách gọn (Mục 2)
  const viewModeBtns = document.querySelectorAll(".view-mode-btn");
  const savedViewPref = localStorage.getItem("phuot_catalog_view_mode") || "grid";
  viewModeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === savedViewPref);
    btn.addEventListener("click", () => {
      const nextView = btn.dataset.view || "grid";
      localStorage.setItem("phuot_catalog_view_mode", nextView);
      viewModeBtns.forEach((b) => b.classList.toggle("active", b === btn));
      renderRoutes();
    });
  });

  function openRouteModal(route, customWaypointsFromSaved = null) {
    activeRoute = route;
    currentWaypoints = customWaypointsFromSaved
      ? [...customWaypointsFromSaved]
      : [...route.waypoints];
    const isBestSeason = route.bestMonths.includes(currentMonth);

    // Cập nhật Ảnh bìa toàn cảnh đầu Buồng lái (Mục 3)
    const coverImgEl = document.getElementById("modal-cover-img");
    const coverCapEl = document.getElementById("modal-cover-caption");
    if (coverImgEl) {
      coverImgEl.src = route.image;
      coverImgEl.alt = route.title;
      coverImgEl.onerror = () => {
        coverImgEl.onerror = null;
        coverImgEl.src = route.fallbackImage;
      };
    }
    if (coverCapEl) {
      const startName = currentWaypoints[0]?.name || "";
      const endName = currentWaypoints[currentWaypoints.length - 1]?.name || "";
      coverCapEl.textContent = `📍 ${route.region} · ${startName} ➔ ${endName}`;
    }

    switchCockpitLeftTab("map");

    document.getElementById("modal-region").textContent = route.region;
    document.getElementById("modal-season").textContent = isBestSeason
      ? `✨ Tháng ${currentMonth} đang vào mùa đẹp (${route.bestTimeText})`
      : `🗓️ Thời điểm lý tưởng: ${route.bestTimeText}`;

    const distBadge = document.getElementById("modal-distance-badge");
    if (distBadge) {
      distBadge.textContent = `🛣️ ~${route.distanceKm} km · ${route.defaultDays}N${Math.max(1, route.defaultDays - 1)}Đ`;
    }

    document.getElementById("modal-title").textContent = route.title;
    document.getElementById("modal-desc").textContent = route.description;

    fetchDestinationWeather(route);
    renderDraggableWaypoints();
    updateVehicleNotice();
    updateGoogleMapsNavLink();
    updateConquerButtonState();
    syncPassportUserUI();

    inputDays.value = route.defaultDays;
    inputPeople.value = 1;
    updateCostCalculator();
    renderChecklist(route);
    renderCommunityReviews(route.id);
    updateTierNavigationUI();

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    userGpsMarker = null;
    renderRouteMap(route, currentWaypoints);
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    activeRoute = null;
    updateTierNavigationUI();
  }

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  let activeCostSplitMode = "equal"; // "equal" | "xe-om"
  const splitTabBtns = document.querySelectorAll(".split-tab-btn");
  splitTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      splitTabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCostSplitMode = btn.dataset.split || "equal";
      updateCostCalculator();
    });
  });

  function updateCostCalculator() {
    if (!activeRoute) return;

    const days = Math.max(1, parseInt(inputDays.value, 10) || 1);
    const people = Math.max(1, parseInt(inputPeople.value, 10) || 1);
    const nights = Math.max(0, days - 1);

    const isMotorbike = selectedVehicle === "motorbike";
    const vehiclesCount = isMotorbike ? Math.ceil(people / 2) : Math.ceil(people / 4);
    const vehicleReadiness = window.phuotService
      ? window.phuotService.evaluateVehicleReadiness(activeRoute, selectedVehicleModel)
      : null;
    const fuelMultiplier = vehicleReadiness
      ? vehicleReadiness.fuelMultiplier
      : isMotorbike
        ? 1
        : 3.2;
    const fuelRate = Math.round(activeRoute.costConfig.fuelPerKm * fuelMultiplier);
    const vehicleLabel = vehicleReadiness
      ? vehicleReadiness.shortName
      : isMotorbike
        ? "xe máy"
        : "ô tô";

    const fuelTotal = activeRoute.distanceKm * fuelRate * vehiclesCount;
    const foodTotal = days * activeRoute.costConfig.foodPerDay * people;
    const stayTotal = nights * activeRoute.costConfig.stayPerNight * people;
    const bufferTotal = activeRoute.costConfig.buffer * people;
    const grandTotal = fuelTotal + foodTotal + stayTotal + bufferTotal;
    lastCalculatedTotal = grandTotal;

    document.getElementById("seg-fuel").style.width = `${(fuelTotal / grandTotal) * 100}%`;
    document.getElementById("seg-food").style.width = `${(foodTotal / grandTotal) * 100}%`;
    document.getElementById("seg-stay").style.width = `${(stayTotal / grandTotal) * 100}%`;
    document.getElementById("seg-buffer").style.width = `${(bufferTotal / grandTotal) * 100}%`;

    const breakdownEl = document.getElementById("cost-breakdown");
    breakdownEl.innerHTML = `
      <li><span>⛽ Nhiên liệu (${vehiclesCount} ${vehicleLabel} × ${activeRoute.distanceKm}km):</span> <span>${formatVND(fuelTotal)}</span></li>
      <li><span>🍜 Ăn uống (${days} ngày × ${people} người):</span> <span>${formatVND(foodTotal)}</span></li>
      <li><span>🏡 Lưu trú (${nights} đêm × ${people} người):</span> <span>${formatVND(stayTotal)}</span></li>
      <li><span>🎟️ Vé tham quan & Dự phòng:</span> <span>${formatVND(bufferTotal)}</span></li>
    `;

    // Cập nhật hộp Chia Tiền Đoàn (Quỹ chung vs Xế - Ôm)
    const splitSummaryEl = document.getElementById("group-split-summary");
    const commonFundPerPerson = (foodTotal + stayTotal + bufferTotal) / people;
    const fuelPerVehicle = fuelTotal / Math.max(1, vehiclesCount);
    let splitSummaryText = "";

    if (splitSummaryEl) {
      if (activeCostSplitMode === "xe-om") {
        splitSummaryEl.innerHTML = `
          <div>💵 <strong>Quỹ Ăn + Ngủ + Vé chung:</strong> <strong>${formatVND(commonFundPerPerson)}</strong> / người</div>
          <div>⛽ <strong>Xăng chia riêng từng xe (${vehiclesCount} ${vehicleLabel}):</strong> <strong>${formatVND(fuelPerVehicle)}</strong> / xe ${
            isMotorbike && people >= 2 ? `(Cặp Xế–Ôm chia ~${formatVND(fuelPerVehicle / 2)}/người)` : ""
          }</div>
        `;
        splitSummaryText = `  • Quỹ ăn ở chung: ${formatVND(commonFundPerPerson)}/người | Xăng riêng mỗi xe: ${formatVND(fuelPerVehicle)}/xe`;
      } else {
        splitSummaryEl.innerHTML = `
          <div>👥 <strong>Mỗi thành viên đóng trọn gói:</strong> <strong>${formatVND(grandTotal / people)}</strong> / người (Đã bao gồm tất cả xăng + ăn ở + dự phòng cho đoàn ${people} người).</div>
        `;
        splitSummaryText = `  • Chia đều trọn gói: ${formatVND(grandTotal / people)}/người`;
      }
    }

    document.getElementById("cost-total").textContent = formatVND(grandTotal);
    const perPersonEl = document.getElementById("cost-per-person-sub");
    if (perPersonEl) {
      perPersonEl.textContent =
        people > 1 ? `~${formatVND(grandTotal / people)} / người` : "Cho 1 người";
    }

    lastCalculatedSummary = [
      `🗺️ KẾ HOẠCH CUNG ĐƯỜNG: ${activeRoute.title}`,
      `🚘 Phương tiện: ${isMotorbike ? "Xe máy" : "Ô tô"} (${vehiclesCount} xe)`,
      `📍 Lộ trình: ${currentWaypoints.map((w) => w.name).join(" → ")} (~${activeRoute.distanceKm} km)`,
      `⏱️ Thời gian: ${days} ngày ${nights} đêm (${people} người)`,
      `💰 Dự trù kinh phí:`,
      `  - Nhiên liệu: ${formatVND(fuelTotal)}`,
      `  - Ăn uống: ${formatVND(foodTotal)}`,
      `  - Lưu trú: ${formatVND(stayTotal)}`,
      `  - Vé & dự phòng: ${formatVND(bufferTotal)}`,
      splitSummaryText,
      `👉 TỔNG CỘNG: ${formatVND(grandTotal)} (~${formatVND(grandTotal / people)}/người)`
    ].join("\n");
  }

  inputDays.addEventListener("input", () => {
    updateCostCalculator();
    renderStageBreakdownTimeline();
  });
  inputPeople.addEventListener("input", updateCostCalculator);

  document.getElementById("btn-copy-plan").addEventListener("click", async () => {
    if (!lastCalculatedSummary) return;
    try {
      await navigator.clipboard.writeText(lastCalculatedSummary);
      showToast("📋 Đã copy lịch trình & bảng tính tiền gửi nhóm!");
    } catch {
      alert(lastCalculatedSummary);
    }
  });

  // =========================================================================
  // 7. SỔ TAY LỊCH TRÌNH ĐÃ LƯU (TIER 3 DATA PERSISTENCE)
  // =========================================================================
  const savedTripsModal = document.getElementById("saved-trips-modal");
  const savedTripsCountEl = document.getElementById("saved-trips-count");

  function updateSavedTripsBadge() {
    if (!savedTripsCountEl || !window.phuotDB) return;
    const trips = window.phuotDB.getSavedTrips();
    savedTripsCountEl.textContent = trips.length;
  }

  function renderSavedTripsModalList() {
    const listEl = document.getElementById("saved-trips-list");
    if (!listEl || !window.phuotDB) return;
    const trips = window.phuotDB.getSavedTrips();
    listEl.innerHTML = "";

    if (trips.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; background: var(--bg-card); border-radius: 14px; border: 1px dashed var(--border-strong);">
          <p style="color: var(--text-secondary); font-weight: 600;">Bạn chưa lưu lịch trình nào vào Sổ tay.</p>
          <p style="color: var(--text-muted); font-size: 0.86rem; margin-top: 0.35rem;">Hãy mở một cung đường bất kỳ và nhấn nút <strong>"🔖 Lưu sổ tay"</strong> ở bảng Dự trù kinh phí.</p>
        </div>
      `;
      return;
    }

    trips.forEach((trip) => {
      const card = document.createElement("div");
      card.className = "saved-trip-card";
      card.innerHTML = `
        <div class="stc-info">
          <h4>${trip.title}</h4>
          <div class="stc-meta">
            <span>🚘 ${trip.vehicle === "motorbike" ? "Xe máy" : "Ô tô"}</span>
            <span>⏱️ ${trip.days} ngày · ${trip.people} người</span>
            <span>💰 Tổng: <strong style="color: var(--accent-amber);">${formatVND(trip.totalCost)}</strong></span>
          </div>
          <small style="color: var(--text-muted); display: block; margin-top: 0.3rem;">
            Lộ trình: ${trip.waypoints.map((w) => w.name).join(" → ")}
          </small>
        </div>
        <div class="stc-actions">
          <button type="button" class="btn-save-small btn-open-trip">Mở lại Buồng lái</button>
          <button type="button" class="btn-text-danger btn-del-trip">Xóa</button>
        </div>
      `;

      card.querySelector(".btn-open-trip").addEventListener("click", () => {
        const foundRoute = ROUTES_DATA.find((r) => r.id === trip.routeId);
        if (foundRoute) {
          savedTripsModal.classList.add("hidden");
          openRouteModal(foundRoute, trip.waypoints);
          inputDays.value = trip.days;
          inputPeople.value = trip.people;
          selectedVehicle = trip.vehicle;
          vehicleButtons.forEach((b) =>
            b.classList.toggle("active", b.dataset.vehicle === selectedVehicle)
          );
          updateCostCalculator();
        }
      });

      card.querySelector(".btn-del-trip").addEventListener("click", () => {
        window.phuotDB.deleteTrip(trip.id || trip.routeId);
        updateSavedTripsBadge();
        renderSavedTripsModalList();
        showToast("🗑️ Đã xóa lịch trình khỏi Sổ tay.");
      });

      listEl.appendChild(card);
    });
  }

  const btnSaveTrip = document.getElementById("btn-save-trip");
  if (btnSaveTrip) {
    btnSaveTrip.addEventListener("click", () => {
      if (!activeRoute || !window.phuotDB) return;
      const days = Math.max(1, parseInt(inputDays.value, 10) || 1);
      const people = Math.max(1, parseInt(inputPeople.value, 10) || 1);

      window.phuotDB.saveTrip({
        routeId: activeRoute.id,
        title: activeRoute.title,
        vehicle: selectedVehicle,
        days,
        people,
        totalCost: lastCalculatedTotal,
        waypoints: [...currentWaypoints]
      });

      updateSavedTripsBadge();
      showToast("🔖 Đã lưu lịch trình tùy biến vào Sổ tay Hành trình!");
    });
  }

  const btnOpenSavedTrips = document.getElementById("btn-open-saved-trips");
  const savedTripsClose = document.getElementById("saved-trips-close");
  const savedTripsBackdrop = document.getElementById("saved-trips-backdrop");

  if (btnOpenSavedTrips && savedTripsModal) {
    btnOpenSavedTrips.addEventListener("click", () => {
      renderSavedTripsModalList();
      savedTripsModal.classList.remove("hidden");
      savedTripsModal.setAttribute("aria-hidden", "false");
    });
  }
  if (savedTripsClose) {
    savedTripsClose.addEventListener("click", () => savedTripsModal.classList.add("hidden"));
  }
  if (savedTripsBackdrop) {
    savedTripsBackdrop.addEventListener("click", () => savedTripsModal.classList.add("hidden"));
  }

  // =========================================================================
  // 8. CHECKLIST HÀNH TRANG THÔNG MINH THEO THỜI TIẾT THỰC TẾ (MỤC 5) & ĐỊNH VỊ GPS
  // =========================================================================
  function getLiveWeatherAdaptiveGear(route) {
    const w = currentRouteLiveWeather;
    const lwgBadge = document.getElementById("lwg-badge");
    const lwgTempSummary = document.getElementById("lwg-temp-summary");
    const lwgAdviceText = document.getElementById("lwg-advice-text");

    if (!w) {
      if (lwgBadge) lwgBadge.textContent = "⏳ Đang quét thời tiết điểm đến";
      if (lwgTempSummary) lwgTempSummary.textContent = "Đang đồng bộ...";
      if (lwgAdviceText) {
        lwgAdviceText.textContent =
          "Hệ thống tự động ghim các món đồ cấp thiết nhất ngay khi tải xong nhiệt độ và khả năng mưa tại điểm đến.";
      }
      return [];
    }

    const adaptiveItems = [];
    if (w.temp <= 16) {
      adaptiveItems.push(
        `🧥 [Thời tiết ${w.temp}°C tại ${w.pointName}] Áo giữ nhiệt, áo gió chống lạnh & găng tay kín gió`
      );
      adaptiveItems.push(`🔥 [Trời lạnh vùng cao] Miếng dán giữ nhiệt & bình giữ nhiệt trà gừng nóng`);
    } else if (w.temp >= 28) {
      adaptiveItems.push(
        `☀️ [Trời nắng ${w.temp}°C tại ${w.pointName}] Áo khoác chống tia UV, kính râm phân cực & kem chống nắng`
      );
      adaptiveItems.push(`💧 [Bù nước đường dài] Nước điện giải / Oresol & khăn lạnh lau mặt`);
    } else {
      adaptiveItems.push(
        `🌤️ [Thời tiết ${w.temp}°C mát mẻ] Áo khoác gió nhẹ mặc sáng sớm & chiều tối trên đèo`
      );
    }

    if (w.rainProb >= 45) {
      adaptiveItems.push(
        `🌧️ [Cảnh báo mưa ${w.rainProb}% hôm nay] Áo mưa bộ 2 mảnh, ủng bọc giày & túi bọc balo chống nước`
      );
    } else if (w.wind >= 20) {
      adaptiveItems.push(
        `💨 [Gió đèo/biển ${w.wind} km/h] Mũ bảo hiểm kính chắn gió kín & dây chằng đồ chắc chắn`
      );
    } else {
      adaptiveItems.push(
        `📸 [Trời quang, mưa thấp ${w.rainProb}%] Lau sạch ống kính / chuẩn bị thẻ nhớ chụp cảnh đẹp`
      );
    }

    if (lwgBadge) {
      lwgBadge.textContent =
        w.rainProb >= 45
          ? "🌧️ Cảnh báo Mưa — Đã ghim đồ chống nước"
          : w.temp <= 16
            ? "🧥 Trời Lạnh — Đã ghim đồ giữ ấm"
            : "🌤️ Thời tiết Đẹp — Đã ghim đồ theo nhiệt độ";
    }
    if (lwgTempSummary) {
      lwgTempSummary.textContent = `${w.pointName}: ${w.temp}°C · Mưa ${w.rainProb}% · Gió ${w.wind} km/h`;
    }
    if (lwgAdviceText) {
      lwgAdviceText.textContent = `Đã tự động thêm ${adaptiveItems.length} món hành trang sát với thời tiết thực tế hôm nay tại ${w.pointName} lên đầu danh sách.`;
    }

    return adaptiveItems;
  }

  function renderChecklist(route) {
    const checkedKey = `phuot_checked_${route.id}`;
    const customKey = `phuot_custom_${route.id}`;

    const savedChecked = JSON.parse(localStorage.getItem(checkedKey) || "[]");
    const customItems = JSON.parse(localStorage.getItem(customKey) || "[]");
    const weatherAdaptiveItems = getLiveWeatherAdaptiveGear(route);
    const allItems = [
      ...weatherAdaptiveItems,
      ...route.specialGear,
      ...DEFAULT_GEAR,
      ...customItems
    ];

    const listEl = document.getElementById("checklist-items");
    const progressEl = document.getElementById("checklist-progress");
    const progressBarEl = document.getElementById("checklist-progress-bar");
    listEl.innerHTML = "";

    const updateProgress = () => {
      const checkedCount = listEl.querySelectorAll("input:checked").length;
      progressEl.textContent = `${checkedCount}/${allItems.length} món`;
      const percent = allItems.length > 0 ? (checkedCount / allItems.length) * 100 : 0;
      progressBarEl.style.width = `${percent}%`;
    };

    allItems.forEach((itemText, index) => {
      const isChecked = savedChecked.includes(itemText);
      const isWeatherItem = index < weatherAdaptiveItems.length;
      const isSpecialRouteItem =
        index >= weatherAdaptiveItems.length &&
        index < weatherAdaptiveItems.length + route.specialGear.length;

      const li = document.createElement("li");
      if (isChecked) li.classList.add("checked");
      if (isWeatherItem) li.classList.add("weather-pinned-item");

      const prefix = isSpecialRouteItem ? "⭐ " : "";
      li.innerHTML = `
        <label>
          <input type="checkbox" ${isChecked ? "checked" : ""}>
          <span>${prefix}${itemText}</span>
        </label>
      `;

      const checkbox = li.querySelector("input");
      checkbox.addEventListener("change", () => {
        li.classList.toggle("checked", checkbox.checked);
        const currentSaved = JSON.parse(localStorage.getItem(checkedKey) || "[]");
        if (checkbox.checked) {
          if (!currentSaved.includes(itemText)) currentSaved.push(itemText);
        } else {
          const idx = currentSaved.indexOf(itemText);
          if (idx > -1) currentSaved.splice(idx, 1);
        }
        localStorage.setItem(checkedKey, JSON.stringify(currentSaved));
        updateProgress();
      });

      listEl.appendChild(li);
    });

    updateProgress();
  }

  document.getElementById("add-gear-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!activeRoute) return;
    const inputEl = document.getElementById("new-gear-input");
    const newItem = inputEl.value.trim();
    if (!newItem) return;

    const customKey = `phuot_custom_${activeRoute.id}`;
    const customItems = JSON.parse(localStorage.getItem(customKey) || "[]");
    if (!customItems.includes(newItem)) {
      customItems.push(newItem);
      localStorage.setItem(customKey, JSON.stringify(customItems));
    }
    inputEl.value = "";
    renderChecklist(activeRoute);
    showToast(`🎒 Đã thêm "${newItem}" vào checklist.`);
  });

  document.getElementById("btn-reset-checklist").addEventListener("click", () => {
    if (!activeRoute) return;
    localStorage.removeItem(`phuot_checked_${activeRoute.id}`);
    renderChecklist(activeRoute);
    showToast("🔄 Đã làm mới danh sách hành trang.");
  });

  function updateEmergencyLinks(coords) {
    if (!coords) return;
    userCurrentCoords = coords;
    updateGoogleMapsNavLink();
    renderDoorToTrailheadTransfer();

    const { lat, lng } = coords;
    const gasUrl = `https://www.google.com/maps/search/trạm+xăng/@${lat},${lng},14z`;
    const repairUrl = `https://www.google.com/maps/search/sửa+xe+máy/@${lat},${lng},14z`;
    const hospitalUrl = `https://www.google.com/maps/search/bệnh+viện+trạm+y+tế/@${lat},${lng},14z`;

    document.getElementById("link-gas").href = gasUrl;
    document.getElementById("link-repair").href = repairUrl;
    document.getElementById("link-hospital").href = hospitalUrl;
    document.getElementById("hero-emergency-bar").classList.remove("hidden");

    document.getElementById("m-link-gas").href = gasUrl;
    document.getElementById("m-link-repair").href = repairUrl;
    document.getElementById("m-link-hospital").href = hospitalUrl;
    document.getElementById("modal-emergency-links").classList.remove("hidden");
  }

  document.getElementById("btn-hero-gps").addEventListener("click", () => {
    const heroStatus = document.getElementById("hero-gps-text");
    startRealtimeGPS((msg, coords) => {
      heroStatus.textContent = msg;
      if (coords) updateEmergencyLinks(coords);
    });
  });

  document.getElementById("btn-modal-gps").addEventListener("click", () => {
    const modalStatus = document.getElementById("modal-gps-status");
    startRealtimeGPS((msg, coords) => {
      modalStatus.textContent = msg;
      if (coords) updateEmergencyLinks(coords);
    });
  });

  // Xử lý menu chọn lớp bản đồ (Layer Switcher)
  const btnLayerMain = document.getElementById("btn-layer-main");
  const layerMenu = document.getElementById("layer-menu");
  const layerOptions = document.querySelectorAll(".layer-option");

  if (btnLayerMain && layerMenu) {
    btnLayerMain.addEventListener("click", () => {
      layerMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!btnLayerMain.contains(e.target) && !layerMenu.contains(e.target)) {
        layerMenu.classList.add("hidden");
      }
    });

    layerOptions.forEach((btn) => {
      btn.addEventListener("click", () => {
        const layerType = btn.dataset.layer;

        if (layerType === "3d-mode") {
          const is3D = toggleTerrain3D();
          btn.classList.toggle("active", is3D);
          btn.querySelector("span").textContent = is3D ? "Tắt 3D" : "Bật góc 3D";
        } else {
          layerOptions.forEach((b) => {
            if (b.dataset.layer !== "3d-mode") b.classList.remove("active");
          });
          btn.classList.add("active");

          let newTileUrl = "";
          if (layerType === "satellite") {
            newTileUrl =
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            document.querySelector(".main-thumb").style.backgroundImage =
              "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/6/12')";
          } else {
            newTileUrl =
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
            document.querySelector(".main-thumb").style.backgroundImage =
              "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/4/6/12')";
          }

          if (map3d && map3d.getSource("base-tiles")) {
            map3d.getSource("base-tiles").tiles = [newTileUrl];
            map3d.style.sourceCaches["base-tiles"].clearTiles();
            map3d.style.sourceCaches["base-tiles"].update(map3d.transform);
          }
        }

        setTimeout(() => layerMenu.classList.add("hidden"), 300);
      });
    });
  }

  // Hiệu ứng nhấc phẳng & quầng ánh sáng theo chuột (không xoay nghiêng 3D gây méo chữ)
  // Được xử lý thuần CSS (.route-card:hover) + spotlight --spot-x / --spot-y mượt mà.

  // =========================================================================
  // 9. ĐĂNG NHẬP HỘ CHIẾU PHƯỢT THỦ & TRẠM LIÊN LẠC CỘNG ĐỒNG 4 KÊNH
  // =========================================================================
  const passportModal = document.getElementById("passport-modal");
  const btnOpenPassport = document.getElementById("btn-open-passport");
  const passportClose = document.getElementById("passport-close");
  const passportBackdrop = document.getElementById("passport-backdrop");
  const navUserAvatar = document.getElementById("nav-user-avatar");
  const navUserLabel = document.getElementById("nav-user-label");

  function syncPassportUserUI() {
    if (!window.phuotDB) return;
    const user = window.phuotDB.getCurrentUser();
    const reviewAuthorInput = document.getElementById("review-author");
    const chatAuthorInput = document.getElementById("chat-msg-author");

    if (user) {
      if (navUserAvatar) navUserAvatar.textContent = user.avatar || "🏍️";
      if (navUserLabel) navUserLabel.textContent = user.name.split(" ")[0];
      if (reviewAuthorInput && !reviewAuthorInput.value) {
        reviewAuthorInput.value = `${user.name} (${user.city})`;
      }
      if (chatAuthorInput && !chatAuthorInput.value) {
        chatAuthorInput.value = `${user.name} (${user.city})`;
      }
    } else {
      if (navUserAvatar) navUserAvatar.textContent = "👤";
      if (navUserLabel) navUserLabel.textContent = "Hộ chiếu";
    }
    renderPassportModalContent();
  }

  function renderPassportModalContent() {
    const activeCardEl = document.getElementById("passport-active-card");
    const demoGridEl = document.getElementById("demo-profiles-grid");
    if (!activeCardEl || !demoGridEl || !window.phuotDB) return;

    const user = window.phuotDB.getCurrentUser();
    if (user) {
      const conqueredList = ROUTES_DATA.filter((r) =>
        (user.conqueredRoutes || []).includes(r.id)
      );
      const totalKm = conqueredList.reduce((sum, r) => sum + r.distanceKm, 0);

      activeCardEl.classList.remove("hidden");
      activeCardEl.innerHTML = `
        <div class="passport-card-top">
          <div class="passport-identity">
            <span class="passport-avatar-big">${user.avatar || "🏍️"}</span>
            <div>
              <span class="passport-rank-pill">🏅 ${user.rankTitle} · ✔ Đã xác thực</span>
              <h3 style="font-size: 1.25rem;">${user.name} — ${user.city}</h3>
              <small style="color: var(--text-secondary);">Phương tiện chính: <strong>${user.vehicle}</strong></small>
            </div>
          </div>
          <button type="button" id="btn-logout-passport" class="btn-text-danger">Đăng xuất</button>
        </div>
        <div class="passport-stats-row">
          <div class="passport-stat-box">
            <strong>${conqueredList.length} / ${ROUTES_DATA.length}</strong>
            <small>Cung đường đã chinh phục</small>
          </div>
          <div class="passport-stat-box">
            <strong>${totalKm.toLocaleString("vi-VN")} km</strong>
            <small>Tổng quãng đường tích lũy</small>
          </div>
          <div class="passport-stat-box">
            <strong>${conqueredList.length >= 4 ? "4 Huy hiệu" : "2 Huy hiệu"}</strong>
            <small>Dấu mộc Hộ chiếu Việt Nam</small>
          </div>
        </div>
      `;

      const logoutBtn = document.getElementById("btn-logout-passport");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          window.phuotDB.logoutUser();
          syncPassportUserUI();
          renderRoutes();
          syncMasterAtlasPinsAndStats();
          showToast("👋 Đã đăng xuất khỏi Hộ chiếu Phượt thủ.");
        });
      }
    } else {
      activeCardEl.classList.add("hidden");
    }

    // Render 3 tài khoản mẫu 1 chạm
    demoGridEl.innerHTML = "";
    (window.DEMO_PASSPORT_PROFILES || []).forEach((prof) => {
      const card = document.createElement("div");
      card.className = "demo-profile-card";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>${prof.avatar} ${prof.name} (${prof.city})</strong>
          <span class="chat-user-rank">${prof.conqueredRoutes.length} cung</span>
        </div>
        <small style="color:var(--text-secondary);">${prof.rankTitle} · ${prof.vehicle}</small>
        <span style="font-size:0.76rem; font-weight:700; color:var(--accent-green); margin-top:0.2rem;">⚡ Chạm để đăng nhập ngay →</span>
      `;
      card.addEventListener("click", () => {
        window.phuotDB.loginWithProfile(prof);
        syncPassportUserUI();
        updateConquerButtonState();
        renderRoutes();
        syncMasterAtlasPinsAndStats();
        showToast(`🛂 Đã kích hoạt Hộ chiếu của ${prof.name} (${prof.rankTitle})!`);
      });
      demoGridEl.appendChild(card);
    });
  }

  const customPassportForm = document.getElementById("custom-passport-form");
  if (customPassportForm) {
    customPassportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("passport-input-name").value.trim();
      const city = document.getElementById("passport-input-city").value.trim();
      const vehicle = document.getElementById("passport-input-vehicle").value;
      if (!name || !city) return;

      const existing = window.phuotDB.getCurrentUser();
      window.phuotDB.loginWithProfile({
        name,
        city,
        vehicle,
        avatar: "🏍️",
        conqueredRoutes: existing ? existing.conqueredRoutes : ["ha-giang-loop", "cuc-bac-lung-cu"]
      });
      syncPassportUserUI();
      updateConquerButtonState();
      renderRoutes();
      syncMasterAtlasPinsAndStats();
      showToast(`🛂 Chào mừng Phượt thủ ${name} (${city})!`);
    });
  }

  if (btnOpenPassport && passportModal) {
    btnOpenPassport.addEventListener("click", () => {
      renderPassportModalContent();
      passportModal.classList.remove("hidden");
      passportModal.setAttribute("aria-hidden", "false");
    });
  }
  if (passportClose) {
    passportClose.addEventListener("click", () => passportModal.classList.add("hidden"));
  }
  if (passportBackdrop) {
    passportBackdrop.addEventListener("click", () => passportModal.classList.add("hidden"));
  }

  // KÊNH CHAT CỘNG ĐỒNG PHƯỢT THỦ (LIVE OVERLAND CHANNEL)
  const chatHubModal = document.getElementById("chat-hub-modal");
  const btnOpenChatHub = document.getElementById("btn-open-chat-hub");
  const floatingChatLauncher = document.getElementById("floating-chat-launcher");
  const chatHubClose = document.getElementById("chat-hub-close");
  const chatHubBackdrop = document.getElementById("chat-hub-backdrop");
  const chatChannelBtns = document.querySelectorAll(".chat-channel-btn");
  const chatRouteSelect = document.getElementById("chat-msg-route");

  let activeChatChannel = "toan-quoc";

  if (chatRouteSelect && typeof ROUTES_DATA !== "undefined") {
    ROUTES_DATA.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = `📍 ${r.title.split("—")[0].trim()}`;
      chatRouteSelect.appendChild(opt);
    });
  }

  function renderChatFeed() {
    const feedEl = document.getElementById("chat-messages-feed");
    if (!feedEl || !window.phuotDB) return;
    const messages = window.phuotDB.getChatMessages(activeChatChannel);
    feedEl.innerHTML = "";

    messages.forEach((msg) => {
      const card = document.createElement("div");
      card.className = "chat-msg-card";
      card.innerHTML = `
        <div class="chat-msg-header">
          <div class="chat-user-info">
            <span style="font-size:1.1rem;">${msg.avatar || "🏍️"}</span>
            <strong>${msg.author}</strong>
            <span class="chat-user-rank">${msg.rank || "Phượt Thủ"}</span>
            <span class="chat-msg-tag">${msg.tag || "💬 Chia sẻ"}</span>
          </div>
          <small style="color:var(--text-muted); font-family:var(--font-mono); font-size:0.74rem;">${msg.time}</small>
        </div>
        <p class="chat-msg-text">${msg.text}</p>
        <div class="chat-msg-footer">
          ${
            msg.routeId
              ? `<button type="button" class="chat-route-pill" data-route-id="${msg.routeId}">🗺️ Mở cung: ${msg.routeName} ↗</button>`
              : `<span></span>`
          }
          <button type="button" class="btn-like-helpful">👍 Hữu ích (<span>${msg.likes || 1}</span>)</button>
        </div>
      `;

      const routePill = card.querySelector(".chat-route-pill");
      if (routePill) {
        routePill.addEventListener("click", () => {
          const targetRoute = ROUTES_DATA.find((r) => r.id === msg.routeId);
          if (targetRoute) {
            chatHubModal.classList.add("hidden");
            openRouteModal(targetRoute);
          }
        });
      }

      const likeBtn = card.querySelector(".btn-like-helpful");
      likeBtn.addEventListener("click", () => {
        if (likeBtn.classList.contains("liked")) return;
        likeBtn.classList.add("liked");
        const span = likeBtn.querySelector("span");
        span.textContent = parseInt(span.textContent, 10) + 1;
      });

      feedEl.appendChild(card);
    });
  }

  chatChannelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      chatChannelBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeChatChannel = btn.dataset.channel;
      renderChatFeed();
    });
  });

  const chatComposeForm = document.getElementById("chat-compose-form");
  if (chatComposeForm) {
    chatComposeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const authorEl = document.getElementById("chat-msg-author");
      const textEl = document.getElementById("chat-msg-input");
      const tagEl = document.getElementById("chat-msg-tag");
      const routeId = chatRouteSelect ? chatRouteSelect.value : "";

      const author = authorEl.value.trim();
      const text = textEl.value.trim();
      if (!author || !text) return;

      const user = window.phuotDB.getCurrentUser();
      const linkedRoute = routeId ? ROUTES_DATA.find((r) => r.id === routeId) : null;

      window.phuotDB.addChatMessage(activeChatChannel, {
        author,
        rank: user ? user.rankTitle : "Phượt Thủ Thực Địa",
        avatar: user ? user.avatar : "🏍️",
        tag: tagEl.value,
        routeId: linkedRoute ? linkedRoute.id : "",
        routeName: linkedRoute ? linkedRoute.title.split("—")[0].trim() : "",
        text
      });

      textEl.value = "";
      renderChatFeed();
      showToast("📡 Đã phát tin nhắn lên Kênh Liên Lạc Phượt Thủ!");
    });
  }

  function openChatHub() {
    syncPassportUserUI();
    renderChatFeed();
    if (chatHubModal) {
      chatHubModal.classList.remove("hidden");
      chatHubModal.setAttribute("aria-hidden", "false");
    }
  }

  if (btnOpenChatHub) btnOpenChatHub.addEventListener("click", openChatHub);
  if (floatingChatLauncher) floatingChatLauncher.addEventListener("click", openChatHub);
  if (chatHubClose) chatHubClose.addEventListener("click", () => chatHubModal.classList.add("hidden"));
  if (chatHubBackdrop) chatHubBackdrop.addEventListener("click", () => chatHubModal.classList.add("hidden"));

  // =========================================================================
  // 10. TỰ VẼ CUNG ĐƯỜNG CỦA RIÊNG BẠN (CUSTOM ROUTE BUILDER TRÊN BẢN ĐỒ VN)
  // =========================================================================
  const CUSTOM_ROUTES_KEY = "phuot_tier3_custom_routes";
  let builderMap = null;
  let builderMarkers = [];
  let builderWaypoints = [];
  let builderDistanceKm = 0;

  function loadPersistedCustomRoutes() {
    try {
      const savedCustom = JSON.parse(localStorage.getItem(CUSTOM_ROUTES_KEY) || "[]");
      savedCustom.forEach((cr) => {
        if (!ROUTES_DATA.some((r) => r.id === cr.id)) {
          ROUTES_DATA.unshift(cr);
        }
      });
    } catch {
      // Ignore parse errors
    }
  }
  loadPersistedCustomRoutes();

  function refreshRegionFilterLabels() {
    filterButtons.forEach((btn) => {
      const reg = btn.dataset.region;
      if (reg === "all") {
        btn.textContent = `Tất cả (${ROUTES_DATA.length})`;
      } else {
        const count = ROUTES_DATA.filter((r) => r.region === reg).length;
        const prefix = reg === "Bộ Sưu Tập Tứ Đại" ? "🏆 Bộ Tứ Đại" : reg;
        btn.textContent = `${prefix} (${count})`;
      }
    });
  }

  const customRouteModal = document.getElementById("custom-route-modal");
  const btnOpenCustomBuilder = document.getElementById("btn-open-custom-builder");
  const customRouteClose = document.getElementById("custom-route-close");
  const customRouteBackdrop = document.getElementById("custom-route-backdrop");

  async function initCustomBuilderMap() {
    if (typeof maplibregl === "undefined") return;
    if (!builderMap) {
      builderMap = new maplibregl.Map({
        container: "custom-builder-map",
        style: {
          version: 8,
          sources: {
            "topo-tiles": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
              ],
              tileSize: 256
            }
          },
          layers: [{ id: "topo-layer", type: "raster", source: "topo-tiles" }]
        },
        center: [106.2, 16.2],
        zoom: 5.2,
        maxBounds: [
          [100.2, 6.2],
          [118.8, 24.8]
        ]
      });

      builderMap.addControl(new maplibregl.NavigationControl(), "top-left");

      builderMap.on("click", (e) => {
        const lat = Number(e.lngLat.lat.toFixed(4));
        const lng = Number(e.lngLat.lng.toFixed(4));
        const pointNum = builderWaypoints.length + 1;
        addBuilderWaypoint({
          name: `Điểm chấm #${pointNum} (${lat}, ${lng})`,
          lat,
          lng
        });
      });

      await new Promise((resolve) => builderMap.on("load", resolve));
    }

    setTimeout(() => {
      builderMap.resize();
      updateBuilderMapAndMetrics();
    }, 150);
  }

  function addBuilderWaypoint(wp) {
    builderWaypoints.push(wp);
    updateBuilderMapAndMetrics();
  }

  async function updateBuilderMapAndMetrics() {
    const wpListEl = document.getElementById("builder-waypoints-list");
    const wpCountEl = document.getElementById("builder-wp-count");
    const totalKmEl = document.getElementById("builder-total-km");
    const estCostEl = document.getElementById("builder-est-cost");
    const gmapsLink = document.getElementById("btn-builder-gmaps");
    const daysInput = document.getElementById("builder-route-days");

    if (wpCountEl) wpCountEl.textContent = builderWaypoints.length;
    if (wpListEl) {
      wpListEl.innerHTML = builderWaypoints
        .map(
          (w, i) => `
          <span class="wp-chip">
            <span class="wp-num">${i + 1}</span>
            <span>${w.name}</span>
          </span>
        `
        )
        .join("");
    }

    builderMarkers.forEach((m) => m.remove());
    builderMarkers = [];

    if (builderMap) {
      builderWaypoints.forEach((w, idx) => {
        const marker = new maplibregl.Marker({
          color: idx === 0 ? "#146338" : "#D97706"
        })
          .setLngLat([w.lng, w.lat])
          .setPopup(new maplibregl.Popup().setHTML(`<strong>Chặng ${idx + 1}:</strong> ${w.name}`))
          .addTo(builderMap);
        builderMarkers.push(marker);
      });
    }

    let lineGeoJson = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: builderWaypoints.map((w) => [w.lng, w.lat])
      }
    };

    // Tính tổng km bằng Haversine × 1.32 (hệ số đường đèo uốn lượn) hoặc OSRM thực tế
    let computedKm = 0;
    for (let i = 0; i < builderWaypoints.length - 1; i++) {
      const d = window.phuotService.calculateHaversineKm(
        builderWaypoints[i].lat,
        builderWaypoints[i].lng,
        builderWaypoints[i + 1].lat,
        builderWaypoints[i + 1].lng
      );
      computedKm += d * 1.32;
    }

    if (builderWaypoints.length >= 2) {
      try {
        const coordsStr = builderWaypoints.map((w) => `${w.lng},${w.lat}`).join(";");
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.code === "Ok" && data.routes && data.routes[0]) {
          lineGeoJson.geometry = data.routes[0].geometry;
          computedKm = data.routes[0].distance / 1000;
        }
      } catch {
        // Giữ kết quả Haversine khi offline
      }
    }

    builderDistanceKm = Math.max(0, Math.round(computedKm));
    if (totalKmEl) totalKmEl.textContent = `${builderDistanceKm.toLocaleString("vi-VN")} km`;

    const days = Math.max(1, parseInt(daysInput ? daysInput.value : 3, 10) || 3);
    const nights = Math.max(1, days - 1);
    const estCost =
      builderDistanceKm * 650 + days * 260000 + nights * 230000 + (builderDistanceKm > 0 ? 250000 : 0);
    if (estCostEl) estCostEl.textContent = builderDistanceKm > 0 ? formatVND(estCost) : "0đ";

    if (builderMap && builderMap.isStyleLoaded()) {
      if (builderMap.getSource("builder-line")) {
        builderMap.getSource("builder-line").setData(lineGeoJson);
      } else {
        builderMap.addSource("builder-line", { type: "geojson", data: lineGeoJson });
        builderMap.addLayer({
          id: "builder-line-layer",
          type: "line",
          source: "builder-line",
          paint: { "line-color": "#146338", "line-width": 4.5 }
        });
      }

      if (builderWaypoints.length >= 2) {
        const b = new maplibregl.LngLatBounds();
        builderWaypoints.forEach((w) => b.extend([w.lng, w.lat]));
        builderMap.fitBounds(b, { padding: 48, duration: 600 });
      }
    }

    if (gmapsLink && builderWaypoints.length >= 2) {
      const first = builderWaypoints[0];
      const last = builderWaypoints[builderWaypoints.length - 1];
      const mid = builderWaypoints
        .slice(1, -1)
        .map((w) => `${w.lat},${w.lng}`)
        .join("|");
      gmapsLink.href = `https://www.google.com/maps/dir/?api=1&origin=${first.lat},${first.lng}&destination=${last.lat},${last.lng}${mid ? "&waypoints=" + encodeURIComponent(mid) : ""}&travelmode=driving`;
    }
  }

  document.querySelectorAll(".builder-preset-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      addBuilderWaypoint({
        name: chip.dataset.name,
        lat: parseFloat(chip.dataset.lat),
        lng: parseFloat(chip.dataset.lng)
      });
    });
  });

  const btnBuilderUndo = document.getElementById("btn-builder-undo");
  const btnBuilderClear = document.getElementById("btn-builder-clear");
  const builderDaysInput = document.getElementById("builder-route-days");

  if (btnBuilderUndo) {
    btnBuilderUndo.addEventListener("click", () => {
      builderWaypoints.pop();
      updateBuilderMapAndMetrics();
    });
  }
  if (btnBuilderClear) {
    btnBuilderClear.addEventListener("click", () => {
      builderWaypoints = [];
      updateBuilderMapAndMetrics();
    });
  }
  if (builderDaysInput) {
    builderDaysInput.addEventListener("input", updateBuilderMapAndMetrics);
  }

  if (btnOpenCustomBuilder && customRouteModal) {
    btnOpenCustomBuilder.addEventListener("click", () => {
      customRouteModal.classList.remove("hidden");
      customRouteModal.setAttribute("aria-hidden", "false");
      if (builderWaypoints.length === 0) {
        // Khởi tạo mẫu 2 điểm gợi ý ban đầu để người dùng thấy đường nối ngay
        builderWaypoints = [
          { name: "TP. Hà Giang", lat: 22.8233, lng: 104.9836 },
          { name: "Cột Cờ Lũng Cú", lat: 23.3628, lng: 105.3164 }
        ];
      }
      initCustomBuilderMap();
    });
  }
  if (customRouteClose) {
    customRouteClose.addEventListener("click", () => customRouteModal.classList.add("hidden"));
  }
  if (customRouteBackdrop) {
    customRouteBackdrop.addEventListener("click", () => customRouteModal.classList.add("hidden"));
  }

  const customRouteForm = document.getElementById("custom-route-form");
  if (customRouteForm) {
    customRouteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (builderWaypoints.length < 2) {
        showToast("⚠️ Vui lòng chấm tối thiểu 2 điểm trên bản đồ Việt Nam!");
        return;
      }

      const title = document.getElementById("builder-route-name").value.trim();
      const region = document.getElementById("builder-route-region").value;
      const days = Math.max(1, parseInt(document.getElementById("builder-route-days").value, 10) || 2);
      const note =
        document.getElementById("builder-route-note").value.trim() ||
        "Cung đường tự thiết kế trên Bản đồ Phượt Đa Tầng Dọc Miền Đất Nước.";

      const newCustomRoute = {
        id: "custom-route-" + Date.now(),
        title: `✨ [Tự Thiết Kế] ${title}`,
        region,
        distanceKm: Math.max(15, builderDistanceKm),
        defaultDays: days,
        bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        bestTimeText: "Quanh năm (Lộ trình cá nhân)",
        image:
          region === "Miền Trung"
            ? "assets/images/hero-vinh-hy.jpg"
            : region === "Tây Nguyên & Nam Bộ"
              ? "assets/images/cau-dat-da-lat.jpg"
              : "assets/images/hero-ma-pi-leng.jpg",
        fallbackImage: "assets/images/lung-cu-hero.jpg",
        excerpt: `${builderWaypoints.map((w) => w.name).join(" – ")}. ${note}`,
        description: `Lộ trình tự vẽ (${builderWaypoints.length} chặng, ~${Math.max(15, builderDistanceKm)} km): ${builderWaypoints.map((w) => w.name).join(" → ")}. Ghi chú: ${note}`,
        waypoints: [...builderWaypoints],
        costConfig: { fuelPerKm: 650, foodPerDay: 260000, stayPerNight: 230000, buffer: 250000 },
        specialGear: [
          "Kiểm tra phanh, lốp và đèn xe trước khi khởi hành lộ trình tự vẽ",
          "Tải sẵn bản đồ Offline cho các chặng tự chấm"
        ]
      };

      const savedCustom = JSON.parse(localStorage.getItem(CUSTOM_ROUTES_KEY) || "[]");
      savedCustom.unshift(newCustomRoute);
      localStorage.setItem(CUSTOM_ROUTES_KEY, JSON.stringify(savedCustom));

      ROUTES_DATA.unshift(newCustomRoute);
      refreshRegionFilterLabels();
      renderTier1MacroAtlas();
      renderRoutes();
      syncMasterAtlasPinsAndStats();

      customRouteModal.classList.add("hidden");
      openRouteModal(newCustomRoute);
      showToast("🚀 Đã tạo cung đường mới & mở trong Buồng lái 3D!");
    });
  }

  // =========================================================================
  // 11. TRẢI NGHIỆM XÚC GIÁC: NHỊP ĐIỆU 12 THÁNG, FLYCAM 3D & ÁNH SÁNG TƯƠNG TÁC
  // =========================================================================

  // 11.A Thanh Nhịp Điệu 12 Tháng Mùa Đẹp Việt Nam (Seasonal Rhythm Bar)
  const MONTH_POETIC_NOTES = {
    0: "Chạm vào từng tháng để cảm nhận mùa hoa, mùa lúa chín & biển êm",
    1: "Tháng 1: Mùa hoa mận trắng Mộc Châu, sương mây Tà Xùa & nắng ấm phương Nam",
    2: "Tháng 2: Mùa hoa đào rừng Hà Giang, mùa xuân biên viễn & lễ hội vùng cao",
    3: "Tháng 3: Mùa hoa ban trắng Tây Bắc, biển miền Trung bắt đầu trong xanh",
    4: "Tháng 4: Giao mùa nắng đẹp khắp 3 miền, lý tưởng chạy cung ven biển & đảo",
    5: "Tháng 5: Mùa nước đổ óng ánh trên ruộng bậc thang Y Tý, Mù Cang Chải, Hoàng Su Phì",
    6: "Tháng 6: Cao điểm biển xanh ngọc bích Vĩnh Hy, Phú Yên, Quy Nhơn, Cát Bà",
    7: "Tháng 7: Cung biển Nam Trung Bộ rực nắng & thảo nguyên xanh mướt",
    8: "Tháng 8: Chớm thu vùng cao, thác Bản Giốc đầy nước & biển miền Trung êm dịu",
    9: "Tháng 9: Mùa vàng lúa chín rực rỡ khắp Mù Cang Chải, Hoàng Su Phì, Y Tý, Bắc Sơn",
    10: "Tháng 10: Mùa cỏ lau trắng Bình Liêu, lúa chín Trùng Khánh & tam giác mạch đầu mùa",
    11: "Tháng 11: Mùa hoa tam giác mạch Hà Giang, dã quỳ vàng Đà Lạt – Măng Đen & săn mây",
    12: "Tháng 12: Săn biển mây Tà Xùa, Cầu Đất, cỏ hồng Đà Lạt & cung đường mùa khô phương Nam"
  };

  const srbMonthsContainer = document.getElementById("srb-months");
  const srbActiveDesc = document.getElementById("srb-active-desc");

  function applySeasonalAtmosphere(monthNum) {
    let mood = "default";
    if (monthNum >= 1 && monthNum <= 3) mood = "spring";
    else if (monthNum >= 4 && monthNum <= 7) mood = "coastal";
    else if (monthNum >= 8 && monthNum <= 10) mood = "golden";
    else if (monthNum >= 11 && monthNum <= 12) mood = "cloud";

    if (mood === "default") {
      document.documentElement.removeAttribute("data-season-mood");
    } else {
      document.documentElement.setAttribute("data-season-mood", mood);
    }
  }

  if (srbMonthsContainer) {
    const pills = srbMonthsContainer.querySelectorAll(".srb-month-pill");
    pills.forEach((pill) => {
      const mVal = parseInt(pill.dataset.month, 10) || 0;
      if (mVal === currentMonth) {
        pill.classList.add("current-real-month");
        pill.title = `Tháng hiện tại (Tháng ${currentMonth})`;
      }

      pill.addEventListener("click", () => {
        selectedMonthFilter = mVal;
        pills.forEach((p) => p.classList.toggle("active", p === pill));
        if (srbActiveDesc) {
          srbActiveDesc.textContent = MONTH_POETIC_NOTES[mVal] || MONTH_POETIC_NOTES[0];
        }
        applySeasonalAtmosphere(mVal);
        renderRoutes();
      });
    });
  }

  // 11.B Hiệu ứng Ánh sáng Xúc giác theo Trỏ chuột (Cursor-Tracking Spotlight)
  document.addEventListener(
    "pointermove",
    (e) => {
      const card = e.target.closest(".route-card, .macro-region-card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${(e.clientX - rect.left).toFixed(0)}px`);
      card.style.setProperty("--spot-y", `${(e.clientY - rect.top).toFixed(0)}px`);
    },
    { passive: true }
  );

  // 11.C Tự động Khóa cuộn nền (Body Scroll Lock) khi bất kỳ Modal nào đang mở
  const modalIdsToWatch = [
    "route-modal",
    "saved-trips-modal",
    "passport-modal",
    "chat-hub-modal",
    "custom-route-modal",
    "pocket-card-modal",
    "compare-routes-modal",
    "command-palette-modal"
  ];

  function syncBodyModalLock() {
    const anyOpen = modalIdsToWatch.some((id) => {
      const el = document.getElementById(id);
      return el && !el.classList.contains("hidden");
    });
    document.body.classList.toggle("modal-open", anyOpen);
  }

  const modalClassObserver = new MutationObserver(syncBodyModalLock);
  modalIdsToWatch.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      modalClassObserver.observe(el, { attributes: true, attributeFilter: ["class"] });
    }
  });

  // =========================================================================
  // 11.D XUẤT "THẺ HÀNH TRÌNH BỎ TÚI" & LƯU ẢNH OFFLINE (.PNG) (FEATURE 4)
  // =========================================================================
  const pocketModal = document.getElementById("pocket-card-modal");
  const btnOpenPocketCard = document.getElementById("btn-open-pocket-card");
  const pocketCardClose = document.getElementById("pocket-card-close");
  const pocketCardBackdrop = document.getElementById("pocket-card-backdrop");
  const btnDownloadPocketPng = document.getElementById("btn-download-pocket-png");
  const btnCopyPocketText = document.getElementById("btn-copy-pocket-text");
  const btnPrintPocketCard = document.getElementById("btn-print-pocket-card");

  function getPocketCardData() {
    if (!activeRoute) return null;
    const days = Math.max(1, parseInt(inputDays.value, 10) || activeRoute.defaultDays);
    const people = Math.max(1, parseInt(inputPeople.value, 10) || 1);
    const nights = Math.max(0, days - 1);
    const isMotorbike = selectedVehicle === "motorbike";
    const vehInfo = window.phuotService
      ? window.phuotService.evaluateVehicleReadiness(activeRoute, selectedVehicleModel)
      : null;
    const vehicleLabel = vehInfo
      ? `${isMotorbike ? "🏍️" : "🚗"} ${vehInfo.shortName} (${vehInfo.score}%)`
      : isMotorbike
        ? "🏍️ Xe máy"
        : "🚗 Ô tô";
    const perPerson = Math.round(lastCalculatedTotal / people);

    const stages = window.phuotService
      ? window.phuotService.buildRouteStages(activeRoute, currentWaypoints)
      : currentWaypoints.map((w, idx) => ({
          index: idx + 1,
          name: w.name,
          legKm: 0,
          role: "Chặng dừng"
        }));

    const extraInfo = window.phuotService
      ? window.phuotService.getRouteElevationAndCulinary(activeRoute, currentWaypoints)
      : { dishes: ["Đặc sản địa phương"], maxElev: 1200, difficulty: "Trung bình" };

    const coreGear = [
      ...(activeRoute.specialGear || []).slice(0, 2),
      "Áo mưa bộ & đồ bảo hộ",
      "Sạc dự phòng & bản đồ Offline"
    ];

    return {
      route: activeRoute,
      days,
      nights,
      people,
      vehicleLabel,
      totalGroup: lastCalculatedTotal,
      perPerson,
      stages,
      dishes: extraInfo.dishes,
      maxElev: extraInfo.maxElev,
      difficulty: extraInfo.difficulty,
      coreGear
    };
  }

  function openPocketCardModal() {
    const data = getPocketCardData();
    if (!data || !pocketModal) return;

    const shortCode = `VN-${data.route.id.slice(0, 6).toUpperCase()}-${data.days}D`;
    document.getElementById("pk-code-badge").textContent = shortCode;
    document.getElementById("pk-region-pill").textContent = `📍 ${data.route.region} · Đỉnh ${data.maxElev}m`;
    document.getElementById("pk-route-title").textContent = data.route.title;
    document.getElementById("pk-season-note").textContent = `🗓️ Mùa đẹp nhất: ${data.route.bestTimeText} · Độ khó: ${data.difficulty}`;
    document.getElementById("pk-distance").textContent = `~${data.route.distanceKm} km`;
    document.getElementById("pk-duration").textContent = `${data.days}N${data.nights}Đ · ${data.people} người`;
    document.getElementById("pk-vehicle").textContent = data.vehicleLabel;
    document.getElementById("pk-cost-person").textContent = `~${formatVND(data.perPerson)}`;
    document.getElementById("pk-total-group").textContent = `Tổng đoàn (${data.people} người): ~${formatVND(data.totalGroup)}`;

    const stagesEl = document.getElementById("pk-stages-list");
    if (stagesEl) {
      stagesEl.innerHTML = data.stages
        .map(
          (st) =>
            `<span class="ticket-stage-chip"><b>#${st.index}</b> ${st.name}${st.legKm > 0 ? ` <small>(+${st.legKm}km)</small>` : ""}</span>`
        )
        .join("");
    }

    document.getElementById("pk-culinary-text").textContent = data.dishes.join(" · ");
    document.getElementById("pk-gear-text").textContent = data.coreGear.join(" · ");

    pocketModal.classList.remove("hidden");
    pocketModal.setAttribute("aria-hidden", "false");
  }

  if (btnOpenPocketCard) {
    btnOpenPocketCard.addEventListener("click", openPocketCardModal);
  }
  if (pocketCardClose) {
    pocketCardClose.addEventListener("click", () => pocketModal.classList.add("hidden"));
  }
  if (pocketCardBackdrop) {
    pocketCardBackdrop.addEventListener("click", () => pocketModal.classList.add("hidden"));
  }

  // Xuất file ảnh .PNG độ phân giải cao (1080x1480) bằng HTML5 Canvas để lưu vào điện thoại
  function downloadPocketCardAsPNG() {
    const data = getPocketCardData();
    if (!data) return;

    const canvas = document.createElement("canvas");
    const W = 1080;
    const H = 1480;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // 1. Nền giấy bản đồ kem ấm (Warm Topographic Paper)
    ctx.fillStyle = "#FAF6EE";
    ctx.fillRect(0, 0, W, H);

    // Viền khung ngoài xanh rừng già
    ctx.strokeStyle = "#146338";
    ctx.lineWidth = 8;
    ctx.strokeRect(36, 36, W - 72, H - 72);

    // 2. Dải Header Xanh Ngọc Lục Bảo
    ctx.fillStyle = "#146338";
    ctx.fillRect(36, 36, W - 72, 145);

    ctx.fillStyle = "#FAF8F4";
    ctx.font = "800 32px 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif";
    ctx.fillText("DỌC MIỀN ĐẤT NƯỚC · THẺ HÀNH TRÌNH BỎ TÚI", 76, 102);

    ctx.fillStyle = "#FBBF24";
    ctx.font = "700 20px 'JetBrains Mono', monospace";
    ctx.fillText(
      `VIETNAM OVERLAND PASS · MÃ TUYẾN: ${data.route.id.toUpperCase()}`,
      76,
      144
    );

    // 3. Tên cung đường & Vùng miền
    ctx.fillStyle = "#B45309";
    ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(
      `📍 VÙNG: ${data.route.region.toUpperCase()}   ·   ⛰️ ĐỈNH CAO NHẤT: ${data.maxElev}M (${data.difficulty})`,
      76,
      240
    );

    ctx.fillStyle = "#122117";
    ctx.font = "800 40px 'Playfair Display', Georgia, serif";
    const titleWords = data.route.title.split(" ");
    let line = "";
    let yTitle = 300;
    titleWords.forEach((word) => {
      const test = line + word + " ";
      if (ctx.measureText(test).width > W - 160) {
        ctx.fillText(line.trim(), 76, yTitle);
        line = word + " ";
        yTitle += 52;
      } else {
        line = test;
      }
    });
    if (line.trim()) {
      ctx.fillText(line.trim(), 76, yTitle);
      yTitle += 44;
    }

    ctx.fillStyle = "#3E5245";
    ctx.font = "600 23px 'Be Vietnam Pro', sans-serif";
    ctx.fillText(`🗓️ Thời điểm lý tưởng: ${data.route.bestTimeText}`, 76, yTitle + 10);

    // 4. 4 Ô Thông số Cốt lõi
    const boxY = yTitle + 45;
    const boxW = (W - 152 - 36) / 2;
    const boxH = 115;
    const metrics = [
      { label: "TỔNG QUÃNG ĐƯỜNG", val: `~${data.route.distanceKm} km` },
      { label: "THỜI GIAN & SỐ NGƯỜI", val: `${data.days}N${data.nights}Đ · ${data.people} người` },
      { label: "PHƯƠNG TIỆN", val: data.vehicleLabel.replace(/[^\w\sÀ-ỹ]/g, "").trim() },
      { label: "CHI PHÍ DỰ TRÙ / NGƯỜI", val: `~${formatVND(data.perPerson)}` }
    ];

    metrics.forEach((m, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 76 + col * (boxW + 36);
      const by = boxY + row * (boxH + 22);

      ctx.fillStyle = idx === 3 ? "#FEF3C7" : "#FFFFFF";
      ctx.fillRect(bx, by, boxW, boxH);
      ctx.strokeStyle = idx === 3 ? "#D97706" : "#C5D1C8";
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, by, boxW, boxH);

      ctx.fillStyle = "#5A6E60";
      ctx.font = "700 18px 'JetBrains Mono', monospace";
      ctx.fillText(m.label, bx + 24, by + 40);

      ctx.fillStyle = idx === 3 ? "#B45309" : "#146338";
      ctx.font = "800 30px 'JetBrains Mono', sans-serif";
      ctx.fillText(m.val, bx + 24, by + 86);
    });

    // Đường cắt vé (Perforated line)
    const cutY = boxY + 285;
    ctx.save();
    ctx.setLineDash([14, 10]);
    ctx.strokeStyle = "#8FA696";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(60, cutY);
    ctx.lineTo(W - 60, cutY);
    ctx.stroke();
    ctx.restore();

    // 5. Danh sách các chặng dừng chính
    let curY = cutY + 54;
    ctx.fillStyle = "#146338";
    ctx.font = "800 24px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("🚩 LỘ TRÌNH THỨ TỰ CÁC CHẶNG DỪNG:", 76, curY);
    curY += 44;

    ctx.fillStyle = "#122117";
    ctx.font = "700 24px 'Be Vietnam Pro', sans-serif";
    data.stages.slice(0, 7).forEach((st) => {
      const legNote = st.legKm > 0 ? ` (+${st.legKm} km)` : " (Xuất phát)";
      ctx.fillText(`• Chặng ${st.index}: ${st.name}${legNote} — ${st.role}`, 88, curY);
      curY += 40;
    });

    // 6. Đặc sản & Hành trang
    curY += 20;
    ctx.fillStyle = "#B45309";
    ctx.font = "800 23px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("🍜 ĐẶC SẢN NÊN THỬ DỌC ĐƯỜNG:", 76, curY);
    curY += 36;
    ctx.fillStyle = "#2C3E32";
    ctx.font = "600 22px 'Be Vietnam Pro', sans-serif";
    ctx.fillText(data.dishes.join("  ·  "), 76, curY);

    curY += 52;
    ctx.fillStyle = "#146338";
    ctx.font = "800 23px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("🎒 HÀNH TRANG QUAN TRỌNG:", 76, curY);
    curY += 36;
    ctx.fillStyle = "#2C3E32";
    ctx.font = "600 21px 'Be Vietnam Pro', sans-serif";
    ctx.fillText(data.coreGear.slice(0, 3).join("  ·  "), 76, curY);

    // 7. Chân thẻ cứu hộ khẩn cấp
    ctx.fillStyle = "#122117";
    ctx.fillRect(36, H - 116, W - 72, 80);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 22px 'Be Vietnam Pro', sans-serif";
    ctx.fillText("🆘 Cứu hộ khẩn cấp: 113 (Công an) · 115 (Y tế) · 114 (Cứu nạn)", 72, H - 66);

    const link = document.createElement("a");
    link.download = `The-Hanh-Trinh-${data.route.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("📸 Đã tải Ảnh Thẻ Hành Trình (.PNG) sắc nét về thiết bị!");
  }

  if (btnDownloadPocketPng) {
    btnDownloadPocketPng.addEventListener("click", downloadPocketCardAsPNG);
  }

  if (btnCopyPocketText) {
    btnCopyPocketText.addEventListener("click", () => {
      const data = getPocketCardData();
      if (!data) return;
      const summary = [
        `🎫 THẺ HÀNH TRÌNH: ${data.route.title.toUpperCase()}`,
        `📍 Vùng: ${data.route.region} | 🛣️ ~${data.route.distanceKm} km | ⏱️ ${data.days}N${data.nights}Đ (${data.people} người)`,
        `🛵 Phương tiện: ${data.vehicleLabel} | 💰 Dự kiến: ~${formatVND(data.perPerson)}/người (Tổng đoàn: ~${formatVND(data.totalGroup)})`,
        `🚩 Các chặng: ${data.stages.map((s) => `${s.index}. ${s.name}`).join(" → ")}`,
        `🍜 Đặc sản: ${data.dishes.join(", ")}`,
        `🆘 Cứu hộ khẩn cấp: 113 · 115 · 114`
      ].join("\n");

      navigator.clipboard?.writeText(summary).then(() => {
        showToast("📋 Đã sao chép Thẻ Hành Trình! Bạn có thể dán ngay vào nhóm Zalo/Messenger.");
      });
    });
  }

  if (btnPrintPocketCard) {
    btnPrintPocketCard.addEventListener("click", () => {
      window.print();
    });
  }

  // =========================================================================
  // 12. TRỢ LÝ TƯ VẤN CUNG ĐƯỜNG THÔNG MINH (SMART TRIP ADVISOR)
  // =========================================================================
  const advisorPanel = document.getElementById("smart-advisor-panel");
  const btnToggleAdvisor = document.getElementById("btn-toggle-advisor");
  const btnCloseAdvisor = document.getElementById("btn-close-advisor");
  const btnRunAdvisor = document.getElementById("btn-run-advisor");

  function runSmartTripAdvisor() {
    const gridEl = document.getElementById("advisor-results-grid");
    if (!gridEl) return;

    const daysPref = document.getElementById("adv-days").value;
    const budgetPref = document.getElementById("adv-budget").value;
    const vibePref = document.getElementById("adv-vibe").value;

    const scored = ROUTES_DATA.map((route) => {
      let score = 78;
      const est = calculateDefaultEstimate(route);

      if (route.bestMonths.includes(currentMonth)) score += 8;

      if (daysPref === "short" && route.defaultDays <= 2) score += 10;
      else if (daysPref === "medium" && route.defaultDays >= 2 && route.defaultDays <= 3)
        score += 10;
      else if (daysPref === "long" && route.defaultDays >= 4) score += 10;

      if (budgetPref !== "all") {
        const limit = parseInt(budgetPref, 10);
        if (limit <= 2500000 && est <= limit) score += 8;
        else if (limit > 2500000 && est >= 2000000) score += 8;
      }

      const textBlob = (route.title + " " + route.description).toLowerCase();
      if (
        vibePref === "mountain" &&
        (textBlob.includes("đèo") || textBlob.includes("mây") || textBlob.includes("lũng cú"))
      ) {
        score += 9;
      } else if (
        vibePref === "coast" &&
        (textBlob.includes("biển") || textBlob.includes("vịnh") || textBlob.includes("đảo"))
      ) {
        score += 9;
      } else if (
        vibePref === "forest" &&
        (textBlob.includes("rừng") || textBlob.includes("thác") || textBlob.includes("thông"))
      ) {
        score += 9;
      }

      return { route, score: Math.min(99, score), est };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.slice(0, 3);

    gridEl.innerHTML = "";
    topMatches.forEach((item) => {
      const card = document.createElement("div");
      card.className = "advisor-match-card";
      card.innerHTML = `
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.45rem;">
            <span class="match-score-badge">🎯 Độ hợp: ${item.score}%</span>
            <small style="font-family:var(--font-mono); font-weight:700; color:var(--accent-amber);">~${formatVND(item.est)}</small>
          </div>
          <h4 style="font-family:var(--font-heading); font-size:1rem; margin-bottom:0.3rem;">${item.route.title}</h4>
          <p style="font-size:0.82rem; color:var(--text-secondary);">🛣️ ~${item.route.distanceKm} km · ⏱️ ${item.route.defaultDays} ngày · 📍 ${item.route.region}</p>
        </div>
        <span style="font-size:0.8rem; font-weight:700; color:var(--accent-green);">Mở Buồng lái 3D cung này →</span>
      `;
      card.addEventListener("click", () => openRouteModal(item.route));
      gridEl.appendChild(card);
    });
  }

  if (btnToggleAdvisor && advisorPanel) {
    btnToggleAdvisor.addEventListener("click", () => {
      const hidden = advisorPanel.classList.toggle("hidden");
      if (!hidden) runSmartTripAdvisor();
    });
  }
  if (btnCloseAdvisor && advisorPanel) {
    btnCloseAdvisor.addEventListener("click", () => advisorPanel.classList.add("hidden"));
  }
  if (btnRunAdvisor) {
    btnRunAdvisor.addEventListener("click", () => {
      runSmartTripAdvisor();
      showToast("🤖 Đã lọc 3 cung đường khớp nhất với nhu cầu của bạn!");
    });
  }

  // =========================================================================
  // 13. ĐẶT 2 CUNG ĐƯỜNG LÊN "BÀN CÂN" SO SÁNH 1 CHẠM (VERSUS COMPARE - MỤC 3)
  // =========================================================================
  const compareTrayBar = document.getElementById("compare-tray-bar");
  const compareSlotsEl = document.getElementById("compare-slots");
  const compareTrayHint = document.getElementById("compare-tray-hint");
  const btnOpenCompareModal = document.getElementById("btn-open-compare-modal");
  const btnClearCompare = document.getElementById("btn-clear-compare");
  const compareRoutesModal = document.getElementById("compare-routes-modal");
  const compareRoutesClose = document.getElementById("compare-routes-close");
  const compareRoutesBackdrop = document.getElementById("compare-routes-backdrop");
  const compareModalBody = document.getElementById("compare-modal-body");

  function toggleCompareRoute(routeId) {
    const idx = compareRouteIds.indexOf(routeId);
    if (idx > -1) {
      compareRouteIds.splice(idx, 1);
      showToast("↩️ Đã gỡ cung đường khỏi Bàn cân so sánh.");
    } else {
      if (compareRouteIds.length >= 2) {
        compareRouteIds.shift();
      }
      compareRouteIds.push(routeId);
      if (compareRouteIds.length === 1) {
        showToast("⚖️ Đã chọn cung thứ 1! Hãy bấm '⚖️ So sánh' ở 1 cung đường nữa để đặt lên bàn cân.");
      } else if (compareRouteIds.length === 2) {
        showToast("⚖️ Đã đủ 2 cung đường! Đang mở Bàn cân đối chiếu trực diện...");
        setTimeout(() => openCompareRoutesModal(), 220);
      }
    }
    updateCompareTrayUI();
    document.querySelectorAll(".btn-card-compare").forEach((btn) => {
      const id = btn.dataset.compareId;
      const isSel = compareRouteIds.includes(id);
      btn.classList.toggle("selected", isSel);
      btn.textContent = isSel ? "✔ Đã chọn" : "⚖️ So sánh";
    });
  }

  function updateCompareTrayUI() {
    if (!compareTrayBar || !compareSlotsEl) return;
    if (compareRouteIds.length === 0) {
      compareTrayBar.classList.add("hidden");
      return;
    }
    compareTrayBar.classList.remove("hidden");

    const r1 = ROUTES_DATA.find((r) => r.id === compareRouteIds[0]);
    const r2 = compareRouteIds[1] ? ROUTES_DATA.find((r) => r.id === compareRouteIds[1]) : null;

    compareSlotsEl.innerHTML = `
      <span class="compare-slot-chip">
        <span>1️⃣ ${r1 ? r1.title.split("—")[0].trim() : ""}</span>
        <button type="button" class="compare-slot-remove" data-rm="${compareRouteIds[0]}" title="Bỏ chọn">✕</button>
      </span>
      <span style="font-weight:800; color:var(--accent-amber);">VS</span>
      ${
        r2
          ? `<span class="compare-slot-chip">
              <span>2️⃣ ${r2.title.split("—")[0].trim()}</span>
              <button type="button" class="compare-slot-remove" data-rm="${compareRouteIds[1]}" title="Bỏ chọn">✕</button>
            </span>`
          : `<span class="compare-slot-chip empty">+ Chọn thêm 1 cung đường nữa...</span>`
      }
    `;

    compareSlotsEl.querySelectorAll(".compare-slot-remove").forEach((btn) => {
      btn.addEventListener("click", () => toggleCompareRoute(btn.dataset.rm));
    });

    if (compareTrayHint) {
      compareTrayHint.textContent =
        compareRouteIds.length === 2
          ? "Đã sẵn sàng! Nhấn 'So sánh ngay' để xem bảng đối chiếu"
          : "Chọn thêm 1 cung nữa trên danh sách để đối chiếu trực diện";
    }
    if (btnOpenCompareModal) {
      btnOpenCompareModal.disabled = compareRouteIds.length < 2;
      btnOpenCompareModal.textContent = `⚖️ So sánh ngay (${compareRouteIds.length}/2)`;
    }
  }

  async function openCompareRoutesModal() {
    if (compareRouteIds.length < 2 || !compareRoutesModal || !compareModalBody) return;
    const rA = ROUTES_DATA.find((r) => r.id === compareRouteIds[0]);
    const rB = ROUTES_DATA.find((r) => r.id === compareRouteIds[1]);
    if (!rA || !rB) return;

    const costA = calculateDefaultEstimate(rA);
    const costB = calculateDefaultEstimate(rB);
    const elevA = window.phuotService.getRouteElevationAndCulinary(rA, rA.waypoints);
    const elevB = window.phuotService.getRouteElevationAndCulinary(rB, rB.waypoints);
    const survA = window.phuotService.getFieldSurvivalProfile(rA, rA.waypoints, selectedVehicle);
    const survB = window.phuotService.getFieldSurvivalProfile(rB, rB.waypoints, selectedVehicle);
    const inSeasonA = rA.bestMonths.includes(currentMonth);
    const inSeasonB = rB.bestMonths.includes(currentMonth);

    const buildColHTML = (r, other, cost, otherCost, elev, otherElev, surv, otherSurv, inSeason, idx) => {
      const shorterKm = r.distanceKm < other.distanceKm;
      const cheaper = cost < otherCost;
      const higherPeak = elev.maxElev > otherElev.maxElev;
      const betterSignal = surv.signalPct >= otherSurv.signalPct;

      return `
        <div class="compare-col-card">
          <div class="compare-col-hero">
            <img src="${r.image}" alt="${r.title}" onerror="this.onerror=null; this.src='${r.fallbackImage}';">
            <div class="compare-col-hero-overlay">
              <span>📍 ${r.region} · ${r.waypoints.length} chặng dừng</span>
              <h3>${r.title}</h3>
            </div>
          </div>

          <div class="compare-metrics-list">
            <div class="compare-metric-row">
              <div class="compare-metric-top">
                <span class="compare-metric-label">🛣️ Quãng đường & Thời lượng</span>
                ${shorterKm ? `<span class="compare-winner-pill">🏆 Gần & Đỡ mệt hơn</span>` : ""}
              </div>
              <div class="compare-metric-val">~${r.distanceKm} km · ${r.defaultDays} ngày ${Math.max(1, r.defaultDays - 1)} đêm</div>
            </div>

            <div class="compare-metric-row">
              <div class="compare-metric-top">
                <span class="compare-metric-label">💰 Kinh phí dự kiến / người</span>
                ${cheaper ? `<span class="compare-winner-pill">🏆 Tiết kiệm hơn ${formatVND(otherCost - cost)}</span>` : ""}
              </div>
              <div class="compare-metric-val" style="color:var(--accent-amber);">~${formatVND(cost)} / người</div>
            </div>

            <div class="compare-metric-row">
              <div class="compare-metric-top">
                <span class="compare-metric-label">⛰️ Đỉnh đèo & Độ gắt địa hình</span>
                ${higherPeak ? `<span class="compare-winner-pill">🏔️ Hùng vĩ hơn (${elev.maxElev}m)</span>` : `<span class="compare-winner-pill">🌿 Dễ chạy hơn</span>`}
              </div>
              <div class="compare-metric-val">Đỉnh ${elev.maxElev}m · ${elev.difficulty}</div>
            </div>

            <div class="compare-metric-row">
              <div class="compare-metric-top">
                <span class="compare-metric-label">🗓️ Độ hợp mùa hiện tại (Tháng ${currentMonth})</span>
                ${inSeason ? `<span class="compare-winner-pill">✨ Đang đúng mùa đẹp nhất</span>` : ""}
              </div>
              <div class="compare-metric-val">${r.bestTimeText}</div>
            </div>

            <div class="compare-metric-row">
              <div class="compare-metric-top">
                <span class="compare-metric-label">🌤️ Thời tiết thực tế ngay lúc này</span>
              </div>
              <div class="compare-metric-val" id="cmp-live-weather-${idx}">⏳ Đang tải nhiệt độ & mưa trực tiếp...</div>
            </div>

            <div class="compare-metric-row">
              <div class="compare-metric-top">
                <span class="compare-metric-label">⛽ Hạ tầng Cây xăng & Sóng 4G</span>
                ${betterSignal ? `<span class="compare-winner-pill">📶 Sóng 4G ổn định hơn (${surv.signalPct}%)</span>` : ""}
              </div>
              <div class="compare-metric-val" style="font-size:0.82rem;">Quãng trắng không cây xăng: ~${surv.maxFuelGapKm} km · ${surv.roadSurface}</div>
            </div>

            <div class="compare-metric-row">
              <div class="compare-metric-top">
                <span class="compare-metric-label">🍜 Đặc sản nổi bật</span>
              </div>
              <div class="compare-metric-val" style="font-size:0.82rem; font-weight:600;">${elev.dishes.slice(0, 3).join(" · ")}</div>
            </div>
          </div>

          <div class="compare-col-footer">
            <button type="button" class="btn-primary btn-choose-compared" data-route-id="${r.id}" style="width:100%; justify-content:center; border:none; cursor:pointer;">
              🚀 Chọn Cung Này (Mở Buồng Lái 3D)
            </button>
          </div>
        </div>
      `;
    };

    compareModalBody.innerHTML = `
      <div class="compare-versus-grid">
        ${buildColHTML(rA, rB, costA, costB, elevA, elevB, survA, survB, inSeasonA, 0)}
        ${buildColHTML(rB, rA, costB, costA, elevB, elevA, survB, survA, inSeasonB, 1)}
      </div>
    `;

    compareModalBody.querySelectorAll(".btn-choose-compared").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = ROUTES_DATA.find((r) => r.id === btn.dataset.routeId);
        compareRoutesModal.classList.add("hidden");
        if (chosen) openRouteModal(chosen);
      });
    });

    compareRoutesModal.classList.remove("hidden");
    compareRoutesModal.setAttribute("aria-hidden", "false");

    // Tải thời tiết trực tuyến cho cả 2 cung đường để so sánh tức thì
    [rA, rB].forEach(async (r, idx) => {
      const el = document.getElementById(`cmp-live-weather-${idx}`);
      if (!el) return;
      const midPt = r.waypoints[Math.floor(r.waypoints.length / 2)];
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${midPt.lat}&longitude=${midPt.lng}&current=temperature_2m,wind_speed_10m&daily=precipitation_probability_max&timezone=Asia%2FBangkok&forecast_days=1`
        );
        const data = await res.json();
        const t = Math.round(data.current.temperature_2m);
        const w = Math.round(data.current.wind_speed_10m);
        const rain = data.daily?.precipitation_probability_max?.[0] ?? 0;
        el.innerHTML = `${midPt.name}: <span style="color:var(--accent-green);">${t}°C</span> · 🌧️ Mưa ${rain}% · 💨 Gió ${w} km/h`;
      } catch {
        el.textContent = `${midPt.name}: Khí hậu ổn định, thuận lợi khởi hành`;
      }
    });
  }

  if (btnOpenCompareModal) {
    btnOpenCompareModal.addEventListener("click", openCompareRoutesModal);
  }
  if (btnClearCompare) {
    btnClearCompare.addEventListener("click", () => {
      compareRouteIds = [];
      updateCompareTrayUI();
      document.querySelectorAll(".btn-card-compare").forEach((btn) => {
        btn.classList.remove("selected");
        btn.textContent = "⚖️ So sánh";
      });
      showToast("🗑️ Đã làm trống Bàn cân so sánh.");
    });
  }
  if (compareRoutesClose) {
    compareRoutesClose.addEventListener("click", () => compareRoutesModal.classList.add("hidden"));
  }
  if (compareRoutesBackdrop) {
    compareRoutesBackdrop.addEventListener("click", () =>
      compareRoutesModal.classList.add("hidden")
    );
  }

  // =========================================================================
  // 14. BẢN ĐỒ TỔNG VIỆT NAM TƯƠNG TÁC TRỰC TIẾP TẠI TẦNG 1 (MASTER ATLAS)
  // =========================================================================
  let masterMapRegionFilter = "all";
  let masterMapConquestOnly = false;
  let masterPreviewRoute = null;

  const masterPreviewCard = document.getElementById("master-map-preview-card");
  const btnCloseMmPreview = document.getElementById("btn-close-mm-preview");
  const btnMmOpenCockpit = document.getElementById("btn-mm-open-cockpit");
  const btnMmCompare = document.getElementById("btn-mm-compare");
  const btnMmConquestMode = document.getElementById("btn-mm-conquest-mode");
  const btnMmBasemap = document.getElementById("btn-mm-basemap");
  const mmRegionPills = document.querySelectorAll(".mm-pill");

  function getConqueredRouteIds() {
    const user = window.phuotDB ? window.phuotDB.getCurrentUser() : null;
    return user && Array.isArray(user.conqueredRoutes) ? user.conqueredRoutes : [];
  }

  function showMasterMapPreviewCard(route) {
    if (!masterPreviewCard || !route) return;
    masterPreviewRoute = route;
    const est = calculateDefaultEstimate(route);
    const imgEl = document.getElementById("mm-prev-img");
    if (imgEl) {
      imgEl.src = route.image;
      imgEl.alt = route.title;
      imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = route.fallbackImage;
      };
    }
    const isConq = getConqueredRouteIds().includes(route.id);
    document.getElementById("mm-prev-region").textContent = `${route.region}${isConq ? " · 🏆 ĐÃ CHINH PHỤC" : ""}`;
    document.getElementById("mm-prev-title").textContent = route.title;
    document.getElementById("mm-prev-meta").textContent = `🛣️ ~${route.distanceKm} km · ⏱️ ${route.defaultDays}N${Math.max(1, route.defaultDays - 1)}Đ · 💰 ~${formatVND(est)}/người`;
    masterPreviewCard.classList.remove("hidden");
  }

  function syncMasterAtlasRegionState(regionName) {
    masterMapRegionFilter = regionName || "all";
    mmRegionPills.forEach((p) => {
      p.classList.toggle("active", p.dataset.mmRegion === masterMapRegionFilter);
    });
    if (masterPreviewCard) masterPreviewCard.classList.add("hidden");
    if (typeof clearMasterSelectedTrail === "function") {
      clearMasterSelectedTrail();
    }
    if (typeof refreshMasterAtlasPins === "function") {
      refreshMasterAtlasPins(
        ROUTES_DATA,
        masterMapRegionFilter,
        getConqueredRouteIds(),
        masterMapConquestOnly
      );
    }
    if (typeof focusMasterAtlasRegion === "function") {
      focusMasterAtlasRegion(masterMapRegionFilter);
    }
  }

  function syncMasterAtlasPinsAndStats() {
    const conqueredIds = getConqueredRouteIds();
    if (typeof refreshMasterAtlasPins === "function") {
      refreshMasterAtlasPins(
        ROUTES_DATA,
        masterMapRegionFilter,
        conqueredIds,
        masterMapConquestOnly
      );
    }
    updateDynamicStatsRibbon();
    if (typeof syncFourPolesPostcardStamps === "function") {
      syncFourPolesPostcardStamps();
    }
  }

  mmRegionPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      syncMasterAtlasRegionState(pill.dataset.mmRegion || "all");
    });
  });

  if (btnMmConquestMode) {
    btnMmConquestMode.addEventListener("click", () => {
      const conqueredIds = getConqueredRouteIds();
      if (!masterMapConquestOnly && conqueredIds.length === 0) {
        showToast("🛂 Hãy đăng nhập Hộ chiếu hoặc đánh dấu 1 cung đã chinh phục để bật Bản đồ Dấu chân!");
        return;
      }
      masterMapConquestOnly = !masterMapConquestOnly;
      btnMmConquestMode.classList.toggle("active", masterMapConquestOnly);
      syncMasterAtlasPinsAndStats();
      showToast(
        masterMapConquestOnly
          ? `🏆 Đang chiếu sáng ${conqueredIds.length} cung đường bạn đã chinh phục trên Bản đồ Việt Nam!`
          : "🗺️ Đã hiển thị lại toàn bộ cung đường."
      );
    });
  }

  if (btnMmBasemap) {
    btnMmBasemap.addEventListener("click", () => {
      const currentMode = btnMmBasemap.dataset.mode || "topo";
      const nextMode = currentMode === "topo" ? "satellite" : "topo";
      btnMmBasemap.dataset.mode = nextMode;
      btnMmBasemap.classList.toggle("active", nextMode === "satellite");
      btnMmBasemap.textContent = nextMode === "satellite" ? "🗺️ Địa hình" : "🛰️ Vệ tinh";
      if (typeof setMasterAtlasBasemap === "function") {
        setMasterAtlasBasemap(nextMode);
      }
    });
  }

  if (btnCloseMmPreview && masterPreviewCard) {
    btnCloseMmPreview.addEventListener("click", () => {
      masterPreviewCard.classList.add("hidden");
      if (typeof clearMasterSelectedTrail === "function") clearMasterSelectedTrail();
      if (typeof focusMasterAtlasRegion === "function") {
        focusMasterAtlasRegion(masterMapRegionFilter);
      }
    });
  }
  if (btnMmOpenCockpit) {
    btnMmOpenCockpit.addEventListener("click", () => {
      if (masterPreviewRoute) openRouteModal(masterPreviewRoute);
    });
  }
  if (btnMmCompare) {
    btnMmCompare.addEventListener("click", () => {
      if (masterPreviewRoute) toggleCompareRoute(masterPreviewRoute.id);
    });
  }

  // =========================================================================
  // 15. XUẤT FILE ĐỊNH VỊ GPS CHUẨN QUỐC TẾ (.GPX 1.1) CHO GARMIN / OSMAND
  // =========================================================================
  const btnExportGpx = document.getElementById("btn-export-gpx");
  const btnPocketDownloadGpx = document.getElementById("btn-pocket-download-gpx");

  function handleExportActiveRouteGPX() {
    if (!activeRoute || typeof exportRouteAsGPX !== "function") return;
    const ok = exportRouteAsGPX(activeRoute, currentWaypoints);
    if (ok) {
      showToast(`📡 Đã tải file GPS chuẩn quốc tế (.GPX) cho cung ${activeRoute.title.split("—")[0].trim()}!`);
    }
  }

  if (btnExportGpx) btnExportGpx.addEventListener("click", handleExportActiveRouteGPX);
  if (btnPocketDownloadGpx) btnPocketDownloadGpx.addEventListener("click", handleExportActiveRouteGPX);

  // =========================================================================
  // 16. CỬA SỔ TÌM KIẾM TỨC THÌ TOÀN TRANG (CTRL + K SPOTLIGHT PALETTE)
  // =========================================================================
  const cmdPaletteModal = document.getElementById("command-palette-modal");
  const cmdPaletteBackdrop = document.getElementById("cmd-palette-backdrop");
  const cmdPaletteInput = document.getElementById("cmd-palette-input");
  const cmdPaletteResults = document.getElementById("cmd-palette-results");
  const cmdResultCount = document.getElementById("cmd-result-count");
  const btnOpenCmdPalette = document.getElementById("btn-open-command-palette");

  let cmdFilteredRoutes = [];
  let cmdActiveIndex = 0;

  function renderCommandPaletteResults(query = "") {
    if (!cmdPaletteResults) return;
    const q = query.trim().toLowerCase();

    cmdFilteredRoutes = ROUTES_DATA.filter((r) => {
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.region.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.waypoints.some((w) => w.name.toLowerCase().includes(q))
      );
    }).slice(0, 12);

    cmdActiveIndex = 0;
    cmdPaletteResults.innerHTML = "";

    if (cmdResultCount) {
      cmdResultCount.textContent = q
        ? `Tìm thấy ${cmdFilteredRoutes.length} cung khớp với "${query.trim()}"`
        : `${ROUTES_DATA.length} cung đường & hơn 150 chặng dừng trên toàn quốc`;
    }

    if (cmdFilteredRoutes.length === 0) {
      cmdPaletteResults.innerHTML = `
        <div style="text-align:center; padding:1.8rem 1rem; color:var(--text-muted); font-size:0.88rem;">
          Không tìm thấy cung đường hay đèo nào khớp với "<strong>${query.trim()}</strong>". Hãy thử từ khóa khác (VD: Hà Giang, Tà Xùa, Vĩnh Hy, Đà Lạt).
        </div>
      `;
      return;
    }

    cmdFilteredRoutes.forEach((route, idx) => {
      const matchedWp = q
        ? route.waypoints.find((w) => w.name.toLowerCase().includes(q))
        : null;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `cmd-result-item ${idx === 0 ? "active-item" : ""}`;
      btn.innerHTML = `
        <img src="${route.image}" alt="" class="cmd-result-thumb" onerror="this.onerror=null; this.src='${route.fallbackImage}';">
        <div class="cmd-result-info">
          <strong>${route.title}</strong>
          <small>📍 ${route.region} · 🛣️ ~${route.distanceKm} km · ⏱️ ${route.defaultDays}N${Math.max(1, route.defaultDays - 1)}Đ${
            matchedWp ? ` · Khớp chặng: <b>${matchedWp.name}</b>` : ""
          }</small>
        </div>
        <span class="cmd-result-badge">Mở 3D ↵</span>
      `;
      btn.addEventListener("click", () => {
        closeCommandPalette();
        openRouteModal(route);
      });
      cmdPaletteResults.appendChild(btn);
    });
  }

  function openCommandPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.classList.remove("hidden");
    cmdPaletteModal.setAttribute("aria-hidden", "false");
    if (cmdPaletteInput) {
      cmdPaletteInput.value = "";
      renderCommandPaletteResults("");
      setTimeout(() => cmdPaletteInput.focus(), 40);
    }
  }

  function closeCommandPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.classList.add("hidden");
    cmdPaletteModal.setAttribute("aria-hidden", "true");
  }

  if (btnOpenCmdPalette) btnOpenCmdPalette.addEventListener("click", openCommandPalette);
  if (cmdPaletteBackdrop) cmdPaletteBackdrop.addEventListener("click", closeCommandPalette);

  if (cmdPaletteInput) {
    cmdPaletteInput.addEventListener("input", () => {
      renderCommandPaletteResults(cmdPaletteInput.value);
    });

    cmdPaletteInput.addEventListener("keydown", (e) => {
      const items = cmdPaletteResults ? cmdPaletteResults.querySelectorAll(".cmd-result-item") : [];
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex + 1) % items.length;
        items.forEach((el, i) => el.classList.toggle("active-item", i === cmdActiveIndex));
        items[cmdActiveIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        cmdActiveIndex = (cmdActiveIndex - 1 + items.length) % items.length;
        items.forEach((el, i) => el.classList.toggle("active-item", i === cmdActiveIndex));
        items[cmdActiveIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const chosen = cmdFilteredRoutes[cmdActiveIndex];
        if (chosen) {
          closeCommandPalette();
          openRouteModal(chosen);
        }
      }
    });
  }

  document.querySelectorAll(".cmd-action-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.dataset.cmd;
      closeCommandPalette();
      if (cmd === "advisor" && btnToggleAdvisor) {
        document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
        if (advisorPanel && advisorPanel.classList.contains("hidden")) {
          btnToggleAdvisor.click();
        }
      } else if (cmd === "builder" && btnOpenCustomBuilder) {
        btnOpenCustomBuilder.click();
      } else if (cmd === "passport" && btnOpenPassport) {
        btnOpenPassport.click();
      } else if (cmd === "chat") {
        openChatHub();
      } else if (cmd === "import-trip") {
        openShareTripModal(true);
      } else if (cmd === "theme" && themeToggleBtn) {
        themeToggleBtn.click();
      }
    });
  });

  // =========================================================================
  // 17. ĐỒNG HỒ LĂN SỐ THỰC TẾ, MÀN MỞ MÀN LA BÀN, PHÁO HOA CHINH PHỤC & NÚT NAM CHÂM
  // =========================================================================
  let statsAnimatedOnce = false;

  function animateOdometerValue(el, targetNum, suffix, formatLocale = false) {
    if (!el) return;
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || statsAnimatedOnce) {
      el.textContent = `${formatLocale ? targetNum.toLocaleString("vi-VN") : targetNum}${suffix}`;
      return;
    }

    const duration = 950;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(targetNum * eased);
      el.textContent = `${formatLocale ? currentVal.toLocaleString("vi-VN") : currentVal}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function updateDynamicStatsRibbon() {
    if (typeof ROUTES_DATA === "undefined") return;
    const totalRoutes = ROUTES_DATA.length;
    const totalKm = ROUTES_DATA.reduce((sum, r) => sum + (r.distanceKm || 0), 0);
    const totalStages = ROUTES_DATA.reduce(
      (sum, r) => sum + (Array.isArray(r.waypoints) ? r.waypoints.length : 0),
      0
    );
    const conqueredCount = getConqueredRouteIds().length;

    const elRoutes = document.getElementById("stat-total-routes");
    const elKm = document.getElementById("stat-total-km");
    const elStages = document.getElementById("stat-total-stages");
    const elConq = document.getElementById("stat-conquered-live");

    animateOdometerValue(elRoutes, totalRoutes, " Cung", false);
    animateOdometerValue(elKm, totalKm, " km", true);
    animateOdometerValue(elStages, totalStages, " Chặng", false);
    statsAnimatedOnce = true;

    if (elConq) {
      elConq.textContent = conqueredCount > 0 ? `${conqueredCount}/${totalRoutes} Đã đi` : "Hộ Chiếu";
    }
  }

  // Hiệu ứng Đóng Dấu Mộc + Pháo Hoa Vàng Nhẹ khi đánh dấu Chinh phục 1 cung đường (A2)
  function triggerConquestCelebration(anchorBtn) {
    if (!anchorBtn) return;
    anchorBtn.classList.remove("stamp-slam");
    void anchorBtn.offsetWidth;
    anchorBtn.classList.add("stamp-slam");

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = anchorBtn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const colors = ["#F59E0B", "#FBBF24", "#146338", "#10B981", "#FDE047", "#D97706"];

    for (let i = 0; i < 24; i++) {
      const spark = document.createElement("span");
      spark.className = "conquest-spark";
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.35;
      const dist = 52 + Math.random() * 88;
      spark.style.left = `${originX}px`;
      spark.style.top = `${originY}px`;
      spark.style.background = colors[i % colors.length];
      spark.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * dist - 18}px`);
      spark.style.setProperty("--rot", `${Math.round(Math.random() * 360 - 180)}deg`);
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 900);
    }
  }

  // Hiệu ứng Nút Nam Châm nhẹ cho các nút hành động chính trên Desktop (A2)
  function initMagneticButtons() {
    if (
      !window.matchMedia ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const targets = document.querySelectorAll(
      ".hero-actions .btn-primary, .passport-nav-btn, .btn-custom-route-pill, .btn-advisor-pill"
    );
    targets.forEach((el) => {
      el.classList.add("magnetic-btn");
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        el.style.transform = `translate3d(${(relX * 7).toFixed(1)}px, ${(relY * 5).toFixed(1)}px, 0)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  // Màn Mở Màn La Bàn Tọa Độ 0.9s + Chữ Tạp Chí Lộ Diện (A1)
  function initCartographicIntro() {
    const curtain = document.getElementById("cartographic-intro-curtain");
    const finishIntro = () => {
      if (curtain && !curtain.classList.contains("is-leaving")) {
        curtain.classList.add("is-leaving");
        document.body.classList.add("hero-entered");
        setTimeout(() => {
          if (curtain.parentNode) curtain.remove();
        }, 700);
      } else {
        document.body.classList.add("hero-entered");
      }
    };

    if (
      !curtain ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      finishIntro();
      return;
    }

    curtain.addEventListener("click", finishIntro);
    setTimeout(finishIntro, 920);
  }

  // =========================================================================
  // 18. BƯU THIẾP 4 CỰC TỔ QUỐC Ở CHÂN TRANG (1 CHẠM MỞ BUỒNG LÁI + ĐỒNG BỘ MỘC ĐỎ)
  // =========================================================================
  const poleStampBtns = document.querySelectorAll(".pole-stamp-btn");

  function syncFourPolesPostcardStamps() {
    const conqueredSet = new Set(getConqueredRouteIds());
    poleStampBtns.forEach((btn) => {
      const routeId = btn.dataset.poleRoute;
      const isDone = conqueredSet.has(routeId);
      btn.classList.toggle("is-conquered", isDone);
    });
  }

  poleStampBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.poleRoute;
      const found = ROUTES_DATA.find((r) => r.id === targetId);
      if (found) {
        openRouteModal(found);
      }
    });
  });

  // =========================================================================
  // 19. GỌN BUỒNG LÁI ACCORDION + LINK MỜI ĐOÀN, MÃ ĐỒNG BỘ & MÃ QR (ZERO-BACKEND)
  // =========================================================================
  const btnToggleAllAcc = document.getElementById("btn-toggle-all-acc");
  if (btnToggleAllAcc) {
    btnToggleAllAcc.addEventListener("click", () => {
      const accs = document.querySelectorAll("details.cockpit-acc");
      const shouldOpen = btnToggleAllAcc.dataset.expanded !== "true";
      accs.forEach((d) => {
        d.open = shouldOpen;
      });
      btnToggleAllAcc.dataset.expanded = shouldOpen ? "true" : "false";
      btnToggleAllAcc.textContent = shouldOpen ? "⤡ Thu gọn bớt" : "⤢ Mở tất cả";
    });
  }

  const shareTripModal = document.getElementById("share-trip-modal");
  const shareTripBackdrop = document.getElementById("share-trip-backdrop");
  const shareTripClose = document.getElementById("share-trip-close");
  const btnShareTripModal = document.getElementById("btn-share-trip-modal");
  const btnPocketShareQr = document.getElementById("btn-pocket-share-qr");
  const shareExportSection = document.getElementById("share-export-section");
  const shareTripSummary = document.getElementById("share-trip-summary");
  const shareQrFrame = document.getElementById("share-qr-frame");
  const shareQrCaption = document.getElementById("share-qr-caption");
  const shareLinkInput = document.getElementById("share-link-input");
  const shareCodeInput = document.getElementById("share-code-input");
  const shareLocalHint = document.getElementById("share-local-hint");
  const shareImportInput = document.getElementById("share-import-input");
  const btnCopyShareLink = document.getElementById("btn-copy-share-link");
  const btnCopyShareCode = document.getElementById("btn-copy-share-code");
  const btnCopyZaloInvite = document.getElementById("btn-copy-zalo-invite");
  const btnApplyShareCode = document.getElementById("btn-apply-share-code");

  function encodeTripShareCode() {
    if (!activeRoute) return null;
    const payload = {
      r: activeRoute.id,
      d: Math.max(1, parseInt(inputDays?.value, 10) || activeRoute.defaultDays || 2),
      p: Math.max(1, parseInt(inputPeople?.value, 10) || 1),
      v: selectedVehicleModel || "underbone",
      t: pacingStartInput?.value || "05:30",
      m: pacingSpeedSelect?.value || "standard",
      s: activeCostSplitMode || "equal",
      dt: solarDateInput?.value || "",
      h: homeCitySelect?.value || "none"
    };

    // Lưu thứ tự chặng tùy chỉnh (kéo thả / đảo chiều) dưới dạng mảng chỉ số gọn nhẹ
    if (
      Array.isArray(currentWaypoints) &&
      Array.isArray(activeRoute.waypoints) &&
      currentWaypoints.length === activeRoute.waypoints.length
    ) {
      const orderIdx = currentWaypoints.map((wp) =>
        activeRoute.waypoints.findIndex((orig) => orig.name === wp.name && orig.lat === wp.lat)
      );
      const isCustomized = orderIdx.some((idx, pos) => idx !== pos) && orderIdx.every((idx) => idx >= 0);
      if (isCustomized) payload.o = orderIdx;
    }

    const jsonStr = JSON.stringify(payload);
    const bytes = new TextEncoder().encode(jsonStr);
    let binStr = "";
    bytes.forEach((b) => {
      binStr += String.fromCharCode(b);
    });
    const b64Url = btoa(binStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return `DM-${b64Url}`;
  }

  function decodeTripShareCode(rawInput) {
    if (!rawInput || typeof rawInput !== "string") return null;
    let token = rawInput.trim();
    const hashMatch = token.match(/#trip=([A-Za-z0-9_-]+)/);
    if (hashMatch) token = hashMatch[1];
    const dmMatch = token.match(/DM-([A-Za-z0-9_-]+)/);
    if (dmMatch) token = dmMatch[1];
    else token = token.replace(/^DM-/, "");

    try {
      const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "===".slice((b64.length + 3) % 4);
      const binStr = atob(padded);
      const bytes = Uint8Array.from(binStr, (ch) => ch.charCodeAt(0));
      const jsonStr = new TextDecoder().decode(bytes);
      const parsed = JSON.parse(jsonStr);
      if (!parsed || !parsed.r) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function applySharedTripPayload(payload, showFeedback = true) {
    if (!payload || !payload.r) return false;
    const foundRoute = ROUTES_DATA.find((r) => r.id === payload.r);
    if (!foundRoute) {
      if (showFeedback) showToast("⚠️ Không tìm thấy cung đường tương ứng trong mã đồng bộ!");
      return false;
    }

    // Khôi phục thứ tự chặng tùy chỉnh (nếu trưởng đoàn đã đảo chiều / kéo thả)
    let restoredWps = null;
    if (
      Array.isArray(payload.o) &&
      payload.o.length === foundRoute.waypoints.length &&
      payload.o.every((i) => Number.isInteger(i) && i >= 0 && i < foundRoute.waypoints.length)
    ) {
      restoredWps = payload.o.map((i) => foundRoute.waypoints[i]);
    }

    // Khôi phục dòng xe, phương tiện, chia tiền, ngày đi, giờ xuất phát, xuất phát từ nhà
    if (payload.v && ["underbone", "manual", "scooter", "sedan", "suv"].includes(payload.v)) {
      selectedVehicleModel = payload.v;
      selectedVehicle = ["sedan", "suv"].includes(payload.v) ? "car" : "motorbike";
      syncVehicleModelPillsUI();
    }
    if (payload.s && ["equal", "xe-om"].includes(payload.s)) {
      activeCostSplitMode = payload.s;
      splitTabBtns.forEach((b) => b.classList.toggle("active", b.dataset.split === activeCostSplitMode));
    }
    if (pacingStartInput && payload.t) pacingStartInput.value = payload.t;
    if (pacingSpeedSelect && payload.m) pacingSpeedSelect.value = payload.m;
    if (solarDateInput && payload.dt) solarDateInput.value = payload.dt;
    if (homeCitySelect && payload.h) homeCitySelect.value = payload.h;

    openRouteModal(foundRoute, restoredWps);

    if (inputDays && payload.d) inputDays.value = Math.max(1, Math.min(30, parseInt(payload.d, 10) || foundRoute.defaultDays));
    if (inputPeople && payload.p) inputPeople.value = Math.max(1, Math.min(20, parseInt(payload.p, 10) || 1));

    updateVehicleNotice();
    renderStageBreakdownTimeline();
    updateGoogleMapsNavLink();
    updateCostCalculator();

    if (showFeedback) {
      const daysVal = inputDays ? inputDays.value : foundRoute.defaultDays;
      const peopleVal = inputPeople ? inputPeople.value : 1;
      showToast(`🔗 Đã đồng bộ lịch trình đoàn: ${foundRoute.title} (${daysVal}N · ${peopleVal} người)!`);
    }
    return true;
  }

  function closeShareTripModal() {
    if (!shareTripModal) return;
    shareTripModal.classList.add("hidden");
    shareTripModal.setAttribute("aria-hidden", "true");
  }

  function openShareTripModal(focusImportOnly = false) {
    if (!shareTripModal) return;
    const hasRoute = Boolean(activeRoute) && !focusImportOnly;
    if (shareExportSection) shareExportSection.classList.toggle("hidden", !hasRoute);

    if (hasRoute) {
      const code = encodeTripShareCode();
      const baseUrl = window.location.href.split("#")[0];
      const fullShareUrl = `${baseUrl}#trip=${code}`;
      const daysVal = inputDays ? inputDays.value : activeRoute.defaultDays;
      const peopleVal = inputPeople ? inputPeople.value : 1;
      const depTime = pacingStartInput ? pacingStartInput.value : "05:30";
      const vehInfo = window.phuotService
        ? window.phuotService.evaluateVehicleReadiness(activeRoute, selectedVehicleModel)
        : null;
      const isFileProto = window.location.protocol === "file:";

      if (shareTripSummary) {
        shareTripSummary.textContent = `📍 ${activeRoute.title} · ${daysVal}N${Math.max(1, daysVal - 1)}Đ · ${peopleVal} người · ${
          vehInfo ? vehInfo.shortName : selectedVehicle
        } · Xuất phát ${depTime}`;
      }
      if (shareLinkInput) shareLinkInput.value = fullShareUrl;
      if (shareCodeInput) shareCodeInput.value = code;
      if (shareLocalHint) shareLocalHint.classList.toggle("hidden", !isFileProto);

      if (shareQrFrame) {
        if (typeof window.qrcode === "function") {
          try {
            const qr = window.qrcode(0, "M");
            qr.addData(isFileProto ? code : fullShareUrl);
            qr.make();
            shareQrFrame.innerHTML = qr.createSvgTag({ scalable: true, margin: 0 });
            if (shareQrCaption) {
              shareQrCaption.textContent = isFileProto
                ? "Mã QR chứa Mã Đồng Bộ Nhanh (quét hoặc Copy mã bên phải)"
                : "Quét bằng camera điện thoại để mở ngay lịch trình này";
            }
          } catch {
            shareQrFrame.innerHTML = `<span style="font-size:0.75rem;color:#37493E;text-align:center;">Dùng nút Copy Link hoặc Mã Đồng Bộ bên cạnh</span>`;
          }
        } else {
          shareQrFrame.innerHTML = `<span style="font-size:0.75rem;color:#37493E;text-align:center;">📴 Đang offline — hãy dùng nút Copy Mã Đồng Bộ bên phải!</span>`;
        }
      }
    } else if (shareTripSummary) {
      shareTripSummary.textContent = "Dán Link (#trip=...) hoặc Mã Đồng Bộ (DM-...) nhận từ bạn bè để mở đúng lịch trình đã thiết lập.";
    }

    shareTripModal.classList.remove("hidden");
    shareTripModal.setAttribute("aria-hidden", "false");
    if (focusImportOnly && shareImportInput) {
      setTimeout(() => shareImportInput.focus(), 60);
    }
  }

  function copyTextSafely(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch {}
        ta.remove();
      });
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      ta.remove();
    }
  }

  if (btnShareTripModal) {
    btnShareTripModal.addEventListener("click", () => openShareTripModal(false));
  }
  if (btnPocketShareQr) {
    btnPocketShareQr.addEventListener("click", () => {
      const pm = document.getElementById("pocket-card-modal");
      if (pm) {
        pm.classList.add("hidden");
        pm.setAttribute("aria-hidden", "true");
      }
      openShareTripModal(false);
    });
  }
  if (shareTripClose) shareTripClose.addEventListener("click", closeShareTripModal);
  if (shareTripBackdrop) shareTripBackdrop.addEventListener("click", closeShareTripModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && shareTripModal && !shareTripModal.classList.contains("hidden")) {
      closeShareTripModal();
    }
  });

  if (btnCopyShareLink && shareLinkInput) {
    btnCopyShareLink.addEventListener("click", () => {
      copyTextSafely(shareLinkInput.value);
      showToast("🔗 Đã sao chép Link hành trình! Gửi cho đoàn mở là khớp 100%.");
    });
  }
  if (btnCopyShareCode && shareCodeInput) {
    btnCopyShareCode.addEventListener("click", () => {
      copyTextSafely(shareCodeInput.value);
      showToast("🔑 Đã sao chép Mã Đồng Bộ Nhanh (DM-...)!");
    });
  }
  if (btnCopyZaloInvite && shareLinkInput && shareCodeInput) {
    btnCopyZaloInvite.addEventListener("click", () => {
      if (!activeRoute) return;
      const daysVal = inputDays ? inputDays.value : activeRoute.defaultDays;
      const peopleVal = inputPeople ? inputPeople.value : 1;
      const depTime = pacingStartInput ? pacingStartInput.value : "05:30";
      const msg = [
        `🏍️ KÈO PHƯỢT: ${activeRoute.title.toUpperCase()}`,
        `🗓️ Lịch trình: ${daysVal}N${Math.max(1, daysVal - 1)}Đ · 👥 ${peopleVal} người · 🕒 Xuất phát ${depTime}`,
        `🛣️ Chặng: ${currentWaypoints.map((w) => w.name).join(" ➔ ")}`,
        `🔗 Mở lịch trình trực tiếp: ${shareLinkInput.value}`,
        `🔑 Mã đồng bộ nhanh: ${shareCodeInput.value}`
      ].join("\n");
      copyTextSafely(msg);
      showToast("💬 Đã copy lời mời đoàn kèm Link & Mã đồng bộ — Dán vào Zalo ngay!");
    });
  }
  if (btnApplyShareCode && shareImportInput) {
    const handleImportTrip = () => {
      const payload = decodeTripShareCode(shareImportInput.value);
      if (!payload) {
        showToast("⚠️ Mã hoặc Link chưa hợp lệ — hãy dán đúng mã bắt đầu bằng DM-... hoặc #trip=...");
        return;
      }
      closeShareTripModal();
      shareImportInput.value = "";
      applySharedTripPayload(payload, true);
    };
    btnApplyShareCode.addEventListener("click", handleImportTrip);
    shareImportInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleImportTrip();
      }
    });
  }

  function checkAndOpenTripFromUrlHash() {
    if (!window.location.hash || !window.location.hash.includes("trip=")) return;
    const payload = decodeTripShareCode(window.location.hash);
    if (payload) {
      applySharedTripPayload(payload, true);
    }
  }
  window.addEventListener("hashchange", checkAndOpenTripFromUrlHash);

  // Khởi chạy toàn bộ 3 tầng, Bản đồ Tổng Việt Nam, Animation & đồng bộ Hộ chiếu
  initCartographicIntro();
  initMagneticButtons();
  refreshRegionFilterLabels();
  syncPassportUserUI();
  updateSavedTripsBadge();
  renderTier1MacroAtlas();
  updateTierNavigationUI();
  renderRoutes();
  syncFourPolesPostcardStamps();
  setTimeout(checkAndOpenTripFromUrlHash, 350);

  // Kích hoạt đồng hồ lăn số mượt khi thanh thống kê xuất hiện trong khung nhìn
  const statsRibbonEl = document.querySelector(".stats-ribbon");
  if (statsRibbonEl && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          updateDynamicStatsRibbon();
          statsObserver.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    statsObserver.observe(statsRibbonEl);
  } else {
    updateDynamicStatsRibbon();
    if (typeof syncFourPolesPostcardStamps === "function") {
      syncFourPolesPostcardStamps();
    }
  }

  if (typeof initVietnamMasterAtlas === "function") {
    initVietnamMasterAtlas(ROUTES_DATA, {
      onSelectRoute: (route) => showMasterMapPreviewCard(route)
    });
    setTimeout(() => syncMasterAtlasPinsAndStats(), 600);
  }
});
