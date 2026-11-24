const DEFAULT_GEAR = [
  "CCCD / Hộ chiếu & Bằng lái xe",
  "Giấy đăng ký xe & Bảo hiểm xe máy",
  "Bộ dụng cụ vá lốp & Bơm mini",
  "Áo mưa bộ & Bọc giày chống nước",
  "Túi y tế cá nhân (thuốc cảm, đau bụng, băng gạc)",
  "Sạc dự phòng 20.000mAh & Dây sạc"
];

// Bộ ảnh thực tế địa danh Việt Nam độ phân giải cao lưu trực tiếp tại máy (100% hiển thị nhanh & chuẩn xác)
const FALLBACK_IMGS = {
  mountainNorth: "assets/images/hero-ma-pi-leng.jpg",
  terracedFields: "assets/images/khau-pha-mu-cang-chai.jpg",
  cloudHunting: "assets/images/ta-xua-tram-tau.jpg",
  waterfall: "assets/images/hero-ban-gioc.jpg",
  coastCentral: "assets/images/hero-vinh-hy.jpg",
  coastalCliff: "assets/images/mui-dien-vung-ro.jpg",
  highlands: "assets/images/mang-den-truong-son.jpg",
  pineForest: "assets/images/cau-dat-da-lat.jpg",
  mekongDelta: "assets/images/dat-mui-ca-mau.jpg",
  vietnamHero: "assets/images/lung-cu-hero.jpg"
};

const ROUTES_DATA = [
  // =========================================================================
  // 1. VÙNG NÚI PHÍA BẮC: HÙNG VĨ & HIỂM TRỞ (8 CUNG ĐƯỜNG)
  // =========================================================================
  {
    id: "ha-giang-loop",
    title: "Vòng Cung Hà Giang (Ha Giang Loop) — Mã Pí Lèng & Lũng Cú",
    region: "Miền Bắc",
    distanceKm: 350,
    defaultDays: 3,
    bestMonths: [9, 10, 11, 1, 2, 3],
    bestTimeText: "Tháng 9–11 & Tháng 1–3",
    image: "assets/images/hero-ma-pi-leng.jpg",
    fallbackImage: FALLBACK_IMGS.mountainNorth,
    excerpt: "TP. Hà Giang – Quản Bạ – Yên Minh – Đồng Văn – Mèo Vạc – Du Già. Chinh phục đèo Mã Pí Lèng, hẻm vực Tu Sản và Cột cờ Lũng Cú.",
    description: "Lộ trình tiêu biểu: TP. Hà Giang – Quản Bạ – Yên Minh – Đồng Văn – Mèo Vạc – Du Già (~350 km). Điểm nhấn là đèo Mã Pí Lèng, hẻm vực Tu Sản trên sông Nho Quế và Cột cờ Quốc gia Lũng Cú. Lưu ý: Đường nhiều cua tay áo, dốc đứng; cần kiểm tra phanh và lốp kỹ trước khi đi.",
    waypoints: [
      { name: "TP. Hà Giang", lat: 22.8233, lng: 104.9836 },
      { name: "Cổng Trời Quản Bạ", lat: 23.0714, lng: 104.9912 },
      { name: "Yên Minh", lat: 23.1167, lng: 105.1417 },
      { name: "Phố Cổ Đồng Văn", lat: 23.2768, lng: 105.3627 },
      { name: "Cột Cờ Lũng Cú", lat: 23.3628, lng: 105.3164 },
      { name: "Đèo Mã Pí Lèng", lat: 23.2435, lng: 105.4052 },
      { name: "Du Già", lat: 22.9231, lng: 105.2389 }
    ],
    costConfig: { fuelPerKm: 650, foodPerDay: 280000, stayPerNight: 220000, buffer: 350000 },
    specialGear: [
      "Kiểm tra má phanh & độ mòn lốp trước khi xuất phát",
      "Áo giữ nhiệt, áo gió chống rét & găng tay chống nước",
      "Giấy bóng kính vàng dán đèn pha đi sương mù"
    ]
  },
  {
    id: "tu-dai-dinh-deo-tay-bac",
    title: "Tứ Đại Đỉnh Đèo Tây Bắc: Khau Phạ — Ô Quy Hồ — Pha Đin",
    region: "Miền Bắc",
    distanceKm: 900,
    defaultDays: 5,
    bestMonths: [5, 6, 9, 10],
    bestTimeText: "Tháng 5–6 (nước đổ) & Tháng 9–10 (lúa chín)",
    image: "assets/images/khau-pha-mu-cang-chai.jpg",
    fallbackImage: FALLBACK_IMGS.terracedFields,
    excerpt: "Hà Nội – Mù Cang Chải (Đèo Khau Phạ) – Sa Pa (Đèo Ô Quy Hồ) – Điện Biên (Đèo Pha Đin).",
    description: "Lộ trình tiêu biểu: Hà Nội – Mù Cang Chải (Đèo Khau Phạ) – Sa Pa (Đèo Ô Quy Hồ) – Điện Biên (Đèo Pha Đin) (~900 km). Đèo Ô Quy Hồ dài gần 50 km, mây mù dày đặc quanh năm. Lưu ý: Chú ý sương mù vào chiều muộn làm giảm tầm nhìn dưới 5m.",
    waypoints: [
      { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
      { name: "Đèo Khau Phạ (Mù Cang Chải)", lat: 21.7583, lng: 104.2481 },
      { name: "Đèo Ô Quy Hồ (Sa Pa)", lat: 22.3564, lng: 103.7711 },
      { name: "Đèo Pha Đin (Điện Biên)", lat: 21.5739, lng: 103.5133 }
    ],
    costConfig: { fuelPerKm: 650, foodPerDay: 280000, stayPerNight: 250000, buffer: 400000 },
    specialGear: [
      "Đèn trợ sáng phá sương ánh sáng vàng",
      "Áo phản quang mặc ngoài khi đi đèo chiều muộn",
      "Bộ đồ giữ ấm chuyên dụng vùng núi cao"
    ]
  },
  {
    id: "san-may-ta-xua-tram-tau",
    title: "Săn Mây Tà Xùa — Trạm Tấu (Sống Lưng Khủng Long)",
    region: "Miền Bắc",
    distanceKm: 240,
    defaultDays: 2,
    bestMonths: [11, 12, 1, 2, 3],
    bestTimeText: "Tháng 11 – Tháng 3 (Mùa biển mây dày)",
    image: "assets/images/ta-xua-tram-tau.jpg",
    fallbackImage: FALLBACK_IMGS.cloudHunting,
    excerpt: "Hà Nội – Bắc Yên – Tà Xùa – Xím Vàng – Trạm Tấu (Yên Bái). Sống lưng khủng long Háng Đồng, mỏm cá heo và suối khoáng nóng.",
    description: "Lộ trình tiêu biểu: Hà Nội – Bắc Yên – Tà Xùa – Xím Vàng – Trạm Tấu (Yên Bái) (~240 km). Điểm nhấn: Sống lưng khủng long Háng Đồng, mỏm cá heo, thảo nguyên Tà Xùa và suối khoáng nóng Trạm Tấu. Lưu ý: Đường nối Tà Xùa sang Trạm Tấu hẹp, nhiều đá hộc, chỉ phù hợp xe số, xe côn tay hoặc SUV gầm cao.",
    waypoints: [
      { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
      { name: "Thị trấn Bắc Yên", lat: 21.2536, lng: 104.4267 },
      { name: "Sống Lưng Khủng Long Háng Đồng", lat: 21.3522, lng: 104.4914 },
      { name: "Xím Vàng", lat: 21.4114, lng: 104.4692 },
      { name: "Trạm Tấu (Yên Bái)", lat: 21.4667, lng: 104.3833 }
    ],
    costConfig: { fuelPerKm: 700, foodPerDay: 250000, stayPerNight: 220000, buffer: 250000 },
    specialGear: [
      "Xe số / xe côn tay / gầm cao (KHÔNG đi xe tay ga cung Xím Vàng - Trạm Tấu)",
      "Đèn pin đội đầu săn mây lúc 5h sáng",
      "Áo phao chống rét đậm ban đêm"
    ]
  },
  {
    id: "dong-bac-cao-bang-ban-gioc",
    title: "Đông Bắc: Cao Bằng — Đèo Mã Phục — Thác Bản Giốc — Hồ Ba Bể",
    region: "Miền Bắc",
    distanceKm: 650,
    defaultDays: 4,
    bestMonths: [8, 9, 10, 11],
    bestTimeText: "Tháng 8 – Tháng 11 (Thác nước xanh trong)",
    image: "assets/images/hero-ban-gioc.jpg",
    fallbackImage: FALLBACK_IMGS.waterfall,
    excerpt: "Hà Nội – Lạng Sơn – Đèo Mã Phục – Thác Bản Giốc – Hồ Ba Bể. Đèo Khau Cốc Chà 15 tầng dốc đứng, núi Mắt Thần.",
    description: "Lộ trình tiêu biểu: Hà Nội – Lạng Sơn – Đèo Mã Phục – Thác Bản Giốc – Hồ Ba Bể (~650 km). Điểm nhấn: Đèo Khau Cốc Chà (15 tầng cua tay áo), núi Mắt Thần, thác Bản Giốc và hồ Ba Bể.",
    waypoints: [
      { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
      { name: "TP. Lạng Sơn", lat: 21.8537, lng: 106.7615 },
      { name: "Đèo Mã Phục", lat: 22.7336, lng: 106.3422 },
      { name: "Thác Bản Giốc", lat: 22.8553, lng: 106.7225 },
      { name: "Hồ Ba Bể (Bắc Kạn)", lat: 22.4167, lng: 105.6167 }
    ],
    costConfig: { fuelPerKm: 650, foodPerDay: 260000, stayPerNight: 230000, buffer: 350000 },
    specialGear: [
      "Giày trekking chống trơn trượt (leo điểm ngắm toàn cảnh Khau Cốc Chà)",
      "Túi chống nước cho máy ảnh/điện thoại khi đi bè gần thác",
      "Áo khoác gió nhẹ buổi tối"
    ]
  },
  {
    id: "y-ty-bat-xat-lung-po",
    title: "Cung Đường Mây & Mùa Vàng: Lũng Pô — Y Tý — Mường Hum — Sa Pa",
    region: "Miền Bắc",
    distanceKm: 195,
    defaultDays: 2,
    bestMonths: [8, 9, 10, 1, 2, 3],
    bestTimeText: "Tháng 8–10 (Lúa chín) & Tháng 1–3 (Săn mây)",
    image: "assets/images/y-ty-lao-cai.jpg",
    fallbackImage: FALLBACK_IMGS.terracedFields,
    excerpt: "TP. Lào Cai – Cột cờ Lũng Pô – A Mú Sung – Ngải Thầu – Y Tý – Mường Hum – Sa Pa. Nơi con sông Hồng chảy vào đất Việt.",
    description: "Hành trình biên giới phía Tây Bắc tỉnh Lào Cai (~195 km): Khởi đầu từ cột cờ Lũng Pô (ngã ba sông Hồng và suối Lũng Pô), ngược lên đỉnh Ngải Thầu Thượng và cao nguyên Y Tý ở độ cao trên 2.000m với những ngôi nhà trình tường cổ của người Hà Nhì ẩn hiện trong biển mây.",
    waypoints: [
      { name: "TP. Lào Cai", lat: 22.4856, lng: 103.9707 },
      { name: "Cột Cờ Lũng Pô (Bát Xát)", lat: 22.6958, lng: 103.6589 },
      { name: "Đỉnh Ngải Thầu Thượng", lat: 22.6481, lng: 103.6214 },
      { name: "Trung tâm xã Y Tý", lat: 22.6269, lng: 103.6194 },
      { name: "Chợ phiên Mường Hum", lat: 22.5214, lng: 103.7042 },
      { name: "Thị xã Sa Pa", lat: 22.3364, lng: 103.8438 }
    ],
    costConfig: { fuelPerKm: 680, foodPerDay: 250000, stayPerNight: 220000, buffer: 250000 },
    specialGear: [
      "CCCD bản gốc để trình Đồn Biên Phòng dọc tuyến biên giới Bát Xát",
      "Áo ấm chống gió lùa (nhiệt độ Y Tý ban đêm rất thấp)",
      "Đổ đầy xăng tại TP. Lào Cai và thị trấn Bát Xát"
    ]
  },
  {
    id: "vong-cung-bien-gioi-binh-lieu",
    title: "Vòng Cung Biên Giới Bình Liêu — Mùa Cỏ Lau & Cột Mốc 1305",
    region: "Miền Bắc",
    distanceKm: 210,
    defaultDays: 2,
    bestMonths: [10, 11, 12, 3, 4],
    bestTimeText: "Tháng 10 – Tháng 12 (Mùa cỏ lau trắng)",
    image: "assets/images/binh-lieu-co-lau.jpg",
    fallbackImage: FALLBACK_IMGS.mountainNorth,
    excerpt: "Hạ Long – Tiên Yên – Bình Liêu – Đường tuần tra biên giới – Sống lưng khủng long Mốc 1305 – Đỉnh Cao Xiêm.",
    description: "Cung đường tuần tra biên giới đẹp bậc nhất vùng Đông Bắc tại Bình Liêu (Quảng Ninh). Những con dốc uốn lượn trên sống núi cao vút ngập tràn cỏ lau trắng muốt mỗi độ thu về, dẫn lối lên sống lưng khủng long và cột mốc biên giới thiêng liêng 1305.",
    waypoints: [
      { name: "TP. Hạ Long", lat: 20.9599, lng: 107.0425 },
      { name: "Thị trấn Tiên Yên", lat: 21.3289, lng: 107.4014 },
      { name: "Thị trấn Bình Liêu", lat: 21.5228, lng: 107.3944 },
      { name: "Cột Mốc 1297 (Đồi Cỏ Lau)", lat: 21.5642, lng: 107.3389 },
      { name: "Sống Lưng Khủng Long Mốc 1305", lat: 21.5811, lng: 107.3728 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 260000, stayPerNight: 230000, buffer: 220000 },
    specialGear: [
      "Giày thể thao êm chân để leo 2.000 bậc thang lên cột mốc 1305",
      "Áo khoác cản gió trên đường tuần tra biên giới trên cao",
      "Nước uống và thanh năng lượng khi leo mốc"
    ]
  },
  {
    id: "moc-chau-mai-chau-pu-luong",
    title: "Cung Đường Tây Bắc Xanh: Đèo Đá Trắng — Mai Châu — Mộc Châu — Pù Luông",
    region: "Miền Bắc",
    distanceKm: 360,
    defaultDays: 3,
    bestMonths: [1, 2, 3, 5, 6, 9, 10, 11],
    bestTimeText: "Tháng 1–3 (Hoa mận) & Tháng 9–11 (Lúa chín)",
    image: "assets/images/moc-chau-pu-luong.jpg",
    fallbackImage: FALLBACK_IMGS.highlands,
    excerpt: "Hà Nội – Đèo Thung Khe (Đá Trắng) – Bản Lác (Mai Châu) – Đồi chè Mộc Châu – Khu bảo tồn thiên nhiên Pù Luông.",
    description: "Hành trình kết nối 3 thiên đường sinh thái nổi tiếng nhất phía Tây Hà Nội (~360 km): Vượt đèo Thung Khe mây phủ trắng như tuyết, thăm thung lũng Mai Châu yên bình, băng qua thảo nguyên chè và thung lũng mận Nà Ka (Mộc Châu) rồi đổ đèo xuống ruộng bậc thang Pù Luông (Thanh Hóa).",
    waypoints: [
      { name: "Hà Nội", lat: 21.0285, lng: 105.8542 },
      { name: "Đèo Thung Khe (Đèo Đá Trắng)", lat: 20.6656, lng: 105.1464 },
      { name: "Thung lũng Mai Châu", lat: 20.6594, lng: 105.0836 },
      { name: "Cao nguyên Mộc Châu (Đồi Chè)", lat: 20.8444, lng: 104.6389 },
      { name: "Khu bảo tồn Pù Luông (Bản Đôn)", lat: 20.4494, lng: 105.1828 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 260000, stayPerNight: 250000, buffer: 300000 },
    specialGear: [
      "Đèn sương mù vàng (đoạn đèo Thung Khe và Lóng Luông sương rất dày)",
      "Kiểm tra phanh kỹ trước khi đổ dốc Son Bá Mười xuống Pù Luông",
      "Áo khoác ấm buổi tối vùng cao"
    ]
  },
  {
    id: "cung-bien-dao-cat-ba-lan-ha",
    title: "Cung Đường Xuyên Đảo Cát Bà — Ven Biển Cái Giá & Vịnh Lan Hạ",
    region: "Miền Bắc",
    distanceKm: 135,
    defaultDays: 2,
    bestMonths: [4, 5, 6, 7, 8, 9, 10],
    bestTimeText: "Tháng 4 – Tháng 10 (Nắng vàng, biển xanh)",
    image: "assets/images/deo-hai-van.jpg",
    fallbackImage: FALLBACK_IMGS.coastCentral,
    excerpt: "Hải Phòng – Cầu vượt biển Tân Vũ – Phà Đồng Bài – Đường hoa ven biển 356 – Vườn Quốc gia Cát Bà – Vịnh Lan Hạ.",
    description: "Cung đường biển đảo đẹp nhất miền Bắc (~135 km): Băng qua cầu vượt biển dài nhất Việt Nam (Tân Vũ – Lạch Huyện), lên đảo Cát Bà chạy dọc tuyến đường ven biển ôm sát vách núi đá vôi với hoa giấy nở rực hai bên đường và cung đường xuyên rừng nguyên sinh VQG Cát Bà.",
    waypoints: [
      { name: "TP. Hải Phòng", lat: 20.8449, lng: 106.6881 },
      { name: "Cầu Vượt Biển Tân Vũ - Lạch Huyện", lat: 20.8086, lng: 106.8492 },
      { name: "Bến Phà Đồng Bài - Cái Viềng", lat: 20.8169, lng: 106.9219 },
      { name: "Vườn Quốc Gia Cát Bà (Đỉnh Ngự Lâm)", lat: 20.7981, lng: 107.0056 },
      { name: "Bến Bèo - Vịnh Lan Hạ", lat: 20.7236, lng: 107.0564 }
    ],
    costConfig: { fuelPerKm: 580, foodPerDay: 300000, stayPerNight: 280000, buffer: 250000 },
    specialGear: [
      "Canh giờ ra bến phà sớm buổi sáng để tránh ùn tắc cuối tuần",
      "Giày leo núi nhẹ để chinh phục đỉnh Ngự Lâm trong VQG Cát Bà",
      "Kính râm & kem chống nắng"
    ]
  },

  // =========================================================================
  // 2. DUYÊN HẢI MIỀN TRUNG: DI SẢN & BIỂN XANH (7 CUNG ĐƯỜNG)
  // =========================================================================
  {
    id: "deo-hai-van-hue-da-nang",
    title: "Đèo Hải Vân — Thiên Hạ Đệ Nhất Hùng Quan (Huế – Đà Nẵng)",
    region: "Miền Trung",
    distanceKm: 21,
    defaultDays: 1,
    bestMonths: [3, 4, 5, 6, 7, 8],
    bestTimeText: "Tháng 3 – Tháng 8 (Trời quang, biển xanh)",
    image: "assets/images/deo-hai-van.jpg",
    fallbackImage: FALLBACK_IMGS.coastCentral,
    excerpt: "Thị trấn Lăng Cô – Đỉnh đèo Hải Vân – Liên Chiểu (Đà Nẵng). Nhìn trọn vịnh Lăng Cô và bán đảo Sơn Trà.",
    description: "Lộ trình: Thị trấn Lăng Cô – Đỉnh đèo Hải Vân – Liên Chiểu (Đà Nẵng) (~21 km). Được mệnh danh là 'Thiên hạ đệ nhất hùng quan'. Từ đỉnh đèo nhìn trọn vịnh Lăng Cô và bán đảo Sơn Trà. Đường đèo rộng, đẹp, ít xe tải lớn vì đã có hầm Hải Vân.",
    waypoints: [
      { name: "Thị trấn Lăng Cô", lat: 16.2367, lng: 108.0753 },
      { name: "Đỉnh Đèo Hải Vân (Hải Vân Quan)", lat: 16.1956, lng: 108.1306 },
      { name: "Liên Chiểu (Đà Nẵng)", lat: 16.1264, lng: 108.1378 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 250000, stayPerNight: 250000, buffer: 150000 },
    specialGear: [
      "Kính râm chống lóa nắng biển",
      "Áo khoác gió mỏng trên đỉnh đèo",
      "Pin dự phòng chụp ảnh tại Hải Vân Quan & Khúc cua chữ U"
    ]
  },
  {
    id: "ven-bien-phu-yen-khanh-hoa",
    title: "Cung Đường Ven Biển Phú Yên — Khánh Hòa (Mũi Điện – Vũng Rô)",
    region: "Miền Trung",
    distanceKm: 120,
    defaultDays: 2,
    bestMonths: [2, 3, 4, 5, 6, 7, 8],
    bestTimeText: "Tháng 2 – Tháng 8 (Biển êm, bình minh rõ)",
    image: "assets/images/mui-dien-vung-ro.jpg",
    fallbackImage: FALLBACK_IMGS.coastalCliff,
    excerpt: "Tuy Hòa – Mũi Điện (Đại Lãnh) – Vịnh Vũng Rô – Đèo Cả – Nha Trang. Đón bình minh sớm nhất trên đất liền Việt Nam.",
    description: "Lộ trình: Tuy Hòa – Mũi Điện (Đại Lãnh) – Vịnh Vũng Rô – Đèo Cả – Nha Trang (~120 km). Mũi Điện là nơi đón bình minh sớm nhất trên đất liền Việt Nam. Cung đường ôm sát vịnh Vũng Rô với nước biển màu ngọc bích.",
    waypoints: [
      { name: "TP. Tuy Hòa", lat: 13.0955, lng: 109.3209 },
      { name: "Mũi Điện (Hải đăng Đại Lãnh)", lat: 12.8647, lng: 109.4586 },
      { name: "Vịnh Vũng Rô", lat: 12.8653, lng: 109.4239 },
      { name: "Đèo Cả", lat: 12.8364, lng: 109.3931 },
      { name: "TP. Nha Trang", lat: 12.2388, lng: 109.1967 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 280000, stayPerNight: 250000, buffer: 200000 },
    specialGear: [
      "Kem chống nắng SPF 50+ & Áo chống nắng",
      "Đèn pin nhỏ (nếu leo hải đăng Mũi Điện từ 4h30 sáng đón bình minh)",
      "Nước suối dự trữ dọc đường đèo"
    ]
  },
  {
    id: "ven-bien-binh-thuan-ninh-thuan",
    title: "Cung Đường Ven Biển Bình Thuận — Ninh Thuận (DT701 – DT702)",
    region: "Miền Trung",
    distanceKm: 220,
    defaultDays: 2,
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8],
    bestTimeText: "Tháng 1 – Tháng 8 (Biển Vĩnh Hy trong vắt)",
    image: "assets/images/hero-vinh-hy.jpg",
    fallbackImage: FALLBACK_IMGS.coastCentral,
    excerpt: "Phan Thiết – Bàu Trắng – Mũi Dinh – Phan Rang – Vĩnh Hy – Cam Ranh. Cung đường ven biển đẹp nhất Việt Nam.",
    description: "Lộ trình: Phan Thiết – Bàu Trắng – Mũi Dinh – Phan Rang – Vĩnh Hy – Cam Ranh (~220 km). Được đánh giá là cung đường ven biển đẹp nhất Việt Nam. Một bên là tiểu sa mạc cát trắng (Bàu Trắng), núi đá VQG Núi Chúa, một bên là vịnh Vĩnh Hy và Hang Rái.",
    waypoints: [
      { name: "TP. Phan Thiết", lat: 10.9289, lng: 108.1021 },
      { name: "Bàu Trắng", lat: 11.0694, lng: 108.4231 },
      { name: "Mũi Dinh", lat: 11.3736, lng: 109.0142 },
      { name: "TP. Phan Rang - Tháp Chàm", lat: 11.5643, lng: 108.9886 },
      { name: "Vịnh Vĩnh Hy", lat: 11.7178, lng: 109.1967 },
      { name: "TP. Cam Ranh", lat: 11.9214, lng: 109.1591 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 280000, stayPerNight: 250000, buffer: 250000 },
    specialGear: [
      "Găng tay dài & Khăn đa năng che kín cổ/mặt chống nắng gắt",
      "Kính râm chống chói cát trắng Bàu Trắng",
      "2 lít nước điện giải mỗi xe"
    ]
  },
  {
    id: "duong-ho-chi-minh-nhanh-tay",
    title: "Đường Hồ Chí Minh Nhánh Tây: Phong Nha — Đèo U Bò — Khe Sanh",
    region: "Miền Trung",
    distanceKm: 245,
    defaultDays: 2,
    bestMonths: [2, 3, 4, 5, 6, 7, 8],
    bestTimeText: "Tháng 2 – Tháng 8 (Mùa khô Trường Sơn)",
    image: "assets/images/mang-den-truong-son.jpg",
    fallbackImage: FALLBACK_IMGS.highlands,
    excerpt: "Phong Nha (Kẻ Bàng) – Ngã ba Khe Gát – Đèo U Bò – Đèo Sa Mù – Hướng Hóa (Khe Sanh). Xuyên lõi rừng già Trường Sơn.",
    description: "Hành trình độc đạo xuyên lõi Vườn quốc gia Phong Nha – Kẻ Bàng sang Quảng Trị (~245 km). Đường bê tông uốn lượn giữa rừng nguyên sinh kỳ vĩ và núi đá vôi triệu năm tuổi. Lưu ý: Có đoạn hơn 120 km hoàn toàn không có trạm xăng và sóng điện thoại.",
    waypoints: [
      { name: "Thị trấn Phong Nha (Quảng Bình)", lat: 17.5906, lng: 106.2831 },
      { name: "Sân bay dã chiến Khe Gát", lat: 17.6194, lng: 106.2289 },
      { name: "Đỉnh Đèo U Bò", lat: 17.3622, lng: 106.3683 },
      { name: "Đèo Sa Mù (Hướng Hóa)", lat: 16.7989, lng: 106.5925 },
      { name: "Thị trấn Khe Sanh (Quảng Trị)", lat: 16.6269, lng: 106.7311 }
    ],
    costConfig: { fuelPerKm: 700, foodPerDay: 250000, stayPerNight: 220000, buffer: 300000 },
    specialGear: [
      "Bình xăng dự phòng 2–3 lít (BẮT BUỘC vì >120km giữa rừng không có cây xăng)",
      "Bộ đồ tự vá lốp & Bơm điện mini",
      "Tải sẵn bản đồ Offline trước khi rời Phong Nha"
    ]
  },
  {
    id: "ban-dao-son-tra-dinh-ban-co",
    title: "Vòng Cung Bán Đảo Sơn Trà — Đỉnh Bàn Cờ — Cây Đa Nghìn Năm (Đà Nẵng)",
    region: "Miền Trung",
    distanceKm: 55,
    defaultDays: 1,
    bestMonths: [2, 3, 4, 5, 6, 7, 8, 9],
    bestTimeText: "Tháng 2 – Tháng 9 (Trời trong, nhìn trọn vịnh)",
    image: "assets/images/deo-hai-van.jpg",
    fallbackImage: FALLBACK_IMGS.coastCentral,
    excerpt: "Cầu Thuận Phước – Chùa Linh Ứng – Đỉnh Bàn Cờ (700m) – Trạm Radar Mắt Thần Đông Dương – Cây Đa Nghìn Năm.",
    description: "Cung đèo ven biển ngay sát trung tâm Đà Nẵng (~55 km) với độ dốc rất gắt, một bên là rừng già nơi voọc chà vá chân nâu sinh sống, một bên là đại dương xanh thẳm. Lưu ý: Tuyến lên Đỉnh Bàn Cờ và Cây Đa Nghìn Năm bắt buộc đi bằng xe số (cấm xe tay ga).",
    waypoints: [
      { name: "Cầu Thuận Phước (Đà Nẵng)", lat: 16.0950, lng: 108.2211 },
      { name: "Chùa Linh Ứng Bãi Bụt", lat: 16.1003, lng: 108.2778 },
      { name: "Đỉnh Bàn Cờ (Độ cao 700m)", lat: 16.1194, lng: 108.2756 },
      { name: "Trạm Radar Sơn Trà", lat: 16.1356, lng: 108.2689 },
      { name: "Cây Đa Nghìn Năm", lat: 16.1322, lng: 108.3164 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 250000, stayPerNight: 250000, buffer: 150000 },
    specialGear: [
      "Xe số hoặc xe côn tay (BQL Bán đảo Sơn Trà cấm xe tay ga lên Đỉnh Bàn Cờ)",
      "Kiểm tra phanh trước và sau kỹ lưỡng vì nhiều dốc đứng 15–20%",
      "Áo khoác chống nắng & Nước uống"
    ]
  },
  {
    id: "quy-nhon-eo-gio-ghenh-da-dia",
    title: "Cung Đường Di Sản Biển: Quy Nhơn — Eo Gió — Cầu Gỗ Ông Cọp — Ghềnh Đá Đĩa",
    region: "Miền Trung",
    distanceKm: 145,
    defaultDays: 2,
    bestMonths: [2, 3, 4, 5, 6, 7, 8],
    bestTimeText: "Tháng 2 – Tháng 8 (Nắng vàng, biển ngọc bích)",
    image: "assets/images/ghenh-da-dia.jpg",
    fallbackImage: FALLBACK_IMGS.coastalCliff,
    excerpt: "TP. Quy Nhơn – Cầu Thị Nại – Eo Gió – Cù Lao Xanh – Đầm Ô Loan – Ghềnh Đá Đĩa – Bãi Xép (Phú Yên).",
    description: "Hành trình kết nối hai xứ sở 'Hoa vàng trên cỏ xanh' Bình Định – Phú Yên (~145 km): Băng qua cầu vượt biển Thị Nại, đón gió biển tại Eo Gió – Nhơn Lý, rồi chạy dọc cung đường ven biển quốc lộ 1D xuống chiêm ngưỡng kỳ quan đá bazan hình lăng trụ tại Ghềnh Đá Đĩa.",
    waypoints: [
      { name: "TP. Quy Nhơn", lat: 13.7829, lng: 109.2196 },
      { name: "Cầu Vượt Biển Thị Nại", lat: 13.8161, lng: 109.2456 },
      { name: "Eo Gió - Kỳ Co (Nhơn Lý)", lat: 13.8825, lng: 109.2981 },
      { name: "Cầu Gỗ Ông Cọp (Phú Yên)", lat: 13.3219, lng: 109.2711 },
      { name: "Kỳ quan Ghềnh Đá Đĩa", lat: 13.3542, lng: 109.2939 },
      { name: "Gành Ông - Bãi Xép", lat: 13.2186, lng: 109.3089 }
    ],
    costConfig: { fuelPerKm: 580, foodPerDay: 280000, stayPerNight: 250000, buffer: 220000 },
    specialGear: [
      "Kính mát phân cực chống chói mặt biển",
      "Áo khoác chống tia UV & Kem chống nắng",
      "Giày đế bám tốt để bước trên các khối đá bazan Ghềnh Đá Đĩa"
    ]
  },
  {
    id: "nghe-an-pu-mat-muong-long",
    title: "Tây Nghệ An Đại Ngàn: Đảo Chè Thanh Chương — Pù Mát — Cổng Trời Mường Lống",
    region: "Miền Trung",
    distanceKm: 290,
    defaultDays: 3,
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    bestTimeText: "Tháng 10 – Tháng 4 (Mùa mây & hoa Mường Lống)",
    image: "assets/images/moc-chau-pu-luong.jpg",
    fallbackImage: FALLBACK_IMGS.mountainNorth,
    excerpt: "TP. Vinh – Đảo chè Thanh Chương – VQG Pù Mát – Thác Kèm – Đường Quốc lộ 7 – Cổng trời Mường Lống (Kỳ Sơn).",
    description: "Khám phá vẻ đẹp hùng vĩ miền Tây xứ Nghệ dọc Quốc lộ 7 (~290 km): Đi thuyền giữa ốc đảo chè Thanh Chương, khám phá rừng nguyên sinh Pù Mát rồi vượt những con đèo dốc đứng lên Cổng trời Mường Lống ở độ cao gần 1.500m — nơi được mệnh danh là 'Sa Pa của miền Trung'.",
    waypoints: [
      { name: "TP. Vinh (Nghệ An)", lat: 18.6796, lng: 105.6813 },
      { name: "Đảo Chè Thanh Chương", lat: 18.7636, lng: 105.2914 },
      { name: "Vườn Quốc Gia Pù Mát (Con Cuông)", lat: 19.0439, lng: 104.8561 },
      { name: "Rừng Săng Lẻ Tương Dương", lat: 19.2056, lng: 104.5819 },
      { name: "Cổng Trời Mường Lống (Kỳ Sơn)", lat: 19.4628, lng: 104.2653 }
    ],
    costConfig: { fuelPerKm: 650, foodPerDay: 250000, stayPerNight: 220000, buffer: 250000 },
    specialGear: [
      "Áo ấm dày khi ngủ đêm tại bản Mường Lống",
      "Đèn phá sương vàng đi đèo chiều tối",
      "Đổ đầy xăng tại thị trấn Mường Xén trước khi leo Mường Lống"
    ]
  },

  // =========================================================================
  // 3. TÂY NGUYÊN & NAM BỘ: ĐẠI NGÀN & SÔNG NƯỚC (7 CUNG ĐƯỜNG)
  // =========================================================================
  {
    id: "duong-truong-son-dong",
    title: "Đường Trường Sơn Đông — Cung Đường Đại Ngàn Tây Nguyên",
    region: "Tây Nguyên & Nam Bộ",
    distanceKm: 700,
    defaultDays: 4,
    bestMonths: [11, 12, 1, 2, 3, 4],
    bestTimeText: "Tháng 11 – Tháng 4 (Mùa hoa dã quỳ & nắng khô)",
    image: "assets/images/mang-den-truong-son.jpg",
    fallbackImage: FALLBACK_IMGS.highlands,
    excerpt: "Đà Nẵng – Tây Giang – Kon Tum – Măng Đen – Buôn Ma Thuột – Đà Lạt. Xuyên rừng nguyên sinh và đồi thông già Măng Đen.",
    description: "Lộ trình: Đà Nẵng – Tây Giang – Kon Tum – Măng Đen – Buôn Ma Thuột – Đà Lạt (~700 km). Xuyên qua những cánh rừng nguyên sinh đại ngàn, khí hậu mát mẻ. Đoạn qua Măng Đen (Kon Tum) rợp bóng thông già, hoang sơ và yên tĩnh.",
    waypoints: [
      { name: "TP. Đà Nẵng", lat: 16.0544, lng: 108.2022 },
      { name: "Tây Giang (Quảng Nam)", lat: 15.8917, lng: 107.4528 },
      { name: "Măng Đen (Kon Tum)", lat: 14.6019, lng: 108.2931 },
      { name: "TP. Buôn Ma Thuột", lat: 12.6667, lng: 108.0500 },
      { name: "TP. Đà Lạt", lat: 11.9404, lng: 108.4583 }
    ],
    costConfig: { fuelPerKm: 650, foodPerDay: 270000, stayPerNight: 240000, buffer: 350000 },
    specialGear: [
      "Đổ đầy bình xăng ở mọi thị trấn (nhiều đoạn xuyên rừng thưa trạm xăng)",
      "Áo khoác ấm cho khí hậu se lạnh Măng Đen & Đà Lạt",
      "Bình xăng phụ 1.5L dự phòng"
    ]
  },
  {
    id: "nha-trang-deo-khanh-le-da-lat",
    title: "Cung Đường Nối Biển Và Hoa: Nha Trang — Đèo Khánh Lê — Đà Lạt",
    region: "Tây Nguyên & Nam Bộ",
    distanceKm: 135,
    defaultDays: 2,
    bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12],
    bestTimeText: "Tháng 11 – Tháng 8 (Đường đèo khô ráo)",
    image: "assets/images/mang-den-truong-son.jpg",
    fallbackImage: FALLBACK_IMGS.pineForest,
    excerpt: "Nha Trang – Đèo Khánh Lê (QL27C) – Lạc Dương – Đà Lạt. Chuyển giao từ biển nhiệt đới lên cao nguyên ôn đới trong 1 giờ.",
    description: "Lộ trình: Nha Trang – Đèo Khánh Lê (QL27C) – Lạc Dương – Đà Lạt (~135 km). Đèo Khánh Lê dài 33 km, nối liền vùng biển nhiệt đới với cao nguyên ôn đới. Sự thay đổi nhiệt độ và thảm thực vật diễn ra rõ rệt chỉ trong vòng 1 giờ chạy xe.",
    waypoints: [
      { name: "TP. Nha Trang", lat: 12.2388, lng: 109.1967 },
      { name: "Đỉnh Đèo Khánh Lê (QL27C)", lat: 12.1931, lng: 108.7614 },
      { name: "Lạc Dương (Lâm Đồng)", lat: 12.0258, lng: 108.4317 },
      { name: "TP. Đà Lạt", lat: 11.9404, lng: 108.4583 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 280000, stayPerNight: 260000, buffer: 200000 },
    specialGear: [
      "Áo khoác gió giữ ấm cất sẵn trong balo (để mặc ngay tại chân đèo)",
      "Áo mưa bộ (đỉnh đèo Khánh Lê thường có mây mù và mưa phùn bất chợt)",
      "Kiểm tra hệ thống phanh trước khi đổ dốc"
    ]
  },
  {
    id: "deo-ngoan-muc-cau-dat-da-lat",
    title: "Cung Đường Săn Mây & Đèo Ngoạn Mục: Phan Rang — Cầu Đất — Đà Lạt",
    region: "Tây Nguyên & Nam Bộ",
    distanceKm: 115,
    defaultDays: 2,
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    bestTimeText: "Tháng 10 – Tháng 4 (Biển mây Cầu Đất)",
    image: "assets/images/cau-dat-da-lat.jpg",
    fallbackImage: FALLBACK_IMGS.pineForest,
    excerpt: "Phan Rang – Đèo Ngoạn Mục (Sông Pha) – Đèo D'Ran – Đồi Chè Cầu Đất – Đèo Prenn – Hồ Tuyền Lâm (Đà Lạt).",
    description: "Một trong những cung đèo ngoạn mục nhất miền Nam (~115 km): Từ vùng nắng gió Ninh Thuận leo thẳng lên cao nguyên Lâm Viên qua những khúc cua kẹp tóc của Đèo Ngoạn Mục (Sông Pha), đi qua thị trấn D'Ran cổ kính ngập sắc vàng hoa dã quỳ và săn biển mây bên những tua-bin điện gió Đồi Chè Cầu Đất.",
    waypoints: [
      { name: "TP. Phan Rang - Tháp Chàm", lat: 11.5643, lng: 108.9886 },
      { name: "Đèo Ngoạn Mục (Sông Pha)", lat: 11.8356, lng: 108.6628 },
      { name: "Thị trấn D'Ran (Đơn Dương)", lat: 11.8369, lng: 108.5661 },
      { name: "Đồi Chè & Điện Gió Cầu Đất", lat: 11.8725, lng: 108.5469 },
      { name: "TP. Đà Lạt (Hồ Tuyền Lâm)", lat: 11.9039, lng: 108.4314 }
    ],
    costConfig: { fuelPerKm: 620, foodPerDay: 280000, stayPerNight: 260000, buffer: 220000 },
    specialGear: [
      "Áo phao ấm & găng tay kín gió nếu đi săn mây Cầu Đất lúc 4h30 sáng",
      "Chạy số thấp khi qua các khúc cua tay áo Đèo Ngoạn Mục",
      "Kính trong suốt đi sương mù buổi sớm"
    ]
  },
  {
    id: "ho-ta-dung-dak-nong-bao-loc",
    title: "Cung Đường Vịnh Hạ Long Trên Cao Nguyên: Bảo Lộc — Hồ Tà Đùng — Gia Nghĩa",
    region: "Tây Nguyên & Nam Bộ",
    distanceKm: 175,
    defaultDays: 2,
    bestMonths: [9, 10, 11, 12, 1, 2, 3],
    bestTimeText: "Tháng 9 – Tháng 3 (Nước hồ đầy, mây sớm)",
    image: "assets/images/cau-dat-da-lat.jpg",
    fallbackImage: FALLBACK_IMGS.highlands,
    excerpt: "TP. Bảo Lộc – Thác Damb'ri – Đèo Lộc Bắc (QL28) – Khu bảo tồn Hồ Tà Đùng – TP. Gia Nghĩa (Đắk Nông).",
    description: "Hành trình khám phá viên ngọc xanh của Tây Nguyên dọc Quốc lộ 28 (~175 km): Băng qua những đồi chè và cà phê Bảo Lộc, vượt đèo Lộc Bắc để đứng từ điểm ngắm toàn cảnh nhìn xuống Hồ Tà Đùng với hơn 40 ốc đảo xanh biếc nhấp nhô giữa mặt nước phẳng lặng.",
    waypoints: [
      { name: "TP. Bảo Lộc (Lâm Đồng)", lat: 11.5478, lng: 107.8075 },
      { name: "Thác Damb'ri", lat: 11.6414, lng: 107.7439 },
      { name: "Đèo Quảng Khê (QL28)", lat: 11.8419, lng: 107.7986 },
      { name: "Vịnh Hồ Tà Đùng (Đắk Glong)", lat: 11.8744, lng: 107.9917 },
      { name: "TP. Gia Nghĩa (Đắk Nông)", lat: 12.0042, lng: 107.6908 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 260000, stayPerNight: 240000, buffer: 220000 },
    specialGear: [
      "Lều cắm trại & túi ngủ (nếu cắm trại săn mây sáng sớm nhìn xuống hồ Tà Đùng)",
      "Áo khoác gió chống sương đêm cao nguyên",
      "Kiểm tra lốp xe kỹ khi chạy đèo QL28"
    ]
  },
  {
    id: "ven-bien-vung-tau-ho-tram-ke-ga",
    title: "Cung Đường Biển Phương Nam: Vũng Tàu — Hồ Tràm — Mũi Kê Gà — Phan Thiết",
    region: "Tây Nguyên & Nam Bộ",
    distanceKm: 195,
    defaultDays: 2,
    bestMonths: [11, 12, 1, 2, 3, 4, 5],
    bestTimeText: "Tháng 11 – Tháng 5 (Biển êm, nắng ấm)",
    image: "assets/images/mui-dien-vung-ro.jpg",
    fallbackImage: FALLBACK_IMGS.coastCentral,
    excerpt: "Vũng Tàu – Đèo Nước Ngọt – Hồ Tràm – Hồ Cốc – Rừng Bình Châu – Hải đăng Kê Gà – TP. Phan Thiết.",
    description: "Cung đường phượt ven biển kinh điển nhất phía Nam (~195 km): Chạy dọc con đường ven biển phẳng lì từ Long Hải qua Hồ Tràm – Hồ Cốc, một bên là rừng tràm nguyên sinh Bình Châu – Phước Bửu, một bên là bãi biển hoang sơ, dẫn thẳng tới ngọn hải đăng cổ nhất Việt Nam tại Mũi Kê Gà.",
    waypoints: [
      { name: "TP. Vũng Tàu", lat: 10.3460, lng: 107.0843 },
      { name: "Đèo Nước Ngọt (Long Hải)", lat: 10.3958, lng: 107.2581 },
      { name: "Biển Hồ Tràm - Hồ Cốc", lat: 10.4872, lng: 107.4561 },
      { name: "Hải Đăng Mũi Kê Gà (Hàm Thuận Nam)", lat: 10.6983, lng: 107.9917 },
      { name: "TP. Phan Thiết", lat: 10.9289, lng: 108.1021 }
    ],
    costConfig: { fuelPerKm: 550, foodPerDay: 280000, stayPerNight: 260000, buffer: 220000 },
    specialGear: [
      "Kính râm, kem chống nắng & khăn ống che nắng gió biển",
      "Áo phản quang nhẹ nếu chạy chiều muộn dọc tuyến ven biển Lộc An",
      "Nước uống giải nhiệt"
    ]
  },
  {
    id: "vong-cung-that-son-bay-nui-an-giang",
    title: "Vòng Cung Thất Sơn Bảy Núi — Rừng Tràm Trà Sư & Cánh Đồng Thốt Nốt (An Giang)",
    region: "Tây Nguyên & Nam Bộ",
    distanceKm: 140,
    defaultDays: 2,
    bestMonths: [9, 10, 11, 12, 3, 4],
    bestTimeText: "Tháng 9–11 (Mùa nước nổi) & Tháng 3–4 (Lúa chín)",
    image: "assets/images/khau-pha-mu-cang-chai.jpg",
    fallbackImage: FALLBACK_IMGS.mekongDelta,
    excerpt: "Châu Đốc – Rừng Tràm Trà Sư – Cánh đồng Thốt Nốt Tà Đảnh – Hồ Tà Pạ – Đỉnh Núi Cấm (Thiên Cấm Sơn).",
    description: "Hành trình độc bản giữa vùng đất Thất Sơn huyền bí của miền Tây Nam Bộ (~140 km): Đi xuồng ba lá xuyên thảm bèo xanh mướt tại Rừng Tràm Trà Sư, ngắm hoàng hôn tím rực dưới những hàng cây thốt nốt cổ thụ Tri Tôn, soi mình bên Hồ Tà Pạ và chinh phục đỉnh Thiên Cấm Sơn — nóc nhà miền Tây.",
    waypoints: [
      { name: "TP. Châu Đốc (An Giang)", lat: 10.7011, lng: 105.1186 },
      { name: "Rừng Tràm Trà Sư (Tịnh Biên)", lat: 10.5736, lng: 105.0519 },
      { name: "Khu du lịch Núi Cấm (Thiên Cấm Sơn)", lat: 10.4958, lng: 104.9964 },
      { name: "Hồ Tà Pạ (Tri Tôn)", lat: 10.4222, lng: 104.9853 },
      { name: "Cánh Đồng Thốt Nốt Tà Đảnh", lat: 10.4589, lng: 105.0417 }
    ],
    costConfig: { fuelPerKm: 550, foodPerDay: 240000, stayPerNight: 200000, buffer: 200000 },
    specialGear: [
      "Nón rộng vành & Áo khoác thoáng mát",
      "Thuốc bôi chống muỗi khi đi xuồng trong Rừng Tràm Trà Sư",
      "Ống kính góc rộng/tele bắt trọn bình minh trên cánh đồng thốt nốt"
    ]
  },
  {
    id: "cung-duong-cuc-nam-tay-nam-bo",
    title: "Cung Đường Cực Nam: Cần Thơ — Bạc Liêu — Đất Mũi Cà Mau",
    region: "Tây Nguyên & Nam Bộ",
    distanceKm: 280,
    defaultDays: 2,
    bestMonths: [12, 1, 2, 3, 4],
    bestTimeText: "Tháng 12 – Tháng 4 (Mùa khô Nam Bộ)",
    image: "assets/images/dat-mui-ca-mau.jpg",
    fallbackImage: FALLBACK_IMGS.mekongDelta,
    excerpt: "Cần Thơ – Sóc Trăng – Bạc Liêu – TP. Cà Mau – Đất Mũi. Rừng đước Năm Căn và cột mốc tọa độ quốc gia GPS 0001.",
    description: "Lộ trình: Cần Thơ – Sóc Trăng – Bạc Liêu – TP. Cà Mau – Đất Mũi (~280 km). Trải nghiệm đi qua những cây cầu dây văng lớn, cánh đồng điện gió Bạc Liêu, rừng đước Năm Căn và chạm tay vào cột mốc tọa độ quốc gia GPS 0001 tại Mũi Cà Mau.",
    waypoints: [
      { name: "TP. Cần Thơ", lat: 10.0452, lng: 105.7469 },
      { name: "TP. Sóc Trăng", lat: 9.6025, lng: 105.9739 },
      { name: "Cánh Đồng Điện Gió Bạc Liêu", lat: 9.2189, lng: 105.7722 },
      { name: "TP. Cà Mau", lat: 9.1768, lng: 105.1524 },
      { name: "Đất Mũi (Cột mốc GPS 0001)", lat: 8.6011, lng: 104.7314 }
    ],
    costConfig: { fuelPerKm: 550, foodPerDay: 250000, stayPerNight: 220000, buffer: 250000 },
    specialGear: [
      "Thuốc xịt chống muỗi & côn trùng rừng đước",
      "Mũ rộng vành & Áo chống nắng",
      "Tiền mặt lẻ qua các trạm phà / đò sông nước"
    ]
  },

  // =========================================================================
  // 4. BỘ SƯU TẬP "TỨ ĐẠI" TRONG GIỚI XÊ DỊCH (7 BỘ CUNG ĐƯỜNG)
  // =========================================================================
  {
    id: "cuc-bac-lung-cu",
    title: "[Tứ Đại Cực] Cực Bắc — Lũng Cú (Đồng Văn, Hà Giang)",
    region: "Bộ Sưu Tập Tứ Đại",
    distanceKm: 180,
    defaultDays: 2,
    bestMonths: [9, 10, 11, 1, 2, 3],
    bestTimeText: "Tháng 9–11 & Tháng 1–3",
    image: "assets/images/lung-cu-hero.jpg",
    fallbackImage: FALLBACK_IMGS.vietnamHero,
    excerpt: "Cột cờ Quốc gia Lũng Cú trên đỉnh núi Rồng và điểm tọa độ thực tế tại bản Séo Lủng sát bờ sông Nho Quế.",
    description: "Nằm ở xã Lũng Cú, huyện Đồng Văn (Hà Giang). Nơi đặt Cột cờ Quốc gia Lũng Cú uy nghiêm trên đỉnh núi Rồng và điểm cực Bắc thực địa tại bản Séo Lủng sát bờ sông Nho Quế biên giới.",
    waypoints: [
      { name: "TP. Hà Giang", lat: 22.8233, lng: 104.9836 },
      { name: "Phố Cổ Đồng Văn", lat: 23.2768, lng: 105.3627 },
      { name: "Cột Cờ Quốc Gia Lũng Cú", lat: 23.3628, lng: 105.3164 },
      { name: "Bản Séo Lủng (Điểm Cực Bắc)", lat: 23.3894, lng: 105.3236 }
    ],
    costConfig: { fuelPerKm: 650, foodPerDay: 250000, stayPerNight: 220000, buffer: 200000 },
    specialGear: [
      "CCCD bản gốc (bắt buộc để khai báo biên phòng khi xuống bản Séo Lủng)",
      "Giày thể thao bám đá tốt",
      "Áo khoác giữ ấm"
    ]
  },
  {
    id: "cuc-nam-mui-ca-mau",
    title: "[Tứ Đại Cực] Cực Nam — Mũi Cà Mau (Ngọc Hiển, Cà Mau)",
    region: "Bộ Sưu Tập Tứ Đại",
    distanceKm: 115,
    defaultDays: 1,
    bestMonths: [12, 1, 2, 3, 4],
    bestTimeText: "Tháng 12 – Tháng 4 (Mùa khô)",
    image: "assets/images/dat-mui-ca-mau.jpg",
    fallbackImage: FALLBACK_IMGS.mekongDelta,
    excerpt: "Cột mốc tọa độ quốc gia GPS 0001 và biểu tượng con tàu hướng ra biển Đông giữa rừng đước Năm Căn.",
    description: "Nằm ở xã Đất Mũi, huyện Ngọc Hiển (Cà Mau), nổi tiếng với cột mốc tọa độ quốc gia GPS 0001 giữa rừng đước Năm Căn — nơi duy nhất trên đất liền Việt Nam thấy mặt trời mọc ở biển Đông và lặn ở biển Tây.",
    waypoints: [
      { name: "TP. Cà Mau", lat: 9.1768, lng: 105.1524 },
      { name: "Thị trấn Năm Căn", lat: 8.7583, lng: 104.9917 },
      { name: "Vườn Quốc Gia Mũi Cà Mau (GPS 0001)", lat: 8.6011, lng: 104.7314 }
    ],
    costConfig: { fuelPerKm: 550, foodPerDay: 250000, stayPerNight: 200000, buffer: 200000 },
    specialGear: [
      "Thuốc xịt côn trùng/muỗi rừng ngập mặn",
      "Nón chống nắng & Kem chống nắng",
      "Sạc dự phòng chụp ảnh check-in mốc GPS 0001"
    ]
  },
  {
    id: "cuc-dong-mui-doi",
    title: "[Tứ Đại Cực] Cực Đông — Mũi Đôi (Bán đảo Hòn Gốm, Khánh Hòa)",
    region: "Bộ Sưu Tập Tứ Đại",
    distanceKm: 100,
    defaultDays: 2,
    bestMonths: [2, 3, 4, 5, 6, 7],
    bestTimeText: "Tháng 2 – Tháng 7 (Biển lặng)",
    image: "assets/images/mui-dien-vung-ro.jpg",
    fallbackImage: FALLBACK_IMGS.coastalCliff,
    excerpt: "Chinh phục chóp inox Cực Đông trên bán đảo Hòn Gốm, vịnh Vân Phong qua hành trình trekking đồi cát và ghềnh đá.",
    description: "Nằm trên bán đảo Hòn Gốm, vịnh Vân Phong (Khánh Hòa). Để chạm chóp inox cực Đông đón ánh bình minh đầu tiên của Tổ quốc, bạn phải trekking vượt đồi cát, băng rừng và nhảy ghềnh đá ven biển.",
    waypoints: [
      { name: "TP. Nha Trang", lat: 12.2388, lng: 109.1967 },
      { name: "Đầm Môn (Vạn Ninh)", lat: 12.6625, lng: 109.3917 },
      { name: "Bãi Rạng", lat: 12.6483, lng: 109.4556 },
      { name: "Chóp Inox Mũi Đôi (Điểm Cực Đông)", lat: 12.6489, lng: 109.4631 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 300000, stayPerNight: 300000, buffer: 400000 },
    specialGear: [
      "Giày leo núi / giày chạy trail bám đá cực tốt (bắt buộc để nhảy ghềnh)",
      "3 lít nước lọc/người & Nước điện giải (đồi cát Đầm Môn rất nắng)",
      "Găng tay leo núi & Đèn pin đội đầu"
    ]
  },
  {
    id: "cuc-tay-a-pa-chai",
    title: "[Tứ Đại Cực] Cực Tây — A Pa Chải (Sín Thầu, Mường Nhé, Điện Biên)",
    region: "Bộ Sưu Tập Tứ Đại",
    distanceKm: 260,
    defaultDays: 3,
    bestMonths: [11, 12, 1, 2, 3, 4],
    bestTimeText: "Tháng 11 – Tháng 4 (Mùa khô)",
    image: "assets/images/binh-lieu-co-lau.jpg",
    fallbackImage: FALLBACK_IMGS.mountainNorth,
    excerpt: "Cột mốc ngã ba biên giới số 0 phân chia 3 nước Việt Nam – Lào – Trung Quốc trên đỉnh Khoan La San.",
    description: "Nằm ở xã Sín Thầu, huyện Mường Nhé (Điện Biên). Nơi có cột mốc ngã ba biên giới số 0 bằng đá hoa cương phân chia 3 nước Việt Nam – Lào – Trung Quốc trên đỉnh núi Khoan La San ở độ cao 1.864m.",
    waypoints: [
      { name: "TP. Điện Biên Phủ", lat: 21.3860, lng: 103.0230 },
      { name: "Mường Nhé", lat: 22.1892, lng: 102.4514 },
      { name: "Đồn Biên Phòng A Pa Chải", lat: 22.4014, lng: 102.1853 },
      { name: "Mốc Số 0 Ngã Ba Biên Giới", lat: 22.4008, lng: 102.1439 }
    ],
    costConfig: { fuelPerKm: 700, foodPerDay: 250000, stayPerNight: 200000, buffer: 350000 },
    specialGear: [
      "CCCD bản gốc (làm thủ tục xin phép Đồn Biên Phòng A Pa Chải)",
      "Giày leo núi chuyên dụng (trekking ~4-5 tiếng cả đi lẫn về)",
      "Bình xăng phụ dự phòng dọc quốc lộ 4H"
    ]
  },
  {
    id: "tu-dai-cung-duong-ven-bien",
    title: "[Bộ Tứ Đại] Tứ Đại Cung Đường Ven Biển Đẹp Nhất Việt Nam",
    region: "Bộ Sưu Tập Tứ Đại",
    distanceKm: 280,
    defaultDays: 3,
    bestMonths: [2, 3, 4, 5, 6, 7, 8],
    bestTimeText: "Tháng 2 – Tháng 8 (Biển xanh, nắng đẹp)",
    image: "assets/images/hero-vinh-hy.jpg",
    fallbackImage: FALLBACK_IMGS.coastCentral,
    excerpt: "Bàu Trắng – Phan Rí Cửa | Cà Ná – Phan Rang | Vĩnh Hy – Bình Tiên | Mũi Điện – Vũng Rô.",
    description: "Tổng hợp 4 cung đường sát biển huyền thoại của dải đất miền Trung: (1) Bàu Trắng – Phan Rí Cửa xuyên đồi cát trắng; (2) Cà Ná – Phan Rang với núi đá và cánh đồng muối; (3) Vĩnh Hy – Bình Tiên ôm sát VQG Núi Chúa & Hang Rái; (4) Mũi Điện – Vũng Rô dưới chân Đèo Cả.",
    waypoints: [
      { name: "Bàu Trắng - Phan Rí Cửa (Bình Thuận)", lat: 11.0694, lng: 108.4231 },
      { name: "Cà Ná - Phan Rang (Ninh Thuận)", lat: 11.3347, lng: 108.8781 },
      { name: "Vĩnh Hy - Bình Tiên (Ninh Thuận)", lat: 11.7178, lng: 109.1967 },
      { name: "Mũi Điện - Vũng Rô (Phú Yên)", lat: 12.8647, lng: 109.4586 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 280000, stayPerNight: 250000, buffer: 300000 },
    specialGear: [
      "Áo chống nắng, găng tay dài & kính râm chống UV",
      "Kem chống nắng & Nước điện giải",
      "Máy ảnh/Flycam bắt trọn góc đường ôm sát vách đá và biển"
    ]
  },
  {
    id: "tu-dai-danh-thac-tay-nguyen",
    title: "[Bộ Tứ Đại] Tứ Đại Danh Thác Tây Nguyên: Dray Nur – Dray Sáp – Gia Long – Pongour",
    region: "Bộ Sưu Tập Tứ Đại",
    distanceKm: 250,
    defaultDays: 2,
    bestMonths: [8, 9, 10, 11, 12],
    bestTimeText: "Tháng 8 – Tháng 12 (Mùa thác đổ hùng vĩ)",
    image: "assets/images/hero-ban-gioc.jpg",
    fallbackImage: FALLBACK_IMGS.waterfall,
    excerpt: "Hành trình chinh phục 4 ngọn thác hùng vĩ bậc nhất đại ngàn Đắk Lắk – Đắk Nông – Lâm Đồng.",
    description: "Bộ tứ danh thác nổi tiếng nhất đại ngàn Tây Nguyên gồm: Thác Dray Nur, Thác Dray Sáp, Thác Gia Long (thuộc cụm thác trên dòng sông Sêrêpốk giữa Đắk Lắk – Đắk Nông) và Thác Pongour (Nam Thiên Đệ Nhất Thác tại Đức Trọng, Lâm Đồng).",
    waypoints: [
      { name: "Thác Dray Nur (Đắk Lắk)", lat: 12.5364, lng: 107.8906 },
      { name: "Thác Dray Sáp (Đắk Nông)", lat: 12.5331, lng: 107.8861 },
      { name: "Thác Gia Long (Đắk Nông)", lat: 12.5186, lng: 107.8989 },
      { name: "Thác Pongour (Đức Trọng, Lâm Đồng)", lat: 11.6889, lng: 108.2683 }
    ],
    costConfig: { fuelPerKm: 600, foodPerDay: 260000, stayPerNight: 240000, buffer: 250000 },
    specialGear: [
      "Giày sandal/giày lội nước chống trơn trên đá rêu",
      "Túi chống nước bảo vệ điện thoại khỏi bụi nước thác",
      "Áo khoác mỏng khi di chuyển lên cao nguyên Lâm Đồng"
    ]
  },
  {
    id: "tu-dai-thac-nuoc-cao-bang",
    title: "[Bộ Tứ Đại] Tứ Đại Thác Nước Cao Bằng: Bản Giốc – Nặm Trá – Cò Là – Thoong Ma",
    region: "Bộ Sưu Tập Tứ Đại",
    distanceKm: 190,
    defaultDays: 2,
    bestMonths: [8, 9, 10, 11],
    bestTimeText: "Tháng 8 – Tháng 11 (Nước thác trong xanh)",
    image: "assets/images/hero-ban-gioc.jpg",
    fallbackImage: FALLBACK_IMGS.waterfall,
    excerpt: "Khám phá 4 ngọn thác tuyệt đẹp của miền non nước Cao Bằng: Bản Giốc, Nặm Trá (Núi Mắt Thần), Cò Là và Thoong Ma.",
    description: "Hành trình kết nối 4 ngọn thác đặc sắc tại Cao Bằng: Thác Bản Giốc hùng vĩ vùng biên giới, thác Nặm Trá ẩn mình giữa thung lũng núi Mắt Thần (Trà Lĩnh), thác Cò Là bình yên bên ruộng lúa Trùng Khánh và thác Thoong Ma hoang sơ.",
    waypoints: [
      { name: "TP. Cao Bằng", lat: 22.6657, lng: 106.2579 },
      { name: "Thác Nặm Trá (Núi Mắt Thần)", lat: 22.7486, lng: 106.3114 },
      { name: "Thác Cò Là (Trùng Khánh)", lat: 22.8153, lng: 106.5889 },
      { name: "Thác Bản Giốc", lat: 22.8553, lng: 106.7225 }
    ],
    costConfig: { fuelPerKm: 650, foodPerDay: 250000, stayPerNight: 220000, buffer: 250000 },
    specialGear: [
      "Giày bám đất tốt (đường vào thác Nặm Trá & Thoong Ma là đường đất/cỏ)",
      "Áo mưa mỏng & Túi chống nước",
      "Bản đồ offline (sóng điện thoại yếu ở một số thung lũng)"
    ]
  }
];
