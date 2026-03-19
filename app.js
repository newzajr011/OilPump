// ===== Oil Pump Station Dashboard App =====

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const brandFilter = document.getElementById("brandFilter");
  const statusFilter = document.getElementById("statusFilter");
  const tableBody = document.getElementById("stationTableBody");
  const stationCount = document.getElementById("stationCount");
  const addStationBtn = document.getElementById("addStationBtn");
  const modal = document.getElementById("stationModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalForm = document.getElementById("stationForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const resetDataBtn = document.getElementById("resetDataBtn");

  // Summary card elements
  const totalStations = document.getElementById("totalStations");
  const openStations = document.getElementById("openStations");
  const closedStations = document.getElementById("closedStations");
  const mostFuel = document.getElementById("mostFuel");
  const leastFuel = document.getElementById("leastFuel");

  let chartInstance = null;
  let editingId = null; // null = adding, number = editing

  // ===== Firebase Setup & Realtime Database =====
  const firebaseConfig = {
    apiKey: "AIzaSyAlAVmjM65uriQpjp5gzb0HOcHStU3mq_8",
    authDomain: "oilpump-2d8c9.firebaseapp.com",
    projectId: "oilpump-2d8c9",
    storageBucket: "oilpump-2d8c9.firebasestorage.app",
    messagingSenderId: "174389559596",
    appId: "1:174389559596:web:3429afd3ada35cfd43ac89",
    databaseURL: "https://oilpump-2d8c9-default-rtdb.asia-southeast1.firebasedatabase.app"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const dbRef = db.ref('stations');

  function loadStations() {
    dbRef.on('value', (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        fuelStations.length = 0; // Clear local array
        for (const key in data) {
          fuelStations.push({ ...data[key], firebaseKey: key });
        }
        
        // Sort by ID to keep table consistent
        fuelStations.sort((a, b) => a.id - b.id);
        
        populateBrandFilter();
        updateDashboard();
      } else {
        // Firebase is empty, seed with initial data from data.js
        console.log("Seeding Firebase with default data...");
        if (typeof fuelStations !== 'undefined' && fuelStations.length > 0) {
          const initialData = [...fuelStations];
          initialData.forEach(station => {
            dbRef.push(station);
          });
        }
      }
    });
  }

  function getNextId() {
    return fuelStations.length > 0 ? Math.max(...fuelStations.map(s => s.id)) + 1 : 1;
  }

  // ===== Initialize =====
  function init() {
    loadStations(); // Starts real-time listener which also updates UI
    attachEvents();
  }

  // ===== Populate Brand Filter =====
  function populateBrandFilter() {
    // Clear existing options except the first "all" option
    while (brandFilter.options.length > 1) {
      brandFilter.remove(1);
    }
    const brands = [...new Set(fuelStations.map(s => s.brand))].sort();
    brands.forEach(brand => {
      const opt = document.createElement("option");
      opt.value = brand;
      opt.textContent = brand;
      brandFilter.appendChild(opt);
    });
  }

  // ===== Attach Events =====
  function attachEvents() {
    searchInput.addEventListener("input", updateDashboard);
    brandFilter.addEventListener("change", updateDashboard);
    statusFilter.addEventListener("change", updateDashboard);
    addStationBtn.addEventListener("click", openAddModal);
    cancelBtn.addEventListener("click", closeModal);
    modalForm.addEventListener("submit", handleFormSubmit);
    resetDataBtn.addEventListener("click", handleResetData);

    // Close modal on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Close modal on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });

    // Delegate click for fuel toggles, edit, delete, and status toggle
    tableBody.addEventListener("click", handleTableClick);
  }

  // ===== Table Click Handler =====
  function handleTableClick(e) {
    const target = e.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const id = parseInt(target.dataset.id);
    const station = fuelStations.find(s => s.id === id);
    if (!station) return;

    switch (action) {
      case "toggle-fuel": {
        const fuelKey = target.dataset.fuel;
        const newValue = !station.fuels[fuelKey];
        if (station.firebaseKey) {
          dbRef.child(`${station.firebaseKey}/fuels`).update({ [fuelKey]: newValue });
          dbRef.child(station.firebaseKey).update({ lastUpdated: formatNow() });
        }
        // Brief flash animation
        target.style.transform = "scale(1.3)";
        setTimeout(() => target.style.transform = "", 200);
        break;
      }
      case "toggle-status": {
        const newStatus = station.status === "open" ? "closed" : "open";
        if (station.firebaseKey) {
          dbRef.child(station.firebaseKey).update({ 
            status: newStatus,
            lastUpdated: formatNow()
          });
        }
        break;
      }
      case "edit": {
        openEditModal(station);
        break;
      }
      case "delete": {
        showConfirm(`ยืนยันลบปั๊ม "${station.name}" ?`, () => {
          if (station.firebaseKey) {
            dbRef.child(station.firebaseKey).remove();
          }
        });
        break;
      }
    }
  }

  // ===== Modal =====
  function openAddModal() {
    editingId = null;
    modalTitle.textContent = "➕ เพิ่มปั๊มน้ำมันใหม่";
    modalForm.reset();
    document.getElementById("formStatus").value = "open";
    modal.classList.add("active");
    document.getElementById("formName").focus();
  }

  function openEditModal(station) {
    editingId = station.id;
    modalTitle.textContent = "✏️ แก้ไขข้อมูลปั๊ม";
    document.getElementById("formName").value = station.name;
    document.getElementById("formBrand").value = station.brand;
    document.getElementById("formAddress").value = station.address;
    document.getElementById("formStatus").value = station.status;
    document.getElementById("fuelDiesel").checked = station.fuels.diesel;
    document.getElementById("fuelBenzine91").checked = station.fuels.benzine91;
    document.getElementById("fuelBenzine95").checked = station.fuels.benzine95;
    document.getElementById("fuelE20").checked = station.fuels.e20;
    document.getElementById("fuelE85").checked = station.fuels.e85;
    modal.classList.add("active");
    document.getElementById("formName").focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    editingId = null;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
      name: document.getElementById("formName").value.trim(),
      brand: document.getElementById("formBrand").value.trim(),
      address: document.getElementById("formAddress").value.trim(),
      status: document.getElementById("formStatus").value,
      fuels: {
        diesel: document.getElementById("fuelDiesel").checked,
        benzine91: document.getElementById("fuelBenzine91").checked,
        benzine95: document.getElementById("fuelBenzine95").checked,
        e20: document.getElementById("fuelE20").checked,
        e85: document.getElementById("fuelE85").checked,
      },
      lastUpdated: formatNow()
    };

    if (editingId !== null) {
      // Edit existing
      const station = fuelStations.find(s => s.id === editingId);
      if (station && station.firebaseKey) {
        dbRef.child(station.firebaseKey).update(data);
      }
    } else {
      // Add new
      data.id = getNextId();
      dbRef.push(data);
    }

    closeModal();
  }

  function handleResetData() {
    showConfirm("ยืนยันรีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น?<br>ข้อมูลที่เพิ่ม/แก้ไขจะหายทั้งหมด", () => {
      // Remove everything from Firebase. Page reload restores standard data into empty DB.
      dbRef.remove().then(() => {
        location.reload();
      });
    });
  }

  // ===== Custom Confirm Modal =====
  function showConfirm(message, onConfirm) {
    const overlay = document.getElementById("confirmModal");
    const msgEl = document.getElementById("confirmMessage");
    const yesBtn = document.getElementById("confirmYes");
    const noBtn = document.getElementById("confirmNo");

    msgEl.innerHTML = message;
    overlay.classList.add("active");

    // Remove old listeners
    const newYes = yesBtn.cloneNode(true);
    const newNo = noBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYes, yesBtn);
    noBtn.parentNode.replaceChild(newNo, noBtn);

    newYes.addEventListener("click", () => {
      overlay.classList.remove("active");
      onConfirm();
    });
    newNo.addEventListener("click", () => {
      overlay.classList.remove("active");
    });
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("active");
    }, { once: true });
  }

  function formatNow() {
    const d = new Date();
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // ===== Filter Stations =====
  function getFilteredStations() {
    const query = searchInput.value.trim().toLowerCase();
    const brand = brandFilter.value;
    const status = statusFilter.value;

    return fuelStations.filter(s => {
      const matchQuery = !query ||
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query);
      const matchBrand = !brand || s.brand === brand;
      const matchStatus = !status || s.status === status;
      return matchQuery && matchBrand && matchStatus;
    });
  }

  // ===== Update Entire Dashboard =====
  function updateDashboard() {
    const filtered = getFilteredStations();
    updateSummaryCards(filtered);
    renderTable(filtered);
    renderChart(filtered);
  }

  // ===== Summary Cards =====
  function updateSummaryCards(stations) {
    const total = stations.length;
    const open = stations.filter(s => s.status === "open").length;
    const closed = total - open;

    // Count fuel availability
    const fuelCounts = {};
    Object.keys(fuelLabels).forEach(key => {
      fuelCounts[key] = stations.filter(s => s.fuels[key]).length;
    });

    // Find most & least available
    const fuelEntries = Object.entries(fuelCounts).filter(([, v]) => v > 0);
    let mostKey = null, leastKey = null;

    if (fuelEntries.length > 0) {
      fuelEntries.sort((a, b) => b[1] - a[1]);
      mostKey = fuelEntries[0][0];
      leastKey = fuelEntries[fuelEntries.length - 1][0];
    }

    // Animate numbers
    animateValue(totalStations, total);
    animateValue(openStations, open);
    animateValue(closedStations, closed);
    mostFuel.textContent = mostKey ? `${fuelLabels[mostKey]} (${fuelCounts[mostKey]})` : "-";
    leastFuel.textContent = leastKey ? `${fuelLabels[leastKey]} (${fuelCounts[leastKey]})` : "-";

    stationCount.textContent = `${total} สถานี`;
  }

  function animateValue(el, target) {
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;

    const duration = 400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(current + (target - current) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ===== Render Table =====
  function renderTable(stations) {
    if (stations.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9">
            <div class="no-results">
              <div class="no-results__icon">🔍</div>
              <div class="no-results__text">ไม่พบปั๊มน้ำมันที่ตรงกับเงื่อนไข</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    tableBody.innerHTML = stations.map((s, i) => {
      const bc = brandColors[s.brand] || { bg: "#1e293b", accent: "#94a3b8" };
      const statusClass = s.status === "open" ? "open" : "closed";
      const statusText = s.status === "open" ? "เปิด" : "ปิด";

      const fuelKeys = ["diesel", "benzine91", "benzine95", "e20", "e85"];
      const fuelCells = fuelKeys.map(key => renderFuelCell(s.id, key, s.fuels[key])).join("");

      return `
        <tr style="animation: fadeInUp 0.3s ease-out ${i * 0.03}s both">
          <td>
            <div class="station-name">
              <span class="station-name__main">${s.name}</span>
              <span class="station-name__address">${s.address}</span>
            </div>
          </td>
          <td>
            <span class="brand-badge" style="background:${bc.bg};color:${bc.accent}">
              ⛽ ${s.brand}
            </span>
          </td>
          <td>
            <span class="status-badge status-badge--${statusClass} clickable" data-action="toggle-status" data-id="${s.id}" title="คลิกเพื่อเปลี่ยนสถานะ">
              <span class="status-badge__dot"></span>
              ${statusText}
            </span>
          </td>
          ${fuelCells}
          <td>
            <div class="action-buttons">
              <button class="action-btn action-btn--edit" data-action="edit" data-id="${s.id}" title="แก้ไข">✏️</button>
              <button class="action-btn action-btn--delete" data-action="delete" data-id="${s.id}" title="ลบ">🗑️</button>
            </div>
          </td>
        </tr>`;
    }).join("");
  }

  function renderFuelCell(stationId, fuelKey, available) {
    const cls = available ? "fuel-icon--available" : "fuel-icon--unavailable";
    const icon = available ? "✓" : "✗";
    const title = available ? "มีจำหน่าย — คลิกเพื่อเปลี่ยน" : "ไม่มีจำหน่าย — คลิกเพื่อเปลี่ยน";
    return `<td><span class="fuel-icon ${cls} clickable" data-action="toggle-fuel" data-id="${stationId}" data-fuel="${fuelKey}" title="${title}">${icon}</span></td>`;
  }

  // ===== Render Chart =====
  function renderChart(stations) {
    const fuelKeys = Object.keys(fuelLabels);
    const chartColors = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"];
    const fuelCounts = fuelKeys.map(key => stations.filter(s => s.fuels[key]).length);

    // Update legend
    const legendContainer = document.getElementById("fuelLegend");
    legendContainer.innerHTML = fuelKeys.map((key, i) => `
      <div class="fuel-legend__item">
        <div class="fuel-legend__left">
          <span class="fuel-legend__dot" style="background:${chartColors[i]}"></span>
          <span class="fuel-legend__name">${fuelLabels[key]}</span>
        </div>
        <span class="fuel-legend__value">${fuelCounts[i]} / ${stations.length}</span>
      </div>
    `).join("");

    // Render chart
    const ctx = document.getElementById("fuelChart").getContext("2d");

    if (chartInstance) {
      chartInstance.data.datasets[0].data = fuelCounts;
      chartInstance.update("none");
      return;
    }

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: fuelKeys.map(k => fuelLabels[k]),
        datasets: [{
          label: "จำนวนปั๊ม",
          data: fuelCounts,
          backgroundColor: chartColors.map(c => c + "40"),
          borderColor: chartColors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.95)",
            titleColor: "#f1f5f9",
            bodyColor: "#94a3b8",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: ctx => `${ctx.parsed.y} สถานี`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#64748b",
              font: { size: 11, family: "'Inter', sans-serif" }
            },
            grid: { display: false },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#64748b",
              font: { size: 11 },
              stepSize: 1
            },
            grid: {
              color: "rgba(255,255,255,0.04)",
              drawBorder: false
            },
            border: { display: false }
          }
        },
        animation: {
          duration: 800,
          easing: "easeOutQuart"
        }
      }
    });
  }

  // ===== Start App =====
  init();
});
