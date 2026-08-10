/* =========================================================
   script.js - Generator Berita Acara
   Dipisahkan dari file HTML awal agar struktur lebih rapi.
========================================================= */

let qLatar, qTujuan, qPenutup, qKejadian, qPembukaBiaya, qPenutupBiaya;

// 🔥 TARO DI SINI (GLOBAL)
function showDraft(){
  document.getElementById("draftPanel").classList.remove("hidden");
}

function hideDraft(){
  document.getElementById("draftPanel").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", function(){

    loadDropdown(); // 🔥 INI WAJIB


  const toolbar = [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"]
  ];

  qLatar = new Quill("#latar", {
    theme: "snow",
    placeholder: "Isi Latar Belakang...",
    modules: { toolbar }
  });

  qTujuan = new Quill("#tujuan", {
    theme: "snow",
    placeholder: "Isi Maksud & Tujuan...",
    modules: { toolbar }
  });

  qPenutup = new Quill("#penutup", {
    theme: "snow",
    placeholder: "Isi Penutup...",
    modules: { toolbar }
  });

  qKejadian = new Quill("#kejadian", {
    theme: "snow",
    placeholder: "Isi Kronologi / Kejadian...",
    modules: { toolbar }
  });

  qPembukaBiaya = new Quill("#pembukaBiaya", {
  theme: "snow",
  placeholder: "Isi pembuka BA pengajuan biaya...",
  modules: { toolbar }
});

qPenutupBiaya = new Quill("#penutupBiaya", {
  theme: "snow",
  placeholder: "Isi penutup BA pengajuan biaya...",
  modules: { toolbar }
});

});

  let rowToDelete = null;

function hapusRow(btn){
  rowToDelete = btn.closest('tr');
  document.getElementById("confirmBox").style.display = "flex";
}

function confirmYes(){
  if(rowToDelete){
    rowToDelete.remove();

    // rapihin nomor
    let rows = document.querySelectorAll('#materialTable tbody tr');
    rows.forEach((r, i) => {
      r.cells[0].innerText = i + 1;
    });

    showToast("Baris berhasil dihapus!", "#7a0000"); // 🔥 merah gelap
  }

  closeConfirm();
}

function confirmNo(){
  closeConfirm();
}

function closeConfirm(){
  document.getElementById("confirmBox").style.display = "none";
  rowToDelete = null;
}

function getHariTanggalIndo() {
  const hari = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
  ];

  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const today = new Date();

  const namaHari = hari[today.getDay()];
  const tanggal = today.getDate();
  const namaBulan = bulan[today.getMonth()];
  const tahun = today.getFullYear();

  return `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
}

function getKalimatPembukaBA(jenis) {
  const tanggalIndo = getHariTanggalIndo();

  if (jenis === "material") {
    return `Pada hari ini, ${tanggalIndo}, kami yang bertanda tangan di bawah ini mengajukan permintaan kebutuhan material/barang untuk mendukung kebutuhan pekerjaan di lapangan.`;
  }

  if (jenis === "keterangan") {
    return `Pada hari ini, ${tanggalIndo}, kami yang bertanda tangan di bawah ini menerangkan kondisi pekerjaan sebagai dasar administrasi dan tindak lanjut pekerjaan di lapangan.`;
  }

  if (jenis === "adendum") {
    return `Pada hari ini, ${tanggalIndo}, kami yang bertanda tangan di bawah ini menyampaikan adendum/kendala pekerjaan sebagai dasar penyesuaian dan tindak lanjut pekerjaan di lapangan.`;
  }

  return `Pada hari ini, ${tanggalIndo}, kami yang bertanda tangan di bawah ini membuat berita acara sebagai dasar administrasi dan tindak lanjut pekerjaan.`;
}

function toggleTtd4() {
  const jenis = document.getElementById("jenis").value;
  const useTtd4 = document.getElementById("useTtd4").checked;

  const pihak4Box = document.getElementById("pihak4Box");
  const ttd4Box = document.getElementById("ttd4Box");

  if (pihak4Box) {
    pihak4Box.style.display = useTtd4 ? "flex" : "none";
  }

  if (ttd4Box) {
    ttd4Box.style.display = useTtd4 ? "block" : "none";
  }

  document.getElementById("roleLabel1").innerText = "DIBUAT";

  if (jenis === "biaya") {
    if (useTtd4) {
      document.getElementById("roleLabel2").innerText = "DIVERIFIKASI";
      document.getElementById("roleLabel3").innerText = "DIKETAHUI";
      document.getElementById("roleLabel4").innerText = "DISETUJUI";
    } else {
      document.getElementById("roleLabel2").innerText = "DIVERIFIKASI";
      document.getElementById("roleLabel3").innerText = "DISETUJUI";
    }

    return;
  }

  if (useTtd4) {
    document.getElementById("roleLabel2").innerText = "DIPERIKSA";
    document.getElementById("roleLabel3").innerText = "DIKETAHUI";
    document.getElementById("roleLabel4").innerText = "DISETUJUI";
  } else {
    document.getElementById("roleLabel2").innerText = "DIKETAHUI";
    document.getElementById("roleLabel3").innerText = "DISETUJUI";
  }
}

function renderTtdBox(title, ttdSrc, waktu, nama, jabatan) {
  return `
    <div class="ttd-box">
      <div class="ttd-header">
        <p class="ttd-title">${title}</p>
      </div>

      ${ttdSrc ? `
        <div class="signature-box">
          <div class="signed-label">✔ Signed by:</div>
          <div class="signature">
            <img src="${ttdSrc}">
          </div>
        </div>
      ` : `
        <div class="signature-placeholder"></div>
      `}

      <div class="ttd-time">${waktu}</div>

      <p class="nama-ttd">${nama}</p>
      <p class="jabatan-ttd">${jabatan}</p>
    </div>
  `;
}

  function generate(){
  let loading = document.getElementById("loadingOverlay");
  loading.style.display = "flex";

  setTimeout(()=>{
    document.getElementById('output').innerHTML = page1 + page2;
    loading.style.display = "none";
    scrollToPreview();
  }, 500);
}

function fitFirstPage() {
  const page = document.getElementById("pageSurat");
  if (!page) return;

  page.classList.remove("fit-tight", "fit-very-tight");

  const maxHeight = page.clientHeight;
  const realHeight = page.scrollHeight;

  if (realHeight > maxHeight) {
    page.classList.add("fit-tight");
  }

  setTimeout(() => {
    if (page.scrollHeight > page.clientHeight) {
      page.classList.add("fit-very-tight");
    }
  }, 50);
}

function getTanggalJamIndo(){
  let now = new Date();

  let tgl = String(now.getDate()).padStart(2,'0');
  let bln = String(now.getMonth()+1).padStart(2,'0');
  let thn = now.getFullYear();

  let jam = String(now.getHours()).padStart(2,'0');
  let menit = String(now.getMinutes()).padStart(2,'0');
  let detik = String(now.getSeconds()).padStart(2,'0');

  return `${tgl}-${bln}-${thn} ${jam}:${menit}:${detik}`;
}

function saveDraft(){
let draft = {
  jenis: document.getElementById('jenis').value,
  useTtd4: document.getElementById("useTtd4").checked,

  nama1: $("#nama1").val(),
  nama2: $("#nama2").val(),
  nama3: $("#nama3").val(),
  nama4: $("#nama4").val(),

  latar: qLatar.root.innerHTML,
  tujuan: qTujuan.root.innerHTML,
  kejadian: qKejadian ? qKejadian.root.innerHTML : '',
  penutup: qPenutup.root.innerHTML
};

  localStorage.setItem("draftBA", JSON.stringify(draft));
  showToast("Draft disimpan!", "success");
}

function loadDraft(){
  let draft = JSON.parse(localStorage.getItem("draftBA"));

  if(!draft){
    showToast("Tidak ada draft!", "error");
    return;
  }

  document.getElementById('jenis').value = draft.jenis;
  toggleJenis();

  document.getElementById('jenis').value = draft.jenis;

const jenisSelect = document.getElementById("jenisSelect");
if (jenisSelect) {
  jenisSelect.value = draft.jenis;
  setJenisDropdown(draft.jenis);
} else {
  toggleJenis();
}

  document.getElementById("useTtd4").checked = !!draft.useTtd4;
toggleTtd4();

  // 🔥 INI BARU TEMPATNYA
  $("#nama1").val(draft.nama1).trigger("change");
  $("#nama2").val(draft.nama2).trigger("change");
  $("#nama3").val(draft.nama3).trigger("change");
  $("#nama4").val(draft.nama4).trigger("change");

  qLatar.root.innerHTML = draft.latar;
  qTujuan.root.innerHTML = draft.tujuan;
  if(qKejadian) qKejadian.root.innerHTML = draft.kejadian;
  qPenutup.root.innerHTML = draft.penutup;

  showToast("Draft dimuat!", "success");
}

window.addEventListener("load", () => {
  loadDraft();
});

function clearDraft(){
  localStorage.removeItem("draftBA");
  showToast("Draft dihapus!", "warning");
}



function toggleSidebar(){
  let sidebar = document.getElementById("sidebar");
  let main = document.getElementById("mainPage");

  sidebar.classList.toggle("collapsed");
  main.classList.toggle("full");
}

function setJenisDropdown(value){
  document.getElementById("jenis").value = value;

  const desc = document.getElementById("jenisDesc");

  const deskripsi = {
    material: "Untuk permintaan barang/material project.",
    keterangan: "Untuk membuat keterangan kondisi pekerjaan di lapangan.",
    adendum: "Untuk perubahan, kendala, atau penyesuaian pekerjaan.",
    biaya: "BA pengajuan biaya dengan nomor, pembuka, penutup, dan tabel biaya manual.",
    urugan: "BA urugan dengan rincian rit, nota, rekening, dan dokumentasi foto per rit."
  };

  if (desc) {
    desc.innerText = deskripsi[value] || "";
  }

  toggleJenis();
}

/* scroll helper */
function scrollToForm(){
  document.querySelector(".form-panel").scrollIntoView({behavior:"smooth"});
}

function scrollToPreview(){
  document.querySelector(".preview-panel").scrollIntoView({behavior:"smooth"});
}

function showToast(msg, type="danger"){
  let toast = document.getElementById("toast");
  toast.innerText = msg;

  // warna berdasarkan type
  let bg = {
    danger: "linear-gradient(135deg, #ff6b6b, #d62828)",
    success: "linear-gradient(135deg, #4CAF50, #2e7d32)",
    warning: "linear-gradient(135deg, #ffb74d, #f57c00)"
  };

  toast.style.background = bg[type] || bg.danger;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translate(-50%, 0)";
  }, 10);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translate(-50%, -20px)";
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 2000);
}

 document.addEventListener("DOMContentLoaded", function() {

  const loginForm = document.getElementById("loginForm");
  const loginPage = document.getElementById("loginPage");
  const mainPage = document.getElementById("mainPage");

  loginForm.addEventListener("submit", function(e){
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

if(user === "admin" && pass === "admin123"){

  let loading = document.getElementById("loadingOverlay");
  loading.style.display = "flex";

  setTimeout(() => {
    loginPage.style.display = "none";
    mainPage.style.display = "block";

    // sidebar muncul
    document.getElementById("sidebar").style.display = "block";

    // 🔥 tampilkan draft panel
    showDraft();

    loading.style.display = "none";
    showToast("Login berhasil!", "success");
  }, 1000);



} else {
  showToast("Username / Password salah!", "#dc3545");
}
  });

const jenisSelect = document.getElementById("jenisSelect");
if (jenisSelect) {
  setJenisDropdown(jenisSelect.value);
}

});

function logout(){
  let loading = document.getElementById("loadingOverlay");
  loading.style.display = "flex";

  setTimeout(() => {
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("loginPage").style.display = "flex";

    // sidebar hilang
    document.getElementById("sidebar").style.display = "none";

    // 🔥 sembunyikan draft panel
    hideDraft();

    loading.style.display = "none";
    showToast("Berhasil logout!", "success");
  }, 1000);

  // reset input login
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

function toggleJenis(){
  let j = document.getElementById('jenis').value;

  const standardContentBox = document.getElementById('standardContentBox');
  const materialBox = document.getElementById('materialBox');
  const adendumBox = document.getElementById('adendumBox');
  const biayaBox = document.getElementById('biayaBox');
  const uruganBox = document.getElementById('uruganBox');

  const pihakCard = document.getElementById('pihakCard');
  const standardTtdLampiranBox = document.getElementById('standardTtdLampiranBox');

  // Form isi surat standar disembunyikan untuk BA Biaya dan BA Urugan
  if (standardContentBox) {
    standardContentBox.style.display = (j === 'biaya' || j === 'urugan') ? 'none' : 'block';
  }

  if (materialBox) {
    materialBox.style.display = j === 'material' ? 'block' : 'none';
  }

  if (adendumBox) {
    adendumBox.style.display = j === 'adendum' ? 'block' : 'none';
  }

  if (biayaBox) {
    biayaBox.style.display = j === 'biaya' ? 'block' : 'none';
  }

  if (uruganBox) {
    uruganBox.style.display = j === 'urugan' ? 'block' : 'none';
  }

  // Khusus BA Urugan: hide pihak, TTD, dan lampiran umum
  if (pihakCard) {
    pihakCard.style.display = j === 'urugan' ? 'none' : 'block';
  }

  if (standardTtdLampiranBox) {
    standardTtdLampiranBox.style.display = j === 'urugan' ? 'none' : 'block';
  }

  // TTD hanya diproses untuk BA selain Urugan
  if (j !== 'urugan') {
    toggleTtd4();
  }
}

function addRow(){
  let tbody = document.querySelector('#materialTable tbody');
  let rows = tbody.querySelectorAll('tr').length;

  if(rows >= 30){
    showToast("Maksimal 30 material!", "warning");
    return;
  }

  let count = rows + 1;

  let row = `
  <tr>
    <td>${count}</td>
    <td><input class='form-control'></td>
    <td><input class='form-control'></td>
    <td><input class='form-control'></td>
    <td><input class='form-control'></td>
    <td style="text-align:center;">
      <button onclick="hapusRow(this)" class="btn btn-sm btn-danger">✕</button>
    </td>
  </tr>`;

  tbody.insertAdjacentHTML('beforeend', row);
}

function addBiayaRow(){
  let tbody = document.querySelector('#biayaTable tbody');
  let rows = tbody.querySelectorAll('tr').length;
  let count = rows + 1;

  let row = `
    <tr>
      <td class="center">${count}</td>
      <td><input class="form-control biaya-item"></td>
      <td><input class="form-control biaya-qty" type="number" oninput="hitungBiayaRow(this)"></td>
      <td><input class="form-control biaya-satuan"></td>
      <td><input class="form-control biaya-harga" type="number" oninput="hitungBiayaRow(this)"></td>
      <td><input class="form-control biaya-total" readonly></td>
      <td style="text-align:center;">
        <button onclick="hapusBiayaRow(this)" class="btn btn-sm btn-danger">✕</button>
      </td>
    </tr>
  `;

  tbody.insertAdjacentHTML('beforeend', row);
}

function hapusBiayaRow(btn){
  btn.closest('tr').remove();

  let rows = document.querySelectorAll('#biayaTable tbody tr');
  rows.forEach((r, i) => {
    r.cells[0].innerText = i + 1;
  });
}

function hitungBiayaRow(el){
  let row = el.closest('tr');

  let qty = Number(row.querySelector('.biaya-qty').value || 0);
  let harga = Number(row.querySelector('.biaya-harga').value || 0);
  let total = qty * harga;

  row.querySelector('.biaya-total').value = total;
}

function formatRupiah(angka){
  angka = Number(angka || 0);
  return "Rp. " + angka.toLocaleString("id-ID");
}



function buildBiayaTable(){
  let rows = document.querySelectorAll('#biayaTable tbody tr');
  let totalAll = 0;

  let html = `
    <table class="table table-bordered tabel-biaya-ba">
      <thead>
        <tr>
          <th style="width:45px;">No</th>
          <th>Item</th>
          <th style="width:70px;">Qty</th>
          <th style="width:90px;">Satuan</th>
          <th style="width:130px;">Harga Satuan</th>
          <th style="width:130px;">Harga Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach((r, i) => {
    let item = r.querySelector('.biaya-item').value || "";
    let qty = Number(r.querySelector('.biaya-qty').value || 0);
    let satuan = r.querySelector('.biaya-satuan').value || "";
    let harga = Number(r.querySelector('.biaya-harga').value || 0);
    let total = qty * harga;

    totalAll += total;

    html += `
      <tr>
        <td class="center">${i + 1}</td>
        <td>${item}</td>
        <td class="center">${qty}</td>
        <td class="center">${satuan}</td>
        <td class="right">${formatRupiah(harga)}</td>
        <td class="right">${formatRupiah(total)}</td>
      </tr>
    `;
  });

  html += `
      <tr class="grand-total-row">
        <td colspan="5" class="center"><b>Grand Total</b></td>
        <td class="right"><b>${formatRupiah(totalAll)}</b></td>
      </tr>
    </tbody>
  </table>
  `;

  return html;
}

let uruganRitFiles = [];
let uruganNotaFiles = [];

function addBlokUrugan(){
  const tbody = document.querySelector("#blokUruganTable tbody");
  const count = tbody.querySelectorAll("tr").length + 1;

  const row = `
    <tr>
      <td class="center">${count}</td>
      <td>
        <input class="form-control blok-urugan-input" placeholder="Contoh: D21">
      </td>
      <td style="text-align:center;">
        <button type="button" onclick="hapusBlokUrugan(this)" class="btn btn-sm btn-danger">✕</button>
      </td>
    </tr>
  `;

  tbody.insertAdjacentHTML("beforeend", row);
}

function hapusBlokUrugan(btn){
  btn.closest("tr").remove();

  document.querySelectorAll("#blokUruganTable tbody tr").forEach((row, i) => {
    row.cells[0].innerText = i + 1;
  });
}

function getBlokUruganText(){
  const inputs = document.querySelectorAll(".blok-urugan-input");
  const list = [];

  inputs.forEach(input => {
    if (input.value.trim()) {
      list.push(input.value.trim());
    }
  });

  return list.join(", ");
}

function hitungTotalUrugan(){
  const jumlah = Number(document.getElementById("jumlahRitUrugan").value || 0);
  const harga = Number(document.getElementById("hargaRitUrugan").value || 0);
  const total = jumlah * harga;

  document.getElementById("totalUrugan").value = formatRupiah(total);

  renderNotaUruganPreview();
}

function formatAngkaUrugan(angka){
  angka = Number(angka || 0);
  return angka.toLocaleString("id-ID");
}

function addRitUrugan(){
  uruganRitFiles.push([]);

  renderRitUruganForm();

  const jumlahRit = document.getElementById("jumlahRitUrugan");

  if (!jumlahRit.value || Number(jumlahRit.value) < uruganRitFiles.length) {
    jumlahRit.value = uruganRitFiles.length;
  }

  hitungTotalUrugan();
  renderNotaUruganPreview();

  showToast("Dokumentasi rit berhasil ditambahkan!", "success");
}

function hapusRitUrugan(index){
  uruganRitFiles.splice(index, 1);

  renderRitUruganForm();

  const jumlahRit = document.getElementById("jumlahRitUrugan");

  if (Number(jumlahRit.value) > uruganRitFiles.length) {
    jumlahRit.value = uruganRitFiles.length;
  }

  hitungTotalUrugan();
  renderNotaUruganPreview();

  showToast("Dokumentasi rit berhasil dihapus!", "warning");
}

function renderRitUruganForm(){
  const container = document.getElementById("ritUruganContainer");
  container.innerHTML = "";

  uruganRitFiles.forEach((files, index) => {
    const no = index + 1;

    let previewHTML = "";

    files.forEach((file, i) => {
      const url = URL.createObjectURL(file);

      previewHTML += `
        <div class="urugan-preview-item">
          <img src="${url}">
          <span>Foto ${i + 1}</span>
          <button type="button" onclick="hapusFotoUrugan(${index}, ${i})" class="urugan-remove-photo">×</button>
        </div>
      `;
    });

    container.innerHTML += `
      <div class="urugan-rit-card">
        <div class="urugan-rit-head">
          <strong>Dokumentasi Rit ${no}</strong>
          <button type="button" onclick="hapusRitUrugan(${index})" class="btn btn-sm btn-danger">Hapus Rit</button>
        </div>

        <div class="urugan-drop-area"
          onclick="document.getElementById('inputRitUrugan${index}').click()"
          ondragover="dragUruganOver(event, this)"
          ondragleave="dragUruganLeave(this)"
          ondrop="dropUruganFiles(event, ${index}, this)">

          <div class="urugan-drop-icon">📷</div>
          <div class="urugan-drop-title">Drag & Drop Foto Rit ${no}</div>
          <div class="urugan-drop-desc">atau klik untuk upload dokumentasi</div>
          <div class="urugan-drop-note">Maksimal 6 foto per rit</div>

          <input type="file" id="inputRitUrugan${index}" hidden multiple accept="image/*"
            onchange="handleUruganRitFiles(event, ${index})">
        </div>

        <div class="urugan-preview-grid">
          ${previewHTML || `<div class="urugan-preview-empty">Belum ada foto untuk Rit ${no}</div>`}
        </div>
      </div>
    `;
  });
}

function handleUruganRitFiles(event, index){
  const files = Array.from(event.target.files);
  tambahFotoUrugan(index, files);

  // reset input supaya file yang sama bisa dipilih ulang
  event.target.value = "";
}

function tambahFotoUrugan(index, files){
  let imageFiles = files.filter(file => file.type.startsWith("image/"));

  if (!uruganRitFiles[index]) {
    uruganRitFiles[index] = [];
  }

  let currentFiles = uruganRitFiles[index];
  let availableSlot = 6 - currentFiles.length;

  if (availableSlot <= 0) {
    showToast("Foto Rit ini sudah maksimal 6 foto!", "warning");
    return;
  }

  if (imageFiles.length > availableSlot) {
    showToast(`Maksimal 6 foto per rit. Hanya ${availableSlot} foto yang ditambahkan.`, "warning");
    imageFiles = imageFiles.slice(0, availableSlot);
  }

  uruganRitFiles[index] = currentFiles.concat(imageFiles);
  renderRitUruganForm();
}

function dragUruganOver(event, el){
  event.preventDefault();
  el.classList.add("dragover");
}

function dragUruganLeave(el){
  el.classList.remove("dragover");
}

function dropUruganFiles(event, index, el){
  event.preventDefault();
  el.classList.remove("dragover");

  const files = Array.from(event.dataTransfer.files);
  tambahFotoUrugan(index, files);
}

function hapusFotoUrugan(ritIndex, fotoIndex){
  if (!uruganRitFiles[ritIndex]) return;

  uruganRitFiles[ritIndex].splice(fotoIndex, 1);
  renderRitUruganForm();
}

function formatTanggalUrugan(){
  const hari = ["MINGGU", "SENIN", "SELASA", "RABU", "KAMIS", "JUMAT", "SABTU"];
  const bulan = [
    "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
    "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
  ];

  const d = new Date();

  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function buildUruganPhotoGrid(files, ritNumber){
  if (!files || files.length === 0) {
    return `
      <div class="urugan-empty-photo">
        Belum ada dokumentasi untuk Rit ${ritNumber}
      </div>
    `;
  }

  let html = `<div class="urugan-photo-grid">`;

  files.slice(0, 6).forEach((file, i) => {
    const url = URL.createObjectURL(file);

    html += `
      <div class="urugan-photo-item">
        <img src="${url}">
        <div class="urugan-photo-caption">Rit ${ritNumber} - Foto ${i + 1}</div>
      </div>
    `;
  });

  html += `</div>`;

  return html;
}

function buildUruganNotaGrid(files, startIndex = 0){
  if (!files || files.length === 0) {
    return `
      <div class="urugan-empty-photo">
        Belum ada dokumentasi nota urugan
      </div>
    `;
  }

  let html = `<div class="urugan-photo-grid urugan-nota-grid">`;

  files.slice(0, 6).forEach((file, i) => {
    const url = URL.createObjectURL(file);
    const nomorNota = startIndex + i + 1;

    html += `
      <div class="urugan-photo-item">
        <img src="${url}">
        <div class="urugan-photo-caption">Nota Rit ${nomorNota}</div>
      </div>
    `;
  });

  html += `</div>`;

  return html;
}

function buildUruganPages(kop, foot){
  const nomor = document.getElementById("nomorUrugan").value || "";
  const project = document.getElementById("projectUrugan").value || "";
  const blok = getBlokUruganText();

  const jumlahRit = Number(document.getElementById("jumlahRitUrugan").value || 0);
  const hargaRit = Number(document.getElementById("hargaRitUrugan").value || 0);
  const total = jumlahRit * hargaRit;

  const atasNama = document.getElementById("atasNamaUrugan").value || "";
  const bank = document.getElementById("bankUrugan").value || "";
  const rekening = document.getElementById("rekeningUrugan").value || "";

  const title = `URUGAN ${project} ${blok}`.trim();

  function headerUrugan(sectionTitle){
    return `
      ${kop()}

      <div class="urugan-header">
        <h4 class="urugan-title">${title || "URUGAN"}</h4>

        ${nomor ? `<div class="urugan-nomor">Nomor : ${nomor}</div>` : ""}

        <div class="urugan-date">${formatTanggalUrugan()}</div>

        <div class="urugan-price">
          ${jumlahRit || 0} RIT
          ${formatAngkaUrugan(hargaRit)} x ${jumlahRit || 0}
          = ${formatAngkaUrugan(total)}
        </div>

        <div class="urugan-rekening">
          ${atasNama || "-"} ${bank ? `- ${bank}` : ""} ${rekening ? `- ${rekening}` : ""}
        </div>

        <div class="urugan-rit-title">
          ${sectionTitle}
        </div>
      </div>
    `;
  }

  let html = "";

  // ===== HALAMAN NOTA DI ATAS SEBELUM FOTO RIT =====
  if (uruganNotaFiles.length > 0) {
    for (let start = 0; start < uruganNotaFiles.length; start += 6) {
      const chunkNota = uruganNotaFiles.slice(start, start + 6);

      html += `
        <div class="page page-urugan page-urugan-nota">
          ${headerUrugan("DOKUMENTASI NOTA URUGAN")}

          <div class="urugan-body">
            ${buildUruganNotaGrid(chunkNota, start)}
          </div>

          ${foot()}
        </div>
      `;
    }
  }

  // ===== HALAMAN FOTO RIT SETELAH NOTA =====
  let ritList = uruganRitFiles.length > 0 ? uruganRitFiles : [[]];

  ritList.forEach((files, index) => {
    const ritNumber = index + 1;

    html += `
      <div class="page page-urugan">
        ${headerUrugan(`DOKUMENTASI RIT ${ritNumber}`)}

        <div class="urugan-body">
          ${buildUruganPhotoGrid(files, ritNumber)}
        </div>

        ${foot()}
      </div>
    `;
  });

  return html;
}

function buildMaterialTable(rowsData) {
  if (!rowsData || rowsData.length === 0) return "";

  let table = `
    <table class='table table-bordered tabel-material'>
      <thead>
        <tr>
          <th style="width:40px;">No</th>
          <th>Nama Material/Barang</th>
          <th style="width:170px;">Spesifikasi / Ukuran</th>
          <th style="width:80px;">Qty</th>
          <th style="width:80px;">Satuan</th>
        </tr>
      </thead>
      <tbody>
  `;

  rowsData.forEach((item) => {
    table += `
      <tr>
        <td class="center">${item.no}</td>
        <td>${item.nama}</td>
        <td class="center">${item.spesifikasi}</td>
        <td class="center">${item.qty}</td>
        <td class="center">${item.satuan}</td>
      </tr>
    `;
  });

  table += `
      </tbody>
    </table>
  `;

  return table;
}

function buildMaterialSeparatePages(rowsData, kop, foot, nomor) {
  if (!rowsData || rowsData.length === 0) return "";

  let html = "";

  for (let start = 0; start < rowsData.length; start += MATERIAL_PAGE_LIMIT) {
    const chunk = rowsData.slice(start, start + MATERIAL_PAGE_LIMIT);

    html += `
      <div class="page page-material-rincian">
        ${kop()}

        <h4 class="title-ba">BERITA ACARA</h4>
        <p class="nomor-ba">${nomor}</p>

        <div class="ba-body">
          <div class="content-flex content-area">
            <h5 class="material-page-title">Rincian Kebutuhan Material / Barang</h5>
            ${buildMaterialTable(chunk)}
          </div>
        </div>

        ${foot()}
      </div>
    `;
  }

  return html;
}

function addBiayaRow(){
  let tbody = document.querySelector('#biayaTable tbody');
  let rows = tbody.querySelectorAll('tr').length;

  let count = rows + 1;

  let row = `
    <tr>
      <td class="center">${count}</td>
      <td><input class="form-control biaya-item"></td>
      <td><input class="form-control biaya-qty" type="number" oninput="hitungBiayaRow(this)"></td>
      <td><input class="form-control biaya-satuan"></td>
      <td><input class="form-control biaya-harga" type="number" oninput="hitungBiayaRow(this)"></td>
      <td><input class="form-control biaya-total" readonly></td>
      <td style="text-align:center;">
        <button onclick="hapusBiayaRow(this)" class="btn btn-sm btn-danger">✕</button>
      </td>
    </tr>
  `;

  tbody.insertAdjacentHTML('beforeend', row);
}

function hapusBiayaRow(btn){
  btn.closest('tr').remove();

  let rows = document.querySelectorAll('#biayaTable tbody tr');
  rows.forEach((r, i) => {
    r.cells[0].innerText = i + 1;
  });
}

function hitungBiayaRow(el){
  let row = el.closest('tr');

  let qty = Number(row.querySelector('.biaya-qty').value || 0);
  let harga = Number(row.querySelector('.biaya-harga').value || 0);
  let total = qty * harga;

  row.querySelector('.biaya-total').value = total;
}

function formatRupiah(angka){
  angka = Number(angka || 0);
  return "Rp. " + angka.toLocaleString("id-ID");
}

function buildBiayaTable(){
  let rows = document.querySelectorAll('#biayaTable tbody tr');
  let totalAll = 0;

  let html = `
    <table class="table table-bordered tabel-biaya-ba">
      <thead>
        <tr>
          <th style="width:45px;">No</th>
          <th>Item</th>
          <th style="width:70px;">Qty</th>
          <th style="width:90px;">Satuan</th>
          <th style="width:130px;">Harga Satuan</th>
          <th style="width:130px;">Harga Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  rows.forEach((r, i) => {
    let item = r.querySelector('.biaya-item').value || "";
    let qty = Number(r.querySelector('.biaya-qty').value || 0);
    let satuan = r.querySelector('.biaya-satuan').value || "";
    let harga = Number(r.querySelector('.biaya-harga').value || 0);
    let total = qty * harga;

    totalAll += total;

    html += `
      <tr>
        <td class="center">${i + 1}</td>
        <td>${item}</td>
        <td class="center">${qty}</td>
        <td class="center">${satuan}</td>
        <td class="right">${formatRupiah(harga)}</td>
        <td class="right">${formatRupiah(total)}</td>
      </tr>
    `;
  });

  html += `
      <tr class="grand-total-row">
        <td colspan="5" class="center"><b>Grand Total</b></td>
        <td class="right"><b>${formatRupiah(totalAll)}</b></td>
      </tr>
    </tbody>
  </table>
  `;

  return html;
}


function confirmYes(){
  if(rowToDelete){
    rowToDelete.remove();

    let rows = document.querySelectorAll('#materialTable tbody tr');
    rows.forEach((r, i) => {
      r.cells[0].innerText = i + 1;
    });

    showToast("Baris berhasil dihapus!", "#7a0000");
  }

  closeConfirm();
}

function confirmNo(){
  closeConfirm();
}

function closeConfirm(){
  document.getElementById("confirmBox").style.display = "none";
  rowToDelete = null;
}

function toRoman(num){
const r=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
let res=''; for(let [v,s] of r){while(num>=v){res+=s;num-=v;}} return res;
}

function img(id){
let f=document.getElementById(id).files[0];
return f?URL.createObjectURL(f):'';
}

function getRunningNumber(){
  let now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth() + 1; // 1–12

  // key unik per bulan
  let key = `ba_${year}_${month}`;

  let num = localStorage.getItem(key);

  num = num ? parseInt(num) + 1 : 1;

  localStorage.setItem(key, num);

  // format jadi 3 digit: 001, 002, dst
  return String(num).padStart(3, '0');
}

/* ===== TAMBAHKAN DI SINI ===== */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0;
      let v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
}



function generate(){

let jenis = document.getElementById('jenis').value;
if (jenis === "biaya") {
  if (!document.getElementById("nomorBiaya")) {
    alert("Field nomorBiaya tidak ditemukan. Cek HTML biayaBox.");
    return;
  }

  if (!document.getElementById("keteranganBiaya")) {
    alert("Field keteranganBiaya tidak ditemukan. Cek HTML biayaBox.");
    return;
  }

  if (!document.getElementById("biayaTable")) {
    alert("Tabel biayaTable tidak ditemukan. Cek HTML biayaBox.");
    return;
  }
}
let logo = "Asset/kop.png";
let footer = "Asset/fot.jpeg";

let kalimatPembuka = jenis === "biaya" ? "" : getKalimatPembukaBA(jenis);

let useTtd4 = document.getElementById("useTtd4").checked;

let i1 = document.getElementById("nama1").value;
let i2 = document.getElementById("nama2").value;
let i3 = document.getElementById("nama3").value;
let i4 = document.getElementById("nama4") ? document.getElementById("nama4").value : "";

let nama1 = i1 !== "" ? dataOrang[i1].nama : "";
let jabatan1 = i1 !== "" ? dataOrang[i1].jabatan : "";

let nama2 = i2 !== "" ? dataOrang[i2].nama : "";
let jabatan2 = i2 !== "" ? dataOrang[i2].jabatan : "";

let nama3 = i3 !== "" ? dataOrang[i3].nama : "";
let jabatan3 = i3 !== "" ? dataOrang[i3].jabatan : "";

let nama4 = i4 !== "" ? dataOrang[i4].nama : "";
let jabatan4 = i4 !== "" ? dataOrang[i4].jabatan : "";

let latar = qLatar.root.innerHTML;
let latarText = qLatar.getText().trim();let tujuan = qTujuan.root.innerHTML;
let kejadian = qKejadian ? qKejadian.root.innerHTML : '';
let penutup = qPenutup.root.innerHTML;

// ===== SECTION DINAMIS =====
let latarHTML = latarText ? `
<h5>Latar Belakang</h5>
<div class='justify'>${latar}</div>
` : "";

let tujuanText = qTujuan.getText().trim();

let tujuanHTML = tujuanText ? `
<h5>Maksud dan Tujuan</h5>
<p class='justify'>${tujuan}</p>
` : "";

let penutupText = qPenutup.getText().trim();

let penutupHTML = penutupText ? `
<h5>Penutup</h5>
<p class='justify'>${penutup}</p>
` : "";

let kejadianText = qKejadian.getText().trim();


let ttd1 = img("ttd1");
let ttd2 = img("ttd2");
let ttd3 = img("ttd3");
let ttd4 = useTtd4 ? img("ttd4") : "";

let today=new Date();
let waktu = getTanggalJamIndo();
let nomor = "";

if (jenis === "biaya") {
  nomor = `Nomor : ${document.getElementById("nomorBiaya").value || "-"}`;
} else if (jenis === "urugan") {
  nomor = document.getElementById("nomorUrugan").value
    ? `Nomor : ${document.getElementById("nomorUrugan").value}`
    : "";
} else {
  let nomorUrut = getRunningNumber();
  nomor = `Nomor : ${nomorUrut}/BA/RSP/PROJECT/${toRoman(today.getMonth()+1)}/${today.getFullYear()}`;
}

let ttdContainerClass = useTtd4
  ? "ttd-container ttd-4"
  : "ttd-container ttd-3";

let ttdHTML = "";

if (jenis === "biaya" && useTtd4) {
  ttdHTML = `
    ${renderTtdBox("DIBUAT", ttd1, waktu, nama1, jabatan1)}
    ${renderTtdBox("DIVERIFIKASI", ttd2, waktu, nama2, jabatan2)}
    ${renderTtdBox("DIKETAHUI", ttd3, waktu, nama3, jabatan3)}
    ${renderTtdBox("DISETUJUI", ttd4, waktu, nama4, jabatan4)}
  `;
} else if (jenis === "biaya") {
  ttdHTML = `
    ${renderTtdBox("DIBUAT", ttd1, waktu, nama1, jabatan1)}
    ${renderTtdBox("DIVERIFIKASI", ttd2, waktu, nama2, jabatan2)}
    ${renderTtdBox("DISETUJUI", ttd3, waktu, nama3, jabatan3)}
  `;
} else if (useTtd4) {
  ttdHTML = `
    ${renderTtdBox("DIBUAT", ttd1, waktu, nama1, jabatan1)}
    ${renderTtdBox("DIPERIKSA", ttd2, waktu, nama2, jabatan2)}
    ${renderTtdBox("DIKETAHUI", ttd3, waktu, nama3, jabatan3)}
    ${renderTtdBox("DISETUJUI", ttd4, waktu, nama4, jabatan4)}
  `;
} else {
  ttdHTML = `
    ${renderTtdBox("DIBUAT", ttd1, waktu, nama1, jabatan1)}
    ${renderTtdBox("DIKETAHUI", ttd2, waktu, nama2, jabatan2)}
    ${renderTtdBox("DISETUJUI", ttd3, waktu, nama3, jabatan3)}
  `;
}

function resetNomor(){
  let now = new Date();
  let key = `ba_${now.getFullYear()}_${now.getMonth()+1}`;
  localStorage.removeItem(key);
  alert("Nomor bulan ini direset!");
}

/* ===== AUTO SCALE BARU =====
   Jangan kecilkan font hanya berdasarkan jumlah karakter.
   Font baru dikecilkan hanya kalau halaman benar-benar overflow.
*/
let compactClass = "";
let contentClass = "";

/* ===== MATERIAL / ADENDUM ===== */
let tambahan = '';
let materialSeparatePages = "";

if (jenis === 'biaya') {
  let pembukaManual = qPembukaBiaya ? qPembukaBiaya.root.innerHTML.trim() : "";
let pembukaText = qPembukaBiaya ? qPembukaBiaya.getText().trim() : "";

let penutupManual = qPenutupBiaya ? qPenutupBiaya.root.innerHTML.trim() : "";
let penutupText = qPenutupBiaya ? qPenutupBiaya.getText().trim() : "";

  let pekerjaanBiaya = document.getElementById("pekerjaanBiaya").value || "";
  let projectBiaya = document.getElementById("projectBiaya").value || "";
  let unitBiaya = document.getElementById("unitBiaya").value || "";

  let pembukaDefault = `
    Pada hari ini, ${getHariTanggalIndo()}, berkaitan dengan adanya pelaksanaan pekerjaan
    <b><i>${pekerjaanBiaya}</i></b> pada Project <b><i>${projectBiaya}</i></b>,
    guna menunjang pekerjaan tersebut maka dilakukan pengajuan Rencana Anggaran Biaya pekerjaan
    <b><i>${pekerjaanBiaya}</i></b> <b><i>${unitBiaya}</i></b> dengan rincian sebagai berikut:
  `;

  let penutupDefault = `
    Demikian Berita Acara ini dibuat untuk dilaksanakan dan apabila di kemudian hari terdapat kesalahan
    maka akan ditinjau kembali.
  `;

  latarHTML = "";
  tujuanHTML = "";
  penutupHTML = "";

  tambahan = `
  <div class="ba4-content">

    <div class="ba4-paragraph">
      ${pembukaText ? pembukaManual : `<p>${pembukaDefault}</p>`}
    </div>

    ${buildBiayaTable()}

    <div class="ba4-paragraph">
      ${penutupText ? penutupManual : `<p>${penutupDefault}</p>`}
    </div>

  </div>
`;
}

// ===== MATERIAL =====
// ===== MATERIAL DENGAN LOGIKA HALAMAN =====
if (jenis === 'material') {
  const materialRowsData = getMaterialRowsData();

  if (materialRowsData.length > 0) {

    // Jika material maksimal 10, tabel tetap tampil di halaman 1
    if (materialRowsData.length <= MATERIAL_MAX_PAGE1) {
      tambahan = buildMaterialTable(materialRowsData);
    }

    // Jika material lebih dari 10, tabel pindah ke halaman berikutnya
    else {
      tambahan = `
        <div class="material-info-box">
          <p>
            Rincian kebutuhan material/barang tidak ditampilkan pada halaman ini karena jumlah item
            lebih dari 13. Seluruh rincian material/barang tercantum pada halaman berikutnya sebagai
            bagian yang tidak terpisahkan dari Berita Acara ini.
          </p>
        </div>
      `;

      materialSeparatePages = buildMaterialSeparatePages(
        materialRowsData,
        kop,
        foot,
        nomor
      );
    }
  }
}

// ===== ADENDUM =====
else if (jenis === 'adendum' && kejadianText.trim() !== '') {
  tambahan = `
    <h5>Keterangan Kejadian</h5>
    <div class='justify'>${kejadian}</div>
  `;
}

/* ===== LAMPIRAN FIX (TIDAK KE-CROP) ===== */
let lampiranFiles = filesArray;
let total = lampiranFiles.length;

// tentukan kolom
let kolom = 1;
if(total == 1) kolom = 1;
else if(total == 2) kolom = 2;
else if(total <= 4) kolom = 2;
else kolom = 3;

// mulai HTML
let lampiranHTML = `
<div style="
  display:grid;
  grid-template-columns: repeat(${kolom}, 1fr);
  gap:10px;
  height:100%;
">
`;

// isi gambar
for(let i=0; i<total; i++){
  let url = URL.createObjectURL(lampiranFiles[i]);

  lampiranHTML += `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      border:1px solid #ccc;
      padding:5px;
    ">
      <img src="${url}" style="
        max-width:100%;
        max-height:240mm;
        object-fit:contain;
      ">
    </div>
  `;
}

lampiranHTML += `</div>`;

/* ===== KOP ===== */
function kop(){
return `
<div class='kop'>
  <div class='kop-left'>
    <img src='${logo}'>
  </div>

  <div class='kop-right'>
    <div class='kop-title'>RAJA SUKSES PROPERTINDO</div>
    <div>Jl. Trusmi Kulon No. 148</div>
    <div>Telp. (0231) 321416 Plered - Cirebon</div>
  </div>
</div>

<!-- GARIS KOP -->
<div class="kop-line"></div>
`;
}

/* ===== FOOTER ===== */
function foot(){
return `
<div class='surat-footer'>
  <img src='${footer}'>
</div>
`;
}

if (jenis === "urugan") {
  const pageUrugan = buildUruganPages(kop, foot);

  document.getElementById("output").innerHTML = pageUrugan;

  requestAnimationFrame(() => {
    fitFirstPage();
    setTimeout(fitFirstPage, 250);
  });

  scrollToPreview();
  return;
}

/* ===== PAGE 1 ===== */
let page1 = `
<div class="page ${compactClass}" id="pageSurat">
${kop()}

<h4 class="title-ba">BERITA ACARA</h4>
<p class="nomor-ba">${nomor}</p>

${jenis === "biaya" ? `
  <p class="subjudul-ba4">
    ${document.getElementById("keteranganBiaya").value || "Pengajuan Biaya"}
  </p>
` : ""}

<div class="ba-body">

  ${kalimatPembuka ? `
  <p class="identitas-ba">
    ${kalimatPembuka}
  </p>
` : ""}

  <div class="content-flex content-area ${contentClass}">
    ${latarHTML}
    ${tujuanHTML}
    ${tambahan}
    ${penutupHTML}
  </div>

<div class="${ttdContainerClass}">
  ${ttdHTML}
</div>

</div>

${foot()}

</div>`;

/* ===== PAGE 2 DST KHUSUS LAMPIRAN ===== */
let page2 = buildLampiranPages(lampiranFiles, kop, foot);

document.getElementById("output").innerHTML = page1 + materialSeparatePages + page2;

/* Cek tinggi aktual halaman.
   Font hanya dipadatkan jika benar-benar overflow.
*/
requestAnimationFrame(() => {
  fitFirstPage();
  setTimeout(fitFirstPage, 250);
});
}


function buildLampiranPages(lampiranFiles, kop, foot) {
  if (!lampiranFiles || lampiranFiles.length === 0) {
    return "";
  }

  const perPage = 4;
  let html = "";

  for (let start = 0; start < lampiranFiles.length; start += perPage) {
    const chunk = lampiranFiles.slice(start, start + perPage);
    const jumlah = chunk.length;

    let gridClass = "lampiran-grid-1";

    if (jumlah === 2) {
      gridClass = "lampiran-grid-2";
    } else if (jumlah === 3) {
      gridClass = "lampiran-grid-3";
    } else if (jumlah >= 4) {
      gridClass = "lampiran-grid-4";
    }

    let itemsHTML = "";

    chunk.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const nomorFoto = start + index + 1;

      itemsHTML += `
        <div class="lampiran-item">
          <img src="${url}" alt="Lampiran ${nomorFoto}">
        </div>
      `;
    });

    html += `
      <div class="page page-lampiran">
        ${kop()}

        <h4 class="title-ba">LAMPIRAN</h4>
        <p class="nomor-ba">Evidence Foto ${start + 1} - ${start + jumlah}</p>

        <div class="lampiran-body">
          <div class="lampiran-grid-page ${gridClass}">
            ${itemsHTML}
          </div>
        </div>

        ${foot()}
      </div>
    `;
  }

  return html;
}

const dropArea = document.getElementById("dropArea");
const inputFile = document.getElementById("lampiran");
const previewBox = document.getElementById("previewLampiran");

let filesArray = [];

// klik = buka file
dropArea.addEventListener("click", () => inputFile.click());

// drag over
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragover");
});

// drag leave
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

// drop file
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragover");

  const files = Array.from(e.dataTransfer.files);
  handleFiles(files);
});

// pilih manual
inputFile.addEventListener("change", () => {
  handleFiles(Array.from(inputFile.files));
});

// proses file
function handleFiles(files){
  files.forEach(file => {
    if(file.type.startsWith("image/")){
      filesArray.push(file);
    }
  });

  renderPreview();
}

// tampilkan preview
function renderPreview(){
  previewBox.innerHTML = "";

  filesArray.forEach((file, index) => {
    let url = URL.createObjectURL(file);

    previewBox.innerHTML += `
      <div style="position:relative">
        <img src="${url}">
        <button onclick="removeFile(${index})" style="
          position:absolute;
          top:2px;
          right:2px;
          background:red;
          color:white;
          border:none;
          border-radius:50%;
          width:20px;
          height:20px;
          font-size:12px;
        ">×</button>
      </div>
    `;
  });
}

function getJumlahRitTargetUrugan(){
  const jumlahInput = Number(document.getElementById("jumlahRitUrugan").value || 0);
  const jumlahRitCard = uruganRitFiles.length || 0;

  return Math.max(jumlahInput, jumlahRitCard);
}

function handleNotaUruganFiles(event){
  const files = Array.from(event.target.files);
  tambahNotaUrugan(files);

  event.target.value = "";
}

function dropNotaUruganFiles(event, el){
  event.preventDefault();
  el.classList.remove("dragover");

  const files = Array.from(event.dataTransfer.files);
  tambahNotaUrugan(files);
}

function tambahNotaUrugan(files){
  let imageFiles = files.filter(file => file.type.startsWith("image/"));
  const maxNota = getJumlahRitTargetUrugan();

  if (maxNota <= 0) {
    showToast("Isi jumlah rit atau tambahkan dokumentasi rit terlebih dahulu.", "warning");
    return;
  }

  let slotTersedia = maxNota - uruganNotaFiles.length;

  if (slotTersedia <= 0) {
    showToast(`Foto nota sudah maksimal ${maxNota} sesuai jumlah rit.`, "warning");
    return;
  }

  if (imageFiles.length > slotTersedia) {
    showToast(`Maksimal ${maxNota} foto nota. Hanya ${slotTersedia} foto yang ditambahkan.`, "warning");
    imageFiles = imageFiles.slice(0, slotTersedia);
  }

  uruganNotaFiles = uruganNotaFiles.concat(imageFiles);
  renderNotaUruganPreview();
}

function renderNotaUruganPreview(){
  const container = document.getElementById("previewNotaUrugan");
  if (!container) return;

  const maxNota = getJumlahRitTargetUrugan();

  if (maxNota > 0 && uruganNotaFiles.length > maxNota) {
    uruganNotaFiles = uruganNotaFiles.slice(0, maxNota);
  }

  let html = `
    <div class="nota-urugan-status">
      Foto nota: ${uruganNotaFiles.length}/${maxNota || 0}
    </div>
  `;

  if (uruganNotaFiles.length === 0) {
    html += `
      <div class="urugan-preview-empty">
        Belum ada foto nota
      </div>
    `;
  } else {
    uruganNotaFiles.forEach((file, index) => {
      const url = URL.createObjectURL(file);

      html += `
        <div class="urugan-preview-item">
          <img src="${url}">
          <span>Nota Rit ${index + 1}</span>
          <button type="button" onclick="hapusNotaUrugan(${index})" class="urugan-remove-photo">×</button>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

function hapusNotaUrugan(index){
  uruganNotaFiles.splice(index, 1);
  renderNotaUruganPreview();
}

// hapus file
function removeFile(index){
  filesArray.splice(index,1);
  renderPreview();
}

// 🔥 DATA DEFAULT
let dataOrang = JSON.parse(localStorage.getItem("dataOrang")) || [
  { nama: "Khalid Rizky Pratama", jabatan: "Pelaksana Project" },
  { nama: "Tedi Yanuar", jabatan: "Project Manager" },
  { nama: "Teuku Raja Sri Mustika", jabatan: "GM Production" }
];

// 🔥 LOAD DROPDOWN
function loadDropdown(){
  ["nama1","nama2","nama3","nama4"].forEach(id=>{
    let select = document.getElementById(id);
    select.innerHTML = `<option value="">-- Pilih Nama --</option>`;

    dataOrang.forEach((d,i)=>{
      select.innerHTML += `<option value="${i}">${d.nama}</option>`;
    });
  });
}

// 🔥 AUTO ISI JABATAN
function setJabatan(select, targetId){
  let index = select.value;
  let input = document.getElementById(targetId);

  if(index !== ""){
    input.value = dataOrang[index].jabatan;
  } else {
    input.value = "";
  }
}

// 🔥 TAMBAH ORANG BARU
function tambahOrang(){
  let nama = prompt("Masukkan Nama:");
  let jabatan = prompt("Masukkan Jabatan:");

  if(nama && jabatan){
    dataOrang.push({nama, jabatan});
    localStorage.setItem("dataOrang", JSON.stringify(dataOrang));
    loadDropdown();
    showToast("Berhasil ditambahkan!", "success");
  }
}

// 🔥 EDIT DATA
function editOrang(){
  let list = dataOrang.map((d,i)=> `${i+1}. ${d.nama} (${d.jabatan})`).join("\n");

  let pilih = prompt("Pilih nomor yang mau diedit:\n\n" + list);

  let index = parseInt(pilih) - 1;

  if(dataOrang[index]){
    let namaBaru = prompt("Edit Nama:", dataOrang[index].nama);
    let jabatanBaru = prompt("Edit Jabatan:", dataOrang[index].jabatan);

    if(namaBaru && jabatanBaru){
      dataOrang[index] = {nama: namaBaru, jabatan: jabatanBaru};

      localStorage.setItem("dataOrang", JSON.stringify(dataOrang));
      loadDropdown();

      showToast("Data berhasil diupdate!", "success");

    }
  }
}

// 🔥 HAPUS DATA
function hapusOrang(){
  let list = dataOrang.map((d,i)=> `${i+1}. ${d.nama}`).join("\n");

  let pilih = prompt("Pilih nomor yang mau dihapus:\n\n" + list);

  let index = parseInt(pilih) - 1;

  if(dataOrang[index]){
    let konfirmasi = confirm("Yakin mau hapus " + dataOrang[index].nama + "?");

    if(konfirmasi){
      dataOrang.splice(index,1);

      localStorage.setItem("dataOrang", JSON.stringify(dataOrang));
      loadDropdown();

      showToast("Data berhasil dihapus!", "success");

    }
  }
}

$(document).ready(function() {
  $("#nama1, #nama2, #nama3, #nama4").select2({
    placeholder: "Cari nama...",
    width: "100%"
  });
});


/* =========================================================
   Fungsi tambahan agar tombol export tidak error
========================================================= */
function simpanPDF() {
  generate();

  setTimeout(() => {
    fitFirstPage();
    window.print();
  }, 500);
}


function exportToWord() {
  generate();

  const output = document.getElementById("output").innerHTML;
  const html = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Berita Acara</title>
        <style>
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.45;
          }
          h4 {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            text-decoration: underline;
          }
          h5 {
            font-size: 12pt;
            font-weight: bold;
          }
          p {
            text-align: justify;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10.5pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 4px;
          }
          th {
            text-align: center;
            font-weight: bold;
          }
          .center {
            text-align: center;
          }
          .ttd-container {
            display: flex;
            justify-content: space-between;
            text-align: center;
            margin-top: 40px;
          }
          .ttd-box {
            width: 31%;
          }
          .nama-ttd {
            font-weight: bold;
            text-decoration: underline;
          }
          .jabatan-ttd {
            font-style: italic;
          }
        </style>
      </head>
      <body>${output}</body>
    </html>
  `;

  const blob = new Blob(["\ufeff", html], {
    type: "application/msword"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Berita_Acara.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
