let map3d = null;
let routeMarkers = [];
let userGpsMarker = null;
let gpsWatchId = null;
let is3DMode = true; // Mặc định mở bản đồ sẽ có góc nghiêng 3D
let lastRenderedRouteGeoJson = null;

// BẢN ĐỒ TỔNG VIỆT NAM TƯƠNG TÁC TRỰC TIẾP TẠI TẦNG 1 (MASTER OVERLAND ATLAS)
let masterAtlasMap = null;
let masterAtlasLoaded = false;
let masterAtlasMarkers = [];
let masterSelectedStageMarkers = [];
let masterAtlasSelectedId = null;
let masterAtlasPendingRefresh = null;
let masterAtlasCallbacks = { onSelectRoute: null };

async function renderRouteMap(route, customWaypoints = null) {
  const mapEl = document.getElementById("map-canvas");
  const waypoints = customWaypoints || route.waypoints;

  if (typeof maplibregl === "undefined") {
    mapEl.innerHTML = "<p>⚠️ Không tải được thư viện bản đồ. Vui lòng kiểm tra kết nối mạng.</p>";
    return;
  }

  if (!map3d) {
    mapEl.innerHTML = "";
    map3d = new maplibregl.Map({
      container: "map-canvas",
      style: {
        version: 8,
        sources: {
          "base-tiles": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "Tiles &copy; Esri"
          },
          "terrain-dem": {
            type: "raster-dem",
            tiles: [
              "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
            ],
            encoding: "terrarium",
            tileSize: 256,
            maxzoom: 15
          }
        },
        layers: [
          {
            id: "base-layer",
            type: "raster",
            source: "base-tiles"
          }
        ],
        terrain: {
          source: "terrain-dem",
          exaggeration: 1.45
        }
      },
      center: [waypoints[0].lng, waypoints[0].lat],
      zoom: 10,
      pitch: 62,
      bearing: -15,
      maxPitch: 80,
      maxBounds: [
        [100.2, 6.2],
        [118.8, 24.8]
      ]
    });

    map3d.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-left");

    await new Promise((resolve) => map3d.on("load", resolve));

    // Gắn mốc Chủ quyền Biển Đảo Việt Nam (Quần đảo Hoàng Sa & Quần đảo Trường Sa)
    const sovereigntyIslands = [
      {
        name: "🇻🇳 Quần đảo Hoàng Sa",
        sub: "TP. Đà Nẵng — Chủ quyền thiêng liêng của Việt Nam",
        lng: 112.0,
        lat: 16.5
      },
      {
        name: "🇻🇳 Quần đảo Trường Sa",
        sub: "Tỉnh Khánh Hòa — Chủ quyền thiêng liêng của Việt Nam",
        lng: 114.2,
        lat: 10.0
      }
    ];

    sovereigntyIslands.forEach((isl) => {
      const badgeEl = document.createElement("div");
      badgeEl.className = "vn-sovereignty-marker";
      badgeEl.innerHTML = `<span class="vn-flag-star">★</span><span>${isl.name}</span>`;
      new maplibregl.Marker({ element: badgeEl })
        .setLngLat([isl.lng, isl.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 18 }).setHTML(
            `<strong>${isl.name}</strong><br><small>${isl.sub}</small>`
          )
        )
        .addTo(map3d);
    });
  }

  setTimeout(() => {
    map3d.resize();
  }, 150);

  routeMarkers.forEach((m) => m.remove());
  routeMarkers = [];

  const bounds = new maplibregl.LngLatBounds();

  waypoints.forEach((wp, index) => {
    const lngLat = [wp.lng, wp.lat];
    bounds.extend(lngLat);

    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
      `<strong>Chặng ${index + 1}:</strong> ${wp.name}`
    );

    const marker = new maplibregl.Marker({ color: index === 0 ? "#146338" : "#D97706" })
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map3d);

    routeMarkers.push(marker);
  });

  let routeGeoJson = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: waypoints.map((wp) => [wp.lng, wp.lat])
    }
  };

  try {
    const coordsString = waypoints.map((wp) => `${wp.lng},${wp.lat}`).join(";");
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl);
    const data = await res.json();

    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      routeGeoJson.geometry = data.routes[0].geometry;
    }
  } catch {
    // Fallback đường thẳng nếu offline
  }

  lastRenderedRouteGeoJson = routeGeoJson;

  if (map3d.getSource("route-line")) {
    map3d.getSource("route-line").setData(routeGeoJson);
  } else {
    map3d.addSource("route-line", {
      type: "geojson",
      data: routeGeoJson
    });

    map3d.addLayer({
      id: "route-line-outline",
      type: "line",
      source: "route-line",
      paint: {
        "line-color": "#FFFFFF",
        "line-width": 8,
        "line-opacity": 0.9
      }
    });

    map3d.addLayer({
      id: "route-line-layer",
      type: "line",
      source: "route-line",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#146338",
        "line-width": 5
      }
    });

    // Dải ánh sáng vàng chạy dọc theo cung đường 3D
    map3d.addLayer({
      id: "route-line-pulse",
      type: "line",
      source: "route-line",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#FDE68A",
        "line-width": 2.6,
        "line-opacity": 0.92,
        "line-dasharray": [0, 4, 3]
      }
    });

    startTrailFlowAnimation();
  }

  if (!bounds.isEmpty()) {
    map3d.fitBounds(bounds, {
      padding: 50,
      pitch: is3DMode ? 62 : 0,
      duration: 900
    });
  }
}

// Bật tắt địa hình 3D (Được gọi từ app.js)
function toggleTerrain3D() {
  if (!map3d) return false;
  is3DMode = !is3DMode;

  if (is3DMode) {
    map3d.setTerrain({ source: "terrain-dem", exaggeration: 1.45 });
    map3d.easeTo({ pitch: 62, duration: 700 });
  } else {
    map3d.setTerrain(null);
    map3d.easeTo({ pitch: 0, bearing: 0, duration: 700 });
  }
  return is3DMode;
}

// Bay camera 3D trực tiếp tới một chặng cụ thể trong Tầng 3
function flyToStageWaypoint(lat, lng, stageIndex) {
  if (!map3d) return;
  map3d.flyTo({
    center: [lng, lat],
    zoom: 12.8,
    pitch: is3DMode ? 65 : 0,
    bearing: (stageIndex % 2 === 0 ? 18 : -18),
    duration: 1100
  });
  const marker = routeMarkers[stageIndex];
  if (marker && marker.getPopup()) {
    routeMarkers.forEach((m) => {
      if (m.getPopup() && m.getPopup().isOpen()) m.togglePopup();
    });
    marker.togglePopup();
  }
}

// GPS Radar Pulse
function startRealtimeGPS(onUpdateStatus) {
  if (!navigator.geolocation) {
    onUpdateStatus("❌ Trình duyệt của bạn không hỗ trợ định vị GPS.", null);
    return;
  }

  onUpdateStatus("⏳ Đang dò tín hiệu vệ tinh GPS...", null);

  if (gpsWatchId !== null) {
    navigator.geolocation.clearWatch(gpsWatchId);
  }

  gpsWatchId = navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      onUpdateStatus(`📍 Tọa độ thực tại: ${lat.toFixed(5)}, ${lng.toFixed(5)}`, { lat, lng });

      if (map3d && typeof maplibregl !== "undefined") {
        const currentPos = [lng, lat];
        if (!userGpsMarker) {
          const el = document.createElement("div");
          el.className = "gps-pulse-dot";
          userGpsMarker = new maplibregl.Marker({ element: el })
            .setLngLat(currentPos)
            .setPopup(new maplibregl.Popup().setText("📍 Vị trí hiện tại của bạn"))
            .addTo(map3d);
        } else {
          userGpsMarker.setLngLat(currentPos);
        }
        map3d.flyTo({ center: currentPos, zoom: 13, pitch: is3DMode ? 62 : 0 });
      }
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        onUpdateStatus("⚠️ Bạn đã từ chối quyền truy cập vị trí.", null);
      } else {
        onUpdateStatus("⚠️ Không thể xác định vị trí lúc này.", null);
      }
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
  );
}

// =========================================================================
// XUẤT FILE ĐỊNH VỊ GPS CHUẨN QUỐC TẾ (.GPX 1.1) CHO GARMIN / OSMAND / VIETMAP
// =========================================================================
function exportRouteAsGPX(route, waypoints) {
  if (!route) return false;
  const wps = waypoints && waypoints.length > 0 ? waypoints : route.waypoints;
  const escapeXml = (str) =>
    String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const trackCoords =
    lastRenderedRouteGeoJson &&
    lastRenderedRouteGeoJson.geometry &&
    Array.isArray(lastRenderedRouteGeoJson.geometry.coordinates) &&
    lastRenderedRouteGeoJson.geometry.coordinates.length >= 2
      ? lastRenderedRouteGeoJson.geometry.coordinates
      : wps.map((w) => [w.lng, w.lat]);

  const wptXml = wps
    .map(
      (wp, idx) =>
        `  <wpt lat="${wp.lat}" lon="${wp.lng}">\n    <name>Chang ${idx + 1}: ${escapeXml(wp.name)}</name>\n    <desc>${escapeXml(route.title)}</desc>\n  </wpt>`
    )
    .join("\n");

  const trkptXml = trackCoords
    .map((coord) => `      <trkpt lat="${coord[1]}" lon="${coord[0]}"></trkpt>`)
    .join("\n");

  const gpxString = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<gpx version="1.1" creator="Doc Mien Dat Nuoc - Vietnam Overland Atlas" xmlns="http://www.topografix.com/GPX/1/1">`,
    `  <metadata>`,
    `    <name>${escapeXml(route.title)}</name>`,
    `    <desc>${escapeXml(route.excerpt || route.description)}</desc>`,
    `    <time>${new Date().toISOString()}</time>`,
    `  </metadata>`,
    wptXml,
    `  <trk>`,
    `    <name>${escapeXml(route.title)}</name>`,
    `    <trkseg>`,
    trkptXml,
    `    </trkseg>`,
    `  </trk>`,
    `</gpx>`
  ].join("\n");

  const blob = new Blob([gpxString], { type: "application/gpx+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `DocMienDatNuoc-${route.id}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

// =========================================================================
// BẢN ĐỒ TỔNG VIỆT NAM TƯƠNG TÁC TRỰC TIẾP TẠI TẦNG 1 (MASTER OVERLAND ATLAS)
// =========================================================================
const MASTER_REGION_CAMERA = {
  all: { center: [106.8, 16.0], zoom: 4.85, pitch: 18, bearing: 0 },
  "Miền Bắc": { center: [105.0, 21.9], zoom: 6.7, pitch: 35, bearing: -8 },
  "Miền Trung": { center: [108.4, 14.3], zoom: 6.4, pitch: 28, bearing: 6 },
  "Tây Nguyên & Nam Bộ": { center: [106.7, 11.4], zoom: 6.4, pitch: 24, bearing: -5 },
  "Bộ Sưu Tập Tứ Đại": { center: [106.6, 16.1], zoom: 4.95, pitch: 22, bearing: 0 }
};

function getRegionPinColor(regionName) {
  if (regionName === "Miền Bắc") return "#146338";
  if (regionName === "Miền Trung") return "#0284C7";
  if (regionName === "Tây Nguyên & Nam Bộ") return "#D97706";
  return "#DC2626";
}

function initVietnamMasterAtlas(routes, callbacks = {}) {
  const container = document.getElementById("vietnam-master-atlas-map");
  if (!container || typeof maplibregl === "undefined") return;
  masterAtlasCallbacks = { ...masterAtlasCallbacks, ...callbacks };

  if (masterAtlasMap) {
    refreshMasterAtlasPins(routes, "all", [], false);
    return;
  }

  masterAtlasMap = new maplibregl.Map({
    container: "vietnam-master-atlas-map",
    style: {
      version: 8,
      sources: {
        "master-topo": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
          ],
          tileSize: 256,
          attribution: "Tiles &copy; Esri · Dọc Miền Đất Nước"
        }
      },
      layers: [
        {
          id: "master-base-layer",
          type: "raster",
          source: "master-topo"
        }
      ]
    },
    center: MASTER_REGION_CAMERA.all.center,
    zoom: MASTER_REGION_CAMERA.all.zoom,
    pitch: MASTER_REGION_CAMERA.all.pitch,
    maxPitch: 60,
    maxBounds: [
      [99.5, 5.8],
      [119.2, 25.0]
    ]
  });

  masterAtlasMap.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

  masterAtlasMap.on("load", () => {
    masterAtlasLoaded = true;

    // Thêm 2 mốc Chủ quyền Quần đảo Hoàng Sa & Trường Sa (dùng wrapper div an toàn cho MapLibre)
    const sovereigntyList = [
      { name: "🇻🇳 Quần đảo Hoàng Sa", sub: "TP. Đà Nẵng — Việt Nam", lng: 112.0, lat: 16.5 },
      { name: "🇻🇳 Quần đảo Trường Sa", sub: "Tỉnh Khánh Hòa — Việt Nam", lng: 114.2, lat: 10.0 }
    ];
    sovereigntyList.forEach((isl) => {
      const wrap = document.createElement("div");
      wrap.className = "master-pin-anchor";
      const badge = document.createElement("div");
      badge.className = "vn-sovereignty-marker master-sov-marker";
      badge.innerHTML = `<span class="vn-flag-star">★</span><span>${isl.name}</span>`;
      wrap.appendChild(badge);

      new maplibregl.Marker({ element: wrap, anchor: "center" })
        .setLngLat([isl.lng, isl.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 16 }).setHTML(
            `<strong>${isl.name}</strong><br><small>${isl.sub}</small>`
          )
        )
        .addTo(masterAtlasMap);
    });

    // Lớp mạng lưới tuyến đường mảnh cho toàn bộ các cung đang hiển thị
    masterAtlasMap.addSource("master-all-trails", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] }
    });

    masterAtlasMap.addLayer({
      id: "master-all-trails-layer",
      type: "line",
      source: "master-all-trails",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": ["get", "color"],
        "line-width": 2.4,
        "line-opacity": 0.45,
        "line-dasharray": [2, 2]
      }
    });

    // Nguồn vẽ dải cung đường phát sáng nổi bật khi người dùng chọn 1 ghim trên Bản đồ Tổng
    masterAtlasMap.addSource("master-active-trail", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] }
    });

    masterAtlasMap.addLayer({
      id: "master-active-trail-glow",
      type: "line",
      source: "master-active-trail",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#FFFFFF", "line-width": 8.5, "line-opacity": 0.92 }
    });

    masterAtlasMap.addLayer({
      id: "master-active-trail-core",
      type: "line",
      source: "master-active-trail",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#D97706", "line-width": 4.5 }
    });

    // Vệt sáng di chuyển dọc theo cung đường đang chọn trên Bản đồ Tổng Việt Nam
    masterAtlasMap.addLayer({
      id: "master-active-trail-pulse",
      type: "line",
      source: "master-active-trail",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#FEF3C7",
        "line-width": 2.4,
        "line-opacity": 0.95,
        "line-dasharray": [0, 4, 3]
      }
    });

    startTrailFlowAnimation();

    if (masterAtlasPendingRefresh) {
      const p = masterAtlasPendingRefresh;
      masterAtlasPendingRefresh = null;
      refreshMasterAtlasPins(p.routes, p.activeRegion, p.conqueredIds, p.conquestModeOnly);
    } else {
      refreshMasterAtlasPins(routes, "all", [], false);
    }
  });
}

function setMasterAtlasBasemap(layerType) {
  if (!masterAtlasMap || !masterAtlasMap.getSource("master-topo")) return;
  const url =
    layerType === "satellite"
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
  masterAtlasMap.getSource("master-topo").tiles = [url];
  masterAtlasMap.style.sourceCaches["master-topo"].clearTiles();
  masterAtlasMap.style.sourceCaches["master-topo"].update(masterAtlasMap.transform);
}

function clearMasterSelectedTrail() {
  masterAtlasSelectedId = null;
  masterSelectedStageMarkers.forEach((m) => m.remove());
  masterSelectedStageMarkers = [];
  if (masterAtlasMap && masterAtlasMap.getSource("master-active-trail")) {
    masterAtlasMap.getSource("master-active-trail").setData({
      type: "FeatureCollection",
      features: []
    });
  }
}

function refreshMasterAtlasPins(
  routes,
  activeRegion = "all",
  conqueredIds = [],
  conquestModeOnly = false
) {
  if (!masterAtlasMap) return;
  if (!masterAtlasLoaded) {
    masterAtlasPendingRefresh = { routes, activeRegion, conqueredIds, conquestModeOnly };
    return;
  }

  masterAtlasMarkers.forEach((m) => m.remove());
  masterAtlasMarkers = [];

  const visibleRoutes = routes.filter((r) => {
    const matchReg = activeRegion === "all" || r.region === activeRegion;
    const matchConq = !conquestModeOnly || conqueredIds.includes(r.id);
    return matchReg && matchConq;
  });

  // Cập nhật lớp mạng lưới tuyến nối nhẹ cho tất cả các cung đường đang hiện
  if (masterAtlasMap.getSource("master-all-trails")) {
    const trailFeatures = visibleRoutes
      .filter((r) => r.waypoints && r.waypoints.length >= 2)
      .map((r) => ({
        type: "Feature",
        properties: {
          id: r.id,
          color: conqueredIds.includes(r.id) ? "#D97706" : getRegionPinColor(r.region)
        },
        geometry: {
          type: "LineString",
          coordinates: r.waypoints.map((w) => [w.lng, w.lat])
        }
      }));

    masterAtlasMap.getSource("master-all-trails").setData({
      type: "FeatureCollection",
      features: trailFeatures
    });
  }

  // Nếu cung đang chọn không còn nằm trong bộ lọc vùng hiện tại thì xóa tuyến chọn cũ
  if (masterAtlasSelectedId && !visibleRoutes.some((r) => r.id === masterAtlasSelectedId)) {
    clearMasterSelectedTrail();
  }

  visibleRoutes.forEach((route) => {
    if (!route.waypoints || route.waypoints.length === 0) return;
    const midWp = route.waypoints[Math.floor(route.waypoints.length / 2)];
    const isConquered = conqueredIds.includes(route.id);
    const isSelected = masterAtlasSelectedId === route.id;
    const pinColor = isConquered ? "#D97706" : getRegionPinColor(route.region);

    // QUAN TRỌNG: Outer element (.master-pin-anchor) KHÔNG đặt position/transform để MapLibre định vị chính xác 100%!
    const anchorEl = document.createElement("div");
    anchorEl.className = "master-pin-anchor";
    anchorEl.dataset.routeId = route.id;

    const dotEl = document.createElement("div");
    dotEl.className = `master-atlas-pin-dot ${isConquered ? "is-conquered" : ""} ${isSelected ? "is-selected" : ""}`;
    dotEl.style.setProperty("--pin-color", pinColor);
    dotEl.setAttribute("role", "button");
    dotEl.setAttribute("tabindex", "0");
    dotEl.setAttribute("aria-label", route.title);
    dotEl.innerHTML = `
      <span class="pin-core">${isConquered ? "★" : ""}</span>
      <span class="pin-tooltip">${route.title.split("—")[0].trim()} · ${route.distanceKm}km</span>
    `;

    const handleActivatePin = (e) => {
      e.stopPropagation();
      highlightRouteOnMasterAtlas(route);
      if (typeof masterAtlasCallbacks.onSelectRoute === "function") {
        masterAtlasCallbacks.onSelectRoute(route);
      }
    };

    dotEl.addEventListener("click", handleActivatePin);
    dotEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleActivatePin(e);
      }
    });

    anchorEl.appendChild(dotEl);

    const marker = new maplibregl.Marker({ element: anchorEl, anchor: "center" })
      .setLngLat([midWp.lng, midWp.lat])
      .addTo(masterAtlasMap);

    masterAtlasMarkers.push(marker);
  });
}

async function highlightRouteOnMasterAtlas(route) {
  if (!masterAtlasMap || !masterAtlasLoaded || !route || !route.waypoints) return;
  masterAtlasSelectedId = route.id;

  // Cập nhật trạng thái nổi bật cho đúng ghim vừa bấm
  document.querySelectorAll(".master-pin-anchor").forEach((anchor) => {
    const dot = anchor.querySelector(".master-atlas-pin-dot");
    if (dot) {
      dot.classList.toggle("is-selected", anchor.dataset.routeId === route.id);
    }
  });

  // Vẽ ngay tuyến nối qua tất cả các chặng của cung vừa chọn
  const fallbackGeoJson = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: route.waypoints.map((w) => [w.lng, w.lat])
    }
  };

  if (masterAtlasMap.getSource("master-active-trail")) {
    masterAtlasMap.getSource("master-active-trail").setData(fallbackGeoJson);
  }

  // Hiển thị các điểm chặng nhỏ đánh số 1..N dọc cung đang chọn
  masterSelectedStageMarkers.forEach((m) => m.remove());
  masterSelectedStageMarkers = [];

  route.waypoints.forEach((wp, idx) => {
    const stageWrap = document.createElement("div");
    stageWrap.className = "master-pin-anchor";
    const stageDot = document.createElement("div");
    stageDot.className = `master-stage-node ${idx === 0 ? "is-start" : ""}`;
    stageDot.textContent = String(idx + 1);
    stageDot.title = `Chặng ${idx + 1}: ${wp.name}`;
    stageWrap.appendChild(stageDot);

    const m = new maplibregl.Marker({ element: stageWrap, anchor: "center" })
      .setLngLat([wp.lng, wp.lat])
      .addTo(masterAtlasMap);
    masterSelectedStageMarkers.push(m);
  });

  const bounds = new maplibregl.LngLatBounds();
  route.waypoints.forEach((w) => bounds.extend([w.lng, w.lat]));
  if (!bounds.isEmpty()) {
    masterAtlasMap.fitBounds(bounds, {
      padding: { top: 75, bottom: 155, left: 65, right: 65 },
      maxZoom: 9.2,
      pitch: 32,
      duration: 820
    });
  }

  // Nâng cấp tuyến thẳng thành tuyến đường bộ thực tế theo đèo/quốc lộ (OSRM)
  try {
    const coordsStr = route.waypoints.map((w) => `${w.lng},${w.lat}`).join(";");
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (
      masterAtlasSelectedId === route.id &&
      data.code === "Ok" &&
      data.routes &&
      data.routes[0] &&
      masterAtlasMap.getSource("master-active-trail")
    ) {
      masterAtlasMap.getSource("master-active-trail").setData({
        type: "Feature",
        geometry: data.routes[0].geometry
      });
    }
  } catch {
    // Giữ nguyên tuyến nối chặng khi offline
  }
}

function focusMasterAtlasRegion(regionName = "all") {
  if (!masterAtlasMap) return;
  const cam = MASTER_REGION_CAMERA[regionName] || MASTER_REGION_CAMERA.all;
  masterAtlasMap.flyTo({
    center: cam.center,
    zoom: cam.zoom,
    pitch: cam.pitch,
    bearing: cam.bearing,
    duration: 950
  });
}

// =========================================================================
// HIỆU ỨNG ÁNH SÁNG CHẢY DỌC TUYẾN ĐƯỜNG (ANIMATED TRAIL FLOW ON MAPLIBRE)
// =========================================================================
let trailFlowAnimStarted = false;
function startTrailFlowAnimation() {
  if (trailFlowAnimStarted) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  trailFlowAnimStarted = true;

  const dashSequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5]
  ];

  let step = 0;
  let lastTick = 0;

  function tick(ts) {
    if (!document.hidden && ts - lastTick > 75) {
      lastTick = ts;
      const dash = dashSequence[step % dashSequence.length];
      step++;

      if (
        masterAtlasMap &&
        masterAtlasLoaded &&
        masterAtlasSelectedId &&
        masterAtlasMap.getLayer("master-active-trail-pulse")
      ) {
        masterAtlasMap.setPaintProperty("master-active-trail-pulse", "line-dasharray", dash);
      }

      if (map3d && map3d.isStyleLoaded && map3d.isStyleLoaded() && map3d.getLayer("route-line-pulse")) {
        const modalEl = document.getElementById("route-modal");
        if (modalEl && !modalEl.classList.contains("hidden")) {
          map3d.setPaintProperty("route-line-pulse", "line-dasharray", dash);
        }
      }
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}