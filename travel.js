const travel = document.querySelector("#travel");
const worldView = { lon: 0, lat: 10, zoom: 1 };
const travelViews = [
  worldView,
  { lon: 12, lat: 51, zoom: 6 },
  { lon: 115, lat: 24, zoom: 4.8 },
  { lon: 26, lat: 28, zoom: 5 }
];
const maxTravelZoom = 100;
let travelLanguage = "zh";
let travelView = { ...worldView };
let travelRegion = 0;
let selectedTravelPlace = null;
let travelCanvas, travelMarkers, travelCard, travelRegionButtons, travelListButtons, travelZoomButtons;
let travelDrag = null;

function travelZoom(zoom, lon = travelView.lon, lat = travelView.lat, region = -1) {
  zoom = Math.max(1, Math.min(maxTravelZoom, zoom));
  travelView = zoom === 1 ? { ...worldView } : {
    lon: Math.max(-180, Math.min(180, lon)),
    lat: Math.max(-82, Math.min(83, lat)),
    zoom
  };
  travelRegion = zoom === 1 ? 0 : region;
  drawTravelMap();
}

function travelScale() {
  return Math.min(travelCanvas.clientWidth / 360, travelCanvas.clientHeight / 180) * travelView.zoom;
}

function showTravelPlace(place, fromPointer) {
  selectedTravelPlace = place;
  updateTravelCard();
  drawTravelMap();
  if (fromPointer && matchMedia("(max-width: 740px)").matches) {
    travelCard.scrollIntoView({ block: "nearest" });
  }
}

function updateTravelCard() {
  const copy = travelCopy[travelLanguage];
  travelCard.querySelector("h3").textContent = selectedTravelPlace?.[travelLanguage] ?? copy.emptyTitle;
  travelCard.querySelector(".travel-card-label").textContent = copy.notes;
  travelCard.querySelector(".travel-card-text").textContent = selectedTravelPlace ? copy.pending : copy.emptyText;
  travelListButtons.forEach((button, index) => {
    button.setAttribute("aria-pressed", travelPlaces[index] === selectedTravelPlace);
  });
}

function drawTravelMap() {
  const width = travelCanvas.clientWidth;
  const height = travelCanvas.clientHeight;
  if (!width || !height) return;
  const deviceScale = Math.min(devicePixelRatio || 1, 2);
  travelCanvas.width = Math.round(width * deviceScale);
  travelCanvas.height = Math.round(height * deviceScale);
  const ctx = travelCanvas.getContext("2d");
  ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
  const scale = travelScale();
  const x = (lon) => width / 2 + (lon - travelView.lon) * scale;
  const y = (lat) => height / 2 + (travelView.lat - lat) * scale;

  ctx.fillStyle = "#e2eced";
  ctx.fillRect(0, 0, width, height);
  ctx.beginPath();
  const gridStep = travelView.zoom < 3 ? 30 : travelView.zoom < 12 ? 10 : travelView.zoom < 35 ? 5 : 1;
  for (let lon = -180; lon <= 180; lon += gridStep) {
    ctx.moveTo(x(lon), y(-90));
    ctx.lineTo(x(lon), y(90));
  }
  for (let lat = -90; lat <= 90; lat += gridStep) {
    ctx.moveTo(x(-180), y(lat));
    ctx.lineTo(x(180), y(lat));
  }
  ctx.strokeStyle = "#bed1d3";
  ctx.stroke();

  ctx.beginPath();
  for (const ring of worldLand) {
    ctx.moveTo(x(ring[0][0]), y(ring[0][1]));
    for (let i = 1; i < ring.length; i++) {
      const [lon, lat] = ring[i];
      ctx.lineTo(x(lon), y(lat));
    }
    ctx.closePath();
  }
  ctx.fillStyle = "#f9f6e9";
  ctx.strokeStyle = "#9aaa9f";
  ctx.fill("evenodd");
  ctx.stroke();

  const clusters = [];
  for (const place of travelPlaces) {
    const px = x(place.lon);
    const py = y(place.lat);
    if (px < 13 || px > width - 13 || py < 14 || py > height - 14) continue;
    const nearby = clusters.find((marker) => Math.hypot(marker.x - px, marker.y - py) < 36);
    if (nearby) {
      const n = nearby.places.length;
      nearby.x = (nearby.x * n + px) / (n + 1);
      nearby.y = (nearby.y * n + py) / (n + 1);
      nearby.places.push(place);
    } else {
      clusters.push({ x: px, y: py, places: [place] });
    }
  }

  const previousMarker = document.activeElement?.closest(".travel-pin")?.dataset.marker;
  travelMarkers.replaceChildren(...clusters.map((marker) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "travel-pin";
    button.style.left = marker.x + "px";
    button.style.top = marker.y + "px";
    button.dataset.marker = marker.places.map((place) => place.id).join(" ");
    const names = marker.places.map((place) => place[travelLanguage]).join(travelLanguage === "zh" ? "、" : ", ");
    button.title = names;
    if (marker.places.length === 1) {
      const place = marker.places[0];
      button.setAttribute("aria-label", names);
      button.setAttribute("aria-pressed", place === selectedTravelPlace);
      button.innerHTML = '<span class="travel-flag" aria-hidden="true"></span>';
      button.addEventListener("click", (event) => showTravelPlace(place, event.detail > 0));
    } else {
      button.classList.add("travel-cluster");
      button.classList.toggle("contains-selection", marker.places.includes(selectedTravelPlace));
      button.textContent = marker.places.length;
      button.setAttribute("aria-label", travelCopy[travelLanguage].group + " · " + names);
      button.addEventListener("click", () => {
        travelZoom(travelView.zoom * 2.5, travelView.lon + (marker.x - width / 2) / scale, travelView.lat - (marker.y - height / 2) / scale);
        const first = [...travelMarkers.children].find((pin) => pin.dataset.marker.split(" ").includes(marker.places[0].id));
        first?.focus({ preventScroll: true });
      });
    }
    return button;
  }));
  if (previousMarker) {
    const replacement = [...travelMarkers.children].find((pin) => pin.dataset.marker === previousMarker);
    replacement?.focus({ preventScroll: true });
  }
  travelRegionButtons.forEach((button, index) => button.setAttribute("aria-pressed", index === travelRegion));
  travelZoomButtons[0].disabled = travelView.zoom >= maxTravelZoom;
  travelZoomButtons[1].disabled = travelView.zoom === 1;
}

function renderTravel(language) {
  travelLanguage = language;
  const copy = travelCopy[language];
  if (!travelCanvas) {
    travel.innerHTML = `
      <header class="travel-header"><div><h2 id="travel-title"></h2><p></p></div><span class="travel-count"></span></header>
      <div class="travel-regions"></div>
      <div class="travel-grid">
        <div class="travel-map">
          <canvas aria-hidden="true"></canvas>
          <div class="travel-markers"></div>
          <div class="travel-zoom"><button type="button">+</button><button type="button">−</button></div>
          <a class="travel-source" href="https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/">Natural Earth</a>
        </div>
        <article class="travel-card" aria-live="polite" aria-atomic="true">
          <p class="travel-card-label"></p><h3></h3><p class="travel-card-text"></p>
        </article>
      </div>
      <h3 class="travel-list-title" id="travel-list-title"></h3><div class="travel-list" role="group" aria-labelledby="travel-list-title"></div>`;

    travelCanvas = travel.querySelector("canvas");
    travelMarkers = travel.querySelector(".travel-markers");
    travelCard = travel.querySelector(".travel-card");
    travelZoomButtons = travel.querySelectorAll(".travel-zoom button");

    travelZoomButtons[0].addEventListener("click", () => travelZoom(travelView.zoom * 1.6));
    travelZoomButtons[1].addEventListener("click", () => travelZoom(travelView.zoom / 1.6));
    travelCanvas.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || travelView.zoom === 1) return;
      travelDrag = { id: event.pointerId, x: event.clientX, y: event.clientY, ...travelView };
      travelCanvas.setPointerCapture(event.pointerId);
      travelCanvas.classList.add("dragging");
    });
    travelCanvas.addEventListener("pointermove", (event) => {
      if (event.pointerId !== travelDrag?.id) return;
      const scale = travelScale();
      travelZoom(travelDrag.zoom, travelDrag.lon - (event.clientX - travelDrag.x) / scale, travelDrag.lat + (event.clientY - travelDrag.y) / scale);
    });
    travelCanvas.addEventListener("lostpointercapture", () => {
      travelDrag = null;
      travelCanvas.classList.remove("dragging");
    });
    new ResizeObserver(drawTravelMap).observe(travelCanvas);
  }

  travel.querySelector("#travel-title").textContent = copy.title;
  travel.querySelector(".travel-header p").textContent = copy.instruction;
  travel.querySelector(".travel-count").textContent = travelPlaces.length + " " + copy.count;
  travel.querySelector(".travel-list-title").textContent = copy.list;
  travelMarkers.setAttribute("role", "group");
  travelMarkers.setAttribute("aria-label", copy.map);
  travelZoomButtons[0].setAttribute("aria-label", copy.zoomIn);
  travelZoomButtons[1].setAttribute("aria-label", copy.zoomOut);

  const regions = travel.querySelector(".travel-regions");
  const list = travel.querySelector(".travel-list");
  regions.innerHTML = copy.regions.map((label) => `<button type="button">${label}</button>`).join("");
  list.innerHTML = travelPlaces.map((place) => `<button type="button">${place[language]}</button>`).join("");
  travelRegionButtons = [...regions.children];
  travelListButtons = [...list.children];
  travelRegionButtons.forEach((button, index) => button.addEventListener("click", () => {
    const view = travelViews[index];
    travelZoom(view.zoom, view.lon, view.lat, index);
  }));
  travelListButtons.forEach((button, index) => button.addEventListener("click", (event) => {
    const place = travelPlaces[index];
    const visible = [...travelMarkers.children].some((pin) => pin.dataset.marker.split(" ").includes(place.id));
    if (!visible) travelZoom(Math.min(travelView.zoom, 6), place.lon, place.lat);
    showTravelPlace(place, event.detail > 0);
  }));

  updateTravelCard();
  drawTravelMap();
}
