/* =========================================================
   script.js - Generator Berita Acara
   Dipisahkan dari file HTML awal agar struktur lebih rapi.
========================================================= */

let qLatar, qTujuan, qPenutup, qKejadian;

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

    nama1: $("#nama1").val(),
    nama2: $("#nama2").val(),
    nama3: $("#nama3").val(),

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

  // 🔥 INI BARU TEMPATNYA
  $("#nama1").val(draft.nama1).trigger("change");
  $("#nama2").val(draft.nama2).trigger("change");
  $("#nama3").val(draft.nama3).trigger("change");

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

function setJenis(value, el){
  document.getElementById("jenis").value = value;

  // reset semua
  document.querySelectorAll(".jenis-option").forEach(o=>{
    o.classList.remove("active");
  });

  // aktifkan yg diklik
  el.classList.add("active");

  // panggil fungsi lama
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

  document.getElementById('materialBox').style.display =
    j === 'material' ? 'block' : 'none';

  document.getElementById('adendumBox').style.display =
    j === 'adendum' ? 'block' : 'none';
}

function addRow(){
  let tbody = document.querySelector('#materialTable tbody');
  let rows = tbody.querySelectorAll('tr').length;

  if(rows >= 20){
    showToast("Maksimal 20 material!", "warning");
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
let logo = "Asset/kop.png";
let footer = "Asset/fot.jpeg";

let kalimatPembuka = getKalimatPembukaBA(jenis);

let i1 = document.getElementById('nama1').value;
let i2 = document.getElementById('nama2').value;
let i3 = document.getElementById('nama3').value;

let nama1 = i1 !== "" ? dataOrang[i1].nama : "";
let jabatan1 = i1 !== "" ? dataOrang[i1].jabatan : "";

let nama2 = i2 !== "" ? dataOrang[i2].nama : "";
let jabatan2 = i2 !== "" ? dataOrang[i2].jabatan : "";

let nama3 = i3 !== "" ? dataOrang[i3].nama : "";
let jabatan3 = i3 !== "" ? dataOrang[i3].jabatan : "";

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


let ttd1=img('ttd1');
let ttd2=img('ttd2');
let ttd3=img('ttd3');

let today=new Date();
let waktu = getTanggalJamIndo();
let nomorUrut=getRunningNumber();
let nomor = `Nomor : ${nomorUrut}/BA/RSP/PROJECT/${toRoman(today.getMonth()+1)}/${today.getFullYear()}`;

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

// ===== MATERIAL =====
if (jenis === 'material') {
  let rows = document.querySelectorAll('#materialTable tbody tr');

  if (rows.length > 0) {

    let table = `
    <table class='table table-bordered tabel-material'>
      <tr>
        <th style="width:40px;">No</th>
        <th>Nama Material/Barang</th>
        <th style="width:170px;">Spesifikasi / Ukuran</th>
        <th style="width:80px;">Qty</th>
        <th style="width:80px;">Satuan</th>
      </tr>
    `;

    rows.forEach((r) => {
      let c = r.querySelectorAll('input');

      table += `
      <tr>
        <td class="center">${r.cells[0].innerText}</td>
        <td>${c[0].value}</td>
        <td class="center">${c[1].value}</td>
        <td class="center">${c[2].value}</td>
        <td class="center">${c[3].value}</td>
      </tr>`;
    });

    table += `</table>`;
    tambahan = table;
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

/* ===== PAGE 1 ===== */
let page1 = `
<div class="page ${compactClass}" id="pageSurat">
${kop()}

<h4 class="title-ba">BERITA ACARA</h4>
<p class="nomor-ba">${nomor}</p>

<div class="ba-body">

  <p class="identitas-ba">
  ${kalimatPembuka}
</p>

  <div class="content-flex content-area ${contentClass}">
    ${latarHTML}
    ${tujuanHTML}
    ${tambahan}
    ${penutupHTML}
  </div>

  <div class="ttd-container">

    <!-- DIBUAT -->
    <div class="ttd-box">
      <div class="ttd-header">
        <p class="ttd-title">DIBUAT</p>
      </div>

      ${ttd1 ? `
        <div class="signature-box">
          <div class="signed-label">✔ Signed by:</div>
          <div class="signature">
            <img src="${ttd1}">
          </div>
        </div>
      ` : `
        <div class="signature-placeholder"></div>
      `}

      <div class="ttd-time">${waktu}</div>

      <p class="nama-ttd">${nama1}</p>
      <p class="jabatan-ttd">${jabatan1}</p>
    </div>

    <!-- DIKETAHUI -->
    <div class="ttd-box">
      <div class="ttd-header">
        <p class="ttd-title">DIKETAHUI</p>
      </div>

      ${ttd2 ? `
        <div class="signature-box">
          <div class="signed-label">✔ Signed by:</div>
          <div class="signature">
            <img src="${ttd2}">
          </div>
        </div>
      ` : `
        <div class="signature-placeholder"></div>
      `}

      <div class="ttd-time">${waktu}</div>

      <p class="nama-ttd">${nama2}</p>
      <p class="jabatan-ttd">${jabatan2}</p>
    </div>

    <!-- DISETUJUI -->
    <div class="ttd-box">
      <div class="ttd-header">
        <p class="ttd-title">DISETUJUI</p>
      </div>

      ${ttd3 ? `
        <div class="signature-box">
          <div class="signed-label">✔ Signed by:</div>
          <div class="signature">
            <img src="${ttd3}">
          </div>
        </div>
      ` : `
        <div class="signature-placeholder"></div>
      `}

      <div class="ttd-time">${waktu}</div>

      <p class="nama-ttd">${nama3}</p>
      <p class="jabatan-ttd">${jabatan3}</p>
    </div>

  </div>

</div>

${foot()}
</div>`;

/* ===== PAGE 2 DST KHUSUS LAMPIRAN ===== */
let page2 = buildLampiranPages(lampiranFiles, kop, foot);

document.getElementById("output").innerHTML = page1 + page2;

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
  ["nama1","nama2","nama3"].forEach(id=>{
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
  $("#nama1").select2({
    placeholder: "Cari nama...",
    width: '100%'
  });

  $("#nama2").select2({
    placeholder: "Cari nama...",
    width: '100%'
  });

  $("#nama3").select2({
    placeholder: "Cari nama...",
    width: '100%'
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
