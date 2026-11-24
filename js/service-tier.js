/**
 * ============================================================================
 * KIẾN TRÚC ĐA TẦNG (3-TIER ARCHITECTURE) — TẦNG DỊCH VỤ & DỮ LIỆU
 * - Tier 1 (Presentation): index.html, css/style.css, js/app.js, js/map.js
 * - Tier 2 (Business Logic & API Service): js/service-tier.js + server.js
 * - Tier 3 (Data Persistence): LocalDatabase (LocalStorage/JSON) + Seed Data
 * ============================================================================
 */

const REGION_METADATA = {
  "Miền Bắc": {
    id: "mien-bac",
    code: "NORTH · HIGHLANDS",
    title: "Miền Bắc — Đỉnh Đèo & Mây Ngàn",
    tagline: "Hà Giang · Tây Bắc · Đông Bắc",
    description: "Vùng đất của Tứ Đại Đỉnh Đèo, những hẻm vực đá tai mèo sâu thẳm, ruộng bậc thang mùa lúa chín và biển mây Tà Xùa.",
    elevationPeak: "2.000m+",
    terrainType: "Đèo cao & Cua tay áo",
    accentColor: "#146338",
    icon: "🏔️"
  },
  "Miền Trung": {
    id: "mien-trung",
    code: "CENTRAL · COASTAL",
    title: "Miền Trung — Duyên Hải & Trường Sơn",
    tagline: "Hải Vân · Bình Tiên · Đường Hồ Chí Minh",
    description: "Sự giao thoa kỳ vĩ giữa một bên là vách núi Trường Sơn dựng đứng, một bên là đại dương xanh ngọc bích đẹp nhất Việt Nam.",
    elevationPeak: "1.200m",
    terrainType: "Đường ven biển & Đèo rừng",
    accentColor: "#1D4ED8",
    icon: "🌊"
  },
  "Tây Nguyên & Nam Bộ": {
    id: "tay-nguyen-nam-bo",
    code: "HIGHLANDS & DELTA",
    title: "Tây Nguyên & Nam Bộ — Đại Ngàn & Phù Sa",
    tagline: "Đà Lạt · Măng Đen · Thất Sơn · Cà Mau",
    description: "Hành trình xuyên qua những rừng thông sương mù, đồi cà phê bạt ngàn trên đất đỏ bazan đến miền sông nước Cửu Long.",
    elevationPeak: "1.500m",
    terrainType: "Đèo thông & Đường ven sông",
    accentColor: "#D97706",
    icon: "🌲"
  },
  "Bộ Sưu Tập Tứ Đại": {
    id: "bo-tu-dai",
    code: "GRAND SLAM · 4 EXTREMES",
    title: "Bộ Tứ Đại — 4 Cực & Đỉnh Đèo Huyền Thoại",
    tagline: "Lũng Cú · A Pa Chải · Mũi Đôi · Cà Mau",
    description: "Bộ sưu tập danh giá nhất dành cho các phượt thủ muốn chinh phục trọn vẹn 4 cực Tổ quốc và 4 đỉnh đèo huyền thoại.",
    elevationPeak: "2.200m",
    terrainType: "Hành trình Chinh phục Cực điểm",
    accentColor: "#B45309",
    icon: "🏆"
  }
};

// Hồ sơ mẫu để Đăng nhập nhanh 1 chạm (Demo 1-Click Login)
const DEMO_PASSPORT_PROFILES = [
  {
    id: "user_hoang_minh",
    name: "Hoàng Minh",
    city: "Hà Nội",
    vehicle: "Xe côn tay CB500X",
    avatar: "🏍️",
    rankTitle: "Huyền Thoại Xuyên Việt",
    verified: true,
    conqueredRoutes: [
      "ha-giang-loop",
      "tu-dai-dinh-deo-tay-bac",
      "san-may-ta-xua-tram-tau",
      "dong-bac-cao-bang-ban-gioc",
      "cuc-bac-lung-cu",
      "deo-hai-van-hue-da-nang",
      "ven-bien-binh-thuan-ninh-thuan"
    ]
  },
  {
    id: "user_linh_dan",
    name: "Linh Đan",
    city: "Đà Nẵng",
    vehicle: "Xe số Yamaha PG-1",
    avatar: "🧭",
    rankTitle: "Phượt Thủ Bản Lĩnh",
    verified: true,
    conqueredRoutes: [
      "deo-hai-van-hue-da-nang",
      "ban-dao-son-tra-dinh-ban-co",
      "quy-nhon-eo-gio-ghenh-da-dia",
      "duong-truong-son-dong"
    ]
  },
  {
    id: "user_tuan_kiet",
    name: "Tuấn Kiệt",
    city: "TP. Hồ Chí Minh",
    vehicle: "Ô tô SUV 4x4",
    avatar: "🚙",
    rankTitle: "Tay Lái Đại Ngàn",
    verified: true,
    conqueredRoutes: [
      "deo-ngoan-muc-cau-dat-da-lat",
      "ho-ta-dung-dak-nong-bao-loc",
      "ven-bien-vung-tau-ho-tram-ke-ga",
      "vong-cung-that-son-bay-nui-an-giang",
      "cung-duong-cuc-nam-tay-nam-bo"
    ]
  }
];

const SEED_REVIEWS = {
  "ha-giang-loop": [
    {
      id: "rev_hg_1",
      author: "Hoàng Minh (Hà Nội)",
      rank: "Huyền Thoại Xuyên Việt",
      vehicle: "Xe côn tay CB500X",
      rating: 5,
      topic: "⚠️ Kinh nghiệm đường đèo",
      date: "2 giờ trước",
      likes: 28,
      note: "Đoạn từ Đồng Văn sang Mã Pí Lèng mặt đường mới trải nhựa lại rất êm. Các bạn nhớ ghé dốc Thẩm Mã lúc 7h30 sáng nắng xiên qua khe núi chụp ảnh cực đẹp, tránh chạy đèo sau 17h30 vì sương xuống nhanh."
    },
    {
      id: "rev_hg_2",
      author: "Thanh Thảo (Sài Gòn)",
      rank: "Phượt Thủ Bản Lĩnh",
      vehicle: "Xe số Wave Alpha",
      rating: 5,
      topic: "🍜 Ẩm thực & Trạm xăng",
      date: "Hôm qua",
      likes: 19,
      note: "Nhớ đổ đầy bình xăng ở Quản Bạ và Yên Minh. Tối ở phố cổ Đồng Văn nên thử lẩu gà đen và bánh cuốn trứng nóng gần chợ cổ, giá rất hợp lý!"
    }
  ],
  "san-may-ta-xua-tram-tau": [
    {
      id: "rev_tx_1",
      author: "Đức Anh (CLB Motor Tây Bắc)",
      rank: "Huyền Thoại Xuyên Việt",
      vehicle: "Honda Winner X",
      rating: 5,
      topic: "📸 Điểm săn mây",
      date: "3 giờ trước",
      likes: 34,
      note: "Biển mây ở Sống lưng khủng long Háng Đồng dày đặc từ 5h30 đến 8h sáng. Đoạn nối Xím Vàng sang Trạm Tấu có vài khúc đá hộc, chỉ nên đi xe số hoặc côn tay khi trời khô ráo."
    }
  ],
  "ven-bien-binh-thuan-ninh-thuan": [
    {
      id: "rev_vh_1",
      author: "Linh Đan (Đà Nẵng)",
      rank: "Phượt Thủ Bản Lĩnh",
      vehicle: "Xe số Yamaha PG-1",
      rating: 5,
      topic: "📸 Điểm ngắm cảnh",
      date: "Hôm qua",
      likes: 22,
      note: "Nước biển Vĩnh Hy trong vắt nhìn thấy đáy! Cung đường DT702 gió biển khá mạnh ở các khúc cua trên cao, mọi người dừng chụp ảnh nhớ đỗ sát vào các vịnh ngắm cảnh có lan can nhé."
    }
  ]
};

const SEED_CHAT_MESSAGES = {
  "toan-quoc": [
    {
      id: "msg_1",
      author: "Hoàng Minh (Hà Nội)",
      rank: "Huyền Thoại Xuyên Việt",
      avatar: "🏍️",
      tag: "⚠️ Cảnh báo đèo",
      routeId: "ha-giang-loop",
      routeName: "Vòng Cung Hà Giang",
      time: "10 phút trước",
      likes: 14,
      text: "Sáng nay đoàn mình vừa qua đèo Mã Pí Lèng, trời nắng ráo trong vắt, sông Nho Quế xanh ngắt. Anh em nào đang ở Đồng Văn lên đèo tầm này là đẹp nhất trong ngày nhé!"
    },
    {
      id: "msg_2",
      author: "Linh Đan (Đà Nẵng)",
      rank: "Phượt Thủ Bản Lĩnh",
      avatar: "🧭",
      tag: "🍜 Quán ngon bản địa",
      routeId: "duong-truong-son-dong",
      routeName: "Đường Trường Sơn Đông — Măng Đen",
      time: "28 phút trước",
      likes: 9,
      text: "Lên Măng Đen mùa này lạnh 15 độ phê lắm mọi người ơi. Nhớ ghé ăn gà nướng cơm lam Cô Sinh rồi chạy dọc đường thông buổi sớm, sương giăng như phim điện ảnh!"
    },
    {
      id: "msg_3",
      author: "Tuấn Kiệt (TP. Hồ Chí Minh)",
      rank: "Tay Lái Đại Ngàn",
      avatar: "🚙",
      tag: "📸 Góc chụp đẹp",
      routeId: "deo-ngoan-muc-cau-dat-da-lat",
      routeName: "Đèo Ngoạn Mục — Cầu Đất",
      time: "1 giờ trước",
      likes: 18,
      text: "Đồi chè Cầu Đất sáng nay biển mây tràn qua các trụ điện gió đẹp xuất sắc. Đường từ Phan Rang lên Đèo Ngoạn Mục mặt đường tốt, nhưng cua gắt nên anh em giữ số thấp đều ga nhé."
    }
  ],
  "deo-phia-bac": [
    {
      id: "msg_b1",
      author: "Đức Anh (Yên Bái)",
      rank: "Huyền Thoại Xuyên Việt",
      avatar: "🏔️",
      tag: "⚠️ Cảnh báo đèo",
      routeId: "san-may-ta-xua-tram-tau",
      routeName: "Săn Mây Tà Xùa — Trạm Tấu",
      time: "15 phút trước",
      likes: 21,
      text: "Cập nhật trực tiếp từ đỉnh Tà Xùa: Lặng gió, mây đang ứ đầy thung lũng Háng Đồng. Nhiệt độ sáng sớm khoảng 11°C, anh em nhớ mang găng tay chống nước và dán kính vàng đèn pha!"
    },
    {
      id: "msg_b2",
      author: "Hải Yến (Quảng Ninh)",
      rank: "Phượt Thủ Bản Lĩnh",
      avatar: "🌾",
      tag: "📸 Góc chụp đẹp",
      routeId: "vong-cung-bien-gioi-binh-lieu",
      routeName: "Vòng Cung Biên Giới Bình Liêu",
      time: "45 phút trước",
      likes: 15,
      text: "Đường tuần tra biên giới từ mốc 1297 sang mốc 1305 cỏ lau đang nở trắng xóa cả sống núi. Nắng chiều lúc 15h30–17h00 chiếu ngược qua bông lau đẹp mê hồn!"
    }
  ],
  "bien-trung-tay-nguyen": [
    {
      id: "msg_t1",
      author: "Minh Quân (Nha Trang)",
      rank: "Tay Lái Đại Ngàn",
      avatar: "🌊",
      tag: "🍜 Quán ngon bản địa",
      routeId: "ven-bien-binh-thuan-ninh-thuan",
      routeName: "Cung Biển Bình Thuận — Ninh Thuận",
      time: "20 phút trước",
      likes: 12,
      text: "Chạy cung Bàu Trắng – Mũi Dinh – Vĩnh Hy tầm 7h–10h sáng nắng lên màu nước biển 3 tầng xanh đẹp điên đảo. Tới Vĩnh Hy nhớ ăn bún chả cá và bánh căn mực tươi ngay cảng nhé!"
    },
    {
      id: "msg_t2",
      author: "Bảo Ngọc (Đà Lạt)",
      rank: "Phượt Thủ Bản Lĩnh",
      avatar: "🌲",
      tag: "⚠️ Cảnh báo đèo",
      routeId: "nha-trang-deo-khanh-le-da-lat",
      routeName: "Nha Trang — Đèo Khánh Lê — Đà Lạt",
      time: "1 giờ trước",
      likes: 16,
      text: "Đỉnh đèo Khánh Lê tầm sau 15h chiều hay có sương mù dày ở đoạn Km42–Km50, anh em từ Nha Trang lên Đà Lạt nhớ xuất phát trước 13h chiều để qua đèo lúc trời còn sáng rõ."
    }
  ],
  "canh-bao-ghep-doan": [
    {
      id: "msg_g1",
      author: "Trọng Hiếu (Hà Nội)",
      rank: "Phượt Thủ Bản Lĩnh",
      avatar: "🤝",
      tag: "🤝 Tìm đồng đội",
      routeId: "y-ty-bat-xat-lung-po",
      routeName: "Lũng Pô — Y Tý — Sa Pa",
      time: "5 phút trước",
      likes: 8,
      text: "Thứ 6 tuần này nhóm mình có 3 xe côn tay xuất phát từ Lào Cai đi cột cờ Lũng Pô – Y Tý – Mường Hum (2N1Đ). Có bạn nào chạy cùng cung muốn nhập đoàn đi chung hỗ trợ đồ sửa xe không?"
    },
    {
      id: "msg_g2",
      author: "Quốc Bảo (Quảng Bình)",
      rank: "Huyền Thoại Xuyên Việt",
      avatar: "🚨",
      tag: "⚠️ Cảnh báo đèo",
      routeId: "duong-ho-chi-minh-nhanh-tay",
      routeName: "Đường Hồ Chí Minh Nhánh Tây",
      time: "35 phút trước",
      likes: 27,
      text: "Nhắc nhẹ anh em chuẩn bị chạy Đường Hồ Chí Minh Nhánh Tây (Phong Nha – Khe Sanh): Bắt buộc đổ đầy bình xăng ở Phong Nha và mang thêm can 2L dự phòng vì suốt 125km qua Đèo U Bò không có cây xăng nào!"
    }
  ]
};

class PhuotDataTier {
  constructor() {
    this.SAVED_TRIPS_KEY = "phuot_tier3_saved_trips";
    this.REVIEWS_KEY = "phuot_tier3_community_reviews";
    this.USER_SESSION_KEY = "phuot_tier3_user_passport";
    this.CHAT_STORE_KEY = "phuot_tier3_live_chat";
  }

  // 1. QUẢN LÝ ĐĂNG NHẬP & HỘ CHIẾU PHƯỢT THỦ
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(this.USER_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  computeRankByConqueredCount(count) {
    if (count >= 6) return "Huyền Thoại Xuyên Việt";
    if (count >= 3) return "Phượt Thủ Bản Lĩnh";
    return "Tân Binh Đường Đèo";
  }

  loginWithProfile(profileData) {
    const conquered = profileData.conqueredRoutes || [];
    const userObj = {
      id: profileData.id || "user_" + Date.now(),
      name: profileData.name,
      city: profileData.city || "Việt Nam",
      vehicle: profileData.vehicle || "Xe côn tay / Xe số",
      avatar: profileData.avatar || "🏍️",
      verified: true,
      conqueredRoutes: conquered,
      rankTitle: profileData.rankTitle || this.computeRankByConqueredCount(conquered.length),
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(userObj));
    return userObj;
  }

  logoutUser() {
    localStorage.removeItem(this.USER_SESSION_KEY);
  }

  toggleConqueredRoute(routeId) {
    let user = this.getCurrentUser();
    if (!user) {
      // Nếu chưa đăng nhập, tự động khởi tạo Hộ chiếu Phượt thủ nhanh
      user = this.loginWithProfile({
        name: "Phượt Thủ Việt Nam",
        city: "Việt Nam",
        vehicle: "Xe máy / Ô tô",
        avatar: "🧭",
        conqueredRoutes: []
      });
    }
    const idx = user.conqueredRoutes.indexOf(routeId);
    let added = false;
    if (idx > -1) {
      user.conqueredRoutes.splice(idx, 1);
    } else {
      user.conqueredRoutes.push(routeId);
      added = true;
    }
    user.rankTitle = this.computeRankByConqueredCount(user.conqueredRoutes.length);
    localStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(user));
    return { user, added };
  }

  // 2. QUẢN LÝ SỔ TAY LỊCH TRÌNH
  getSavedTrips() {
    try {
      return JSON.parse(localStorage.getItem(this.SAVED_TRIPS_KEY) || "[]");
    } catch {
      return [];
    }
  }

  saveTrip(tripRecord) {
    const trips = this.getSavedTrips();
    const existingIndex = trips.findIndex((t) => t.routeId === tripRecord.routeId);
    if (existingIndex > -1) {
      trips[existingIndex] = { ...tripRecord, updatedAt: new Date().toISOString() };
    } else {
      trips.unshift({ ...tripRecord, id: "trip_" + Date.now(), createdAt: new Date().toISOString() });
    }
    localStorage.setItem(this.SAVED_TRIPS_KEY, JSON.stringify(trips));
    return trips;
  }

  deleteTrip(tripId) {
    const trips = this.getSavedTrips().filter((t) => t.id !== tripId && t.routeId !== tripId);
    localStorage.setItem(this.SAVED_TRIPS_KEY, JSON.stringify(trips));
    return trips;
  }

  // 3. QUẢN LÝ ĐÁNH GIÁ CUNG ĐƯỜNG & BÌNH CHỌN HỮU ÍCH
  getReviewsForRoute(routeId) {
    try {
      const stored = JSON.parse(localStorage.getItem(this.REVIEWS_KEY) || "{}");
      const customList = stored[routeId] || [];
      const seedList = SEED_REVIEWS[routeId] || [
        {
          id: "seed_" + routeId,
          author: "Cộng đồng Dọc Miền Đất Nước",
          rank: "Kiểm định thực địa",
          vehicle: "Xe máy & Ô tô",
          rating: 5,
          topic: "⚠️ Lưu ý đường đèo",
          date: "Cập nhật gần đây",
          likes: 11,
          note: "Đường quốc lộ và tỉnh lộ thông thoáng. Khuyến nghị kiểm tra má phanh, lốp và đổ đầy nhiên liệu tại thị trấn đầu tuyến trước khi lên đèo."
        }
      ];
      return [...customList, ...seedList];
    } catch {
      return SEED_REVIEWS[routeId] || [];
    }
  }

  addReviewForRoute(routeId, reviewObj) {
    const stored = JSON.parse(localStorage.getItem(this.REVIEWS_KEY) || "{}");
    if (!stored[routeId]) stored[routeId] = [];
    const newRev = {
      id: "rev_" + Date.now(),
      likes: 1,
      date: "Vừa xong",
      ...reviewObj
    };
    stored[routeId].unshift(newRev);
    localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(stored));
    return this.getReviewsForRoute(routeId);
  }

  // 4. QUẢN LÝ KÊNH CHAT CỘNG ĐỒNG PHƯỢT THỦ
  getChatMessages(channelId = "toan-quoc") {
    try {
      const stored = JSON.parse(localStorage.getItem(this.CHAT_STORE_KEY) || "{}");
      const customMsgs = stored[channelId] || [];
      const seedMsgs = SEED_CHAT_MESSAGES[channelId] || [];
      return [...customMsgs, ...seedMsgs];
    } catch {
      return SEED_CHAT_MESSAGES[channelId] || [];
    }
  }

  addChatMessage(channelId, msgData) {
    const stored = JSON.parse(localStorage.getItem(this.CHAT_STORE_KEY) || "{}");
    if (!stored[channelId]) stored[channelId] = [];
    const newMsg = {
      id: "chat_" + Date.now(),
      time: "Vừa xong",
      likes: 1,
      ...msgData
    };
    stored[channelId].unshift(newMsg);
    localStorage.setItem(this.CHAT_STORE_KEY, JSON.stringify(stored));
    return this.getChatMessages(channelId);
  }
}

class PhuotServiceTier {
  constructor(dataTier) {
    this.db = dataTier;
  }

  calculateHaversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  buildRouteStages(route, waypoints) {
    if (!waypoints || waypoints.length === 0) return [];
    const rawLegs = [];
    let totalRaw = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const d = this.calculateHaversineKm(
        waypoints[i].lat,
        waypoints[i].lng,
        waypoints[i + 1].lat,
        waypoints[i + 1].lng
      );
      rawLegs.push(d);
      totalRaw += d;
    }

    return waypoints.map((wp, idx) => {
      if (idx === 0) {
        return {
          index: idx + 1,
          name: wp.name,
          lat: wp.lat,
          lng: wp.lng,
          legKm: 0,
          role: "Điểm xuất phát",
          note: "Kiểm tra phanh, lốp, xăng đầy bình trước khi khởi hành"
        };
      }
      const prevRaw = rawLegs[idx - 1] || 1;
      const scaledKm =
        totalRaw > 0
          ? Math.max(5, Math.round((prevRaw / totalRaw) * route.distanceKm))
          : Math.round(route.distanceKm / (waypoints.length - 1));
      const isLast = idx === waypoints.length - 1;

      return {
        index: idx + 1,
        name: wp.name,
        lat: wp.lat,
        lng: wp.lng,
        legKm: scaledKm,
        role: isLast ? "Đích đến hành trình" : `Chặng trung chuyển ${idx}`,
        note: isLast
          ? `Hoàn thành tổng lộ trình ~${route.distanceKm} km`
          : `Di chuyển ~${scaledKm} km từ ${waypoints[idx - 1].name}`
      };
    });
  }

  getRegionalOverviewStats(routes, currentMonth) {
    return Object.keys(REGION_METADATA).map((regionName) => {
      const meta = REGION_METADATA[regionName];
      const regionRoutes = routes.filter((r) => r.region === regionName);
      const totalKm = regionRoutes.reduce((sum, r) => sum + r.distanceKm, 0);
      const inSeasonCount = regionRoutes.filter((r) => r.bestMonths.includes(currentMonth)).length;

      return {
        regionName,
        ...meta,
        routeCount: regionRoutes.length,
        totalKm,
        inSeasonCount,
        sampleRoutes: regionRoutes.slice(0, 2).map((r) => r.title.split("—")[0].trim())
      };
    });
  }

  // Tính toán Biểu đồ Độ cao Địa hình (Elevation Profile) & Đặc sản Ẩm thực Vùng miền
  getRouteElevationAndCulinary(route, waypoints) {
    const id = route.id;
    let baseElevations = [120, 680, 1150, 1480, 920, 450];
    let difficulty = "4.2 / 5 · Đèo cao & Cua tay áo";
    let dishes = [
      "🍲 Thắng cố & Lẩu gà đen",
      "🥟 Bánh cuốn trứng nóng",
      "🍙 Xôi ngũ sắc vùng cao",
      "🥩 Thịt trâu gác bếp"
    ];

    if (id.includes("ha-giang") || id.includes("lung-cu")) {
      baseElevations = [280, 1050, 890, 1120, 1470, 1520, 740];
      difficulty = "4.8 / 5 · Cua tay áo gắt & Vách đá cao";
      dishes = [
        "🍲 Thắng cố phố cổ Đồng Văn",
        "🥚 Bánh cuốn trứng nước hầm xương",
        "🥣 Cháo ấu tẩu giải cảm đêm",
        "🌸 Bánh tam giác mạch nướng"
      ];
    } else if (id.includes("tay-bac") || id.includes("ta-xua") || id.includes("y-ty")) {
      baseElevations = [80, 1250, 1860, 2000, 1450, 980];
      difficulty = "4.9 / 5 · Đỉnh đèo săn mây >1.800m";
      dishes = [
        "🐟 Lẩu cá tầm & Cá hồi Ô Quy Hồ",
        "🍙 Xôi nếp Tú Lệ & Cốm vùng cao",
        "🥩 Thịt trâu gác bếp Mường Thanh",
        "🍵 Trà cổ thụ Shan Tuyết Tà Xùa"
      ];
    } else if (id.includes("cao-bang") || id.includes("binh-lieu")) {
      baseElevations = [150, 620, 980, 750, 1305, 480];
      difficulty = "4.0 / 5 · Đèo nhiều tầng dốc";
      dishes = [
        "🦆 Vịt quay 7 vị mắc mật Cao Bằng",
        "🥟 Bánh áp chao & Phở chua",
        "🌰 Hạt dẻ Trùng Khánh rang bơ",
        "🐓 Gà đen Tiên Yên – Bình Liêu"
      ];
    } else if (id.includes("moc-chau") || id.includes("nghe-an")) {
      baseElevations = [50, 880, 1050, 1120, 1450, 620];
      difficulty = "3.6 / 5 · Đèo sương mù vừa phải";
      dishes = [
        "🥩 Bê chao Mộc Châu & Cá suối nướng",
        "🎍 Cơm lam & Gà đồi Pù Luông",
        "🍲 Nhút Thanh Chương & Cá mát sông Giăng",
        "🥛 Sữa tươi nóng thảo nguyên"
      ];
    } else if (
      id.includes("hai-van") ||
      id.includes("son-tra") ||
      id.includes("phu-yen") ||
      id.includes("binh-thuan") ||
      id.includes("quy-nhon") ||
      id.includes("ven-bien") ||
      id.includes("cat-ba") ||
      id.includes("mui-doi")
    ) {
      baseElevations = [15, 180, 496, 320, 85, 25];
      difficulty = "2.8 / 5 · Đường ven biển & Đèo thoáng";
      dishes = [
        "🦑 Bánh căn mực tươi Vĩnh Hy – Phan Rang",
        "🐟 Mắt cá ngừ đại dương & Sò huyết Đầm Ô Loan",
        "🦪 Hàu sữa Lăng Cô & Bún chả cá Quy Nhơn",
        "🍇 Nho tươi & Tỏi cô đơn Ninh Thuận"
      ];
    } else if (
      id.includes("truong-son") ||
      id.includes("da-lat") ||
      id.includes("ta-dung") ||
      id.includes("tay-nguyen") ||
      id.includes("ho-chi-minh")
    ) {
      baseElevations = [45, 780, 1250, 1620, 1500, 1480];
      difficulty = "4.1 / 5 · Đèo thông dài & Xuyên rừng";
      dishes = [
        "🍗 Gà nướng cơm lam Măng Đen – Pleiku",
        "🍲 Lẩu gà lá é & Bánh ướt lòng gà Đà Lạt",
        "🍜 Phở khô Gia Lai (Phở hai tô)",
        "☕ Cà phê Arabica Cầu Đất – Buôn Ma Thuột"
      ];
    } else if (id.includes("ca-mau") || id.includes("an-giang")) {
      baseElevations = [8, 15, 710, 45, 12, 5];
      difficulty = "2.2 / 5 · Đường bằng & Cầu dây văng";
      dishes = [
        "🦀 Cua biển Năm Căn – Đất Mũi Cà Mau",
        "🍲 Lẩu mắm Châu Đốc & Cá linh bông điên điển",
        "🌴 Thốt nốt tươi & Gà đốt lá chúc Tri Tôn",
        "🥞 Bánh xèo miền Tây & Hủ tiếu Cần Thơ"
      ];
    }

    const points = waypoints.map((wp, idx) => {
      const elev = baseElevations[idx % baseElevations.length];
      return {
        name: wp.name,
        lat: wp.lat,
        lng: wp.lng,
        elevation: elev
      };
    });

    const maxElev = Math.max(...points.map((p) => p.elevation));
    return {
      points,
      maxElev,
      difficulty,
      dishes
    };
  }

  // Tính toán Chỉ số "Sinh Tồn Đường Đèo": Quãng trắng Cây xăng, Sóng 4G & Mặt đường thực tế (Mục 2)
  getFieldSurvivalProfile(route, waypoints, vehicle = "motorbike") {
    const id = route.id;
    const wps = waypoints && waypoints.length > 0 ? waypoints : route.waypoints;
    const startWp = wps[0]?.name || "Thị trấn đầu tuyến";
    const midWp = wps[Math.floor(wps.length / 2)]?.name || "Thị trấn trung tâm";

    let maxFuelGapKm = 38;
    let signalPct = 88;
    let signalNote = `Sóng 4G ổn định dọc tuyến, chỉ yếu nhẹ ở các khúc cua khuất núi gần ${midWp}.`;
    let roadSurface = "85% Nhựa tiêu chuẩn · 15% Đèo dốc quanh co";
    let mechanicalTip = "Kiểm tra áp suất lốp và độ ăn của phanh trước/sau trước khi khởi hành.";

    if (
      id.includes("ha-giang") ||
      id.includes("lung-cu") ||
      id.includes("tay-bac") ||
      id.includes("ta-xua") ||
      id.includes("y-ty") ||
      id.includes("hoang-su-phi")
    ) {
      maxFuelGapKm = 54;
      signalPct = 76;
      signalNote = `Dễ lõm sóng 4G dưới khe vực & sườn đèo sau ${midWp} — nên tải sẵn Ảnh Thẻ Hành Trình Bỏ Túi.`;
      roadSurface = "78% Nhựa đèo dốc gắt · 22% Cua tay áo & đường bản vùng cao";
      mechanicalTip =
        vehicle === "motorbike"
          ? "Bắt buộc về số thấp (số 1–2) khi đổ đèo; tuyệt đối không rà phanh liên tục gây cháy bố thắng."
          : "Sử dụng số bán tự động (S / L / B) khi đổ đèo dài để hãm bằng động cơ, bật đèn phá sương.";
    } else if (
      id.includes("truong-son") ||
      id.includes("ho-chi-minh") ||
      id.includes("nghe-an") ||
      id.includes("binh-lieu") ||
      id.includes("cao-bang")
    ) {
      maxFuelGapKm = 64;
      signalPct = 72;
      signalNote = `Có đoạn xuyên rừng/biên giới dài gần ${midWp} sóng yếu — cần lưu bản đồ Offline trước.`;
      roadSurface = "82% Đường bê tông/nhựa xuyên rừng · 18% Đèo dốc liên tục";
      mechanicalTip =
        vehicle === "motorbike"
          ? "Bình xăng xe số/côn tay (~4L) hao hơn ~25% khi leo dốc — phải đổ đầy tại thị trấn trước khi vào rừng."
          : "Kiểm tra lốp dự phòng, nước làm mát và đổ đầy bình nhiên liệu trước khi vào nhánh xuyên rừng.";
    } else if (
      id.includes("ven-bien") ||
      id.includes("hai-van") ||
      id.includes("phu-yen") ||
      id.includes("binh-thuan") ||
      id.includes("quy-nhon") ||
      id.includes("cat-ba")
    ) {
      maxFuelGapKm = 28;
      signalPct = 95;
      signalNote = `Sóng 4G/5G căng đầy toàn tuyến ven biển (riêng đoạn vách đá sát biển gần ${midWp} gió tạt mạnh).`;
      roadSurface = "94% Nhựa phẳng ven biển tuyệt đẹp · 6% Đèo dốc ven vịnh";
      mechanicalTip =
        vehicle === "motorbike"
          ? "Cung ven biển nhiều đoạn gió ngang mạnh — giữ chắc tay lái khi qua mũi đá và cầu vượt biển."
          : "Đường nhựa ven biển thoáng đẹp, chú ý tốc độ tại các khúc cua ngắm cảnh có nhiều xe dừng chụp ảnh.";
    } else if (id.includes("ca-mau") || id.includes("an-giang") || id.includes("dong-thap")) {
      maxFuelGapKm = 24;
      signalPct = 96;
      signalNote = "Sóng 4G phủ kín toàn tuyến đồng bằng & rừng ngập mặn.";
      roadSurface = "92% Quốc lộ/tỉnh lộ bằng phẳng · 8% Cầu dân sinh & đường ven kênh";
      mechanicalTip = "Chú ý các mố cầu cao đặc trưng miền Tây và kiểm tra lốp chống đinh.";
    }

    const refuelNote =
      vehicle === "motorbike"
        ? `Quãng trắng xa nhất không cây xăng: ~${maxFuelGapKm} km · Đổ đầy bình tại: ${startWp} & ${midWp}.`
        : `Quãng trắng xa nhất: ~${maxFuelGapKm} km · Trạm xăng chuẩn Euro 5 tại: ${startWp} & ${midWp}.`;

    return {
      maxFuelGapKm,
      refuelStop: `${startWp} → ${midWp}`,
      refuelNote,
      signalPct,
      signalNote,
      roadSurface,
      mechanicalTip
    };
  }

  // Tính toán Lịch trình Theo Ngày & Khung Giờ Vàng + Cảnh báo Đổ đèo tối (Golden Hour Pacing Engine)
  buildTimedDayByDaySchedule(
    route,
    waypoints,
    totalDays = 3,
    startTimeStr = "05:30",
    paceMode = "standard",
    vehicle = "motorbike"
  ) {
    const stages = this.buildRouteStages(route, waypoints);
    const safeDays = Math.max(1, Math.min(totalDays || route.defaultDays || 2, Math.max(1, stages.length)));

    const [startH, startM] = String(startTimeStr || "05:30")
      .split(":")
      .map((n) => parseInt(n, 10) || 0);
    const baseStartMinutes = startH * 60 + startM;

    // Tốc độ trung bình đường thực tế tại Việt Nam (tính cả đèo dốc)
    const isHighland =
      route.region === "Miền Bắc" ||
      route.id.includes("truong-son") ||
      route.id.includes("da-lat");
    let avgSpeedKmh = isHighland ? 38 : 48;
    let stopMinutesPerLeg = 28;

    if (paceMode === "relaxed") {
      avgSpeedKmh -= 7;
      stopMinutesPerLeg = 42;
    } else if (paceMode === "steady") {
      avgSpeedKmh += 8;
      stopMinutesPerLeg = 16;
    }
    if (vehicle === "car" && !isHighland) avgSpeedKmh += 6;

    const formatClock = (mins) => {
      const normalized = ((Math.round(mins) % 1440) + 1440) % 1440;
      const hh = String(Math.floor(normalized / 60)).padStart(2, "0");
      const mm = String(normalized % 60).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    const classifyTimeSlot = (mins) => {
      const normalized = ((Math.round(mins) % 1440) + 1440) % 1440;
      if (normalized >= 300 && normalized <= 450) {
        return {
          level: "golden-dawn",
          label: "🌅 Khung giờ vàng Săn mây / Bình minh"
        };
      }
      if (normalized > 450 && normalized < 975) {
        return {
          level: "daylight",
          label: "☀️ Nắng đẹp ngắm cảnh & di chuyển"
        };
      }
      if (normalized >= 975 && normalized <= 1065) {
        return {
          level: "golden-sunset",
          label: "🌇 Giờ vàng Hoàng hôn trên đèo / biển"
        };
      }
      return {
        level: "night-warning",
        label: "⚠️ Đổ đèo trời tối (Sau 17:45) — Dễ gặp sương mù!"
      };
    };

    let currentDay = 1;
    let currentClockMins = baseStartMinutes;
    let hasNightWarning = false;
    const stagesPerDay = Math.max(1, Math.ceil(stages.length / safeDays));

    const scheduled = stages.map((st, idx) => {
      const targetDay = Math.min(safeDays, Math.floor(idx / stagesPerDay) + 1);
      if (targetDay > currentDay) {
        currentDay = targetDay;
        // Sáng ngày hôm sau khởi hành đúng giờ xuất phát người dùng chọn
        currentClockMins = baseStartMinutes;
      }

      if (idx > 0 && targetDay === Math.min(safeDays, Math.floor((idx - 1) / stagesPerDay) + 1)) {
        const travelMins = (st.legKm / Math.max(20, avgSpeedKmh)) * 60;
        currentClockMins += travelMins + stopMinutesPerLeg;
      } else if (idx > 0) {
        // Chặng đầu tiên của ngày mới di chuyển từ điểm nghỉ đêm hôm trước
        const travelMins = (st.legKm / Math.max(20, avgSpeedKmh)) * 60;
        currentClockMins += travelMins;
      }

      const slot = classifyTimeSlot(currentClockMins);
      if (slot.level === "night-warning") hasNightWarning = true;

      return {
        ...st,
        dayNumber: currentDay,
        etaStr: formatClock(currentClockMins),
        timeLevel: slot.level,
        timeTag: slot.label
      };
    });

    return {
      stages: scheduled,
      totalDays: safeDays,
      hasNightWarning
    };
  }

  // Kiểm định Độ phù hợp Thực địa theo đúng dòng xe của người dùng (My Vehicle Readiness Advisor)
  evaluateVehicleReadiness(route, modelKey = "underbone") {
    const id = route.id || "";
    const region = route.region || "";

    const VEHICLE_PROFILES = {
      underbone: {
        name: "Xe số (110–125cc)",
        shortName: "Xe số 110–125cc",
        baseCategory: "motorbike",
        fuelMultiplier: 0.92,
        fuelLabel: "~550đ/km (~2.1L/100km)"
      },
      manual: {
        name: "Xe côn tay / PKL (150cc+)",
        shortName: "Xe côn tay / PKL",
        baseCategory: "motorbike",
        fuelMultiplier: 1.12,
        fuelLabel: "~720đ/km (~2.6L/100km)"
      },
      scooter: {
        name: "Xe tay ga (Vision / AB / SH)",
        shortName: "Xe tay ga",
        baseCategory: "motorbike",
        fuelMultiplier: 1.05,
        fuelLabel: "~660đ/km (~2.5L/100km)"
      },
      sedan: {
        name: "Ô tô Sedan / Hatchback gầm thấp",
        shortName: "Ô tô Sedan",
        baseCategory: "car",
        fuelMultiplier: 2.85,
        fuelLabel: "~1.800đ/km (~6.8L/100km)"
      },
      suv: {
        name: "Ô tô SUV / Bán tải gầm cao",
        shortName: "SUV / Bán tải",
        baseCategory: "car",
        fuelMultiplier: 3.55,
        fuelLabel: "~2.300đ/km (~8.8L/100km)"
      }
    };

    const profile = VEHICLE_PROFILES[modelKey] || VEHICLE_PROFILES.underbone;

    // Phân loại nhóm địa hình thực tế của 29 cung đường Việt Nam
    const isExtremeOffroadPass =
      id.includes("ta-xua") ||
      id.includes("y-ty") ||
      id.includes("hoang-su-phi") ||
      id.includes("ho-chi-minh-tay") ||
      id.includes("mui-doi");

    const isSteepMountainPass =
      !isExtremeOffroadPass &&
      (id.includes("ha-giang") ||
        id.includes("lung-cu") ||
        id.includes("tay-bac") ||
        id.includes("cao-bang") ||
        id.includes("binh-lieu") ||
        id.includes("truong-son") ||
        id.includes("nghe-an") ||
        id.includes("da-lat") ||
        id.includes("ta-dung") ||
        id.includes("moc-chau") ||
        id.includes("bac-son") ||
        id.includes("ba-be") ||
        region === "Miền Bắc" ||
        region === "Bộ Sưu Tập Tứ Đại");

    const isCoastalRoute =
      id.includes("hai-van") ||
      id.includes("phu-yen") ||
      id.includes("binh-thuan") ||
      id.includes("quy-nhon") ||
      id.includes("ven-bien") ||
      id.includes("cat-ba") ||
      id.includes("son-tra");

    let score = 92;
    let loadAdvice = "Chở 2 người (Xế–Ôm) thoải mái";
    let checklistHint = "Kiểm tra áp suất lốp, bố thắng và đèn chiếu sáng trước khi khởi hành.";
    let ridingTip =
      "Tuyến đường nhựa thuận lợi cho dòng xe này. Giữ tốc độ đều và chú ý quan sát tại các khúc cua ngắm cảnh.";

    if (isExtremeOffroadPass) {
      if (modelKey === "manual") {
        score = 96;
        loadAdvice = "Tối ưu nhất đi 1–2 người (đồ gọn)";
        checklistHint = "Tăng sên, thay nhớt bán tổng hợp/tổng hợp, mang bộ vá lụi & bơm mini.";
        ridingTip =
          "Sinh ra cho địa hình đá hộc & dốc >12%! Chủ động về số 1–2 hãm động cơ khi đổ dốc, tránh rà phanh liên tục.";
      } else if (modelKey === "suv") {
        score = 95;
        loadAdvice = "Chở 4–5 người & hành lý thoải mái";
        checklistHint = "Kiểm tra lốp dự phòng, bật chế độ đổ đèo (S / L / 4H nếu có).";
        ridingTip =
          "Gầm cao giúp vượt đá hộc, sống trâu & rãnh thoát nước an toàn. Lưu ý nhường đường tại các khúc cua hẹp vách núi.";
      } else if (modelKey === "underbone") {
        score = 84;
        loadAdvice = "Khuyên đi 1 người/xe (hoặc chở nhẹ)";
        checklistHint = "Kiểm tra nhông sên dĩa, má phanh mới & đổ đầy xăng ở thị trấn cuối cùng.";
        ridingTip =
          "Gọn nhẹ, dễ chống chân khi vào đường đất/đá hộc. Nếu chở đôi cần lấy đà về số 1 sớm trước con dốc đứng để tránh đuối máy.";
      } else if (modelKey === "sedan") {
        score = 52;
        loadAdvice = "Chỉ đi trục nhựa chính, hạn chế chở nặng";
        checklistHint = "Tuyệt đối tránh rẽ vào nhánh đường nối bản đá hộc (dễ cạ gầm, rách lốp).";
        ridingTip =
          "Khoảng sáng gầm Sedan (~135–155mm) rất dễ cạ gầm trên các đoạn nối Xím Vàng – Trạm Tấu hoặc đường vào bản Y Tý. Nên gửi xe ở trung tâm rồi thuê xe ôm bản địa vào điểm săn mây.";
      } else if (modelKey === "scooter") {
        score = 46;
        loadAdvice = "CẢNH BÁO: Chỉ 1 người/xe nếu bắt buộc đi";
        checklistHint = "Phải thay má phanh mới + dầu phanh chịu nhiệt trước khi đi; tuyệt đối không chở nặng.";
        ridingTip =
          "Dốc cao & đá hộc rất hại nồi côn và dễ mất phanh do nóng bố thắng khi đổ đèo dài. Tuyệt đối KHÔNG tắt máy thả trôi; giữ mớm ga nhẹ để bám côn và dừng nghỉ 10 phút sau mỗi 3–4 km đổ dốc!";
      }
    } else if (isSteepMountainPass) {
      if (modelKey === "manual") {
        score = 98;
        loadAdvice = "Đi 1–2 người cực kỳ linh hoạt";
        checklistHint = "Kiểm tra dây côn, tăng xích và đèn trợ sáng/phá sương vàng.";
        ridingTip =
          "Lý tưởng nhất để chinh phục cua tay áo! Sử dụng kỹ thuật lên số nào xuống số đó để đổ đèo Mã Pí Lèng / Khau Phạ / Ô Quy Hồ êm và an toàn tuyệt đối.";
      } else if (modelKey === "suv") {
        score = 96;
        loadAdvice = "Chở gia đình / nhóm 4–7 người cực êm";
        checklistHint = "Kiểm tra nước làm mát, gạt mưa và đèn sương mù vàng.";
        ridingTip =
          "Gầm cao, tầm nhìn thoáng dễ quan sát gương cầu lồi trên đèo. Chuyển về số bán tự động (M / S / L) khi đổ dốc dài để không bị cháy má phanh.";
      } else if (modelKey === "underbone") {
        score = 91;
        loadAdvice = "Chở đôi ổn định (tổng tải < 140kg)";
        checklistHint = "Thay nhớt mới, kiểm tra phanh đùm/đĩa & mang sẵn 1 săm (ruột) dự phòng.";
        ridingTip =
          "Dòng xe quốc dân đi cực bền trên đèo núi Việt Nam. Tránh chở quá nặng trên dốc 10% và luôn dùng phanh động cơ số 2 khi thả dốc.";
      } else if (modelKey === "sedan") {
        score = 82;
        loadAdvice = "Chở 3–4 người thoải mái trên trục nhựa";
        checklistHint = "Bấm số bán tự động (S/M/L) khi xuống đèo; tránh rẽ đường bê tông dốc gắt.";
        ridingTip =
          "Đường quốc lộ & tỉnh lộ đèo đã trải nhựa đẹp nên Sedan chạy tốt. Lưu ý tránh tự lái xuống dốc quá gắt (như đường xuống bến thuyền Nho Quế) để tránh cạ cản trước.";
      } else if (modelKey === "scooter") {
        score = 66;
        loadAdvice = "Khuyên đi 1 người/xe để giảm tải phanh";
        checklistHint = "Kiểm tra độ dày bố thắng đĩa/đùm và lốp không săm trước khi lên đèo.";
        ridingTip =
          "Xe tay ga lực phanh động cơ yếu hơn xe số khi đổ đèo dài. Nhớ bóp–nhả phanh nhịp nhàng luân phiên trước và sau (KHÔNG bóp chết liên tục), giữ tay ga mớm nhẹ ~10% để giữ nồi côn ghì xe và dừng nghỉ nguội phanh giữa đèo.";
      }
    } else if (isCoastalRoute) {
      if (modelKey === "suv" || modelKey === "sedan") {
        score = 97;
        loadAdvice = "Cực êm ái cho cả nhóm & gia đình";
        checklistHint = "Kiểm tra điều hòa, kính râm lái xe & nước rửa kính chống bụi biển.";
        ridingTip =
          id.includes("hai-van")
            ? "Đường nhựa ven biển tuyệt đẹp! Nếu muốn ngắm toàn cảnh vịnh Lăng Cô, hãy rẽ lên đường đèo Hải Vân thay vì đi thẳng qua hầm."
            : "Đường ven biển trải nhựa phẳng lì, tầm nhìn thoáng. Chú ý giảm tốc tại các điểm check-in ven vịnh nơi có nhiều xe máy dừng chụp ảnh.";
      } else if (modelKey === "manual") {
        score = 98;
        loadAdvice = "Xế–Ôm chạy lướt cực sướng";
        checklistHint = "Rửa sạch xích/sên sau chuyến đi vì hơi muối biển dễ làm gỉ xích.";
        ridingTip =
          "Cung ven biển rộng đẹp, ôm cua cực đã! Chú ý giữ chắc tay lái tại các eo gió lớn sát vách đá và cầu vượt biển.";
      } else if (modelKey === "underbone") {
        score = 94;
        loadAdvice = "Chở đôi chạy thoải mái, siêu tiết kiệm xăng";
        checklistHint = "Kiểm tra lốp bám đường và kính chắn gió mũ bảo hiểm.";
        ridingTip =
          "Rất phù hợp & tiết kiệm nhiên liệu. Lưu ý các đoạn mũi đá ven biển gió ngang thổi mạnh có thể làm lạng tay lái xe nhẹ.";
      } else {
        score = 91;
        loadAdvice = "Cốp rộng đựng đồ đi biển cực tiện";
        checklistHint = "Kiểm tra phanh trước khi qua các đoạn dốc ngắn ven vịnh (như đèo Hải Vân / Đèo Cả).";
        ridingTip =
          "Rất hợp cho cung ven biển nhờ cốp rộng & tư thế ngồi thoải mái. Riêng lúc xuống dốc Đèo Hải Vân / Đèo Cả vẫn cần bóp nhả phanh nhịp nhàng, tránh giữ phanh liên tục.";
      }
    } else {
      // Đồng bằng Nam Bộ & trục đường phẳng
      score = modelKey === "suv" || modelKey === "sedan" ? 96 : 94;
      loadAdvice =
        profile.baseCategory === "car"
          ? "Chở 4–5 người thoải mái suốt tuyến"
          : "Chở đôi thoải mái, đường bằng dễ chạy";
      checklistHint = "Kiểm tra lốp chống đinh, ánh sáng đèn pha & nước uống giải nhiệt.";
      ridingTip =
        profile.baseCategory === "car"
          ? "Quốc lộ & cao tốc miền Tây bằng phẳng; chú ý giữ khoảng cách an toàn qua các mố cầu cao đặc trưng vùng sông nước."
          : "Đường bằng phẳng, êm ái cho mọi dòng xe máy! Nhớ chú ý mật độ xe tải trên quốc lộ và giảm tốc khi qua cầu dân sinh hẹp.";
    }

    let level = "optimal";
    let statusLabel = "✅ Rất phù hợp";
    if (score < 60) {
      level = "warning";
      statusLabel = "🚨 Khuyến cáo hạn chế";
    } else if (score < 80) {
      level = "caution";
      statusLabel = "⚠️ Đi được — Cần kỹ thuật";
    }

    return {
      modelKey,
      ...profile,
      score,
      level,
      statusLabel,
      loadAdvice,
      checklistHint,
      ridingTip
    };
  }

  // =========================================================================
  // RADAR DỰ BÁO 3 NGÀY TỚI & TỶ LỆ SĂN MÂY / BIỂN XANH (MỤC 1 - DỮ LIỆU THẬT)
  // =========================================================================
  analyze3DayWeatherAndCloudRadar(route, apiData) {
    const elevInfo = this.getRouteElevationAndCulinary(route, route.waypoints);
    const isHighlandCloudSpot =
      elevInfo.maxElev >= 850 ||
      route.id.includes("ta-xua") ||
      route.id.includes("ha-giang") ||
      route.id.includes("y-ty") ||
      route.id.includes("da-lat") ||
      route.id.includes("tay-bac") ||
      route.id.includes("mang-den");

    const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const relLabels = ["Hôm nay", "Ngày mai", "Ngày kia"];
    const daily = apiData?.daily || {};
    const hourly = apiData?.hourly || {};
    const dates = daily.time || [];

    const getWeatherEmoji = (code, rainProb) => {
      if (rainProb >= 65 || code >= 61) return "🌧️";
      if (rainProb >= 35 || code >= 51) return "🌦️";
      if (code === 45 || code === 48) return "🌫️";
      if (code >= 2) return "⛅";
      return "☀️";
    };

    const days = dates.slice(0, 3).map((isoDate, i) => {
      const dt = new Date(isoDate + "T06:00:00");
      const wd = dayNames[dt.getDay()] || "";
      const ddmm = `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const minT = Math.round(daily.temperature_2m_min?.[i] ?? 18);
      const maxT = Math.round(daily.temperature_2m_max?.[i] ?? 26);
      const rainProb = Math.round(daily.precipitation_probability_max?.[i] ?? 20);
      const wCode = daily.weather_code?.[i] ?? 1;

      // Lấy dữ liệu thực lúc 06:00 sáng của ngày thứ i (index = i * 24 + 6)
      const dawnIdx = i * 24 + 6;
      const dawnTemp = hourly.temperature_2m?.[dawnIdx] ?? minT;
      const dawnDew = hourly.dew_point_2m?.[dawnIdx] ?? dawnTemp - 3;
      const dawnRh = hourly.relative_humidity_2m?.[dawnIdx] ?? 80;
      const dawnWind = hourly.wind_speed_10m?.[dawnIdx] ?? 10;
      const lowCloud = hourly.cloud_cover_low?.[dawnIdx] ?? 45;

      let specialScore = 70;
      let specialLabel = "";
      let specialShort = "";

      if (isHighlandCloudSpot) {
        // Công thức khí tượng săn mây vùng cao: ẩm sáng cao + chênh lệch T-Td thấp + gió êm + không mưa bão
        const spread = Math.max(0, dawnTemp - dawnDew);
        let cloudPct = 42;
        if (dawnRh >= 88) cloudPct += 26;
        else if (dawnRh >= 78) cloudPct += 16;
        else if (dawnRh < 65) cloudPct -= 15;

        if (spread <= 1.8) cloudPct += 20;
        else if (spread <= 3.5) cloudPct += 10;
        else cloudPct -= 10;

        if (dawnWind <= 12) cloudPct += 12;
        else if (dawnWind > 20) cloudPct -= 18;

        if (lowCloud >= 40 && lowCloud <= 90) cloudPct += 8;
        if (rainProb >= 70) cloudPct -= 25;

        specialScore = Math.max(18, Math.min(96, Math.round(cloudPct)));
        specialShort = `☁️ Săn mây ${specialScore}%`;
        specialLabel =
          specialScore >= 78
            ? "Rất dễ gặp biển mây dày!"
            : specialScore >= 56
              ? "Có mây thung lũng sáng sớm"
              : "Ít mây hoặc nhiều gió/mưa";
      } else {
        // Chỉ số Biển Xanh & Nắng Đẹp cho cung ven biển / đồng bằng
        let sunScore = 95 - Math.round(rainProb * 0.72) - (dawnWind > 22 ? 14 : 0);
        specialScore = Math.max(25, Math.min(98, sunScore));
        specialShort = `🌊 Biển/Nắng đẹp ${specialScore}%`;
        specialLabel =
          specialScore >= 78
            ? "Trời trong, cực hợp chụp ảnh!"
            : specialScore >= 55
              ? "Có mây nhẹ, chạy xe mát mẻ"
              : "Dễ gặp mưa rào, nhớ áo mưa";
      }

      // Chấm điểm tổng hợp chọn ngày khởi hành lý tưởng nhất trong 3 ngày
      const travelQuality = Math.round(
        (100 - rainProb) * 0.65 + specialScore * 0.35 - (dawnWind > 25 ? 10 : 0)
      );

      return {
        index: i,
        relLabel: relLabels[i] || `Ngày ${i + 1}`,
        dateBadge: `${wd} ${ddmm}`,
        emoji: getWeatherEmoji(wCode, rainProb),
        minT,
        maxT,
        rainProb,
        dawnRh: Math.round(dawnRh),
        dawnWind: Math.round(dawnWind),
        isHighlandCloudSpot,
        specialScore,
        specialShort,
        specialLabel,
        travelQuality,
        isBestDay: false
      };
    });

    if (days.length > 0) {
      let bestIdx = 0;
      days.forEach((d, idx) => {
        if (d.travelQuality > days[bestIdx].travelQuality) bestIdx = idx;
      });
      days[bestIdx].isBestDay = true;
    }

    return {
      isHighlandCloudSpot,
      days
    };
  }

  // =========================================================================
  // BỘ TÍNH "TỪ NHÀ BẠN -> ĐIỂM ĐẦU CUNG ĐƯỜNG" (MỤC 2 - DOOR-TO-TRAILHEAD)
  // =========================================================================
  computeTrailheadTransfer(originKey, customGpsCoords, firstWaypoint, selectedVehicle = "motorbike") {
    const HUBS = {
      hanoi: { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
      hcm: { name: "TP. Hồ Chí Minh", lat: 10.7769, lng: 106.7009 },
      danang: { name: "Đà Nẵng", lat: 16.0544, lng: 108.2022 },
      haiphong: { name: "Hải Phòng", lat: 20.8449, lng: 106.6881 },
      nhatrang: { name: "Nha Trang", lat: 12.2388, lng: 109.1967 },
      cantho: { name: "Cần Thơ", lat: 10.0452, lng: 105.7469 },
      hue: { name: "Huế", lat: 16.4637, lng: 107.5909 },
      vinh: { name: "TP. Vinh (Nghệ An)", lat: 18.6796, lng: 105.6813 }
    };

    if (!firstWaypoint || !originKey || originKey === "none") return null;

    let origin = null;
    if (originKey === "gps") {
      if (!customGpsCoords) {
        return { needsGps: true };
      }
      origin = { name: "Vị trí GPS của bạn", lat: customGpsCoords.lat, lng: customGpsCoords.lng };
    } else {
      origin = HUBS[originKey];
    }
    if (!origin) return null;

    const airKm = this.calculateHaversineKm(
      origin.lat,
      origin.lng,
      firstWaypoint.lat,
      firstWaypoint.lng
    );
    const roadKm = Math.round(airKm * 1.24);
    const avgSpeed = selectedVehicle === "car" ? 60 : 48;
    const driveHours = roadKm / avgSpeed;
    const hrs = Math.floor(driveHours);
    const mins = Math.round((driveHours - hrs) * 60);
    const durationText =
      roadKm <= 12
        ? "~15–25 phút"
        : hrs > 0
          ? `~${hrs} giờ ${mins > 0 ? `${mins} phút` : ""}`.trim()
          : `~${Math.max(15, mins)} phút`;

    let badgeLevel = "near";
    let strategyBadge = "🟢 Gần nhà — Chạy thẳng từ sáng sớm";
    let strategyAdvice = `Điểm đầu ${firstWaypoint.name} nằm ngay gần ${origin.name}, bạn có thể chạy thẳng vào cung mà không tốn ngày trung chuyển.`;

    if (roadKm > 520) {
      badgeLevel = "flight";
      strategyBadge = "✈️ Khác miền — Khuyên bay nội địa / tàu + thuê xe tại đầu cung";
      strategyAdvice = `Quãng đường ~${roadKm.toLocaleString("vi-VN")} km từ ${origin.name} đến ${firstWaypoint.name} quá dài để chạy xe máy thẳng. Phương án giữ sức nhất: bay/tàu đến sân bay gần nhất rồi thuê xe máy (~180k–250k/ngày) hoặc ô tô tự lái (~850k/ngày) tại điểm đầu tuyến.`;
    } else if (roadKm > 220) {
      badgeLevel = "sleeper";
      strategyBadge =
        selectedVehicle === "motorbike"
          ? "🚌 Khuyên gửi xe máy theo xe khách đêm (Hoặc chia thêm 1 ngày chạy)"
          : "🚗 Quãng đường dài — Nên khởi hành từ 04:30 sáng hoặc đi từ tối hôm trước";
      strategyAdvice =
        selectedVehicle === "motorbike"
          ? `Chạy xe máy ~${roadKm} km (${durationText}) trước khi leo đèo dễ gây mỏi vai gáy. Kinh nghiệm phượt thủ: đi xe khách giường nằm đêm thứ 6 gửi kèm xe máy (~250k–350k/xe) hoặc thuê xe ngay tại ${firstWaypoint.name} để sáng thứ 7 còn 100% thể lực đổ đèo.`
          : `Lái ô tô ~${roadKm} km (${durationText}) cần 2 tài thay phiên hoặc nghỉ đêm sớm tại ${firstWaypoint.name} để hôm sau lên đèo tỉnh táo nhất.`;
    } else if (roadKm > 60) {
      badgeLevel = "medium";
      strategyBadge = "🟡 Chạy xe tự túc trong buổi sáng";
      strategyAdvice = `Khoảng cách ~${roadKm} km (${durationText}) rất đẹp để tự chạy xe từ ${origin.name} đến ${firstWaypoint.name}. Xuất phát trước 06:00 sáng và nghỉ giải lao 15 phút giữa đường là đẹp nhất.`;
    }

    const gmapsTransferUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${firstWaypoint.lat},${firstWaypoint.lng}&travelmode=driving${
      selectedVehicle === "motorbike" ? "&avoid=highways" : ""
    }`;

    return {
      needsGps: false,
      originName: origin.name,
      destName: firstWaypoint.name,
      roadKm,
      durationText,
      badgeLevel,
      strategyBadge,
      strategyAdvice,
      gmapsTransferUrl
    };
  }

  // =========================================================================
  // 1. CẢNH BÁO TẦM CHẠY BÌNH XĂNG & VÙNG "KHÁT XĂNG" (FUEL RANGE GUARD)
  // =========================================================================
  analyzeFuelRangeGuard(route, waypoints, modelKey = "underbone") {
    const SPECS = {
      underbone: {
        name: "Xe số 110–125cc",
        tankLiters: 4.0,
        flatLPer100: 2.05,
        climbExtra: 0.28,
        moderateExtra: 0.17,
        isMotorbike: true
      },
      manual: {
        name: "Xe côn tay / PKL",
        tankLiters: 4.8,
        flatLPer100: 2.55,
        climbExtra: 0.26,
        moderateExtra: 0.16,
        isMotorbike: true
      },
      scooter: {
        name: "Xe tay ga",
        tankLiters: 4.6,
        flatLPer100: 2.45,
        climbExtra: 0.34,
        moderateExtra: 0.22,
        isMotorbike: true
      },
      sedan: {
        name: "Ô tô Sedan",
        tankLiters: 45,
        flatLPer100: 6.8,
        climbExtra: 0.21,
        moderateExtra: 0.13,
        isMotorbike: false
      },
      suv: {
        name: "SUV / Bán tải",
        tankLiters: 65,
        flatLPer100: 8.8,
        climbExtra: 0.20,
        moderateExtra: 0.12,
        isMotorbike: false
      }
    };

    const spec = SPECS[modelKey] || SPECS.underbone;
    const wps = waypoints && waypoints.length > 0 ? waypoints : route.waypoints;
    const stages = this.buildRouteStages(route, wps);
    const elevInfo = this.getRouteElevationAndCulinary(route, wps);
    const surv = this.getFieldSurvivalProfile(route, wps, spec.isMotorbike ? "motorbike" : "car");
    const id = route.id || "";

    // Xác định hệ số hao xăng thực tế do đèo dốc / địa hình
    const isSevereMountain =
      elevInfo.maxElev >= 1350 ||
      id.includes("ha-giang") ||
      id.includes("tay-bac") ||
      id.includes("ta-xua") ||
      id.includes("y-ty") ||
      id.includes("ho-chi-minh") ||
      id.includes("truong-son") ||
      id.includes("hoang-su-phi");

    const isModerateHill =
      !isSevereMountain &&
      (elevInfo.maxElev >= 650 ||
        id.includes("cao-bang") ||
        id.includes("binh-lieu") ||
        id.includes("da-lat") ||
        id.includes("moc-chau") ||
        id.includes("ta-dung") ||
        id.includes("nghe-an"));

    let terrainPenalty = 0.06;
    let terrainNote = "Đường bằng & ven biển (+6% gió ngang)";
    if (isSevereMountain) {
      terrainPenalty = spec.climbExtra;
      terrainNote = `Leo đèo cao >1.300m (+${Math.round(terrainPenalty * 100)}% hao xăng)`;
    } else if (isModerateHill) {
      terrainPenalty = spec.moderateExtra;
      terrainNote = `Đồi núi trung du (+${Math.round(terrainPenalty * 100)}% hao xăng)`;
    }

    // Hồ Chí Minh Nhánh Tây có quãng trắng thực tế lên tới ~125km qua Đèo U Bò
    let dryGapKm = surv.maxFuelGapKm;
    if (id.includes("ho-chi-minh")) {
      dryGapKm = 125;
    }

    const flatRangeKm = Math.round((spec.tankLiters / spec.flatLPer100) * 100);
    const actualLPer100 = Number((spec.flatLPer100 * (1 + terrainPenalty)).toFixed(2));
    const effectiveRangeKm = Math.max(80, Math.round((spec.tankLiters / actualLPer100) * 100));
    const safeReserveRangeKm = Math.round(effectiveRangeKm * 0.78); // Giữ ~22% dự phòng an toàn

    const totalRouteKm = Math.max(
      route.distanceKm || 100,
      stages.reduce((s, st) => s + (st.legKm || 0), 0)
    );
    const totalLiters = Number(((totalRouteKm / 100) * actualLPer100).toFixed(1));

    // Mô phỏng mức xăng còn lại dọc theo từng chặng thực tế
    let kmSinceRefuel = 0;
    let refuelStops = [];
    const stageNodes = stages.map((st, idx) => {
      const legKm = st.legKm || 0;
      const nextLegKm = stages[idx + 1]?.legKm || 0;
      kmSinceRefuel += legKm;

      let pctBeforeRefuel = Math.round(
        Math.max(4, Math.min(100, ((effectiveRangeKm - kmSinceRefuel) / effectiveRangeKm) * 100))
      );

      let mustRefuelHere = false;
      let refuelReason = "";

      if (idx === 0) {
        pctBeforeRefuel = 100;
        if (dryGapKm >= 50 && spec.isMotorbike) {
          refuelReason = "Bắt buộc đổ đầy bình 100% trước khi rời thị trấn đầu tuyến";
        }
      } else if (idx < stages.length - 1) {
        // Nếu chạy tiếp chặng sau sẽ vượt ngưỡng an toàn (hoặc còn < 34% bình trước đoạn dài)
        const projectedAfterNext = kmSinceRefuel + nextLegKm;
        if (
          projectedAfterNext >= safeReserveRangeKm ||
          pctBeforeRefuel <= 34 ||
          (nextLegKm >= 65 && pctBeforeRefuel <= 52 && spec.isMotorbike)
        ) {
          mustRefuelHere = true;
          refuelReason = `Chặng kế tiếp +${nextLegKm} km leo dốc — đổ đầy bình tại ${st.name} để giữ ngưỡng an toàn`;
          refuelStops.push({
            stageIndex: st.index,
            name: st.name,
            nextLegKm,
            pctArrival: pctBeforeRefuel
          });
          kmSinceRefuel = 0;
        }
      }

      let gaugeState = "safe";
      if (pctBeforeRefuel <= 25) gaugeState = "critical";
      else if (pctBeforeRefuel <= 45) gaugeState = "caution";

      return {
        index: st.index,
        name: st.name,
        lat: st.lat,
        lng: st.lng,
        legKm,
        pctArrival: pctBeforeRefuel,
        pctAfter: mustRefuelHere ? 100 : pctBeforeRefuel,
        mustRefuelHere,
        refuelReason,
        gaugeState
      };
    });

    // Đánh giá mức độ rủi ro "Vùng Khát Xăng"
    const gapRatio = dryGapKm / Math.max(1, safeReserveRangeKm);
    const needsSpareCan = spec.isMotorbike && (dryGapKm >= 85 || gapRatio >= 0.62);
    let riskLevel = "safe";
    let riskLabel = "✅ Tầm bình dư dả";
    if (needsSpareCan) {
      riskLevel = "critical";
      riskLabel = "🚨 Cảnh báo Vùng Khát Xăng";
    } else if (gapRatio >= 0.36 || refuelStops.length >= 2) {
      riskLevel = "caution";
      riskLabel = "⚠️ Cần chủ động đổ xăng sớm";
    }

    let summaryAdvice = "";
    if (needsSpareCan) {
      summaryAdvice = `Quãng trắng không cây xăng lên tới ~${dryGapKm} km chiếm ${Math.round(
        gapRatio * 100
      )}% tầm chạy an toàn của ${spec.name}. Bắt buộc đổ đầy bình ở đầu tuyến và mang theo chai/can 1.5–2L dự phòng!`;
    } else if (refuelStops.length > 0) {
      const stopNames = refuelStops.map((s) => `Chặng ${s.stageIndex} (${s.name})`).join(" & ");
      summaryAdvice = `1 bình xăng ${spec.name} (${spec.tankLiters}L) chạy đường đèo cung này đạt ~${effectiveRangeKm} km (ngưỡng an toàn ~${safeReserveRangeKm} km). Nên đổ đầy bình tại: ${stopNames}.`;
    } else {
      summaryAdvice = `1 bình đầy ${spec.name} (~${effectiveRangeKm} km thực tế) đủ thoải mái chạy trọn cung (~${totalRouteKm} km). Vẫn nên đổ đầy tại ${
        wps[0]?.name || "đầu tuyến"
      } trước khi khởi hành.`;
    }

    return {
      modelKey,
      vehicleName: spec.name,
      isMotorbike: spec.isMotorbike,
      tankLiters: spec.tankLiters,
      flatRangeKm,
      effectiveRangeKm,
      safeReserveRangeKm,
      actualLPer100,
      terrainPenaltyPct: Math.round(terrainPenalty * 100),
      terrainNote,
      totalRouteKm,
      totalLiters,
      dryGapKm,
      refuelCount: refuelStops.length,
      refuelStops,
      needsSpareCan,
      riskLevel,
      riskLabel,
      summaryAdvice,
      stageNodes
    };
  }

  // =========================================================================
  // 2. VÒNG CUNG MẶT TRỜI & HƯỚNG NẮNG THỰC TẾ (SOLAR ARC & GLARE COMPASS)
  // =========================================================================
  calculateSolarArcAndGlare(route, waypoints, isoDateStr = null, departureTimeStr = "05:30") {
    const wps = waypoints && waypoints.length > 0 ? waypoints : route.waypoints;
    const midWp = wps[Math.floor(wps.length / 2)] || wps[0] || { lat: 21.0, lng: 105.8, name: "Việt Nam" };
    const startWp = wps[0] || midWp;
    const endWp = wps[wps.length - 1] || midWp;

    // Xử lý ngày dự kiến đi (mặc định là hôm nay)
    const now = new Date();
    let targetDate = now;
    if (isoDateStr && /^\d{4}-\d{2}-\d{2}$/.test(isoDateStr)) {
      const [yy, mm, dd] = isoDateStr.split("-").map(Number);
      targetDate = new Date(yy, mm - 1, dd, 12, 0, 0);
    }
    const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((targetDate - startOfYear) / 86400000);

    // Công thức thiên văn NOAA (Múi giờ Việt Nam UTC+7)
    const rad = Math.PI / 180;
    const deg = 180 / Math.PI;
    const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);

    // Phương trình thời gian (phút) & độ xích vĩ Mặt Trời (radian)
    const eqTime =
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma));

    const decl =
      0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma);

    const latRad = midWp.lat * rad;
    const zenith = 90.833 * rad;
    const cosHA = Math.max(
      -1,
      Math.min(1, Math.cos(zenith) / (Math.cos(latRad) * Math.cos(decl)) - Math.tan(latRad) * Math.tan(decl))
    );
    const haDeg = Math.acos(cosHA) * deg;

    const tzOffset = 7; // GMT+7 Việt Nam
    const solarNoonMin = 720 - 4 * midWp.lng - eqTime + tzOffset * 60;
    const sunriseMin = solarNoonMin - haDeg * 4;
    const sunsetMin = solarNoonMin + haDeg * 4;
    const daylightMin = Math.round(sunsetMin - sunriseMin);

    const fmtClock = (mins) => {
      const m = ((Math.round(mins) % 1440) + 1440) % 1440;
      const hh = String(Math.floor(m / 60)).padStart(2, "0");
      const mm = String(m % 60).padStart(2, "0");
      return `${hh}:${mm}`;
    };

    // Góc phương vị Mặt Trời lúc Bình minh & Hoàng hôn (0° = Bắc, 90° = Đông, 180° = Nam, 270° = Tây)
    const cosAzRise = Math.max(-1, Math.min(1, Math.sin(decl) / Math.cos(latRad)));
    const sunriseAzimuth = Math.round(Math.acos(cosAzRise) * deg); // ~66°..114°
    const sunsetAzimuth = (360 - sunriseAzimuth) % 360; // ~246°..294°

    // Tính góc phương vị hướng chạy chính của cung đường (Start -> End, hoặc Start -> Mid nếu là vòng cung khép kín)
    const calcBearing = (p1, p2) => {
      const phi1 = p1.lat * rad;
      const phi2 = p2.lat * rad;
      const dLam = (p2.lng - p1.lng) * rad;
      const y = Math.sin(dLam) * Math.cos(phi2);
      const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLam);
      return ((Math.atan2(y, x) * deg) + 360) % 360;
    };

    const endDistKm = this.calculateHaversineKm(startWp.lat, startWp.lng, endWp.lat, endWp.lng);
    const bearingTarget =
      endDistKm < 15 && wps.length >= 3 ? wps[Math.max(1, Math.floor(wps.length / 3))] : endWp;
    const routeBearing = Math.round(calcBearing(startWp, bearingTarget));

    const compassName = (az) => {
      const dirs = [
        "Bắc",
        "Đông Bắc",
        "Đông",
        "Đông Nam",
        "Nam",
        "Tây Nam",
        "Tây",
        "Tây Bắc"
      ];
      return dirs[Math.round(((az % 360) / 45)) % 8];
    };

    const angleDiff = (a, b) => {
      const d = Math.abs(a - b) % 360;
      return d > 180 ? 360 - d : d;
    };

    // Kiểm tra hướng nắng trực diện lúc Bình minh & Hoàng hôn
    const diffDawn = angleDiff(routeBearing, sunriseAzimuth);
    const diffDusk = angleDiff(routeBearing, sunsetAzimuth);

    // Giờ xuất phát của người dùng
    const [depH, depM] = String(departureTimeStr || "05:30")
      .split(":")
      .map((n) => parseInt(n, 10) || 0);
    const depMin = depH * 60 + depM;
    const sunProgress = Math.max(0, Math.min(1, (depMin - sunriseMin) / Math.max(1, daylightMin)));
    const isBeforeSunrise = depMin < sunriseMin;
    const isAfterSunset = depMin > sunsetMin;

    let glareLevel = "optimal"; // optimal | caution | warning
    let glareBadge = "✨ Thuận sáng — Ít bị chói mắt";
    let glareAdvice = "";
    let photoTip = "";

    if (diffDusk <= 46) {
      glareLevel = "warning";
      glareBadge = "🕶️ Cảnh báo Ngược nắng gắt buổi chiều";
      glareAdvice = `Chiều đi hiện tại hướng ${compassName(routeBearing)} (${routeBearing}°) chạy thẳng về phía Mặt Trời lặn (${compassName(
        sunsetAzimuth
      )} ${sunsetAzimuth}°). Nếu chạy đoạn đèo lúc ${fmtClock(sunsetMin - 75)}–${fmtClock(
        sunsetMin
      )} sẽ bị chói lóa kính mũ/kính lái — nên đeo kính râm hoặc thử bấm "⇄ Đảo chiều" đi ngược lại!`;
      photoTip = `📸 Mẹo săn ảnh: Chụp ngược sáng hoàng hôn cực nghệ từ ${fmtClock(
        sunsetMin - 45
      )} đến ${fmtClock(sunsetMin)}; buổi sáng nắng chiếu thuận từ sau lưng làm cảnh vật rực màu nhất!`;
    } else if (diffDawn <= 46) {
      glareLevel = "caution";
      glareBadge = "🌅 Ngược nắng nhẹ lúc sáng sớm";
      glareAdvice = `Chiều đi hướng ${compassName(routeBearing)} (${routeBearing}°) đón thẳng bình minh (${compassName(
        sunriseAzimuth
      )} ${sunriseAzimuth}°) trong khung ${fmtClock(sunriseMin)}–${fmtClock(
        sunriseMin + 90
      )}. Chuẩn bị kính chắn gió có lọc UV/kính râm nếu xuất phát sớm; từ chiều nắng chiếu sau lưng cực dễ chạy!`;
      photoTip = `📸 Mẹo săn ảnh: Dừng ở đỉnh đèo trước ${fmtClock(
        sunriseMin + 15
      )} để đón tia nắng đầu tiên; buổi chiều (${fmtClock(sunsetMin - 60)}–${fmtClock(
        sunsetMin
      )}) ánh sáng vàng chiếu thuận vào cảnh quan trước mặt siêu trong!`;
    } else {
      // Nắng chiếu ngang hông (lý tưởng nhất cho cả lái xe lẫn chụp ảnh nổi khối!)
      const morningSunSide = ((sunriseAzimuth - routeBearing + 360) % 360) < 180 ? "bên phải" : "bên trái";
      const eveningSunSide = ((sunsetAzimuth - routeBearing + 360) % 360) < 180 ? "bên phải" : "bên trái";
      glareLevel = "optimal";
      glareBadge = "✨ Nắng chiếu ngang hông — Cực thuận sáng";
      glareAdvice = `Hướng chạy chính ${compassName(routeBearing)} (${routeBearing}°) vuông góc khá đẹp với trục Đông–Tây của Mặt Trời nên hạn chế tối đa chói mắt trực diện cả sáng lẫn chiều.`;
      photoTip = `📸 Mẹo săn ảnh: Giờ vàng sáng (${fmtClock(sunriseMin)}–${fmtClock(
        sunriseMin + 55
      )}) nắng xiên ${morningSunSide} xe; Giờ vàng chiều (${fmtClock(sunsetMin - 55)}–${fmtClock(
        sunsetMin
      )}) nắng ấm tạt ${eveningSunSide} giúp ảnh đèo núi/biển nổi khối sâu nhất!`;
    }

    const yyyy = targetDate.getFullYear();
    const mmStr = String(targetDate.getMonth() + 1).padStart(2, "0");
    const ddStr = String(targetDate.getDate()).padStart(2, "0");

    return {
      isoDate: `${yyyy}-${mmStr}-${ddStr}`,
      displayDate: `${ddStr}/${mmStr}/${yyyy}`,
      pointName: midWp.name,
      lat: midWp.lat,
      lng: midWp.lng,
      sunriseStr: fmtClock(sunriseMin),
      solarNoonStr: fmtClock(solarNoonMin),
      sunsetStr: fmtClock(sunsetMin),
      goldenMorningRange: `${fmtClock(sunriseMin)} – ${fmtClock(sunriseMin + 55)}`,
      goldenEveningRange: `${fmtClock(sunsetMin - 55)} – ${fmtClock(sunsetMin)}`,
      blueDawnStr: fmtClock(sunriseMin - 24),
      daylightText: `${Math.floor(daylightMin / 60)}g ${daylightMin % 60}p`,
      sunriseAzimuth,
      sunsetAzimuth,
      sunriseDir: compassName(sunriseAzimuth),
      sunsetDir: compassName(sunsetAzimuth),
      routeBearing,
      routeDir: compassName(routeBearing),
      departureTimeStr,
      sunProgress,
      isBeforeSunrise,
      isAfterSunset,
      glareLevel,
      glareBadge,
      glareAdvice,
      photoTip
    };
  }
}

window.phuotDB = new PhuotDataTier();
window.phuotService = new PhuotServiceTier(window.phuotDB);
window.REGION_METADATA = REGION_METADATA;
window.DEMO_PASSPORT_PROFILES = DEMO_PASSPORT_PROFILES;
