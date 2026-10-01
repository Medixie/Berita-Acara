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
        <div class="ttd-title">${title}</div>
      </div>

      <div class="ttd-sign-area">
        ${ttdSrc ? `
          <div class="signature">
            <img src="${ttdSrc}" alt="Tanda Tangan">
          </div>
        ` : ``}
      </div>

      <div class="ttd-info">
        <div class="ttd-time">${waktu || ""}</div>
        <div class="nama-ttd">${nama || ""}</div>
        <div class="jabatan-ttd">${jabatan || ""}</div>
      </div>

    </div>
  `;
}

let opnameFiles = [];

function getValue(id, fallback = ""){
  const el = document.getElementById(id);
  return el && el.value.trim() ? el.value.trim() : fallback;
}

function getTanggalOpname(){
  const input = document.getElementById("tanggalOpname");

  let d = input && input.value ? new Date(input.value + "T00:00:00") : new Date();

  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return {
    display: `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${yyyy}`,
    angka: `${dd}-${mm}-${yyyy}`
  };
}

function getRunningNumberOpname(){
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const key = `ba_opname_${year}_${month}`;

  let num = localStorage.getItem(key);
  num = num ? parseInt(num) + 1 : 1;

  localStorage.setItem(key, num);

  return String(num).padStart(3, "0");
}

function getNomorOpname(){
  const nomorInput = document.getElementById("nomorOpname");

  if (nomorInput && nomorInput.value.trim()) {
    return nomorInput.value.trim();
  }

  const now = new Date();
  const kode = getValue("kodeOpname", "BAO/TL/RSP/CRB");
  const nomorUrut = getRunningNumberOpname();

  const nomor = `${nomorUrut}/${kode}/${toRoman(now.getMonth() + 1)}/${now.getFullYear()}`;

  if (nomorInput) {
    nomorInput.value = nomor;
  }

  return nomor;
}

function resetNomorOpnameBulanIni(){
  const now = new Date();
  const key = `ba_opname_${now.getFullYear()}_${now.getMonth() + 1}`;

  localStorage.removeItem(key);

  const nomorInput = document.getElementById("nomorOpname");
  if (nomorInput) nomorInput.value = "";

  showToast("Nomor BA Opname bulan ini berhasil direset.", "warning");
}

function getOpnameImg(id){
  const el = document.getElementById(id);
  if (!el || !el.files || !el.files[0]) return "";
  return URL.createObjectURL(el.files[0]);
}

function renderOpnameTtdBox(title, ttdSrc, nama, jabatan) {

  // tanggal & jam saat BA dibuat
  const waktu = getTanggalJamIndo();

  return `
    <div class="opname-ttd-box">

      <div class="opname-ttd-title">
        ${title}
      </div>

      <!-- SLOT TTD SELALU ADA -->
      <div class="opname-ttd-signature">
        ${
          ttdSrc
            ? `
              <img
                src="${ttdSrc}"
                alt="Tanda Tangan"
              >
            `
            : ``
        }
      </div>

      <!-- TANGGAL / JAM -->
      <div class="opname-ttd-time">
        ${waktu}
      </div>

      <!-- NAMA -->
      <div class="opname-ttd-name">
        ${nama || ""}
      </div>

      <!-- JABATAN -->
      <div class="opname-ttd-jabatan">
        ${jabatan || ""}
      </div>

    </div>
  `;
}

function dragOpnameOver(event, el){
  event.preventDefault();
  el.classList.add("dragover");
}

function dragOpnameLeave(el){
  el.classList.remove("dragover");
}

function dropOpnameFiles(event, el){
  event.preventDefault();
  el.classList.remove("dragover");

  const files = Array.from(event.dataTransfer.files);
  tambahOpnameFiles(files);
}

function handleOpnameInputFiles(event){
  const files = Array.from(event.target.files);
  tambahOpnameFiles(files);

  event.target.value = "";
}

function tambahOpnameFiles(files){
  const imageFiles = files.filter(file => file.type.startsWith("image/"));

  opnameFiles = opnameFiles.concat(imageFiles);

  renderOpnamePreview();
}

function renderOpnamePreview(){
  const preview = document.getElementById("previewOpnameLampiran");
  if (!preview) return;

  preview.innerHTML = "";

  if (opnameFiles.length === 0) {
    preview.innerHTML = `
      <div class="opname-preview-empty">
        Belum ada foto lampiran opname
      </div>
    `;
    return;
  }

  opnameFiles.forEach((file, index) => {
    const url = URL.createObjectURL(file);

    preview.innerHTML += `
      <div class="opname-preview-item">
        <img src="${url}">
        <span>Foto ${index + 1}</span>
        <button type="button" onclick="hapusOpnameFile(${index})">×</button>
      </div>
    `;
  });
}

function hapusOpnameFile(index){
  opnameFiles.splice(index, 1);
  renderOpnamePreview();
}

function buildOpnameLampiranPages(kop, foot){
  if (!opnameFiles || opnameFiles.length === 0) return "";

  const perPage = 6;
  let html = "";

  for (let start = 0; start < opnameFiles.length; start += perPage) {
    const chunk = opnameFiles.slice(start, start + perPage);

    let fotoHTML = "";

    chunk.forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const no = start + index + 1;

      fotoHTML += `
        <div class="opname-lampiran-item">
          <img src="${url}">
          <div class="opname-lampiran-caption">Foto ${no}</div>
        </div>
      `;
    });

    html += `
      <div class="page page-opname-lampiran">
        ${kop()}

        <h4 class="opname-lampiran-title">LAMPIRAN BERITA ACARA OPNAME LAPANGAN</h4>
        <div class="opname-lampiran-subtitle">
          Evidence Foto ${start + 1} - ${start + chunk.length}
        </div>

        <div class="opname-lampiran-grid">
          ${fotoHTML}
        </div>

        ${foot()}
      </div>
    `;
  }

  return html;
}

function getNamaFromDropdown(selectId, fallback = "-"){
  const select = document.getElementById(selectId);

  if (!select || select.value === "") {
    return fallback;
  }

  const index = select.value;

  if (!dataOrang[index]) {
    return fallback;
  }

  return dataOrang[index].nama || fallback;
}

function buildOpnamePages(kop, foot){
  const nomor = getNomorOpname();
  const tanggal = getTanggalOpname();

const namaPihak1 = getNamaFromDropdown("namaPihak1OpnameSelect", "-");
const jabatanPihak1 = getValue("jabatanPihak1Opname", "-");

const namaPihak2 = getNamaFromDropdown("namaPihak2OpnameSelect", "-");
const jabatanPihak2 = getValue("jabatanPihak2Opname", "-");
const perusahaanPihak2 = getValue("perusahaanPihak2Opname", "Raja Sukses Propertindo");

const pekerjaan = getValue("pekerjaanOpname", "-");
const blok = getValue("blokOpname", "-");
const waktuPelaksanaan = getValue("waktuPelaksanaanOpname", tanggal.display);
const jumlah = getValue("jumlahOpname", "-");
const progress = getValue("progressOpname", "100%");

const namaDiperiksa = getNamaFromDropdown("namaDiperiksaOpnameSelect", "-");
const jabatanDiperiksa = getValue("jabatanDiperiksaOpname", "-");

const namaDiketahui = getNamaFromDropdown("namaDiketahuiOpnameSelect", "-");
const jabatanDiketahui = getValue("jabatanDiketahuiOpname", "-");

  const ttd1 = getOpnameImg("ttdOpname1");
  const ttd2 = getOpnameImg("ttdOpname2");
  const ttd3 = getOpnameImg("ttdOpname3");
  const ttd4 = getOpnameImg("ttdOpname4");

  const page1 = `
    <div class="page page-opname">
      ${kop()}

      <h4 class="opname-title">BERITA ACARA OPNAME LAPANGAN</h4>
      <div class="opname-nomor">No. ${nomor}</div>

      <div class="opname-body">

        <p>
          Pada hari ini ${tanggal.display} (${tanggal.angka}), kami yang bertanda tangan di bawah ini:
        </p>

        <div class="opname-party">
          <div>Nama</div><div>:</div><div>${namaPihak1}</div>
          <div>Jabatan</div><div>:</div><div>${jabatanPihak1}</div>
        </div>

        <p>
          Dalam hal ini bertindak melaksanakan jabatan tersebut untuk dan atas nama ${jabatanPihak1},
          selanjutnya disebut sebagai <b>PIHAK PERTAMA</b>.
        </p>

        <div class="opname-party">
          <div>Nama</div><div>:</div><div>${namaPihak2}</div>
          <div>Jabatan</div><div>:</div><div>${jabatanPihak2}</div>
          <div>Perusahaan</div><div>:</div><div>${perusahaanPihak2}</div>
        </div>

        <p>
          Dalam hal ini bertindak melaksanakan jabatan tersebut untuk dan atas nama ${perusahaanPihak2},
          selanjutnya disebut sebagai <b>PIHAK KEDUA</b>.
        </p>

        <p>
          Dengan ini <b>PIHAK PERTAMA</b> dan <b>PIHAK KEDUA</b> menyatakan sebagai berikut:
        </p>

        <ol class="opname-list">
          <li>
            <p><b>PIHAK PERTAMA</b> telah melaksanakan pekerjaan:</p>

            <div class="opname-detail">
              <div>Nama Pekerjaan</div><div>:</div><div>${pekerjaan}</div>
              <div>Blok</div><div>:</div><div>${blok}</div>
              <div>Waktu Pelaksanaan</div><div>:</div><div>${waktuPelaksanaan}</div>
              <div>Jumlah</div><div>:</div><div>${jumlah}</div>
            </div>
          </li>

          <li>
            <p>
              <b>PIHAK KEDUA</b> menyatakan menyetujui semua pekerjaan tersebut telah mencapai
              <b>Progress ${progress}</b> sesuai yang disyaratkan.
            </p>
          </li>
        </ol>

        <p>
          Demikian Berita Acara Serah Terima ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
        </p>

        <div class="opname-ttd-container">
          ${renderOpnameTtdBox("PIHAK PERTAMA", ttd1, namaPihak1, jabatanPihak1)}
          ${renderOpnameTtdBox("PIHAK KEDUA", ttd2, namaPihak2, jabatanPihak2)}
          ${renderOpnameTtdBox("DIPERIKSA", ttd3, namaDiperiksa, jabatanDiperiksa)}
          ${renderOpnameTtdBox("DIKETAHUI", ttd4, namaDiketahui, jabatanDiketahui)}
        </div>

      </div>

      ${foot()}
    </div>
  `;

  return page1 + buildOpnameLampiranPages(kop, foot);
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

/* =========================================================
   MULTI DRAFT BA
   Draft tidak saling menimpa
========================================================= */

const BA_DRAFT_KEY = "baDrafts";
let activeDraftId = null;
const DRAFT_TABLE = "DRAFTS";
const DRAFT_MIGRATION_KEY = "baDraftSheetsMigratedV1";


/* =========================================================
   GET SEMUA DRAFT
========================================================= */

function getAllDrafts() {

  try {

    const data = JSON.parse(
      localStorage.getItem(BA_DRAFT_KEY)
    );

    return Array.isArray(data) ? data : [];

  } catch (error) {

    console.error("Gagal membaca draft:", error);

    return [];

  }

}


/* =========================================================
   SIMPAN SEMUA DRAFT
========================================================= */

function setAllDrafts(drafts) {

  localStorage.setItem(
    BA_DRAFT_KEY,
    JSON.stringify(drafts)
  );

}

/* =========================================================
   DRAFT DATABASE — GOOGLE SHEETS
========================================================= */


/* =========================
   PARSE JSON AMAN
========================= */

function parseDraftJSON(value, fallback = {}) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }

}


/* =========================
   NORMALISASI DATA DRAFT
========================= */

function normalizeDraftRecord(item) {

  if (!item) return null;

  return {

    id:
      item.id || "",

    jenis:
      item.jenis || "",

    judul:
      item.judul || "",

    createdAt:
      item.createdAt || "",

    updatedAt:
      item.updatedAt || "",

    createdBy:
      parseDraftJSON(
        item.createdBy,
        {}
      ),

    data:
      parseDraftJSON(
        item.data,
        {}
      )

  };

}


/* =========================
   GET DRAFT DARI DATABASE
========================= */

async function fetchDraftsFromAPI() {

  const response = await fetch(
    DATABASE_API_URL +
    "?table=" +
    encodeURIComponent(DRAFT_TABLE),
    {
      method: "GET",
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Gagal mengambil Draft dari database."
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.message ||
      "Database Draft gagal dibaca."
    );
  }

  const rows = Array.isArray(result.data)
    ? result.data
    : [];

  return rows
    .map(normalizeDraftRecord)
    .filter(Boolean);

}


/* =========================
   POST DRAFT KE DATABASE
========================= */

async function sendDraftRequest(payload) {

  const response = await fetch(
    DATABASE_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:
        JSON.stringify(payload)
    }
  );

  if (!response.ok) {

    throw new Error(
      "Gagal terhubung ke database Draft."
    );

  }

  const result =
    await response.json();

  if (!result.success) {

    throw new Error(
      result.message ||
      "Operasi Draft gagal."
    );

  }

  return result;

}


/* =========================
   LOAD DATABASE → CACHE
========================= */

async function loadDraftDatabase(
  showLoading = true
) {

  try {

    const drafts =
      await fetchDraftsFromAPI();


    /*
       Urutkan terbaru di atas
    */

    drafts.sort((a, b) => {

      const dateA =
        new Date(
          a.updatedAt ||
          a.createdAt ||
          0
        );

      const dateB =
        new Date(
          b.updatedAt ||
          b.createdAt ||
          0
        );

      return dateB - dateA;

    });


    /*
       Google Sheets
       menjadi sumber data utama.

       localStorage hanya cache.
    */

    setAllDrafts(drafts);


    if (
      typeof renderDraftList ===
      "function"
    ) {

      renderDraftList();

    }


    if (
      typeof updateDraftStatus ===
      "function"
    ) {

      updateDraftStatus();

    }


    if (
      typeof updateDashboardStats ===
      "function"
    ) {

      updateDashboardStats();

    }


    return drafts;

  } catch (error) {

    console.error(
      "Gagal load Draft database:",
      error
    );


    /*
       Kalau internet/API bermasalah,
       gunakan cache terakhir.
    */

    if (showLoading) {

      showToast(
        "Database Draft tidak dapat diakses. Menampilkan cache terakhir.",
        "warning"
      );

    }


    const cached =
      getAllDrafts();


    if (
      typeof renderDraftList ===
      "function"
    ) {

      renderDraftList();

    }


    return cached;

  }

}

/* =========================================================
   MIGRASI DRAFT LOCALSTORAGE → GOOGLE SHEETS
   HANYA SEKALI
========================================================= */

async function migrateLocalDraftsToDatabaseOnce() {

  if (
    localStorage.getItem(
      DRAFT_MIGRATION_KEY
    ) === "1"
  ) {

    return;

  }


  /*
     Ambil draft lokal SEBELUM
     database menimpa cache.
  */

  const localDrafts =
    getAllDrafts();


  try {

    const remoteDrafts =
      await fetchDraftsFromAPI();


    const remoteIds =
      new Set(
        remoteDrafts.map(
          item => String(item.id)
        )
      );


    /*
       Upload draft lokal
       yang belum ada di Sheets.
    */

    for (
      const draft of localDrafts
    ) {

      if (
        !draft ||
        !draft.id ||
        remoteIds.has(
          String(draft.id)
        )
      ) {

        continue;

      }


      await sendDraftRequest({

        action: "create",

        table: DRAFT_TABLE,

        data: {

          id:
            draft.id,

          jenis:
            draft.jenis || "",

          judul:
            draft.judul || "",

          status:
            "draft",

          createdAt:
            draft.createdAt ||
            new Date().toISOString(),

          updatedAt:
            draft.updatedAt ||
            new Date().toISOString(),

          createdBy:
            draft.createdBy || {},

          data:
            draft.data || {}

        }

      });


      remoteIds.add(
        String(draft.id)
      );

    }


    localStorage.setItem(
      DRAFT_MIGRATION_KEY,
      "1"
    );


    console.log(
      "Migrasi Draft ke Google Sheets selesai."
    );


    await loadDraftDatabase(false);


  } catch (error) {

    /*
       Jangan tandai migrasi selesai
       kalau database gagal.
       Supaya bisa dicoba lagi.
    */

    console.error(
      "Migrasi Draft gagal:",
      error
    );

  }

}


/* =========================================================
   BUAT ID DRAFT
========================================================= */

function createDraftId() {

  return (
    "DRAFT-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()
  );

}


/* =========================================================
   NAMA JENIS BA
========================================================= */

function getNamaJenisBA(jenis) {

  const nama = {

    material:
      "BA Material",

    keterangan:
      "BA Keterangan",

    adendum:
      "BA Adendum",

    biaya:
      "BA Pengajuan Biaya",

    urugan:
      "BA Urugan",

    opname:
      "BA Opname Lapangan",

    form_opname:
      "Form Opname"

  };

  return nama[jenis] || "Berita Acara";

}




/* =========================================================
   AMBIL DATA FORM
========================================================= */
function getDraftValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function setDraftValue(id, value) {
  const el = document.getElementById(id);

  if (!el) return;

  el.value = value ?? "";

  // khusus select/select2
  if (el.tagName === "SELECT" && typeof $ !== "undefined") {
    $("#" + id).val(value ?? "").trigger("change");
  }
}


function collectDraftData() {

  const getElValue = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : "";
  };

const getSelectValue = (id) => {

  const el =
    document.getElementById(id);

  if (!el) {
    return "";
  }


  /* =========================
     PRIORITAS SELECT2
  ========================= */

  if (
    typeof $ !== "undefined" &&
    $("#" + id).length
  ) {

    const jqueryValue =
      $("#" + id).val();

    if (
      jqueryValue !== undefined &&
      jqueryValue !== null &&
      String(jqueryValue).trim() !== ""
    ) {

      return jqueryValue;

    }

  }


  /* =========================
     SELECT NORMAL
  ========================= */

  if (
    el.value !== undefined &&
    el.value !== null &&
    String(el.value).trim() !== ""
  ) {

    return el.value;

  }


  /* =========================
     FALLBACK OPTION TERPILIH
  ========================= */

  if (
    el.selectedOptions &&
    el.selectedOptions.length
  ) {

    const option =
      el.selectedOptions[0];

    return (
      option.value ||
      option.textContent ||
      ""
    ).trim();

  }


  return "";

};

  const jenisElement =
    document.getElementById("jenis");

  const useTtd4Element =
    document.getElementById("useTtd4");


  const data = {

    jenis:
      jenisElement
        ? jenisElement.value
        : "",

    useTtd4:
      useTtd4Element
        ? useTtd4Element.checked
        : false,


    /* =========================
       PENANDATANGAN UMUM
    ========================= */

    nama1:
      $("#nama1").length
        ? $("#nama1").val()
        : "",

    nama2:
      $("#nama2").length
        ? $("#nama2").val()
        : "",

    nama3:
      $("#nama3").length
        ? $("#nama3").val()
        : "",

    nama4:
      $("#nama4").length
        ? $("#nama4").val()
        : "",


    /* =========================
       EDITOR
    ========================= */

    latar:
      typeof qLatar !== "undefined" && qLatar
        ? qLatar.root.innerHTML
        : "",

    tujuan:
      typeof qTujuan !== "undefined" && qTujuan
        ? qTujuan.root.innerHTML
        : "",

    kejadian:
      typeof qKejadian !== "undefined" && qKejadian
        ? qKejadian.root.innerHTML
        : "",

    penutup:
      typeof qPenutup !== "undefined" && qPenutup
        ? qPenutup.root.innerHTML
        : "",


    /* =========================
       TABEL MATERIAL
    ========================= */

    materialRows:
      typeof getMaterialRowsData === "function"
        ? getMaterialRowsData()
        : [],


    /* =========================
       BA OPNAME
    ========================= */

    opname: {

      nomor:
        getElValue("nomorOpname"),

      kode:
        getElValue("kodeNomorOpname"),

      tanggal:
        getElValue("tanggalOpname"),


      /* PIHAK PERTAMA */

      pihak1:
        getSelectValue(
          "namaPihak1OpnameSelect"
        ),

      jabatanPihak1:
        getElValue(
          "jabatanPihak1Opname"
        ),


      /* PIHAK KEDUA */

      pihak2:
        getSelectValue(
          "namaPihak2OpnameSelect"
        ),

      jabatanPihak2:
        getElValue(
          "jabatanPihak2Opname"
        ),

      perusahaanPihak2:
        getElValue(
          "perusahaanPihak2Opname"
        ),


      /* DETAIL PEKERJAAN */

      pekerjaan:
        getElValue(
          "pekerjaanOpname"
        ),

      blok:
        getElValue(
          "blokOpname"
        ),

      waktuPelaksanaan:
        getElValue(
          "waktuPelaksanaanOpname"
        ),

      jumlah:
        getElValue(
          "jumlahOpname"
        ),

      progress:
        getElValue(
          "progressOpname"
        ),


      /* DIPERIKSA */

      diperiksa:
        getSelectValue(
          "namaDiperiksaOpnameSelect"
        ),

      jabatanDiperiksa:
        getElValue(
          "jabatanDiperiksaOpname"
        ),


      /* DIKETAHUI */

      diketahui:
        getSelectValue(
          "namaDiketahuiOpnameSelect"
        ),

      jabatanDiketahui:
        getElValue(
          "jabatanDiketahuiOpname"
        )

    }

  };


  return data;

}

function restoreMaterialDraft(rows) {
  const tbody = document.querySelector("#materialTable tbody");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (!Array.isArray(rows) || rows.length === 0) {
    return;
  }

  rows.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>

      <td>
        <input
          class="form-control"
          value="${escapeDraftValue(item.nama)}"
        >
      </td>

      <td>
        <input
          class="form-control"
          value="${escapeDraftValue(item.spesifikasi)}"
        >
      </td>

      <td>
        <input
          class="form-control"
          value="${escapeDraftValue(item.qty)}"
        >
      </td>

      <td>
        <input
          class="form-control"
          value="${escapeDraftValue(item.satuan)}"
        >
      </td>

      <td style="text-align:center;">
        <button
          type="button"
          onclick="hapusRow(this)"
          class="btn btn-sm btn-danger"
        >
          ✕
        </button>
      </td>
    `;

    tbody.appendChild(row);
  });
}


function escapeDraftValue(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function restoreOpnameDraft(opname) {

  if (!opname) return;


  /* =========================
     PIHAK PERTAMA
  ========================= */

  setDraftValue(
    "namaPihak1OpnameSelect",
    opname.pihak1
  );

  setDraftValue(
    "jabatanPihak1Opname",
    opname.jabatanPihak1
  );


  /* =========================
     PIHAK KEDUA
  ========================= */

  setDraftValue(
    "namaPihak2OpnameSelect",
    opname.pihak2
  );

  setDraftValue(
    "jabatanPihak2Opname",
    opname.jabatanPihak2
  );

  setDraftValue(
    "perusahaanPihak2Opname",
    opname.perusahaanPihak2
  );


  /* =========================
     DETAIL PEKERJAAN
  ========================= */

  setDraftValue(
    "pekerjaanOpname",
    opname.pekerjaan
  );

  setDraftValue(
    "blokOpname",
    opname.blok
  );

  setDraftValue(
    "waktuPelaksanaanOpname",
    opname.waktuPelaksanaan
  );

  setDraftValue(
    "jumlahOpname",
    opname.jumlah
  );

  setDraftValue(
    "progressOpname",
    opname.progress
  );


  /* =========================
     DIPERIKSA
  ========================= */

  setDraftValue(
    "namaDiperiksaOpnameSelect",
    opname.diperiksa
  );

  setDraftValue(
    "jabatanDiperiksaOpname",
    opname.jabatanDiperiksa
  );


  /* =========================
     DIKETAHUI
  ========================= */

  setDraftValue(
    "namaDiketahuiOpnameSelect",
    opname.diketahui
  );

  setDraftValue(
    "jabatanDiketahuiOpname",
    opname.jabatanDiketahui
  );

}


/* =========================================================
   SAVE DRAFT
========================================================= */

/* =========================================================
   SAVE DRAFT
   GOOGLE SHEETS + LOCAL CACHE
========================================================= */

async function saveDraft() {

  const data =
    collectDraftData();


  if (!data.jenis) {

    showToast(
      "Pilih jenis BA terlebih dahulu.",
      "warning"
    );

    return;
  }


  /* =========================
     LOADING SIMPAN DRAFT
  ========================= */

  showGlobalLoading(
    "Menyimpan draft..."
  );


  const now =
    new Date().toISOString();


  const currentUser =
    getCurrentBAUser();


  try {

    /* =====================================================
       UPDATE DRAFT YANG SEDANG DIEDIT
    ===================================================== */

    if (activeDraftId) {

      const drafts =
        getAllDrafts();


      const existingDraft =
        drafts.find(
          item =>
            item.id === activeDraftId
        );


      if (existingDraft) {

        const updatedDraft = {

          ...existingDraft,

          jenis:
            data.jenis,

          judul:
            getNamaJenisBA(
              data.jenis
            ),

          updatedAt:
            now,

          data:
            data

        };


        /* =========================
           UPDATE KE GOOGLE SHEETS
        ========================= */

        await sendDraftRequest({

          action:
            "update",

          table:
            DRAFT_TABLE,

          id:
            activeDraftId,

          data: {

            jenis:
              updatedDraft.jenis,

            judul:
              updatedDraft.judul,

            status:
              "draft",

            updatedAt:
              updatedDraft.updatedAt,

            createdBy:
              updatedDraft.createdBy ||
              {
                id:
                  currentUser.id,

                nama:
                  currentUser.nama,

                username:
                  currentUser.username,

                department:
                  currentUser.department
              },

            data:
              updatedDraft.data

          }

        });


        /* =========================
           REFRESH CACHE DARI SERVER
        ========================= */

        await loadDraftDatabase(false);


        /* =========================
           REFRESH TAMPILAN
        ========================= */

        if (
          typeof updateDraftStatus ===
          "function"
        ) {
          updateDraftStatus();
        }


        if (
          typeof updateDashboardStats ===
          "function"
        ) {
          updateDashboardStats();
        }


        if (
          typeof renderDraftList ===
          "function"
        ) {
          renderDraftList();
        }


        showToast(
          "Draft berhasil diperbarui!",
          "success"
        );


        return;

      }

    }


    /* =====================================================
       DRAFT BARU
    ===================================================== */

    const id =
      createDraftId();


    const draftBaru = {

      id:
        id,

      createdBy: {

        id:
          currentUser.id,

        nama:
          currentUser.nama,

        username:
          currentUser.username,

        department:
          currentUser.department

      },

      jenis:
        data.jenis,

      judul:
        getNamaJenisBA(
          data.jenis
        ),

      createdAt:
        now,

      updatedAt:
        now,

      data:
        data

    };


    /* =========================
       SIMPAN KE GOOGLE SHEETS
    ========================= */

    await sendDraftRequest({

      action:
        "create",

      table:
        DRAFT_TABLE,

      data: {

        id:
          draftBaru.id,

        jenis:
          draftBaru.jenis,

        judul:
          draftBaru.judul,

        status:
          "draft",

        createdAt:
          draftBaru.createdAt,

        updatedAt:
          draftBaru.updatedAt,

        createdBy:
          draftBaru.createdBy,

        data:
          draftBaru.data

      }

    });


    /* =========================
       SET DRAFT AKTIF
    ========================= */

    activeDraftId =
      id;


    /* =========================
       REFRESH DATABASE → CACHE
    ========================= */

    await loadDraftDatabase(false);


    /* =========================
       REFRESH TAMPILAN
    ========================= */

    if (
      typeof updateDraftStatus ===
      "function"
    ) {
      updateDraftStatus();
    }


    if (
      typeof updateDashboardStats ===
      "function"
    ) {
      updateDashboardStats();
    }


    if (
      typeof renderDraftList ===
      "function"
    ) {
      renderDraftList();
    }


    showToast(
      "Draft baru berhasil disimpan!",
      "success"
    );


  } catch (error) {

    console.error(
      "Gagal menyimpan Draft:",
      error
    );


    showToast(
      "Draft gagal disimpan ke database.",
      "error"
    );


  } finally {

    /* =====================================================
       LOADING SELALU DITUTUP
       BERHASIL / GAGAL / UPDATE
    ===================================================== */

    hideGlobalLoading();

  }

}


/* =========================================================
   LOAD / EDIT DRAFT
========================================================= */

function escapeDraftValue(value) {

  return String(
    value ?? ""
  )
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}

function loadDraft(id) {

  const drafts = getAllDrafts();

  const draft = drafts.find(item => item.id === id);

  if (!draft) {
    showToast("Draft tidak ditemukan!", "error");
    return;
  }

  const data = draft.data || {};

  // tandai bahwa kita sedang edit draft ini
  activeDraftId = draft.id;


  // ==========================================
  // 1. RESTORE JENIS BA
  // ==========================================

  const jenis = data.jenis || "";

  const jenisHidden =
    document.getElementById("jenis");

  if (jenisHidden) {
    jenisHidden.value = jenis;
  }


  const jenisSelect =
    document.getElementById("jenisSelect");

  if (jenisSelect) {
    jenisSelect.value = jenis;
  }


  if (typeof setJenisDropdown === "function") {
    setJenisDropdown(jenis);
  }

  if (typeof toggleJenis === "function") {
    toggleJenis();
  }


  // ==========================================
  // 2. RESTORE TTD STANDAR
  // ==========================================

  const useTtd4 =
    document.getElementById("useTtd4");

  if (useTtd4) {
    useTtd4.checked = !!data.useTtd4;
  }

  if (typeof toggleTtd4 === "function") {
    toggleTtd4();
  }


  // ==========================================
  // 3. RESTORE PIHAK BA STANDAR
  // ==========================================

  if ($("#nama1").length) {
    $("#nama1")
      .val(data.nama1 || "")
      .trigger("change");
  }

  if ($("#nama2").length) {
    $("#nama2")
      .val(data.nama2 || "")
      .trigger("change");
  }

  if ($("#nama3").length) {
    $("#nama3")
      .val(data.nama3 || "")
      .trigger("change");
  }

  if ($("#nama4").length) {
    $("#nama4")
      .val(data.nama4 || "")
      .trigger("change");
  }


  // ==========================================
  // 4. RESTORE EDITOR
  // ==========================================

  if (
    typeof qLatar !== "undefined" &&
    qLatar
  ) {
    qLatar.root.innerHTML =
      data.latar || "";
  }

  if (
    typeof qTujuan !== "undefined" &&
    qTujuan
  ) {
    qTujuan.root.innerHTML =
      data.tujuan || "";
  }

  if (
    typeof qKejadian !== "undefined" &&
    qKejadian
  ) {
    qKejadian.root.innerHTML =
      data.kejadian || "";
  }

  if (
    typeof qPenutup !== "undefined" &&
    qPenutup
  ) {
    qPenutup.root.innerHTML =
      data.penutup || "";
  }

    /* =====================================================
     RESTORE TABEL MATERIAL
  ===================================================== */

  if (
    Array.isArray(data.materialRows)
  ) {

    const tbody =
      document.querySelector(
        "#materialTable tbody"
      );


    if (tbody) {

      tbody.innerHTML = "";


      data.materialRows.forEach(
        (item, index) => {

          const row =
            document.createElement("tr");


          row.innerHTML = `
            <td>
              ${index + 1}
            </td>

            <td>
              <input
                type="text"
                class="form-control"
                value="${escapeDraftValue(item.nama)}"
              >
            </td>

            <td>
              <input
                type="text"
                class="form-control"
                value="${escapeDraftValue(item.spesifikasi)}"
              >
            </td>

            <td>
              <input
                type="text"
                class="form-control"
                value="${escapeDraftValue(item.qty)}"
              >
            </td>

            <td>
              <input
                type="text"
                class="form-control"
                value="${escapeDraftValue(item.satuan)}"
              >
            </td>
          `;


          tbody.appendChild(row);

        }
      );

    }

  }


  /* =====================================================
     RESTORE BA OPNAME
  ===================================================== */

  const opname =
    data.opname || {};


  function restoreInput(id, value) {

    const el =
      document.getElementById(id);

    if (el) {
      el.value =
        value !== undefined &&
        value !== null
          ? value
          : "";
    }

  }


  function restoreSelect(id, value) {

  const el =
    document.getElementById(id);


  if (!el) {
    return;
  }


  const safeValue =
    value !== undefined &&
    value !== null
      ? String(value)
      : "";


  /* =========================
     CEK OPTION
  ========================= */

  let optionExists =
    Array.from(
      el.options || []
    ).some(
      option =>
        String(option.value) ===
        safeValue
    );


  /*
    Jika value dari Riwayat belum
    terdapat pada option select,
    buat option temporary.
  */

  if (
    safeValue &&
    !optionExists
  ) {

    const newOption =
      new Option(
        safeValue,
        safeValue,
        true,
        true
      );


    el.add(
      newOption
    );

  }


  /* =========================
     SET VALUE NORMAL
  ========================= */

  el.value =
    safeValue;


  /* =========================
     SYNC SELECT2
  ========================= */

  if (
    typeof $ !== "undefined" &&
    $("#" + id).length
  ) {

    $("#" + id)
      .val(safeValue)
      .trigger("change");

  }

}


  restoreInput(
    "nomorOpname",
    opname.nomor
  );

  restoreInput(
    "kodeNomorOpname",
    opname.kode
  );

  restoreInput(
    "tanggalOpname",
    opname.tanggal
  );


  /* PIHAK PERTAMA */

  restoreSelect(
    "namaPihak1OpnameSelect",
    opname.pihak1
  );

  restoreInput(
    "jabatanPihak1Opname",
    opname.jabatanPihak1
  );


  /* PIHAK KEDUA */

  restoreSelect(
    "namaPihak2OpnameSelect",
    opname.pihak2
  );

  restoreInput(
    "jabatanPihak2Opname",
    opname.jabatanPihak2
  );

  restoreInput(
    "perusahaanPihak2Opname",
    opname.perusahaanPihak2
  );


  /* DETAIL PEKERJAAN */

  restoreInput(
    "pekerjaanOpname",
    opname.pekerjaan
  );

  restoreInput(
    "blokOpname",
    opname.blok
  );

  restoreInput(
    "waktuPelaksanaanOpname",
    opname.waktuPelaksanaan
  );

  restoreInput(
    "jumlahOpname",
    opname.jumlah
  );

  restoreInput(
    "progressOpname",
    opname.progress
  );


  /* DIPERIKSA */

  restoreSelect(
    "namaDiperiksaOpnameSelect",
    opname.diperiksa
  );

  restoreInput(
    "jabatanDiperiksaOpname",
    opname.jabatanDiperiksa
  );


  /* DIKETAHUI */

  restoreSelect(
    "namaDiketahuiOpnameSelect",
    opname.diketahui
  );

  restoreInput(
    "jabatanDiketahuiOpname",
    opname.jabatanDiketahui
  );


  /* =====================================================
     REFRESH PREVIEW SETELAH SEMUA DATA MASUK
  ===================================================== */

  setTimeout(() => {

    if (
      typeof generate === "function"
    ) {
      generate();
    }

  }, 150);


  // ==========================================
  // 5. RESTORE BA MATERIAL
  // ==========================================

  if (jenis === "material") {
    restoreMaterialDraft(
      data.materialRows || []
    );
  }


  // ==========================================
  // 6. RESTORE BA OPNAME
  // ==========================================

  if (jenis === "opname") {
    restoreOpnameDraft(
      data.opname || {}
    );
  }

  /* =========================================================
   FORM OPNAME BARU
========================================================= */

if (jenis === "form_opname") {

  const pageFormOpname =
    buildFormOpnamePages(
      kop,
      foot
    );

  document
    .getElementById("output")
    .innerHTML =
      pageFormOpname;


  requestAnimationFrame(
    () => {

      if (
        typeof applyPreviewZoom ===
        "function"
      ) {

        applyPreviewZoom();

      }

    }
  );


  scrollToPreview();

  return;

}


  // ==========================================
  // 7. BUKA HALAMAN EDIT
  // ==========================================

  if (typeof openPage === "function") {
    openPage("buatBA");
  }

  if (typeof showBAStep === "function") {
    showBAStep(1);
  }

  if (typeof syncStepByJenis === "function") {
    syncStepByJenis();
  }


  // ==========================================
  // 8. GENERATE PREVIEW OTOMATIS
  // ==========================================

  setTimeout(() => {

    if (typeof generate === "function") {
      generate();
    }

    if (typeof updateDraftStatus === "function") {
      updateDraftStatus();
    }

  }, 250);


  showToast(
    "Draft berhasil dimuat.",
    "success"
  );
}


/* =========================================================
   HAPUS SATU DRAFT
========================================================= */

/* =========================================================
   HAPUS SATU DRAFT
   GOOGLE SHEETS + CACHE
========================================================= */

/* =========================================================
   HAPUS SATU DRAFT
   GOOGLE SHEETS + CACHE + LOADING
========================================================= */

async function deleteDraft(id) {

  const drafts =
    getAllDrafts();


  const draft =
    drafts.find(
      item =>
        item.id === id
    );


  /* =====================================================
     CEK DRAFT
  ===================================================== */

  if (!draft) {

    showToast(
      "Draft tidak ditemukan.",
      "error"
    );

    return;

  }


  /* =====================================================
     KONFIRMASI HAPUS
  ===================================================== */

const yakin =
  await showConfirm({
    title: "Hapus Draft?",
    message: `Yakin ingin menghapus "${draft.judul}"?`,
    description: "Draft yang dihapus tidak dapat dikembalikan.",
    confirmText: "Hapus Draft",
    type: "danger"
  });


  if (!yakin) {
    return;
  }


  /* =====================================================
     MULAI LOADING
  ===================================================== */

  showGlobalLoading(
    "Menghapus draft..."
  );


  try {

    /* =====================================================
       HAPUS DARI GOOGLE SHEETS
    ===================================================== */

    await sendDraftRequest({

      action:
        "delete",

      table:
        DRAFT_TABLE,

      id:
        id

    });


    /* =====================================================
       RESET ACTIVE DRAFT
       JIKA DRAFT YANG DIHAPUS SEDANG DIBUKA
    ===================================================== */

    if (
      activeDraftId === id
    ) {

      activeDraftId = null;

    }


    /* =====================================================
       REFRESH DATABASE → CACHE
    ===================================================== */

    await loadDraftDatabase(false);


    /* =====================================================
       REFRESH TAMPILAN
    ===================================================== */

    if (
      typeof renderDraftList ===
      "function"
    ) {

      renderDraftList();

    }


    if (
      typeof updateDraftStatus ===
      "function"
    ) {

      updateDraftStatus();

    }


    if (
      typeof updateDashboardStats ===
      "function"
    ) {

      updateDashboardStats();

    }


    /* =====================================================
       BERHASIL
    ===================================================== */

    showToast(
      "Draft berhasil dihapus.",
      "warning"
    );


  } catch (error) {

    /* =====================================================
       GAGAL
    ===================================================== */

    console.error(
      "Gagal menghapus Draft:",
      error
    );


    showToast(
      "Draft gagal dihapus dari database.",
      "error"
    );


  } finally {

    /* =====================================================
       LOADING SELALU DITUTUP
    ===================================================== */

    hideGlobalLoading();

  }

}


/* =========================================================
   CLEAR SEMUA DRAFT
========================================================= */

async function clearDraft() {

  const drafts = getAllDrafts();


  if (!drafts.length) {

    showToast(
      "Tidak ada draft.",
      "warning"
    );

    return;

  }


  const yakin =
    await showConfirm({
      title: "Hapus Semua Draft?",
      message: "Yakin ingin menghapus seluruh Draft BA?",
      description: "Seluruh draft yang tersimpan akan dihapus.",
      confirmText: "Hapus Semua",
      type: "danger"
    });


  if (!yakin) {

    return;

  }


  localStorage.removeItem(
    BA_DRAFT_KEY
  );


  activeDraftId = null;


  showToast(
    "Semua draft berhasil dihapus.",
    "warning"
  );


  if (
    typeof renderDraftList ===
    "function"
  ) {

    renderDraftList();

  }


  if (
    typeof updateDraftStatus ===
    "function"
  ) {

    updateDraftStatus();

  }


  if (
    typeof updateDashboardStats ===
    "function"
  ) {

    updateDashboardStats();

  }

}


/* =========================================================
   BUAT DRAFT BARU / RESET ACTIVE ID
========================================================= */

function newDraft() {

  activeDraftId = null;

}


/* =========================================================
   JUMLAH DRAFT
========================================================= */

function getDraftCount() {

  return getAllDrafts().length;

}



function toggleSidebar(){
  let sidebar = document.getElementById("sidebar");
  let main = document.getElementById("mainPage");

  sidebar.classList.toggle("collapsed");
  main.classList.toggle("full");
}

function setJenisDropdown(value){
  const jenisHidden = document.getElementById("jenis");

  if (jenisHidden) {
    jenisHidden.value = value;
  }

  const desc = document.getElementById("jenisDesc");

  const deskripsi = {

    material:
      "Untuk permintaan barang/material project.",

    keterangan:
      "Untuk membuat keterangan kondisi pekerjaan di lapangan.",

    adendum:
      "Untuk perubahan, kendala, atau penyesuaian pekerjaan.",

    biaya:
      "BA pengajuan biaya dengan nomor, pembuka, penutup, dan tabel biaya manual.",

    urugan:
      "BA urugan dengan rincian rit, nota, rekening, dan dokumentasi foto per rit.",

    opname:
      "BA opname lapangan dengan data pekerjaan, progress, tanda tangan, dan lampiran foto.",

    form_opname:
      "Form pencairan opname dengan perhitungan nominal, retensi 5%, progress 95%, dan EAF."

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

  loginForm.addEventListener("submit", async function(e){
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

let masterUsers = [];
let loginUser = null;


/*
   ADMIN UTAMA
*/

if (
  user === "admin" &&
  pass === "admin123"
) {

  loginUser = {

    id: "ADMIN",

    nama:
      "Administrator",

    username:
      "admin",

    department:
      "Purchasing",

    role:
      "full_access",

    status:
      "aktif"

  };

}


/* =========================================================
   LOGIN MASTER USER - GOOGLE SHEETS
========================================================= */

if (!loginUser) {

  try {

    /*
      Ambil user terbaru langsung
      dari Google Sheets USERS.
    */

    masterUsers =
      await fetchMasterUsersFromAPI();


    /*
      Update cache lokal.

      Cache ini tetap berguna untuk
      tampilan Master User.
    */

    setMasterUsers(
      masterUsers
    );


    /*
      Cari username + password +
      status harus aktif.
    */

    loginUser =
      masterUsers.find(
        item =>

          String(
            item.username || ""
          )
            .trim()
            .toLowerCase()
          ===
          user
            .trim()
            .toLowerCase()

          &&

          String(
            item.password || ""
          ) ===
          String(pass)

          &&

          String(
            item.status || ""
          )
            .trim()
            .toLowerCase()
          ===
          "aktif"
      );


  } catch (error) {

    console.error(
      "LOGIN DATABASE ERROR:",
      error
    );


    /*
      Jika Google Sheets gagal diakses,
      jangan membuat user baru.

      Gunakan cache terakhir yang
      pernah berhasil diambil.
    */

    masterUsers =
      getMasterUsers();


    loginUser =
      masterUsers.find(
        item =>

          String(
            item.username || ""
          )
            .trim()
            .toLowerCase()
          ===
          user
            .trim()
            .toLowerCase()

          &&

          String(
            item.password || ""
          ) ===
          String(pass)

          &&

          String(
            item.status || ""
          )
            .trim()
            .toLowerCase()
          ===
          "aktif"
      );

  }

}


if (loginUser) {

  setCurrentBAUser(
    loginUser
  );

  updateLoggedInUserUI();

  let loading = document.getElementById("loadingOverlay");
  loading.style.display = "flex";

   setTimeout(() => {

      loginPage.style.display = "none";
      mainPage.style.display = "block";

      // tampilkan sidebar
      document.getElementById("sidebar").style.display = "block";

      // update identitas user
      updateLoggedInUserUI();

      // tampilkan draft panel
      showDraft();

      // tutup loading terlebih dahulu
      loading.style.display = "none";

      // buka halaman dashboard
      openPage("dashboard");

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

function toggleJenis() {

  const jenisHidden =
    document.getElementById("jenis");

  const jenisSelect =
    document.getElementById("jenisSelect");


  const j =
    jenisHidden && jenisHidden.value
      ? jenisHidden.value
      : (
          jenisSelect
            ? jenisSelect.value
            : "material"
        );


  /* =====================================================
     AMBIL SEMUA BOX
  ===================================================== */

  const standardContentBox =
    document.getElementById(
      "standardContentBox"
    );

  const materialBox =
    document.getElementById(
      "materialBox"
    );

  const adendumBox =
    document.getElementById(
      "adendumBox"
    );

  const biayaBox =
    document.getElementById(
      "biayaBox"
    );

  const uruganBox =
    document.getElementById(
      "uruganBox"
    );

  const opnameBox =
    document.getElementById(
      "opnameBox"
    );

  const formOpnameBox =
    document.getElementById(
      "formOpnameBox"
    );

  const pihakCard =
    document.getElementById(
      "pihakCard"
    );

  const standardTtdLampiranBox =
    document.getElementById(
      "standardTtdLampiranBox"
    );

  const opnameLampiranStep =
    document.getElementById(
      "opnameLampiranStep"
    );


  /* =====================================================
     IDENTIFIKASI JENIS
  ===================================================== */

  const isFormOpname =
    j === "form_opname";

  const isUrugan =
    j === "urugan";

  const isOpname =
    j === "opname";

  const isBiaya =
    j === "biaya";

  const isMaterial =
    j === "material";

  const isAdendum =
    j === "adendum";

  const isKeterangan =
    j === "keterangan";

  const isStandard =
    isMaterial ||
    isKeterangan ||
    isAdendum ||
    isBiaya;


  /* =====================================================
     ISI BERITA ACARA STANDARD

     material
     keterangan
     adendum

     biaya punya box sendiri
     urugan punya box sendiri
     opname punya box sendiri
     form opname punya box sendiri
  ===================================================== */

  if (standardContentBox) {

    standardContentBox.style.display =
      (
        isBiaya ||
        isUrugan ||
        isOpname ||
        isFormOpname
      )
        ? "none"
        : "block";

  }


  /* =====================================================
     MATERIAL
  ===================================================== */

  if (materialBox) {

    materialBox.style.display =
      isMaterial
        ? "block"
        : "none";

  }


  /* =====================================================
     ADENDUM
  ===================================================== */

  if (adendumBox) {

    adendumBox.style.display =
      isAdendum
        ? "block"
        : "none";

  }


  /* =====================================================
     PENGAJUAN BIAYA
  ===================================================== */

  if (biayaBox) {

    biayaBox.style.display =
      isBiaya
        ? "block"
        : "none";

  }


    /* =====================================================
      BA URUGAN

      Step 2 tetap menampilkan form Urugan.
      Yang dihilangkan hanya:
      - Pihak Terkait
      - Lampiran step terpisah
    ===================================================== */

    if (uruganBox) {

      uruganBox.style.display =
        isUrugan
          ? "block"
          : "none";

    }


    if (isUrugan) {

      if (pihakCard) {
        pihakCard.style.display = "none";
      }

      if (standardTtdLampiranBox) {
        standardTtdLampiranBox.style.display = "none";
      }

      if (opnameLampiranStep) {
        opnameLampiranStep.style.display = "none";
      }

    }


  /* =====================================================
     BA OPNAME LAPANGAN
     JANGAN DIGABUNG DENGAN FORM OPNAME
  ===================================================== */

  if (opnameBox) {

    opnameBox.style.display =
      isOpname
        ? "block"
        : "none";

  }


  /* =====================================================
     FORM OPNAME BARU
  ===================================================== */

  if (formOpnameBox) {

    formOpnameBox.style.display =
      isFormOpname
        ? "block"
        : "none";

  }


  /* =====================================================
     PIHAK TERKAIT

     ADA:
     - Material
     - Keterangan
     - Adendum
     - Pengajuan Biaya

     TIDAK ADA:
     - Urugan
     - Opname Lapangan
     - Form Opname
  ===================================================== */

  if (pihakCard) {

    pihakCard.style.display =
      isStandard
        ? "block"
        : "none";

  }


  /* =====================================================
     LAMPIRAN STANDARD

     Hanya BA standard yang menggunakan
     standardTtdLampiranBox.

     Urugan = upload sendiri
     Opname = opnameLampiranStep
     Form Opname = tidak ada lampiran
  ===================================================== */

  if (standardTtdLampiranBox) {

    standardTtdLampiranBox.style.display =
      isStandard
        ? "block"
        : "none";

  }


  /* =====================================================
     LAMPIRAN KHUSUS BA OPNAME LAPANGAN
  ===================================================== */

  if (opnameLampiranStep) {

    opnameLampiranStep.style.display =
      isOpname
        ? "block"
        : "none";

  }


  /* =====================================================
     TTD STANDARD

     Jangan jalankan untuk:
     - Urugan
     - Opname Lapangan
     - Form Opname
  ===================================================== */

  if (isStandard) {

    if (
      typeof toggleTtd4 ===
      "function"
    ) {

      toggleTtd4();

    }

  }


  /* =====================================================
     FORM OPNAME
     REALTIME PREVIEW
  ===================================================== */

  if (isFormOpname) {

    if (
      typeof syncFormOpnameFinal ===
      "function"
    ) {

      syncFormOpnameFinal();

    }

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

  const count = Math.min(files.length, 6);

  let html = `<div class="urugan-photo-grid urugan-nota-grid nota-count-${count}">`;

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

const MATERIAL_MAX_PAGE1 = 13;
const MATERIAL_PAGE_LIMIT = 30;

function getMaterialRowsData() {
  const rows = document.querySelectorAll('#materialTable tbody tr');
  const data = [];

  rows.forEach((row) => {
    const inputs = row.querySelectorAll('input');

    data.push({
      no: row.cells[0] ? row.cells[0].innerText : "",
      nama: inputs[0] ? inputs[0].value : "",
      spesifikasi: inputs[1] ? inputs[1].value : "",
      qty: inputs[2] ? inputs[2].value : "",
      satuan: inputs[3] ? inputs[3].value : ""
    });
  });

  return data;
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

const jenisHidden = document.getElementById("jenis");
const jenisSelect = document.getElementById("jenisSelect");

let jenis = jenisHidden
  ? jenisHidden.value
  : (jenisSelect ? jenisSelect.value : "material");
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

let kalimatPembuka = (jenis === "biaya" || jenis === "urugan" || jenis === "opname")
  ? ""
  : getKalimatPembukaBA(jenis);

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

  applyPreviewZoom();


  setTimeout(() => {

    fitFirstPage();

    applyPreviewZoom();

  }, 250);

});

  scrollToPreview();
  return;
}

if (jenis === "opname") {
  const pageOpname = buildOpnamePages(kop, foot);

  document.getElementById("output").innerHTML = pageOpname;

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

/* =========================================================
   MASTER PIHAK
========================================================= */

const MASTER_PIHAK_KEY = "masterPihak";


/* =========================================================
   GOOGLE SHEETS DATABASE API
========================================================= */

const DATABASE_API_URL =
  "https://script.google.com/macros/s/AKfycbyCN712Er-X-YO9ucdEsUbLOODWQ2dOKxwRmEfJ2wOuq1913btHpaQZav3NCe4AXAZ5/exec";

const MASTER_PIHAK_TABLE = "PIHAK";

const MASTER_PROJECT_TABLE = "PROJECTS";

const MASTER_USER_TABLE = "USERS";

/* =========================================================
   GET PIHAK DARI GOOGLE SHEETS
========================================================= */

async function fetchMasterPihakFromAPI() {

  const response =
    await fetch(
      DATABASE_API_URL +
      "?table=" +
      MASTER_PIHAK_TABLE,
      {
        method: "GET",
        cache: "no-store"
      }
    );


  if (!response.ok) {

    throw new Error(
      "Gagal terhubung ke database."
    );

  }


  const result =
    await response.json();


  if (!result.success) {

    throw new Error(
      result.message ||
      "Gagal mengambil Master Pihak."
    );

  }


  return Array.isArray(result.data)
    ? result.data
    : [];

}


/* =========================================================
   POST REQUEST
========================================================= */

async function sendMasterPihakRequest(
  payload
) {

  const response =
    await fetch(
      DATABASE_API_URL,
      {
        method: "POST",

        /*
          Sengaja memakai text/plain.

          Ini membantu penggunaan Apps Script
          dari GitHub Pages tanpa preflight
          CORS application/json.
        */

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(payload)
      }
    );


  if (!response.ok) {

    throw new Error(
      "Database tidak merespons."
    );

  }


  const result =
    await response.json();


  if (!result.success) {

    throw new Error(
      result.message ||
      "Operasi database gagal."
    );

  }


  return result;

}

/* =========================================================
   GET / SET DATA
========================================================= */

function getMasterPihak() {

  try {

    const data =
      JSON.parse(
        localStorage.getItem(
          MASTER_PIHAK_KEY
        )
      );

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {

    return [];

  }

}


function setMasterPihak(data) {

  localStorage.setItem(
    MASTER_PIHAK_KEY,
    JSON.stringify(data)
  );

}


/* =========================================================
   CREATE ID
========================================================= */

function createMasterPihakId() {

  return (
    "PHK-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()
  );

}


/* =========================================================
   INITIALIZE / MIGRATION
========================================================= */

function initializeMasterPihak() {

  const existing =
    getMasterPihak();


  /*
    Jika Master Pihak sudah pernah dibuat,
    jangan isi ulang data default.
  */

  if (existing.length) {
    return;
  }


  /*
    Cek dataOrang lama.
    Jika sebelumnya user sudah pernah
    menambah pihak dari BA, datanya
    otomatis dimigrasikan.
  */

  let oldData = [];

  try {

    oldData =
      JSON.parse(
        localStorage.getItem(
          "dataOrang"
        )
      ) || [];

  } catch (error) {

    oldData = [];

  }


  /*
    Default lama jika dataOrang
    belum pernah tersimpan.
  */

  if (!oldData.length) {

    oldData = [

      {
        nama:
          "Khalid Rizky Pratama",

        jabatan:
          "Pelaksana Project"
      },

      {
        nama:
          "Tedi Yanuar",

        jabatan:
          "Project Manager"
      },

      {
        nama:
          "Teuku Raja Sri Mustika",

        jabatan:
          "GM Production"
      }

    ];

  }


  const now =
    new Date().toISOString();


  const migrated =
    oldData.map(item => ({

      id:
        createMasterPihakId(),

      nama:
        item.nama || "",

      jabatan:
        item.jabatan || "",

      department:
        item.department || "",

      status:
        "aktif",

      createdAt:
        now,

      updatedAt:
        now

    }));


  setMasterPihak(
    migrated
  );

}


/* =========================================================
   COMPATIBILITY DATA ORANG
========================================================= */

/*
  Beberapa fungsi BA lama masih menggunakan
  variable dataOrang.

  Variable ini tetap dipertahankan supaya
  fungsi BA existing tidak rusak.
*/

let dataOrang = [];


function syncDataOrangFromMaster() {

  const master =
    getMasterPihak();


  dataOrang =
    master
      .filter(
        item =>
          item.status === "aktif"
      )
      .map(item => ({

        id:
          item.id,

        nama:
          item.nama,

        jabatan:
          item.jabatan,

        department:
          item.department || ""

      }));


  /*
    Cache localStorage.

    Ini bukan database utama lagi.
    Hanya fallback jika internet/API bermasalah.
  */

  localStorage.setItem(
    "dataOrang",
    JSON.stringify(dataOrang)
  );

}

/* =========================================================
   LOAD MASTER PIHAK DATABASE
========================================================= */

async function loadMasterPihakDatabase(
  showLoading = true
) {

  const tbody =
    document.getElementById(
      "masterPihakList"
    );


  try {

    if (
      showLoading &&
      tbody
    ) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="5"
            class="master-pihak-empty"
          >
            Mengambil data database...
          </td>

        </tr>

      `;

    }


    const data =
      await fetchMasterPihakFromAPI();


    /*
      Google Sheets sekarang menjadi
      sumber data utama.
    */

    setMasterPihak(
      data
    );


    syncDataOrangFromMaster();

    loadDropdown();

    renderMasterPihak();


    return data;


  } catch (error) {

    console.error(
      "MASTER PIHAK API:",
      error
    );


    /*
      Jika database tidak dapat diakses,
      gunakan cache terakhir.
    */

    syncDataOrangFromMaster();

    loadDropdown();

    renderMasterPihak();


    if (showLoading) {

      showToast(
        "Database online tidak dapat diakses. Menggunakan data terakhir.",
        "#f79009"
      );

    }


    return getMasterPihak();

  }

}


/* =========================================================
   LOAD DROPDOWN SELURUH BA
========================================================= */

function loadDropdown() {

  syncDataOrangFromMaster();


  const dropdownIds = [

    /* BA MATERIAL */

    "nama1",
    "nama2",
    "nama3",
    "nama4",


    /* BA OPNAME */

    "namaPihak1OpnameSelect",
    "namaPihak2OpnameSelect",
    "namaDiperiksaOpnameSelect",
    "namaDiketahuiOpnameSelect"

  ];


  dropdownIds.forEach(id => {

    const select =
      document.getElementById(id);


    if (!select) {
      return;
    }


    /*
      Simpan ID pihak yang sedang dipilih
      sebelum dropdown dirender ulang.
    */

    let selectedId = "";

    const oldIndex =
      select.value;


    if (
      oldIndex !== "" &&
      dataOrang[oldIndex]
    ) {

      selectedId =
        dataOrang[oldIndex].id;

    }


    select.innerHTML =
      `<option value="">
        -- Pilih Pihak --
      </option>`;


    dataOrang.forEach(
      (item, index) => {

        const option =
          document.createElement(
            "option"
          );


        /*
          Kita tetap menggunakan index
          sebagai value supaya setJabatan()
          dan sistem BA existing tetap aman.
        */

        option.value =
          index;


        option.textContent =
          item.nama;


        option.dataset.pihakId =
          item.id;


        select.appendChild(
          option
        );

      }
    );


    /*
      Restore pilihan jika masih tersedia.
    */

    if (selectedId) {

      const options =
        Array.from(
          select.options
        );


      const target =
        options.find(
          option =>
            option.dataset.pihakId ===
            selectedId
        );


      if (target) {

        select.value =
          target.value;

      }

    }

  });

}


/* =========================================================
   AUTO ISI JABATAN
========================================================= */

function setJabatan(
  select,
  targetId
) {

  const index =
    select.value;


  const input =
    document.getElementById(
      targetId
    );


  if (!input) {
    return;
  }


  if (
    index !== "" &&
    dataOrang[index]
  ) {

    input.value =
      dataOrang[index].jabatan;

  } else {

    input.value = "";

  }


  /*
    Trigger event supaya live preview BA
    ikut membaca perubahan jabatan.
  */

  input.dispatchEvent(
    new Event(
      "input",
      {
        bubbles: true
      }
    )
  );

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openPihakModal(id = null) {

  const modal =
    document.getElementById(
      "pihakModal"
    );


  if (!modal) {
    return;
  }


  document.getElementById(
    "pihakEditId"
  ).value = "";


  document.getElementById(
    "pihakNama"
  ).value = "";


  document.getElementById(
    "pihakJabatan"
  ).value = "";


  document.getElementById(
    "pihakDepartemen"
  ).value = "";


  document.getElementById(
    "pihakStatus"
  ).value = "aktif";


  document.getElementById(
    "pihakModalTitle"
  ).textContent =
    "Tambah Pihak";


  /*
    MODE EDIT
  */

  if (id) {

    const pihak =
      getMasterPihak()
        .find(
          item =>
            item.id === id
        );


    if (!pihak) {
      return;
    }


    document.getElementById(
      "pihakEditId"
    ).value =
      pihak.id;


    document.getElementById(
      "pihakNama"
    ).value =
      pihak.nama || "";


    document.getElementById(
      "pihakJabatan"
    ).value =
      pihak.jabatan || "";


    document.getElementById(
      "pihakDepartemen"
    ).value =
      pihak.department || "";


    document.getElementById(
      "pihakStatus"
    ).value =
      pihak.status || "aktif";


    document.getElementById(
      "pihakModalTitle"
    ).textContent =
      "Edit Pihak";

  }


  modal.classList.add(
    "active"
  );


  setTimeout(() => {

    document.getElementById(
      "pihakNama"
    )?.focus();

  }, 100);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closePihakModal() {

  const modal =
    document.getElementById(
      "pihakModal"
    );


  if (!modal) {
    return;
  }


  modal.classList.remove(
    "active"
  );

}


/* =========================================================
   SAVE MASTER PIHAK
========================================================= */

async function saveMasterPihak() {

  const saveButton =
    document.querySelector(
      ".pihak-save-btn"
    );

  const id =
    document.getElementById(
      "pihakEditId"
    ).value;

  const nama =
    document.getElementById(
      "pihakNama"
    ).value.trim();

  const jabatan =
    document.getElementById(
      "pihakJabatan"
    ).value.trim();

  const department =
    document.getElementById(
      "pihakDepartemen"
    ).value.trim();

  const status =
    document.getElementById(
      "pihakStatus"
    ).value;


  /* =========================
     VALIDASI
  ========================= */

  if (!nama) {

    showToast(
      "Nama pihak wajib diisi.",
      "#dc3545"
    );

    return;
  }


  if (!jabatan) {

    showToast(
      "Jabatan wajib diisi.",
      "#dc3545"
    );

    return;
  }


  /* =========================
     CEK DUPLIKAT
  ========================= */

  const existing =
    getMasterPihak();

  const duplicate =
    existing.find(item =>

      String(item.nama || "")
        .trim()
        .toLowerCase()
        ===
      nama.toLowerCase()

      &&

      String(item.id) !==
      String(id)

    );


  if (duplicate) {

    showToast(
      "Nama pihak sudah tersedia.",
      "#dc3545"
    );

    return;
  }


  const data = {

    nama: nama,

    jabatan: jabatan,

    department: department,

    status: status

  };


  /* =========================
     MULAI LOADING
  ========================= */

  showGlobalLoading(
    id
      ? "Memperbarui pihak..."
      : "Menyimpan pihak..."
  );


  try {

    if (saveButton) {

      saveButton.disabled = true;

      saveButton.textContent =
        "Menyimpan...";

    }


    /* =========================
       UPDATE
    ========================= */

    if (id) {

      await sendMasterPihakRequest({

        action: "update",

        table:
          MASTER_PIHAK_TABLE,

        id: id,

        data: data

      });

    }


    /* =========================
       CREATE
    ========================= */

    else {

      await sendMasterPihakRequest({

        action: "create",

        table:
          MASTER_PIHAK_TABLE,

        data: data

      });

    }


    updateGlobalLoading(
      "Memperbarui data pihak..."
    );


    /*
      Ambil ulang data dari
      Google Sheets
    */

    await loadMasterPihakDatabase(
      false
    );


    closePihakModal();


    showToast(

      id
        ? "Data pihak berhasil diperbarui."
        : "Pihak berhasil ditambahkan.",

      "success"

    );


  } catch (error) {

    console.error(
      "Gagal menyimpan pihak:",
      error
    );


    showToast(
      "Gagal menyimpan ke database: " +
      error.message,
      "#dc3545"
    );


  } finally {

    /* =========================
       MATIKAN LOADING
    ========================= */

    hideGlobalLoading();


    if (saveButton) {

      saveButton.disabled =
        false;

      saveButton.textContent =
        "Simpan Pihak";

    }

  }

}


/* =========================================================
   DELETE MASTER PIHAK
========================================================= */

async function deleteMasterPihak(id) {

  const pihak =
    getMasterPihak();


  const target =
    pihak.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!target) {

    showToast(
      "Data pihak tidak ditemukan.",
      "#dc3545"
    );

    return;
  }


  /* =========================
     KONFIRMASI DULU
  ========================= */

const confirmDelete =
  await showConfirm({
    title: "Hapus Pihak?",
    message: `Yakin ingin menghapus "${target.nama}"?`,
    description: "Pihak ini tidak akan tersedia lagi pada dropdown BA.",
    confirmText: "Hapus Pihak",
    type: "danger"
  });


  if (!confirmDelete) {
    return;
  }


  /* =========================
     MULAI LOADING
  ========================= */

  showGlobalLoading(
    "Menghapus pihak..."
  );


  try {

    await sendMasterPihakRequest({

      action: "delete",

      table:
        MASTER_PIHAK_TABLE,

      id: id

    });


    updateGlobalLoading(
      "Memperbarui data pihak..."
    );


    /*
      Ambil ulang database
      Google Sheets
    */

    await loadMasterPihakDatabase(
      false
    );


    showToast(
      "Pihak berhasil dihapus.",
      "success"
    );


  } catch (error) {

    console.error(
      "Gagal menghapus pihak:",
      error
    );


    showToast(
      "Gagal menghapus data: " +
      error.message,
      "#dc3545"
    );


  } finally {

    /* =========================
       MATIKAN LOADING
    ========================= */

    hideGlobalLoading();

  }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapePihakHTML(value) {

  return String(
    value ?? ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   RENDER MASTER PIHAK
========================================================= */

function renderMasterPihak() {

  initializeMasterPihak();


  const pihak =
    getMasterPihak();


  const search =
    (
      document.getElementById(
        "pihakSearch"
      )?.value || ""
    )
      .trim()
      .toLowerCase();


  const status =
    document.getElementById(
      "pihakStatusFilter"
    )?.value || "";


  const filtered =
    pihak.filter(item => {


      /* STATUS */

      if (
        status &&
        item.status !== status
      ) {

        return false;

      }


      /* SEARCH */

      if (search) {

        const text =
          (
            (item.nama || "") +
            " " +
            (item.jabatan || "") +
            " " +
            (item.department || "")
          )
            .toLowerCase();


        if (
          !text.includes(search)
        ) {

          return false;

        }

      }


      return true;

    });


  /* SUMMARY */

  const total =
    document.getElementById(
      "pihakTotal"
    );


  const aktif =
    document.getElementById(
      "pihakAktif"
    );


  if (total) {

    total.textContent =
      pihak.length;

  }


  if (aktif) {

    aktif.textContent =
      pihak.filter(
        item =>
          item.status === "aktif"
      ).length;

  }


  /* TABLE */

  const tbody =
    document.getElementById(
      "masterPihakList"
    );


  if (!tbody) {
    return;
  }


  if (!filtered.length) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="master-pihak-empty"
        >

          Data pihak tidak ditemukan.

        </td>

      </tr>

    `;

    return;

  }


  tbody.innerHTML =
    filtered.map(item => `

      <tr>

        <td>

          <strong>
            ${escapePihakHTML(
              item.nama
            )}
          </strong>

        </td>


        <td>

          ${escapePihakHTML(
            item.jabatan
          )}

        </td>


        <td>

          ${
            item.department

              ? escapePihakHTML(
                  item.department
                )

              : `<span style="color:#9ca3af;">-</span>`
          }

        </td>


        <td>

          <span
            class="pihak-status
            ${item.status}"
          >

            ${
              item.status === "aktif"
                ? "Aktif"
                : "Nonaktif"
            }

          </span>

        </td>


        <td>

          <div class="pihak-action-group">

            <button
              type="button"
              class="pihak-edit-btn"
              onclick="openPihakModal('${item.id}')"
            >
              Edit
            </button>


            <button
              type="button"
              class="pihak-delete-btn"
              onclick="deleteMasterPihak('${item.id}')"
            >
              Hapus
            </button>

          </div>

        </td>

      </tr>

    `).join("");

}


/* =========================================================
   INITIAL LOAD
========================================================= */

/* =========================================================
   MASTER PIHAK INITIAL CACHE
========================================================= */

syncDataOrangFromMaster();


document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadMasterPihakDatabase(
      false
    );

  }
);

$(document).ready(function() {
  $("#nama1, #nama2, #nama3, #nama4, #namaPihak1OpnameSelect, #namaPihak2OpnameSelect, #namaDiperiksaOpnameSelect, #namaDiketahuiOpnameSelect").select2({
    placeholder: "Cari nama...",
    width: "100%"
  });
});


/* =========================================================
   Fungsi tambahan agar tombol export tidak error
========================================================= */


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

/* =========================================================
   =========================================================
   BA GENERATOR — DESIGN B CONTROLLER
   VERSION 1.0
   =========================================================
   ========================================================= */


/* =========================================================
   01. STATE
========================================================= */

let currentBAStep = 1;
let previewZoom = 1;
let previewManualZoom = false;

function applyPreviewZoom() {
  const output = document.getElementById("output");

  if (!output) return;

  output.style.transformOrigin = "top left";
  output.style.transform = `scale(${previewZoom})`;
}


/* =========================================================
   AUTO FIT PREVIEW SESUAI LEBAR PANEL
========================================================= */

function fitPreviewToContainer() {

  // kalau user sudah menekan + / -, jangan auto reset
  if (previewManualZoom) return;

  const output = document.getElementById("output");

  const previewBody =
    document.querySelector(".preview-modern-body") ||
    document.querySelector(".preview-workspace-card") ||
    document.querySelector(".workspace-preview");

  if (!output || !previewBody) return;

  const page = output.querySelector(".page");

  if (!page) return;


  /*
    Ambil lebar asli halaman A4.
    offsetWidth tidak terpengaruh transform scale.
  */
  const pageWidth = page.offsetWidth;

  /*
    Lebar panel yang tersedia.
    Dikurangi sedikit supaya ada margin kiri-kanan.
  */
  const availableWidth =
    previewBody.clientWidth - 32;


  if (!pageWidth || !availableWidth) return;


  let scale = availableWidth / pageWidth;


  /*
    Jangan otomatis memperbesar lebih dari 100%.
    Tapi boleh mengecil mengikuti layar.
  */
  scale = Math.min(scale, 1);


  /*
    Batas minimum supaya tidak terlalu kecil.
  */
  scale = Math.max(scale, 0.35);


  previewZoom = scale;

  applyPreviewZoom();
}




/* =========================================================
   02. PAGE NAVIGATION
========================================================= */

function openPage(pageName) {

  const pages =
    document.querySelectorAll(".app-page");

  const menus =
    document.querySelectorAll(".sidebar-item");


  /* -----------------------------------------
     Hide seluruh page
  ----------------------------------------- */

  pages.forEach(page => {

    page.classList.remove("active");

  });


  /* -----------------------------------------
     Show target page
  ----------------------------------------- */

  const targetPage =
    document.getElementById(
      "page-" + pageName
    );


  if (targetPage) {

    targetPage.classList.add("active");

  }


  /* -----------------------------------------
     Reset menu sidebar
  ----------------------------------------- */

  menus.forEach(menu => {

    menu.classList.remove("active");

  });


  /* -----------------------------------------
     Active menu
  ----------------------------------------- */

  const targetMenu =
    document.querySelector(
      `.sidebar-item[data-page="${pageName}"]`
    );


  if (targetMenu) {

    targetMenu.classList.add("active");

  }


  /* -----------------------------------------
     Scroll page ke atas
  ----------------------------------------- */

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });


  /* -----------------------------------------
     Tutup sidebar mobile
  ----------------------------------------- */

  if (window.innerWidth <= 768) {

    const sidebar =
      document.getElementById("sidebar");


    if (sidebar) {

      sidebar.classList.remove(
        "mobile-open"
      );

    }

  }


    /* -----------------------------------------
      Refresh dashboard jika dibuka
    ----------------------------------------- */

    if (pageName === "dashboard") {

      renderDashboard();

      updateLoggedInUserUI();

    }

    if (pageName === "draft") {

      loadDraftDatabase();

    }

    if (pageName === "riwayat") {

      loadBARecordDatabase();

    }

    if (pageName === "laporan") {

      renderLaporan();

    }

    if (pageName === "project") {

      loadMasterProjectDatabase();

    }

    if (pageName === "buatBA") {

      loadMasterProjectDatabase(
        false
      );

    }

    if (pageName === "user") {

      loadMasterUserDatabase();

    }

    if (pageName === "pihak") {

      loadMasterPihakDatabase();

    }

  

}


/* =========================================================
   03. SIDEBAR TOGGLE
   Override fungsi lama
========================================================= */

function toggleSidebar() {

  const sidebar =
    document.getElementById("sidebar");


  if (!sidebar) {

    return;

  }


  /* MOBILE */

  if (window.innerWidth <= 768) {

    sidebar.classList.toggle(
      "mobile-open"
    );

    return;

  }


  /* DESKTOP */

  sidebar.classList.toggle(
    "collapsed"
  );


  /* Simpan preference */

  try {

    localStorage.setItem(

      "baSidebarCollapsed",

      sidebar.classList.contains(
        "collapsed"
      )
        ? "1"
        : "0"

    );

  } catch (error) {

    console.warn(
      "Sidebar preference gagal disimpan.",
      error
    );

  }

}


/* =========================================================
   04. RESTORE SIDEBAR
========================================================= */

function restoreSidebarState() {

  const sidebar =
    document.getElementById("sidebar");


  if (!sidebar) {

    return;

  }


  if (window.innerWidth <= 768) {

    sidebar.classList.remove(
      "collapsed"
    );

    return;

  }


  try {

    const collapsed =
      localStorage.getItem(
        "baSidebarCollapsed"
      );


    if (collapsed === "1") {

      sidebar.classList.add(
        "collapsed"
      );

    } else {

      sidebar.classList.remove(
        "collapsed"
      );

    }

  } catch (error) {

    console.warn(
      "Sidebar preference tidak dapat dibaca.",
      error
    );

  }

}


/* =========================================================
   05. HELPER FLOW STEP BA
========================================================= */

function getBAJenisStepper() {

  const jenisSelect =
    document.getElementById("jenisSelect");

  const jenisHidden =
    document.getElementById("jenis");

  return (
    jenisSelect?.value ||
    jenisHidden?.value ||
    "material"
  );

}


function getBAStepsAktif() {

  const jenis = getBAJenisStepper();

  /*
    STANDARD
    1 Informasi
    2 Isi BA
    3 Pihak Terkait
    4 Lampiran
  */
  if (
    jenis === "material" ||
    jenis === "keterangan" ||
    jenis === "adendum" ||
    jenis === "biaya"
  ) {
    return [1, 2, 3, 4];
  }


  /*
    BA URUGAN
    Hanya:
    1 Informasi
    2 Isi BA

    Tidak ada:
    - Pihak Terkait
    - Lampiran
  */
  if (jenis === "urugan") {
    return [1, 2];
  }


  /*
    BA OPNAME LAPANGAN
    1 Informasi
    2 Isi BA
    4 Lampiran khusus opname

    Step 3 dilewati.
  */
  if (jenis === "opname") {
    return [1, 2, 4];
  }


  /*
    FORM OPNAME
    Standalone
  */
  if (jenis === "form_opname") {
    return [1];
  }


  return [1, 2, 3, 4];

}


/* =========================================================
   06. STEP NAVIGATION
========================================================= */

function showBAStep(stepNumber) {

  const jenis =
    getBAJenisStepper();

  const activeSteps =
    getBAStepsAktif();


  /*
    FORM OPNAME tidak menggunakan
    stepper BA normal.
  */
  if (jenis === "form_opname") {

    currentBAStep = 1;

    document
      .querySelectorAll(".ba-step")
      .forEach(step => {

        step.style.display = "none";

      });


    if (
      typeof setupFormOpnameSingleProcess === "function"
    ) {

      setupFormOpnameSingleProcess();

    }


    if (
      typeof syncFormOpnameFinal === "function"
    ) {

      syncFormOpnameFinal();

    }

    return;

  }


  /*
    Jika step yang diminta tidak termasuk
    flow BA aktif, jangan masuk ke step itu.
  */
  if (!activeSteps.includes(stepNumber)) {

    return;

  }


  currentBAStep = stepNumber;


  /* =========================================
     CONTENT STEP
  ========================================= */

  document
    .querySelectorAll(".ba-step-content")
    .forEach(content => {

      content.classList.remove("active");

    });


  const activeContent =
    document.querySelector(
      `[data-step-content="${currentBAStep}"]`
    );


  if (activeContent) {

    activeContent.classList.add("active");

  }


  /* =========================================
     STEPPER INDICATOR
  ========================================= */

  document
    .querySelectorAll(".ba-step")
    .forEach(step => {

      const number =
        Number(step.dataset.step);


      /*
        Step yang tidak dipakai
        benar-benar disembunyikan.
      */
      if (!activeSteps.includes(number)) {

        step.style.display = "none";

        step.classList.remove(
          "active",
          "completed"
        );

        return;

      }


      /*
        Step yang dipakai ditampilkan kembali.
      */
      step.style.display = "";


      step.classList.remove(
        "active",
        "completed"
      );


      const currentIndex =
        activeSteps.indexOf(
          currentBAStep
        );

      const stepIndex =
        activeSteps.indexOf(
          number
        );


      if (
        stepIndex !== -1 &&
        stepIndex < currentIndex
      ) {

        step.classList.add(
          "completed"
        );

      }


      if (
        number === currentBAStep
      ) {

        step.classList.add(
          "active"
        );

      }

    });


  /* =========================================
     PREVIOUS BUTTON
  ========================================= */

  const previousButton =
    document.getElementById(
      "btnPreviousStep"
    );


  if (previousButton) {

    const currentIndex =
      activeSteps.indexOf(
        currentBAStep
      );

    previousButton.disabled =
      currentIndex <= 0;

  }


  /* =========================================
     SYNC FIELD
  ========================================= */

  syncStepByJenis();


  /* =========================================
     NEXT BUTTON
  ========================================= */

  updateNextButton();


  /* =========================================
     SCROLL
  ========================================= */

  const page =
    document.getElementById(
      "page-buatBA"
    );


  if (page) {

    const header =
      page.querySelector(
        ".ba-stepper"
      );


    if (header) {

      const top =
        header.getBoundingClientRect().top +
        window.pageYOffset -
        80;


      window.scrollTo({

        top: top,

        behavior: "smooth"

      });

    }

  }

}


/* =========================================================
   07. UPDATE NEXT BUTTON
========================================================= */

function updateNextButton() {

  const button =
    document.getElementById(
      "btnNextStep"
    );


  if (!button) {

    return;

  }


  const jenis =
    getBAJenisStepper();


  if (jenis === "form_opname") {

    button.style.display = "none";

    return;

  }


  button.style.display = "";


  const activeSteps =
    getBAStepsAktif();


  const lastStep =
    activeSteps[
      activeSteps.length - 1
    ];


  /*
    Jika sudah berada di step terakhir,
    tombol berubah menjadi Generate.
  */
  if (
    currentBAStep === lastStep
  ) {

    button.innerHTML =
      "Generate Dokumen";

  } else {

    button.innerHTML =
      `Lanjutkan <span>→</span>`;

  }

}


/* =========================================================
   08. NEXT STEP
========================================================= */

function nextBAStep() {

  const jenis =
    getBAJenisStepper();


  /*
    FORM OPNAME
    Tidak menggunakan tombol lanjut normal.
  */
  if (jenis === "form_opname") {

    if (
      typeof syncFormOpnameFinal === "function"
    ) {

      syncFormOpnameFinal();

    }

    return;

  }


  /*
    Validasi step aktif.
  */
  if (!validateCurrentStep()) {

    return;

  }


  const activeSteps =
    getBAStepsAktif();


  const currentIndex =
    activeSteps.indexOf(
      currentBAStep
    );


  /*
    Safety apabila currentBAStep
    tidak ditemukan.
  */
  if (currentIndex === -1) {

    showBAStep(
      activeSteps[0]
    );

    return;

  }


  /*
    Jika sekarang sudah berada
    di step terakhir = GENERATE.
  */
  if (
    currentIndex ===
    activeSteps.length - 1
  ) {

    if (
      typeof generate === "function"
    ) {

      generate();


      setTimeout(() => {

        if (
          typeof scrollPreviewIntoView === "function"
        ) {

          scrollPreviewIntoView();

        }

      }, 650);

    } else {

      showToast(
        "Fungsi generate tidak ditemukan.",
        "danger"
      );

    }

    return;

  }


  /*
    Masuk ke step berikutnya
    berdasarkan flow BA aktif.
  */
  const nextStep =
    activeSteps[
      currentIndex + 1
    ];


  showBAStep(
    nextStep
  );

}


/* =========================================================
   09. PREVIOUS STEP
========================================================= */

function previousBAStep() {

  const jenis =
    getBAJenisStepper();


  if (jenis === "form_opname") {

    return;

  }


  const activeSteps =
    getBAStepsAktif();


  const currentIndex =
    activeSteps.indexOf(
      currentBAStep
    );


  if (currentIndex <= 0) {

    return;

  }


  const previousStep =
    activeSteps[
      currentIndex - 1
    ];


  showBAStep(
    previousStep
  );

}


/* =========================================================
   10. STEPPER CLICKABLE
========================================================= */

function initStepperClick() {

  document
    .querySelectorAll(".ba-step")
    .forEach(step => {

      step.style.cursor =
        "pointer";


      step.addEventListener(
        "click",
        function () {

          const number =
            Number(
              this.dataset.step
            );


          const activeSteps =
            getBAStepsAktif();


          /*
            Hanya step yang memang
            digunakan yang boleh diklik.
          */
          if (
            !activeSteps.includes(number)
          ) {

            return;

          }


          showBAStep(
            number
          );

        }
      );

    });

}


/* =========================================================
   11. VALIDATION
========================================================= */

function validateCurrentStep() {

  if (
    currentBAStep === 1
  ) {

    const jenis =
      document.getElementById(
        "jenisSelect"
      );


    if (
      !jenis ||
      !jenis.value
    ) {

      showToast(
        "Pilih jenis Berita Acara terlebih dahulu.",
        "warning"
      );

      return false;

    }

  }


  return true;

}


/* =========================================================
   12. SYNC STEP BERDASARKAN JENIS BA
========================================================= */

function syncStepByJenis() {

  const jenis =
    getBAJenisStepper();


  const pihakCard =
    document.getElementById(
      "pihakCard"
    );


  const standardTtd =
    document.getElementById(
      "standardTtdLampiranBox"
    );


  const opnameLampiran =
    document.getElementById(
      "opnameLampiranStep"
    );


  const isStandard = [
    "material",
    "keterangan",
    "adendum",
    "biaya"
  ].includes(jenis);


  const isUrugan =
    jenis === "urugan";


  const isOpname =
    jenis === "opname";


  const isFormOpname =
    jenis === "form_opname";


  /* =========================================
     PIHAK TERKAIT

     Hanya BA standard.
  ========================================= */

  if (pihakCard) {

    pihakCard.style.display =
      isStandard
        ? "block"
        : "none";

  }


  /* =========================================
     LAMPIRAN STANDARD

     Hanya BA standard.

     URUGAN TIDAK PAKAI LAMPIRAN.
  ========================================= */

  if (standardTtd) {

    standardTtd.style.display =
      isStandard
        ? "block"
        : "none";

  }


  /* =========================================
     LAMPIRAN KHUSUS OPNAME LAPANGAN
  ========================================= */

  if (opnameLampiran) {

    opnameLampiran.style.display =
      isOpname
        ? "block"
        : "none";

  }


  /*
    FORM OPNAME tetap ditangani
    sistem Form Opname yang sudah ada.
  */

  if (
    isFormOpname &&
    typeof setupFormOpnameSingleProcess === "function"
  ) {

    setupFormOpnameSingleProcess();

  }

}


/* =========================================================
   13. WATCH JENIS BA
========================================================= */

function initJenisWatcher() {

  const select =
    document.getElementById(
      "jenisSelect"
    );


  if (!select) {

    return;

  }


  select.addEventListener(
    "change",
    function () {

      setTimeout(() => {

        const jenis =
          getBAJenisStepper();


        /*
          FORM OPNAME
        */
        if (
          jenis === "form_opname"
        ) {

          syncStepByJenis();

          if (
            typeof setupFormOpnameSingleProcess ===
            "function"
          ) {

            setupFormOpnameSingleProcess();

          }

          return;

        }


        /*
          Setiap ganti jenis BA,
          kembali ke Step 1.
        */
        showBAStep(1);

      }, 20);

    }
  );

}


/* =========================================================
   13. PREVIEW ZOOM
========================================================= */

function applyPreviewZoom() {

  const output =
    document.getElementById("output");

  if (!output) return;


  /*
    Zoom hanya untuk tampilan layar.
    Ukuran dokumen tetap A4 210 x 297 mm.
  */

  output.style.transform =
    `scale(${previewZoom})`;

  output.style.transformOrigin =
    "top center";


  /*
    Kompensasi ruang kosong yang muncul
    akibat penggunaan transform scale.
  */

  requestAnimationFrame(() => {

    const naturalHeight =
      output.scrollHeight;


    if (!naturalHeight) {

      output.style.marginBottom =
        "0px";

      return;

    }


    const visualHeight =
      naturalHeight * previewZoom;


    output.style.marginBottom =
      `${visualHeight - naturalHeight}px`;

  });

}


/* =========================================================
   14. ZOOM IN
========================================================= */

function previewZoomIn() {

  previewZoom += 0.1;


  if (previewZoom > 1.4) {

    previewZoom = 1.4;

  }


  previewZoom =
    Math.round(
      previewZoom * 10
    ) / 10;


  applyPreviewZoom();

}


/* =========================================================
   15. ZOOM OUT
========================================================= */

function previewZoomOut() {

  previewZoom -= 0.1;


  if (previewZoom < 0.5) {

    previewZoom = 0.5;

  }


  previewZoom =
    Math.round(
      previewZoom * 10
    ) / 10;


  applyPreviewZoom();

}


/* =========================================================
   16. RESET ZOOM
========================================================= */

function previewZoomReset() {

  previewZoom = 1;

  applyPreviewZoom();

}


/* =========================================================
   17. SCROLL PREVIEW
========================================================= */

function scrollPreviewIntoView() {

  const preview =
    document.querySelector(
      ".workspace-preview"
    );


  if (!preview) {

    return;

  }


  /*
    Desktop preview selalu terlihat.
    Scroll hanya penting di tablet/mobile.
  */

  if (window.innerWidth <= 992) {

    preview.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });

  }

}


/* ========================================================= 
   18. DASHBOARD STATS 
========================================================= */ 

function updateDashboardStats() {

  /* =========================
     AMBIL DATA DRAFT
  ========================= */

  let drafts = [];

  if (typeof getAllDrafts === "function") {
    drafts = getAllDrafts();
  } else {
    try {
      drafts =
        JSON.parse(
          localStorage.getItem("baDrafts")
        ) || [];
    } catch (error) {
      drafts = [];
    }
  }

  const totalDraft = drafts.length;


  /* =========================
     UPDATE KPI DRAFT
  ========================= */

  const draftElements = [
    document.getElementById("dashboardDraftCount"),
    document.getElementById("dashboardDraft"),
    document.getElementById("totalDraftDashboard"),
    document.getElementById("statDraft")
  ];

  draftElements.forEach(element => {
    if (element) {
      element.textContent = totalDraft;
    }
  });


  /* =========================
     UPDATE DRAFT SAYA
  ========================= */

  const draftTotal =
    document.getElementById("draftTotal");

  if (draftTotal) {
    draftTotal.textContent = totalDraft;
  }


  /* =========================
     DEBUG
  ========================= */

  console.log(
    "Dashboard Draft:",
    totalDraft
  );

}


/* =========================================================
   19. SET STAT VALUE
========================================================= */

function setStatValue(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );


  if (element) {

    element.textContent =
      value;

  }

}


/* =========================================================
   20. GLOBAL SEARCH
========================================================= */

function initGlobalSearch() {

  const input =
    document.getElementById(
      "globalSearch"
    );


  if (!input) {

    return;

  }


  input.addEventListener(
    "keydown",
    function (event) {

      if (event.key !== "Enter") {

        return;

      }


      const keyword =
        input.value
          .trim()
          .toLowerCase();


      if (!keyword) {

        return;

      }


      /*
        Untuk sekarang search berfungsi
        sebagai pencarian menu.
      */


      const routes = [

        {
          keywords:
            [
              "dashboard",
              "home",
              "beranda"
            ],

          page:
            "dashboard"
        },


        {
          keywords:
            [
              "buat",
              "berita acara",
              "ba",
              "dokumen"
            ],

          page:
            "buatBA"
        },


        {
          keywords:
            [
              "draft"
            ],

          page:
            "draft"
        },


        {
          keywords:
            [
              "riwayat",
              "history"
            ],

          page:
            "riwayat"
        },


        {
          keywords:
            [
              "approval",
              "persetujuan"
            ],

          page:
            "approval"
        },


        {
          keywords:
            [
              "laporan",
              "report"
            ],

          page:
            "laporan"
        },


        {
          keywords:
            [
              "project",
              "proyek"
            ],

          page:
            "project"
        },


        {
          keywords:
            [
              "user",
              "pengguna"
            ],

          page:
            "user"
        },


        {
          keywords:
            [
              "setting",
              "pengaturan"
            ],

          page:
            "pengaturan"
        }

      ];


      const result =
        routes.find(route =>

          route.keywords.some(
            keywordItem =>

              keyword.includes(
                keywordItem
              )

          )

        );


      if (result) {

        openPage(
          result.page
        );


        input.value = "";

      } else {

        showToast(
          "Menu tidak ditemukan.",
          "warning"
        );

      }

    }
  );

}


/* =========================================================
   21. DRAFT STATUS
========================================================= */

function updateDraftStatus() {

  const status =
    document.getElementById("draftStatus");

  if (!status) {
    return;
  }


  const drafts = getAllDrafts();

  const jumlahDraft = drafts.length;


  /* =========================
     SEDANG EDIT DRAFT
  ========================= */

  if (activeDraftId) {

    const activeDraft =
      drafts.find(
        item => item.id === activeDraftId
      );


    if (activeDraft) {

      status.innerHTML = `
        <span class="draft-status-icon">
          ✓
        </span>

        <span>
          Sedang edit draft
        </span>
      `;

      return;

    }

  }


  /* =========================
     ADA DRAFT TERSIMPAN
  ========================= */

  if (jumlahDraft > 0) {

    status.innerHTML = `
      <span class="draft-status-icon">
        ✓
      </span>

      <span>
        ${jumlahDraft} draft tersimpan
      </span>
    `;

  }


  /* =========================
     BELUM ADA DRAFT
  ========================= */

  else {

    status.innerHTML = `
      <span class="draft-status-icon">
        ✓
      </span>

      <span>
        Siap digunakan
      </span>
    `;

  }

}



/* =========================================================
   25. RESIZE
========================================================= */

window.addEventListener(
  "resize",
  function () {

    const sidebar =
      document.getElementById(
        "sidebar"
      );


    if (!sidebar) {

      return;

    }


    if (window.innerWidth > 768) {

      sidebar.classList.remove(
        "mobile-open"
      );


      restoreSidebarState();

    }

  }
);


/* =========================================================
   26. INITIALIZE DESIGN B
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* Sidebar */

    restoreSidebarState();


    /* Step */

    showBAStep(1);


    /* Step clickable */

    initStepperClick();


    /* Jenis BA */

    initJenisWatcher();


    /* Search */

    initGlobalSearch();


    /* Dashboard */

    updateDashboardStats();


    /* Draft */

    updateDraftStatus();


    /* Zoom */

    applyPreviewZoom();


    /*
      Pastikan halaman awal
      setelah login = Buat BA
    */

    openPage(
      "buatBA"
    );


    /*
      Sync jenis BA setelah seluruh
      script lama selesai init.
    */

    setTimeout(() => {

      syncStepByJenis();

    }, 150);


  }
);

/* =========================================================
   27. LEGACY COMPATIBILITY
========================================================= */

/*
  HTML Design B sudah tidak menggunakan
  floating draftPanel lama.

  Fungsi ini dipertahankan sebagai
  compatibility layer agar login/logout
  lama tidak error.
*/

function showDraft() {

  const panel =
    document.getElementById(
      "draftPanel"
    );


  if (panel) {

    panel.style.display =
      "block";

  }

}


function hideDraft() {

  const panel =
    document.getElementById(
      "draftPanel"
    );


  if (panel) {

    panel.style.display =
      "none";

  }

}


/*
  scrollToForm lama memakai .form-panel,
  sedangkan Design B memakai
  .workspace-form.
*/

function scrollToForm() {

  const form =
    document.querySelector(
      ".workspace-form"
    );


  if (form) {

    form.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });

  }

}


/*
  scrollToPreview lama memakai
  .preview-panel.

  Design B memakai .workspace-preview.
*/

function scrollToPreview() {

  const preview =
    document.querySelector(
      ".workspace-preview"
    );


  if (preview) {

    preview.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });

  }

}

/* =========================================================
   FINAL PRINT HANDLER
========================================================= */

function printBA() {

  const output =
    document.getElementById("output");

  if (!output) {
    return;
  }


  /* Simpan style preview */

  const oldTransform =
    output.style.transform;

  const oldTransformOrigin =
    output.style.transformOrigin;

  const oldMarginBottom =
    output.style.marginBottom;


  /* Hilangkan seluruh zoom preview */

  output.style.transform =
    "none";

  output.style.transformOrigin =
    "top left";

  output.style.marginBottom =
    "0";


  /*
    Tunggu browser menghitung ulang
    ukuran A4 dan seluruh halaman lampiran.
  */

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      window.print();

    });

  });


  /*
    Setelah print dialog ditutup,
    kembalikan preview.
  */

  const restorePreview = () => {

    output.style.transform =
      oldTransform;

    output.style.transformOrigin =
      oldTransformOrigin;

    output.style.marginBottom =
      oldMarginBottom;


    window.removeEventListener(
      "afterprint",
      restorePreview
    );

  };


  window.addEventListener(
    "afterprint",
    restorePreview
  );

}

/* =========================================================
   FINAL PRINT BA
========================================================= */

function printBA() {

  const output = document.getElementById("output");

  if (!output) {
    return;
  }


  /* Simpan kondisi preview */

  const oldTransform =
    output.style.transform;

  const oldTransformOrigin =
    output.style.transformOrigin;

  const oldWidth =
    output.style.width;

  const oldMinWidth =
    output.style.minWidth;

  const oldHeight =
    output.style.height;

  const oldMargin =
    output.style.margin;


  /* Lepaskan zoom preview */

  output.style.transform =
    "none";

  output.style.transformOrigin =
    "top left";

  output.style.width =
    "210mm";

  output.style.minWidth =
    "210mm";

  output.style.height =
    "auto";

  output.style.margin =
    "0";


  /*
    Paksa browser menghitung ulang:
    page 1 + page lampiran
  */

  void output.offsetHeight;


  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      window.print();

    });

  });


  /* Kembalikan preview setelah dialog print ditutup */

  function restorePreview() {

    output.style.transform =
      oldTransform;

    output.style.transformOrigin =
      oldTransformOrigin;

    output.style.width =
      oldWidth;

    output.style.minWidth =
      oldMinWidth;

    output.style.height =
      oldHeight;

    output.style.margin =
      oldMargin;


    window.removeEventListener(
      "afterprint",
      restorePreview
    );

  }


  window.addEventListener(
    "afterprint",
    restorePreview
  );

}

window.addEventListener("resize", () => {

  if (previewManualZoom) return;

  clearTimeout(window.previewResizeTimer);

  window.previewResizeTimer = setTimeout(() => {
    fitPreviewToContainer();
  }, 100);

});

/* =========================================================
   RUMAH NINGRAT
   BORDER DRAW ANIMATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const box =
        document.querySelector(".rn-motion-box");

    if (!box) return;


    const content =
        box.querySelector(".rn-motion-content");

    const slogan =
        box.querySelector(".rn-motion-slogan");

    const top =
        box.querySelector(".rn-border-top");

    const right =
        box.querySelector(".rn-border-right");

    const bottom =
        box.querySelector(".rn-border-bottom");

    const left =
        box.querySelector(".rn-border-left");


    const slogans = [

        "UNTUK HIDUP LEBIH BAIK",

        "SEMUA BISA PUNYA RUMAH"

    ];


    let sloganIndex = 0;


    /* =====================================================
       HELPER
    ===================================================== */

    function wait(ms) {

        return new Promise(resolve =>
            setTimeout(resolve, ms)
        );

    }


    function setTransition(
        element,
        property,
        duration,
        easing = "ease"
    ) {

        element.style.transition =
            `${property} ${duration}ms ${easing}`;

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetAnimation() {

        content.style.transition = "none";

        content.style.opacity = "0";

        content.style.transform =
            "translateX(-5px)";


        top.style.transition = "none";
        right.style.transition = "none";
        bottom.style.transition = "none";
        left.style.transition = "none";


        top.style.width = "0";

        right.style.height = "0";

        bottom.style.width = "0";

        left.style.height = "0";

    }


    /* =====================================================
       BORDER MASUK
    ===================================================== */

    async function drawBorder() {

        /*
         FASE 1
         GARIS KIRI NAIK
        */

        setTransition(
            left,
            "height",
            220,
            "linear"
        );

        left.style.height = "100%";

        await wait(180);


        /*
         FASE 2
         GARIS ATAS BERGERAK KE KANAN
        */

        setTransition(
            top,
            "width",
            420,
            "linear"
        );

        top.style.width = "100%";

        await wait(330);


        /*
         FASE 3
         GARIS KANAN TURUN
        */

        setTransition(
            right,
            "height",
            200,
            "linear"
        );

        right.style.height = "100%";

        await wait(160);


        /*
         FASE 4
         GARIS BAWAH KE KIRI
        */

        setTransition(
            bottom,
            "width",
            420,
            "linear"
        );

        bottom.style.width = "100%";

        await wait(320);

    }


    /* =====================================================
       TEXT MASUK
    ===================================================== */

    async function showText() {

        content.style.transition =
            "opacity 320ms ease, transform 400ms ease";

        content.style.opacity = "1";

        content.style.transform =
            "translateX(0)";

        await wait(420);

    }


    /* =====================================================
       TEXT KELUAR
    ===================================================== */

    async function hideText() {

        content.style.transition =
            "opacity 260ms ease, transform 320ms ease";

        content.style.opacity = "0";

        content.style.transform =
            "translateX(-7px)";

        await wait(300);

    }


    /* =====================================================
       BORDER KELUAR
    ===================================================== */

    async function eraseBorder() {

        /*
         BAWAH MENDEK KE KANAN
        */

        setTransition(
            bottom,
            "width",
            350,
            "linear"
        );

        bottom.style.width = "0";

        await wait(260);


        /*
         KANAN NAIK
        */

        setTransition(
            right,
            "height",
            180,
            "linear"
        );

        right.style.height = "0";

        await wait(140);


        /*
         ATAS MENDEK
        */

        setTransition(
            top,
            "width",
            350,
            "linear"
        );

        top.style.width = "0";

        await wait(270);


        /*
         KIRI HILANG
        */

        setTransition(
            left,
            "height",
            180,
            "linear"
        );

        left.style.height = "0";

        await wait(200);

    }


    /* =====================================================
       MAIN LOOP
    ===================================================== */

    async function runAnimation() {

        while (true) {

            resetAnimation();


            /*
             GANTI JARGON
            */

            slogan.textContent =
                slogans[sloganIndex];


            /*
             JEDA SEBELUM BORDER MULAI
            */

            await wait(200);


            /*
             BORDER MENGGAMBAR KOTAK
            */

            await drawBorder();


            /*
             RUMAH NINGRAT + JARGON MASUK
            */

            await showText();


            /*
             TAHAN
            */

            await wait(2200);


            /*
             SEMUA TEKS KELUAR
            */

            await hideText();


            /*
             BORDER IKUT TERURAI
            */

            await eraseBorder();


            /*
             GANTI JARGON
            */

            sloganIndex =
                (sloganIndex + 1)
                % slogans.length;


            /*
             JEDA SEBELUM LOOP BERIKUTNYA
            */

            await wait(200);

        }

    }


    runAnimation();

});

function toggleLoginPassword() {

    const input =
        document.getElementById("password");

    if (!input) return;


    if (input.type === "password") {

        input.type = "text";

    } else {

        input.type = "password";

    }

}

/* =========================================================
   DASHBOARD SYSTEM
   PASTE PALING BAWAH script.js
========================================================= */


/* =========================================================
   AMBIL DATA BA
========================================================= */

function getDashboardRecords() {

    let records = [];

    try {

        /*
          Nanti modul Riwayat akan menggunakan penyimpanan ini.
          Dashboard sudah kita siapkan dari sekarang.
        */

        const raw =
            localStorage.getItem("baRecords");

        if (!raw) {
            return [];
        }


        const parsed =
            JSON.parse(raw);


        if (Array.isArray(parsed)) {
            records = parsed;
        }

    } catch (error) {

        console.warn(
            "Dashboard gagal membaca data BA:",
            error
        );

    }


    return records;
}



/* =========================================================
   HELPER SET TEXT
========================================================= */

function dashboardSetText(id, value) {

    const el =
        document.getElementById(id);


    if (el) {
        el.textContent = value;
    }

}



/* =========================================================
   RENDER DASHBOARD
========================================================= */

function renderDashboard() {

    const records =
        getDashboardRecords();


    /* TOTAL */

    const total =
        records.length;



    /* DRAFT
   Draft aktif disimpan terpisah di baDrafts,
   bukan di baRecords.
      */

      let draft = 0;

      try {

          draft =
              typeof getAllDrafts === "function"
                  ? getAllDrafts().length
                  : 0;

      } catch (error) {

          console.warn(
              "Dashboard gagal membaca draft:",
              error
          );

          draft = 0;

      }

      /* =========================================================
        BA BULAN INI
      ========================================================= */

      const sekarang = new Date();

      const bulanSekarang =
          sekarang.getMonth();

      const tahunSekarang =
          sekarang.getFullYear();


      const bulanIni =
          records.filter(item => {

              if (!item.tanggal) {
                  return false;
              }


              const tanggal =
                  new Date(item.tanggal);


              if (isNaN(tanggal.getTime())) {
                  return false;
              }


              return (
                  tanggal.getMonth() === bulanSekarang &&
                  tanggal.getFullYear() === tahunSekarang
              );

          }).length;

/* =========================================================
   BA SELESAI
========================================================= */

const selesai =
    records.filter(item => {

        const status =
            String(
                item.status || ""
            )
            .toLowerCase()
            .trim();


        return (
            status === "selesai" ||
            status === "final"
        );

    }).length;



    /* UPDATE KPI */

    dashboardSetText(
        "statTotalDokumen",
        total
    );


    dashboardSetText(
        "statDraft",
        draft
    );


    dashboardSetText(
        "statBulanIni",
        bulanIni
    );


    dashboardSetText(
    "statSelesai",
        selesai
    );



    dashboardSetText(
        "dashboardDonutTotal",
        total
    );



    /* STATISTIK JENIS */

    const stats = {

        material: 0,

        biaya: 0,

        urugan: 0,

        opname: 0

    };


    records.forEach(item => {

        const jenis =
            String(
                item.jenis ||
                item.jenisBA ||
                ""
            )
            .toLowerCase();


        if (
            jenis.includes("material")
        ) {

            stats.material++;

        }

        else if (
            jenis.includes("biaya")
        ) {

            stats.biaya++;

        }

        else if (
            jenis.includes("urugan")
        ) {

            stats.urugan++;

        }

        else if (
            jenis.includes("opname")
        ) {

            stats.opname++;

        }

    });



    updateDashboardStat(
        "Material",
        stats.material,
        total
    );


    updateDashboardStat(
        "Biaya",
        stats.biaya,
        total
    );


    updateDashboardStat(
        "Urugan",
        stats.urugan,
        total
    );


    updateDashboardStat(
        "Opname",
        stats.opname,
        total
    );



    updateDashboardDonut(
        stats,
        total
    );


    renderDashboardRecent(
        records
    );

}



/* =========================================================
   UPDATE STAT
========================================================= */

function updateDashboardStat(
    name,
    value,
    total
) {

    const percentage =
        total > 0
            ? Math.round(
                (value / total) * 100
              )
            : 0;


    dashboardSetText(
        "stat" + name,
        value
    );


    dashboardSetText(
        "stat" +
        name +
        "Percent",
        percentage + "%"
    );

}



/* =========================================================
   DONUT CHART
========================================================= */

function updateDashboardDonut(
    stats,
    total
) {

    const donut =
        document.querySelector(
            ".dashboard-donut"
        );


    if (!donut) {
        return;
    }


    if (total <= 0) {

        donut.style.background =
            "#e5e7eb";

        return;
    }


    const material =
        (stats.material / total) * 100;


    const biaya =
        (stats.biaya / total) * 100;


    const urugan =
        (stats.urugan / total) * 100;


    const p1 =
        material;


    const p2 =
        p1 + biaya;


    const p3 =
        p2 + urugan;


    donut.style.background = `
        conic-gradient(
            #dc2626 0% ${p1}%,
            #fb7185 ${p1}% ${p2}%,
            #f97316 ${p2}% ${p3}%,
            #fbbf24 ${p3}% 100%
        )
    `;

}



/* =========================================================
   BA TERBARU
========================================================= */

function renderDashboardRecent(records) {

    const tbody =
        document.getElementById(
            "dashboardRecentBA"
        );


    if (!tbody) {
        return;
    }


    if (!records.length) {

        tbody.innerHTML = `

            <tr class="dashboard-empty">

                <td colspan="5">

                    Belum ada Berita Acara.

                </td>

            </tr>

        `;

        return;
    }



    const recent =
        [...records]
        .reverse()
        .slice(0, 5);



    tbody.innerHTML =
        recent.map(item => {


            const status =
                item.status ||
                "Draft";


            const statusClass =
                getDashboardStatusClass(
                    status
                );


            return `

                <tr>

                    <td>

                        ${dashboardEscape(
                            item.nomor ||
                            item.noBA ||
                            "-"
                        )}

                    </td>


                    <td>

                        ${dashboardEscape(
                            item.tanggal ||
                            "-"
                        )}

                    </td>


                    <td>

                        ${dashboardEscape(
                            item.jenis ||
                            item.jenisBA ||
                            "-"
                        )}

                    </td>


                    <td>

                        ${dashboardEscape(
                            item.project ||
                            "-"
                        )}

                    </td>


                    <td>

                        <span
                            class="
                                dashboard-status
                                ${statusClass}
                            "
                        >

                            ${dashboardEscape(
                                status
                            )}

                        </span>

                    </td>

                </tr>

            `;

        })
        .join("");

}



/* =========================================================
   STATUS
========================================================= */

function getDashboardStatusClass(status) {

    const value =
        String(status)
        .toLowerCase();


    if (
        value === "approved" ||
        value === "selesai"
    ) {

        return "approved";

    }


    if (
        value === "pending" ||
        value.includes("menunggu")
    ) {

        return "pending";

    }


    return "draft";

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function dashboardEscape(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   INITIAL DASHBOARD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderDashboard();

    }
);

/* =========================================================
   DRAFT SAYA — UI
========================================================= */


/* =========================================================
   FORMAT TANGGAL DRAFT
========================================================= */

function formatDraftDate(value) {

  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeDraftHTML(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   BUAT BA BARU
========================================================= */

function createNewBADraft() {

  /* Lepaskan draft yang sedang diedit */
  activeDraftId = null;

  /* Keluar dari mode Riwayat */

window.activeBARecordId =
  null;

window.isViewingBARecord =
  false;


/* Aktifkan kembali Finalisasi */

const finalButton =
  document.querySelector(
    ".btn-final-ba"
  );


if (finalButton) {

  finalButton.disabled =
    false;

  finalButton.innerHTML = `

    <span>✓</span>

    Finalisasi BA

  `;

  finalButton.classList.remove(
    "ba-final-disabled"
  );

}

  /* Reset jenis BA */
  const jenis = document.getElementById("jenis");

  if (jenis) {
    jenis.value = "";
  }


  /* Reset custom dropdown jenis */
  const jenisSelect =
    document.getElementById("jenisSelect");

  if (jenisSelect) {
    jenisSelect.value = "";
  }


  /* Reset penandatangan */
  const useTtd4 =
    document.getElementById("useTtd4");

  if (useTtd4) {
    useTtd4.checked = false;
  }


  /* Reset nama */
  if ($("#nama1").length) {
    $("#nama1").val("").trigger("change");
  }

  if ($("#nama2").length) {
    $("#nama2").val("").trigger("change");
  }

  if ($("#nama3").length) {
    $("#nama3").val("").trigger("change");
  }

  if ($("#nama4").length) {
    $("#nama4").val("").trigger("change");
  }


  /* Reset editor */
  if (
    typeof qLatar !== "undefined" &&
    qLatar
  ) {
    qLatar.root.innerHTML = "";
  }

  if (
    typeof qTujuan !== "undefined" &&
    qTujuan
  ) {
    qTujuan.root.innerHTML = "";
  }

  if (
    typeof qKejadian !== "undefined" &&
    qKejadian
  ) {
    qKejadian.root.innerHTML = "";
  }

  if (
    typeof qPenutup !== "undefined" &&
    qPenutup
  ) {
    qPenutup.root.innerHTML = "";
  }


  /* Sinkronisasi tampilan jenis BA */
  if (
    typeof toggleJenis === "function"
  ) {
    toggleJenis();
  }

  if (
    typeof toggleTtd4 === "function"
  ) {
    toggleTtd4();
  }


  /* Buka halaman BA */
  if (
    typeof openPage === "function"
  ) {
    openPage("buatBA");
  }
  


  /* Kembali ke step pertama */
  if (
    typeof showBAStep === "function"
  ) {
    showBAStep(1);
  }


  /* Update status */
  if (
    typeof updateDraftStatus === "function"
  ) {
    updateDraftStatus();
  }

}


/* =========================================================
   RENDER DRAFT LIST
========================================================= */

function renderDraftList() {

  const container =
    document.getElementById(
      "draftList"
    );


  if (!container) {
    return;
  }


  let drafts = getAllDrafts();


  /* =========================
     SEARCH
  ========================= */

  const searchElement =
    document.getElementById(
      "draftSearch"
    );


  const keyword =
    searchElement
      ? searchElement.value
          .toLowerCase()
          .trim()
      : "";


  /* =========================
     FILTER
  ========================= */

  const filterElement =
    document.getElementById(
      "draftFilterJenis"
    );


  const filterJenis =
    filterElement
      ? filterElement.value
      : "";


  /* =========================
     TOTAL
  ========================= */

  const totalElement =
    document.getElementById(
      "draftTotal"
    );


  if (totalElement) {

    totalElement.textContent =
      drafts.length;

  }


  /* =========================
     SORT TERBARU
  ========================= */

  drafts.sort((a, b) => {

    return new Date(
      b.updatedAt || b.createdAt || 0
    ) - new Date(
      a.updatedAt || a.createdAt || 0
    );

  });


  /* =========================
     APPLY FILTER
  ========================= */

  drafts = drafts.filter(
    draft => {

      const jenis =
        String(
          draft.jenis || ""
        ).toLowerCase();


      const judul =
        String(
          draft.judul || ""
        ).toLowerCase();


      const cocokSearch =
        !keyword ||
        judul.includes(keyword) ||
        jenis.includes(keyword);


      const cocokJenis =
        !filterJenis ||
        jenis === filterJenis;


      return (
        cocokSearch &&
        cocokJenis
      );

    }
  );


  /* =========================
     EMPTY STATE
  ========================= */

  if (!drafts.length) {

    container.innerHTML = `

      <div class="draft-empty">

        <div class="draft-empty-icon">
          ▤
        </div>

        <h3>
          Belum ada draft
        </h3>

        <p>
          Berita Acara yang Anda simpan
          sebagai draft akan muncul di sini.
        </p>

        <button
          type="button"
          onclick="createNewBADraft()"
        >
          ＋ Buat Berita Acara
        </button>

      </div>

    `;


    return;

  }


  /* =========================
     RENDER CARD
  ========================= */

  container.innerHTML =
    drafts.map(
      draft => {

        const id =
          escapeDraftHTML(
            draft.id
          );


        const jenis =
          escapeDraftHTML(
            draft.jenis || "-"
          );


        const judul =
          escapeDraftHTML(
            draft.judul ||
            getNamaJenisBA(
              draft.jenis
            )
          );


        const tanggal =
          formatDraftDate(
            draft.updatedAt ||
            draft.createdAt
          );

        const createdByUsername =
          escapeDraftHTML(
            draft.createdBy?.username ||
            "admin"
          );


        return `

          <div
            class="draft-card"
            data-draft-id="${id}"
          >

            <div class="draft-card-main">

              <div class="draft-card-icon">
                ▤
              </div>


              <div class="draft-card-info">

                <div class="draft-card-top">

                  <span class="draft-badge">
                    DRAFT
                  </span>

                  <span class="draft-type">
                    ${jenis.toUpperCase()}
                  </span>

                </div>


                <h3>
                  ${judul}
                </h3>


                <p>
                  Terakhir diperbarui
                  ${tanggal}
                  · Dibuat oleh
                  <strong>@${createdByUsername}</strong>
                </p>

              </div>

            </div>


            <div class="draft-card-actions">

              <button
                type="button"
                class="draft-action-primary"
                onclick="loadDraft('${id}')"
              >
                Lanjut Edit
              </button>


              <button
                type="button"
                class="draft-action-delete"
                onclick="deleteDraft('${id}')"
                title="Hapus Draft"
              >
                Hapus
              </button>

            </div>

          </div>

        `;

      }

    ).join("");

}


/* =========================================================
   REFRESH DRAFT SAAT MENU DIBUKA
========================================================= */

function refreshDraftPage() {

  if (
    document
      .getElementById("page-draft")
      ?.classList.contains("active")
  ) {

    renderDraftList();

  }

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    renderDraftList();

  }
);

/* =========================================================
   RIWAYAT BERITA ACARA
========================================================= */

const BA_RECORD_KEY = "baRecords";
const BA_RECORD_TABLE = "BA_RECORDS";


/* =========================================================
   AMBIL SEMUA RIWAYAT
========================================================= */

function getAllBARecords() {

  try {

    const data =
      JSON.parse(
        localStorage.getItem(
          BA_RECORD_KEY
        )
      );

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {

    console.error(
      "Gagal membaca Riwayat BA:",
      error
    );

    return [];

  }

}


/* =========================================================
   SIMPAN SEMUA RIWAYAT
========================================================= */

function setAllBARecords(records) {

  localStorage.setItem(
    BA_RECORD_KEY,
    JSON.stringify(records)
  );

}


/* =========================================================
   BA RECORD DATABASE
   GOOGLE SHEETS = PRIMARY
   LOCALSTORAGE = CACHE
========================================================= */

function normalizeBARecord(item) {

  if (!item) {
    return null;
  }


  let createdBy =
    item.createdBy || {};


  let data =
    item.data || {};


  if (
    typeof createdBy === "string"
  ) {

    try {
      createdBy =
        JSON.parse(createdBy);
    } catch (error) {
      createdBy = {};
    }

  }


  if (
    typeof data === "string"
  ) {

    try {
      data =
        JSON.parse(data);
    } catch (error) {
      data = {};
    }

  }


  return {

    ...item,

    createdBy:
      createdBy,

    data:
      data,

    pdfFileId:
      item.pdfFileId || "",

    pdfUrl:
      item.pdfUrl || ""

  };

}


/* =========================================================
   FETCH BA RECORD
========================================================= */

async function fetchBARecordsFromAPI() {

  const response =
    await fetch(

      DATABASE_API_URL +
      "?table=" +
      encodeURIComponent(
        BA_RECORD_TABLE
      ) +
      "&t=" +
      Date.now(),

      {
        method: "GET",
        cache: "no-store"
      }

    );


  if (!response.ok) {

    throw new Error(
      "Gagal mengambil Riwayat BA."
    );

  }


  const result =
    await response.json();


  if (!result.success) {

    throw new Error(
      result.message ||
      "Database Riwayat BA gagal dibaca."
    );

  }


  return (
    Array.isArray(result.data)
      ? result.data
      : []
  )

  .map(
    normalizeBARecord
  )

  .filter(Boolean);

}


/* =========================================================
   POST BA RECORD
========================================================= */

async function sendBARecordRequest(
  payload
) {

  const response =
    await fetch(

      DATABASE_API_URL,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "text/plain;charset=utf-8"

        },

        body:
          JSON.stringify(
            payload
          )

      }

    );


  if (!response.ok) {

    throw new Error(
      "Database BA tidak merespons."
    );

  }


  const result =
    await response.json();


  if (!result.success) {

    throw new Error(
      result.message ||
      "Operasi BA gagal."
    );

  }


  return result;

}


/* =========================================================
   LOAD BA RECORD DATABASE
========================================================= */

async function loadBARecordDatabase(
  showLoading = true
) {

  try {

    const records =
      await fetchBARecordsFromAPI();


    records.sort(
      (a, b) => {

        return (

          new Date(
            b.tanggal ||
            b.createdAt ||
            0
          ) -

          new Date(
            a.tanggal ||
            a.createdAt ||
            0
          )

        );

      }
    );


    /*
      Cache lokal
    */

    setAllBARecords(
      records
    );


    if (
      typeof renderRiwayat ===
      "function"
    ) {

      renderRiwayat();

    }


    if (
      typeof renderDashboard ===
      "function"
    ) {

      renderDashboard();

    }


    return records;


  } catch (error) {

    console.error(
      "BA RECORD DATABASE:",
      error
    );


    if (showLoading) {

      showToast(
        "Database Riwayat tidak dapat diakses. Menggunakan cache terakhir.",
        "warning"
      );

    }


    if (
      typeof renderRiwayat ===
      "function"
    ) {

      renderRiwayat();

    }


    return getAllBARecords();

  }

}

/* =========================================================
   GENERATE PDF BA
========================================================= */

async function generateBAPDFBase64(
  fileName
) {

  const output =
    document.getElementById(
      "output"
    );


  if (!output) {

    throw new Error(
      "Preview BA tidak ditemukan."
    );

  }


  if (
    typeof html2pdf ===
    "undefined"
  ) {

    throw new Error(
      "Library PDF belum tersedia."
    );

  }


  /*
    Simpan kondisi preview.
  */

  const oldTransform =
    output.style.transform;

  const oldTransformOrigin =
    output.style.transformOrigin;

  const oldWidth =
    output.style.width;

  const oldMinWidth =
    output.style.minWidth;

  const oldHeight =
    output.style.height;

  const oldMargin =
    output.style.margin;


  /*
    Lepaskan zoom preview supaya
    PDF mengikuti ukuran A4 asli.
  */

  output.style.transform =
    "none";

  output.style.transformOrigin =
    "top left";

  output.style.width =
    "210mm";

  output.style.minWidth =
    "210mm";

  output.style.height =
    "auto";

  output.style.margin =
    "0";


  /*
    Paksa browser render ulang.
  */

  void output.offsetHeight;


  try {

    const options = {

      margin:
        0,

      filename:
        fileName,

      image: {

        type:
          "jpeg",

        quality:
          0.98

      },

      html2canvas: {

        scale:
          2,

        useCORS:
          true,

        logging:
          false

      },

      jsPDF: {

        unit:
          "mm",

        format:
          "a4",

        orientation:
          "portrait"

      },

      pagebreak: {

        mode: [
          "css",
          "legacy"
        ]

      }

    };


    const pdfBlob =

      await html2pdf()

        .set(options)

        .from(output)

        .outputPdf(
          "blob"
        );


    return await blobToBase64(
      pdfBlob
    );


  } finally {

    /*
      Kembalikan preview seperti semula.
    */

    output.style.transform =
      oldTransform;

    output.style.transformOrigin =
      oldTransformOrigin;

    output.style.width =
      oldWidth;

    output.style.minWidth =
      oldMinWidth;

    output.style.height =
      oldHeight;

    output.style.margin =
      oldMargin;

  }

}


/* =========================================================
   BLOB → BASE64
========================================================= */

function blobToBase64(blob) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();


      reader.onloadend =
        function () {

          resolve(
            reader.result
          );

        };


      reader.onerror =
        function () {

          reject(
            new Error(
              "Gagal membaca file PDF."
            )
          );

        };


      reader.readAsDataURL(
        blob
      );

    }
  );

}

/* =========================================================
   FORMAT TANGGAL
========================================================= */

function formatRiwayatDate(value) {

  if (!value) {
    return "-";
  }

  const date =
    new Date(value);


  if (
    isNaN(
      date.getTime()
    )
  ) {

    return "-";

  }


  return date.toLocaleString(
    "id-ID",
    {

      day: "2-digit",

      month: "short",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit"

    }
  );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeRiwayatHTML(value) {

  return String(
    value || ""
  )

  .replace(
    /&/g,
    "&amp;"
  )

  .replace(
    /</g,
    "&lt;"
  )

  .replace(
    />/g,
    "&gt;"
  )

  .replace(
    /"/g,
    "&quot;"
  )

  .replace(
    /'/g,
    "&#039;"
  );

}


/* =========================================================
   NAMA JENIS BA
========================================================= */

function getRiwayatJenisName(jenis) {

  if (
    typeof getNamaJenisBA ===
    "function"
  ) {

    return getNamaJenisBA(
      jenis
    );

  }


  const nama = {

    material:
      "BA Material",

    keterangan:
      "BA Keterangan",

    adendum:
      "BA Adendum",

    biaya:
      "BA Pengajuan Biaya",

    urugan:
      "BA Urugan",

    opname:
      "BA Opname"

  };


  return (
    nama[jenis] ||
    "Berita Acara"
  );

}


/* =========================================================
   GENERATE ID RECORD
========================================================= */

function createBARecordId() {

  return (

    "BA-" +

    Date.now() +

    "-" +

    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()

  );

}


/* =========================================================
   SIMPAN BA FINAL
========================================================= */

/* =========================================================
   SIMPAN BA FINAL
   PDF + GOOGLE DRIVE + BA_RECORDS
========================================================= */

async function saveBAFinal() {

  const jenisElement =
    document.getElementById(
      "jenis"
    );


  const jenis =
    jenisElement
      ? jenisElement.value
      : "";


  if (!jenis) {

    alert(
      "Pilih jenis Berita Acara terlebih dahulu."
    );

    return;

  }


  let data = {};


  /* =========================
     AMBIL DATA FORM
  ========================= */

  try {

    if (
      typeof getDraftData ===
      "function"
    ) {

      data =
        getDraftData();

    }

    else if (
      typeof collectDraftData ===
      "function"
    ) {

      data =
        collectDraftData();

    }

    else if (
      typeof activeDraftId !==
        "undefined" &&
      activeDraftId &&
      typeof getAllDrafts ===
        "function"
    ) {

      const activeDraft =
        getAllDrafts().find(
          item =>
            item.id ===
            activeDraftId
        );


      if (
        activeDraft &&
        activeDraft.data
      ) {

        data =
          activeDraft.data;

      }

    }

  } catch (error) {

    console.error(
      "Gagal mengambil data BA:",
      error
    );

  }


  const now =
    new Date();


  const currentUser =
    getCurrentBAUser();


  /*
    ID dibuat browser agar ID record
    dan nama PDF sama.
  */

  const recordId =
    createBARecordId();


  const judul =
    getRiwayatJenisName(
      jenis
    );


  /*
    Nama file aman untuk Drive.
  */

  const safeTitle =
    String(judul)

      .replace(
        /[\\/:*?"<>|]/g,
        "-"
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();


  const fileName =

    recordId +
    " - " +
    safeTitle +
    ".pdf";


  /*
    Simpan ID Draft sebelum
    activeDraftId direset.
  */

  const draftId =
  (
    typeof activeDraftId !==
      "undefined"
  )
    ? activeDraftId
    : null;


/* =====================================================
   MULAI LOADING FINALISASI BA
===================================================== */

showGlobalLoading(
  "Menyiapkan finalisasi BA..."
);


try {

  /* =========================
     1. GENERATE PDF
  ========================= */

  updateGlobalLoading(
    "Membuat PDF final..."
  );


  showToast(
    "Membuat PDF final...",
    "info"
  );


  const pdfBase64 =
    await generateBAPDFBase64(
      fileName
    );


  /* =========================
     2. UPLOAD GOOGLE DRIVE
  ========================= */

  updateGlobalLoading(
    "Mengunggah PDF ke Google Drive..."
  );


  showToast(
    "Mengunggah PDF...",
    "info"
  );


  const pdfResponse =
    await sendBARecordRequest({

      action:
        "upload_pdf",

      table:
        BA_RECORD_TABLE,

      data: {

        fileName:
          fileName,

        base64:
          pdfBase64

      }

    });


  const pdfData =
    pdfResponse.data || {};


  if (
    !pdfData.fileId ||
    !pdfData.url
  ) {

    throw new Error(
      "PDF berhasil diproses tetapi data file Drive tidak lengkap."
    );

  }


  /* =========================
     3. RECORD FINAL
  ========================= */

  updateGlobalLoading(
    "Menyiapkan data BA..."
  );


  const record = {

    id:
      recordId,

    jenis:
      jenis,

    judul:
      judul,

    status:
      "selesai",

    tanggal:
      now.toISOString(),

    createdAt:
      now.toISOString(),

    updatedAt:
      now.toISOString(),

    createdBy: {

      id:
        currentUser.id,

      nama:
        currentUser.nama,

      username:
        currentUser.username,

      department:
        currentUser.department

    },

    pdfFileId:
      pdfData.fileId,

    pdfUrl:
      pdfData.url,

    data:
      data

  };


  /* =========================
     4. SIMPAN BA_RECORDS
  ========================= */

  updateGlobalLoading(
    "Menyimpan Riwayat BA..."
  );


  showToast(
    "Menyimpan Riwayat BA...",
    "info"
  );


  await sendBARecordRequest({

    action:
      "create",

    table:
      BA_RECORD_TABLE,

    data:
      record

  });


  /* =========================
     5. REFRESH DATABASE
  ========================= */

  updateGlobalLoading(
    "Memperbarui data BA..."
  );


  await loadBARecordDatabase(
    false
  );


  /* =========================
     6. HAPUS DRAFT SERVER
  ========================= */

  if (
    draftId &&
    typeof sendDraftRequest ===
      "function"
  ) {

    try {

      updateGlobalLoading(
        "Menyelesaikan finalisasi BA..."
      );


      await sendDraftRequest({

        action:
          "delete",

        table:
          DRAFT_TABLE,

        id:
          draftId

      });


      if (
        typeof activeDraftId !==
          "undefined"
      ) {

        activeDraftId =
          null;

      }


      if (
        typeof loadDraftDatabase ===
          "function"
      ) {

        await loadDraftDatabase(
          false
        );

      }


    } catch (draftError) {

      /*
        BA tetap dianggap final karena
        record + PDF sudah berhasil.

        Draft hanya gagal dibersihkan.
      */

      console.error(
        "Draft final gagal dihapus:",
        draftError
      );

    }

  }


    /* =========================
       7. REFRESH UI
    ========================= */

    if (
      typeof renderDraftList ===
      "function"
    ) {

      renderDraftList();

    }


    if (
      typeof renderDashboard ===
      "function"
    ) {

      renderDashboard();

    }


    if (
      typeof updateDraftStatus ===
      "function"
    ) {

      updateDraftStatus();

    }


    showToast(
      "Berita Acara berhasil difinalisasi dan PDF tersimpan.",
      "success"
    );


    openPage(
      "riwayat"
    );


  } catch (error) {

    console.error(
      "FINAL BA ERROR:",
      error
    );


    alert(
      "Finalisasi BA gagal.\n\n" +
      error.message +
      "\n\n" +
      "Draft tidak dihapus."
    );

    

  }


  finally {

  hideGlobalLoading();

}

}


/* =========================================================
   HAPUS RIWAYAT
========================================================= */

async function deleteBARecord(id) {

const yakin =
  await showConfirm({
    title: "Hapus Riwayat?",
    message: "Yakin ingin menghapus dokumen ini dari Riwayat?",
    description: "Data dokumen akan dihapus dari daftar Riwayat BA.",
    confirmText: "Hapus",
    type: "danger"
  });


  if (!yakin) {
    return;
  }


  let records =
    getAllBARecords();


  records =
    records.filter(
      record =>
        record.id !== id
    );


  setAllBARecords(
    records
  );


  renderRiwayat();


  if (
    typeof renderDashboard ===
    "function"
  ) {

    renderDashboard();

  }

}


/* =========================================================
   RENDER RIWAYAT
========================================================= */

function renderRiwayat() {

  const tbody =
    document.getElementById(
      "riwayatList"
    );

  if (!tbody) {
    return;
  }


  let records =
    getAllBARecords();


  /* =========================
     SUMMARY
  ========================= */

  const totalElement =
    document.getElementById(
      "riwayatTotal"
    );

  if (totalElement) {
    totalElement.textContent =
      records.length;
  }


  /* =========================
     BULAN INI
  ========================= */

  const sekarang =
    new Date();

  const bulanSekarang =
    sekarang.getMonth();

  const tahunSekarang =
    sekarang.getFullYear();


  const bulanIni =
    records.filter(
      record => {

        const value =
          record.tanggal ||
          record.createdAt;

        if (!value) {
          return false;
        }

        const tanggal =
          new Date(value);

        if (
          isNaN(
            tanggal.getTime()
          )
        ) {
          return false;
        }

        return (
          tanggal.getMonth() ===
            bulanSekarang &&
          tanggal.getFullYear() ===
            tahunSekarang
        );

      }
    ).length;


  const bulanElement =
    document.getElementById(
      "riwayatBulanIni"
    );

  if (bulanElement) {
    bulanElement.textContent =
      bulanIni;
  }


  /* =========================
     SEARCH
  ========================= */

  const searchElement =
    document.getElementById(
      "riwayatSearch"
    );

  const keyword =
    searchElement
      ? searchElement.value
          .trim()
          .toLowerCase()
      : "";


  /* =========================
     FILTER JENIS
  ========================= */

  const filterElement =
    document.getElementById(
      "riwayatFilterJenis"
    );

  const filterJenis =
    filterElement
      ? filterElement.value
      : "";


  /* =========================
     SORT TERBARU
  ========================= */

  records.sort(
    (a, b) =>
      new Date(
        b.tanggal ||
        b.createdAt ||
        0
      ) -
      new Date(
        a.tanggal ||
        a.createdAt ||
        0
      )
  );


  /* =========================
     FILTER
  ========================= */

  records =
    records.filter(
      record => {

        const jenis =
          String(
            record.jenis || ""
          ).toLowerCase();

        const judul =
          String(
            record.judul || ""
          ).toLowerCase();

        const id =
          String(
            record.id || ""
          ).toLowerCase();

        const username =
          String(
            record.createdBy?.username ||
            ""
          ).toLowerCase();


        const cocokSearch =
          !keyword ||
          judul.includes(keyword) ||
          jenis.includes(keyword) ||
          id.includes(keyword) ||
          username.includes(keyword);


        const cocokJenis =
          !filterJenis ||
          jenis === filterJenis;


        return (
          cocokSearch &&
          cocokJenis
        );

      }
    );


  /* =========================
     EMPTY
  ========================= */

  if (!records.length) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="6"
          class="table-empty"
        >

          <div class="table-empty-title">
            Belum ada Riwayat
          </div>

          <div class="table-empty-description">
            Berita Acara yang sudah
            difinalisasi akan muncul di sini.
          </div>

        </td>

      </tr>

    `;

    return;

  }


  /* =========================
     RENDER
  ========================= */

  tbody.innerHTML =

    records.map(
      record => {

        const id =
          escapeRiwayatHTML(
            record.id || "-"
          );


        const judul =
          escapeRiwayatHTML(
            record.judul ||
            getRiwayatJenisName(
              record.jenis
            )
          );


        const namaJenis =
          escapeRiwayatHTML(
            getRiwayatJenisName(
              record.jenis
            )
          );


        const tanggal =
          formatRiwayatDate(
            record.tanggal ||
            record.createdAt
          );


        const username =
          escapeRiwayatHTML(
            record.createdBy?.username ||
            "admin"
          );


        const department =
          escapeRiwayatHTML(
            record.createdBy?.department ||
            "-"
          );


        const pdfUrl =
          record.pdfUrl
            ? escapeRiwayatHTML(
                record.pdfUrl
              )
            : "";


        return `

          <tr>

            <!-- NO BA -->

            <td>

              <span class="table-id">
                ${id}
              </span>

              <span class="table-secondary">
                Dokumen Final
              </span>

            </td>


            <!-- JENIS / DOKUMEN -->

            <td>

              <span class="table-primary">
                ${judul}
              </span>

              <span class="table-secondary">
                ${namaJenis}
              </span>

            </td>


            <!-- TANGGAL -->

            <td>

              <span class="table-primary">
                ${tanggal}
              </span>

            </td>


            <!-- DIBUAT OLEH -->

            <td>

              <span class="table-primary">
                @${username}
              </span>

              <span class="table-secondary">
                ${department}
              </span>

            </td>


            <!-- STATUS -->

            <td>

              <span
                class="
                  status-badge
                  status-final
                "
              >
                ● Final
              </span>

            </td>


            <!-- AKSI -->

            <td>

              <div class="table-actions">

                <button
                  type="button"
                  class="
                    table-action-btn
                    btn-detail
                  "
                  onclick="
                    viewBARecord(
                      '${id}'
                    )
                  "
                >
                  Detail
                </button>


                ${
                  pdfUrl
                    ? `
                      <button
                        type="button"
                        class="
                          table-action-btn
                          btn-pdf
                        "
                        onclick="
                          window.open(
                            '${pdfUrl}',
                            '_blank',
                            'noopener,noreferrer'
                          )
                        "
                      >
                        PDF
                      </button>
                    `
                    : ""
                }


                <button
                  type="button"
                  class="
                    table-action-btn
                    btn-delete
                  "
                  title="Hapus"
                  onclick="
                    deleteBARecord(
                      '${id}'
                    )
                  "
                >
                  Hapus
                </button>

              </div>

            </td>

          </tr>

        `;

      }

    ).join("");

}


/* =========================================================
   LIHAT RECORD
   tahap berikutnya akan membuka preview BA
========================================================= */

/* =========================================================
   LIHAT DOKUMEN DARI RIWAYAT
========================================================= */

function viewBARecord(id) {

  /* =========================
     CARI RECORD
  ========================= */

  const records =
    getAllBARecords();


  const record =
    records.find(
      item =>
        item.id === id
    );


  if (!record) {

    alert(
      "Dokumen tidak ditemukan."
    );

    return;

  }


  /* =========================
     AMBIL DATA DOKUMEN
  ========================= */

  const data =
    record.data || {};


  if (
    !data ||
    Object.keys(data).length === 0
  ) {

    alert(
      "Data dokumen ini kosong dan tidak dapat ditampilkan."
    );

    return;

  }


  /*
    PENTING:
    dokumen Riwayat bukan Draft aktif.
  */

  activeDraftId = null;


  /* =========================
     BUAT DRAFT TEMPORARY
     HANYA DI MEMORY
  ========================= */

  const tempId =
    "__RIWAYAT_PREVIEW__";


  const draftsAsli =
    getAllDrafts();


  /*
    Jangan simpan temporary record
    ke localStorage.

    Kita override getAllDrafts
    sebentar agar loadDraft()
    dapat memakai mesin restore
    yang sudah ada.
  */

  const originalGetAllDrafts =
    getAllDrafts;


  window.getAllDrafts =
    function () {

      return [

        {
          id: tempId,

          jenis:
            record.jenis,

          judul:
            record.judul,

          data:
            data
        }

      ];

    };


  try {

    /*
      Mesin restore existing:
      - jenis BA
      - editor
      - TTD
      - material
      - opname
      - preview
    */

    loadDraft(
      tempId
    );


    /*
      loadDraft() menganggap data
      sebagai Draft aktif.

      Kita lepaskan kembali karena
      ini dokumen Riwayat.
    */

    activeDraftId =
      null;


    /*
      Tandai mode Riwayat.
    */

    window.activeBARecordId =
      record.id;


    window.isViewingBARecord =
      true;


    /*
      Status bagian atas.
    */

    setTimeout(
      function () {

        updateRiwayatViewMode(
          record
        );

      },
      300
    );


  } catch (error) {

    console.error(
      "Gagal membuka Riwayat BA:",
      error
    );


    alert(
      "Dokumen gagal ditampilkan."
    );

  } finally {

    /*
      Kembalikan fungsi Draft asli.
    */

    window.getAllDrafts =
      originalGetAllDrafts;

  }

}

/* =========================================================
   MODE LIHAT DOKUMEN RIWAYAT
========================================================= */

function updateRiwayatViewMode(
  record
) {

  /*
    Pastikan bukan Draft aktif.
  */

  activeDraftId = null;


  /* =========================
     STATUS TOPBAR
  ========================= */

  const status =
    document.getElementById(
      "draftStatus"
    );


  if (status) {

    status.innerHTML = `

      <span
        class="draft-status-icon"
      >
        ✓
      </span>

      <span>
        Dokumen Selesai
      </span>

    `;

  }


  /* =========================
     FINALISASI BUTTON
  ========================= */

  const finalButton =
    document.querySelector(
      ".btn-final-ba"
    );


  if (finalButton) {

    finalButton.disabled =
      true;


    finalButton.innerHTML = `

      <span>✓</span>

      Sudah Final

    `;


    finalButton.classList.add(
      "ba-final-disabled"
    );

  }

}


/* =========================================================
   INIT RIWAYAT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    renderRiwayat();

  }
);

/* =========================================================
   FINALISASI BERITA ACARA
========================================================= */

async function finalizeBA() {

  /* Jangan finalisasi ulang dokumen Riwayat */

if (
  window.isViewingBARecord
) {

  alert(
    "Dokumen ini sudah difinalisasi dan tersimpan di Riwayat."
  );

  return;

}

  /* =========================
     CEK JENIS BA
  ========================= */

  const jenisElement =
    document.getElementById("jenis");


  const jenis =
    jenisElement
      ? jenisElement.value.trim()
      : "";


  if (!jenis) {

    alert(
      "Pilih jenis Berita Acara terlebih dahulu."
    );

    return;

  }


  /* =========================
     KONFIRMASI
  ========================= */

  const namaJenis =
    typeof getNamaJenisBA === "function"
      ? getNamaJenisBA(jenis)
      : "Berita Acara";


const yakin =
  await showConfirm({
    title: "Finalisasi BA?",
    message: `Finalisasi ${namaJenis}?`,
    description:
      "Dokumen akan disimpan ke Riwayat dan tidak lagi berstatus Draft.",
    confirmText: "Finalisasi",
    type: "danger"
  });


  if (!yakin) {
    return;
  }


  /* =========================
     GENERATE PREVIEW TERBARU
  ========================= */

  try {

    if (
      typeof generate ===
      "function"
    ) {

      generate();

    }

  } catch (error) {

    console.error(
      "Generate preview gagal:",
      error
    );

  }


  /* =========================
     SIMPAN KE RIWAYAT
  ========================= */

  await saveBAFinal();

}

/* =========================================================
   LAPORAN BERITA ACARA
========================================================= */

function getLaporanRecords() {

  if (
    typeof getAllBARecords === "function"
  ) {
    return getAllBARecords();
  }

  try {

    const data =
      JSON.parse(
        localStorage.getItem("baRecords")
      );

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {

    console.error(
      "Gagal membaca data laporan:",
      error
    );

    return [];

  }

}


function getLaporanJenisName(jenis) {

  const jenisMap = {

    material:
      "BA Material",

    keterangan:
      "BA Keterangan",

    adendum:
      "BA Adendum",

    biaya:
      "BA Pengajuan Biaya",

    urugan:
      "BA Urugan",

    opname:
      "BA Opname"

  };

  return (
    jenisMap[jenis] ||
    jenis ||
    "-"
  );

}


function formatLaporanDate(value) {

  if (!value) return "-";

  const date =
    new Date(value);

  if (isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


function getLaporanFilteredRecords() {

  const records =
    getLaporanRecords();


  const bulan =
    document.getElementById(
      "laporanFilterBulan"
    )?.value || "";


  const jenis =
    document.getElementById(
      "laporanFilterJenis"
    )?.value || "";


  return records.filter(
    record => {

      const recordJenis =
        record.jenis || "";


      if (
        jenis &&
        recordJenis !== jenis
      ) {
        return false;
      }


      if (bulan) {

        const date =
          new Date(
            record.tanggal ||
            record.createdAt
          );


        if (
          isNaN(date.getTime())
        ) {
          return false;
        }


        const recordBulan =
          date.getFullYear() +
          "-" +
          String(
            date.getMonth() + 1
          ).padStart(2, "0");


        if (
          recordBulan !== bulan
        ) {
          return false;
        }

      }


      return true;

    }
  );

}


function renderLaporan() {

  const allRecords =
    getLaporanRecords();


  const records =
    getLaporanFilteredRecords();


  /* =========================
     SUMMARY
  ========================= */

  const totalEl =
    document.getElementById(
      "laporanTotalBA"
    );

  if (totalEl) {
    totalEl.textContent =
      allRecords.length;
  }


  const now =
    new Date();


  const bulanIni =
    allRecords.filter(
      record => {

        const date =
          new Date(
            record.tanggal ||
            record.createdAt
          );

        return (
          !isNaN(date.getTime()) &&
          date.getMonth() ===
            now.getMonth() &&
          date.getFullYear() ===
            now.getFullYear()
        );

      }
    ).length;


  const bulanEl =
    document.getElementById(
      "laporanBulanIni"
    );

  if (bulanEl) {
    bulanEl.textContent =
      bulanIni;
  }


  /* =========================
     HITUNG JENIS
  ========================= */

  const jenisCount = {};

  allRecords.forEach(
    record => {

      const jenis =
        record.jenis || "lainnya";

      jenisCount[jenis] =
        (jenisCount[jenis] || 0) + 1;

    }
  );


  const jenisEntries =
    Object.entries(jenisCount)
      .sort(
        (a, b) =>
          b[1] - a[1]
      );


  const terbanyakEl =
    document.getElementById(
      "laporanJenisTerbanyak"
    );


  if (terbanyakEl) {

    terbanyakEl.textContent =
      jenisEntries.length
        ? getLaporanJenisName(
            jenisEntries[0][0]
          )
        : "-";

  }


  const totalJenisEl =
    document.getElementById(
      "laporanTotalJenis"
    );


  if (totalJenisEl) {
    totalJenisEl.textContent =
      jenisEntries.length;
  }


  /* =========================
     STATISTIK JENIS
  ========================= */

  const jenisList =
    document.getElementById(
      "laporanJenisList"
    );


  if (jenisList) {

    const filterJenisCount = {};

    records.forEach(
      record => {

        const jenis =
          record.jenis || "lainnya";

        filterJenisCount[jenis] =
          (filterJenisCount[jenis] || 0)
          + 1;

      }
    );


    const entries =
      Object.entries(
        filterJenisCount
      ).sort(
        (a, b) =>
          b[1] - a[1]
      );


    const max =
      entries.length
        ? entries[0][1]
        : 0;


    if (!entries.length) {

      jenisList.innerHTML = `
        <div class="laporan-empty">
          Belum ada data pada filter ini.
        </div>
      `;

    } else {

      jenisList.innerHTML =
        entries.map(
          ([jenis, jumlah]) => {

            const persen =
              max > 0
                ? (jumlah / max) * 100
                : 0;


            return `

              <div class="laporan-stat-row">

                <div class="laporan-stat-info">

                  <span>
                    ${getLaporanJenisName(jenis)}
                  </span>

                  <strong>
                    ${jumlah}
                  </strong>

                </div>

                <div class="laporan-stat-track">

                  <div
                    class="laporan-stat-bar"
                    style="width:${persen}%"
                  ></div>

                </div>

              </div>

            `;

          }
        ).join("");

    }

  }


  /* =========================
     REKAP BULANAN
  ========================= */

  const monthly = {};

  records.forEach(
    record => {

      const date =
        new Date(
          record.tanggal ||
          record.createdAt
        );

      if (
        isNaN(date.getTime())
      ) {
        return;
      }


      const key =
        date.getFullYear() +
        "-" +
        String(
          date.getMonth() + 1
        ).padStart(2, "0");


      monthly[key] =
        (monthly[key] || 0) + 1;

    }
  );


  const monthList =
    document.getElementById(
      "laporanBulananList"
    );


  if (monthList) {

    const monthEntries =
      Object.entries(monthly)
        .sort(
          (a, b) =>
            b[0].localeCompare(a[0])
        );


    if (!monthEntries.length) {

      monthList.innerHTML = `
        <div class="laporan-empty">
          Belum ada data bulanan.
        </div>
      `;

    } else {

      monthList.innerHTML =
        monthEntries.map(
          ([key, jumlah]) => {

            const [
              year,
              month
            ] = key.split("-");


            const label =
              new Date(
                Number(year),
                Number(month) - 1,
                1
              ).toLocaleDateString(
                "id-ID",
                {
                  month: "long",
                  year: "numeric"
                }
              );


            return `

              <div class="laporan-month-row">

                <span>
                  ${label}
                </span>

                <strong>
                  ${jumlah} BA
                </strong>

              </div>

            `;

          }
        ).join("");

    }

  }


  /* =========================
     DETAIL TABLE
  ========================= */

  const tbody =
    document.getElementById(
      "laporanTableBody"
    );


  const count =
    document.getElementById(
      "laporanFilteredCount"
    );


  if (count) {
    count.textContent =
      `${records.length} Dokumen`;
  }


  if (!tbody) return;


  if (!records.length) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="4"
          class="laporan-empty"
        >
          Belum ada dokumen
          pada filter ini.
        </td>

      </tr>

    `;

    return;

  }


  const sorted =
    [...records].sort(
      (a, b) =>
        new Date(
          b.tanggal ||
          b.createdAt
        ) -
        new Date(
          a.tanggal ||
          a.createdAt
        )
    );


  tbody.innerHTML =
    sorted.map(
      record => `

        <tr>

          <td>

            <strong>
              ${
                record.judul ||
                getLaporanJenisName(
                  record.jenis
                )
              }
            </strong>

            <small>
              ${record.id || "-"}
            </small>

          </td>


          <td>
            ${getLaporanJenisName(
              record.jenis
            )}
          </td>


          <td>
            ${formatLaporanDate(
              record.tanggal ||
              record.createdAt
            )}
          </td>


          <td>

            <span class="laporan-status">
              Selesai
            </span>

          </td>

        </tr>

      `
    ).join("");

}


/* =========================================================
   RESET FILTER
========================================================= */

function resetLaporanFilter() {

  const bulan =
    document.getElementById(
      "laporanFilterBulan"
    );


  const jenis =
    document.getElementById(
      "laporanFilterJenis"
    );


  if (bulan) {
    bulan.value = "";
  }


  if (jenis) {
    jenis.value = "";
  }


  renderLaporan();

}


/* =========================================================
   EXPORT CSV
========================================================= */

function exportLaporanCSV() {

  const records =
    getLaporanFilteredRecords();


  if (!records.length) {

    alert(
      "Tidak ada data untuk diexport."
    );

    return;

  }


  const rows = [

    [
      "ID Dokumen",
      "Jenis BA",
      "Tanggal",
      "Status"
    ],

    ...records.map(
      record => [

        record.id || "",

        getLaporanJenisName(
          record.jenis
        ),

        formatLaporanDate(
          record.tanggal ||
          record.createdAt
        ),

        "Selesai"

      ]
    )

  ];


  const csv =
    rows.map(
      row =>
        row.map(
          value =>
            `"${String(value)
              .replace(/"/g, '""')}"`
        ).join(",")
    ).join("\n");


  const blob =
    new Blob(
      ["\uFEFF" + csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "Laporan_Berita_Acara.csv";


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();

  URL.revokeObjectURL(url);

}

/* =========================================================
   MASTER PROJECT
========================================================= */

const MASTER_PROJECT_KEY =
  "masterProjects";

  /* =========================================================
   MASTER PROJECT - GOOGLE SHEETS API
========================================================= */

async function fetchMasterProjectsFromAPI() {

  const response =
    await fetch(
      DATABASE_API_URL +
      "?table=" +
      MASTER_PROJECT_TABLE,
      {
        method: "GET",
        cache: "no-store"
      }
    );

  if (!response.ok) {
    throw new Error(
      "Gagal terhubung ke database Project."
    );
  }

  const result =
    await response.json();

  if (!result.success) {
    throw new Error(
      result.message ||
      "Gagal mengambil Master Project."
    );
  }

  return Array.isArray(result.data)
    ? result.data
    : [];
}


async function sendMasterProjectRequest(
  payload
) {

  const response =
    await fetch(
      DATABASE_API_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(payload)
      }
    );

  if (!response.ok) {
    throw new Error(
      "Database Project tidak merespons."
    );
  }

  const result =
    await response.json();

  if (!result.success) {
    throw new Error(
      result.message ||
      "Operasi Project gagal."
    );
  }

  return result;
}


/* =========================================================
   LOAD PROJECT DARI DATABASE
========================================================= */

async function loadMasterProjectDatabase(
  showLoading = true
) {

  const tbody =
    document.getElementById(
      "masterProjectList"
    );

  try {

    if (
      showLoading &&
      tbody
    ) {

      tbody.innerHTML = `
        <tr>
          <td
            colspan="5"
            class="master-project-empty"
          >
            Mengambil data project...
          </td>
        </tr>
      `;

    }

    const data =
      await fetchMasterProjectsFromAPI();

    /*
      Google Sheets = database utama.
      localStorage = cache.
    */

    setMasterProjects(data);

    renderMasterProject();

    refreshProjectDropdowns();

    return data;

  } catch (error) {

    console.error(
      "MASTER PROJECT API:",
      error
    );

    /*
      Jika API bermasalah,
      gunakan cache localStorage.
    */

    renderMasterProject();

    refreshProjectDropdowns();

    if (showLoading) {

      showToast(
        "Database Project tidak dapat diakses. Menggunakan data terakhir.",
        "#f79009"
      );

    }

    return getMasterProjects();

  }

}


function getMasterProjects() {

  try {

    const data =
      JSON.parse(
        localStorage.getItem(
          MASTER_PROJECT_KEY
        )
      );

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {

    console.error(
      "Gagal membaca Master Project:",
      error
    );

    return [];

  }

}


function setMasterProjects(data) {

  localStorage.setItem(
    MASTER_PROJECT_KEY,
    JSON.stringify(data)
  );

}


function createProjectId() {

  return (
    "PRJ-" +
    Date.now().toString(36).toUpperCase()
  );

}


function openProjectModal(id = null) {

  const modal =
    document.getElementById(
      "projectModal"
    );

  if (!modal) return;


  document.getElementById(
    "projectEditId"
  ).value = "";


  document.getElementById(
    "projectKode"
  ).value = "";


  document.getElementById(
    "projectNama"
  ).value = "";


  document.getElementById(
    "projectArea"
  ).value = "";


  document.getElementById(
    "projectStatus"
  ).value = "aktif";


  document.getElementById(
    "projectModalTitle"
  ).textContent =
    "Tambah Project";


  if (id) {

    const project =
      getMasterProjects().find(
        item => item.id === id
      );


    if (project) {

      document.getElementById(
        "projectEditId"
      ).value =
        project.id;


      document.getElementById(
        "projectKode"
      ).value =
        project.kode || "";


      document.getElementById(
        "projectNama"
      ).value =
        project.nama || "";


      document.getElementById(
        "projectArea"
      ).value =
        project.area || "";


      document.getElementById(
        "projectStatus"
      ).value =
        project.status || "aktif";


      document.getElementById(
        "projectModalTitle"
      ).textContent =
        "Edit Project";

    }

  }


  modal.classList.add(
    "show"
  );

}


function closeProjectModal() {

  const modal =
    document.getElementById(
      "projectModal"
    );

  if (modal) {
    modal.classList.remove(
      "show"
    );
  }

}

/* =========================================================
   AUTO GENERATE KODE PROJECT
========================================================= */

/* =========================================================
   GENERATE PREFIX PROJECT
========================================================= */

function getProjectPrefix(nama) {

  if (!nama) {
    return "";
  }

  const clean =
    String(nama)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .replace(/\s+/g, " ");

  if (!clean) {
    return "";
  }


  const words =
    clean.split(" ");


  /* RN */

  if (words[0] === "RN") {
    return "RN";
  }


  /* TRUSMILAND */

  if (
    words[0] === "TRUSMILAND" ||
    words[0] === "TL"
  ) {
    return "TL";
  }


  /*
    Project lainnya:
    gunakan maksimal 3 huruf
    dari kata pertama.
  */

  return words[0]
    .replace(/[^A-Z]/g, "")
    .substring(0, 3);

}


/* =========================================================
   GENERATE KODE PROJECT BERIKUTNYA
========================================================= */

function generateProjectCode(nama) {

  const prefix =
    getProjectPrefix(nama);


  if (!prefix) {
    return "";
  }


  const projects =
    getMasterProjects();


  let nomorTerbesar = 0;


  projects.forEach(
    project => {

      const kode =
        String(
          project.kode || ""
        ).toUpperCase();


      /*
        Contoh:
        RN001
        RN002
        TL001
      */

      if (
        kode.startsWith(prefix)
      ) {

        const nomor =
          parseInt(
            kode.substring(
              prefix.length
            ),
            10
          );


        if (
          !isNaN(nomor) &&
          nomor > nomorTerbesar
        ) {

          nomorTerbesar =
            nomor;

        }

      }

    }
  );


  const nomorBaru =
    nomorTerbesar + 1;


  return (
    prefix +
    String(nomorBaru)
      .padStart(3, "0")
  );

}


/* =========================================================
   AUTO GENERATE SAAT NAMA PROJECT DIKETIK
========================================================= */

function autoGenerateProjectCode() {

  const namaEl =
    document.getElementById(
      "projectNama"
    );


  const kodeEl =
    document.getElementById(
      "projectKode"
    );


  const editId =
    document.getElementById(
      "projectEditId"
    )?.value || "";


  if (
    !namaEl ||
    !kodeEl
  ) {
    return;
  }


  /*
    Saat EDIT:
    kode existing jangan berubah otomatis.
  */

  if (editId) {
    return;
  }


  const nama =
    namaEl.value.trim();


  if (!nama) {

    kodeEl.value = "";

    return;

  }


  kodeEl.value =
    generateProjectCode(nama);

}


/* =========================================================
   SAVE MASTER PROJECT
========================================================= */

async function saveMasterProject() {

  const saveButton =
    document.querySelector(
      ".project-save-btn"
    );

  const id =
    document.getElementById(
      "projectEditId"
    ).value;

  const kode =
    document.getElementById(
      "projectKode"
    ).value.trim();

  const nama =
    document.getElementById(
      "projectNama"
    ).value.trim();

  const area =
    document.getElementById(
      "projectArea"
    ).value.trim();

  const status =
    document.getElementById(
      "projectStatus"
    ).value;


  /* =========================
     VALIDASI
  ========================= */

  if (!kode || !nama) {

    alert(
      "Kode Project dan Nama Project wajib diisi."
    );

    return;
  }


  /* =========================
     CEK DUPLIKAT
  ========================= */

  const projects =
    getMasterProjects();


  const kodeDipakai =
    projects.some(
      item =>
        String(item.kode || "")
          .toLowerCase() ===
        kode.toLowerCase()

        &&

        String(item.id) !==
        String(id)
    );


  if (kodeDipakai) {

    alert(
      "Kode Project sudah digunakan."
    );

    return;
  }


  const data = {

    kode,
    nama,
    area,
    status

  };


  /* =========================
     MULAI LOADING
  ========================= */

  showGlobalLoading(
    id
      ? "Memperbarui project..."
      : "Menyimpan project..."
  );


  try {

    if (saveButton) {

      saveButton.disabled =
        true;

      saveButton.textContent =
        "Menyimpan...";

    }


    /* =========================
       EDIT PROJECT
    ========================= */

    if (id) {

      await sendMasterProjectRequest({

        action:
          "update",

        table:
          MASTER_PROJECT_TABLE,

        id:
          id,

        data:
          data

      });

    }


    /* =========================
       TAMBAH PROJECT
    ========================= */

    else {

      await sendMasterProjectRequest({

        action:
          "create",

        table:
          MASTER_PROJECT_TABLE,

        data:
          data

      });

    }


    /* =========================
       REFRESH DATABASE
    ========================= */

    updateGlobalLoading(
      "Memperbarui data project..."
    );


    await loadMasterProjectDatabase(
      false
    );


    closeProjectModal();


    showToast(

      id
        ? "Project berhasil diperbarui."
        : "Project berhasil ditambahkan.",

      "success"

    );


  } catch (error) {

    console.error(
      "SAVE PROJECT:",
      error
    );


    showToast(
      "Gagal menyimpan Project: " +
      error.message,
      "#dc3545"
    );


  } finally {

    /* =========================
       MATIKAN LOADING
    ========================= */

    hideGlobalLoading();


    if (saveButton) {

      saveButton.disabled =
        false;

      saveButton.textContent =
        "Simpan Project";

    }

  }

}


/* =========================================================
   DELETE MASTER PROJECT
========================================================= */

async function deleteMasterProject(id) {

  const projects =
    getMasterProjects();


  const project =
    projects.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!project) {

    showToast(
      "Data Project tidak ditemukan.",
      "#dc3545"
    );

    return;
  }


  /* =========================
     KONFIRMASI DULU
  ========================= */

const yakin =
  await showConfirm({
    title: "Hapus Project?",
    message: `Yakin ingin menghapus "${project.nama}"?`,
    description:
      "Project ini tidak akan tersedia lagi pada dropdown BA.",
    confirmText: "Hapus Project",
    type: "danger"
  });


  if (!yakin) {
    return;
  }


  /* =========================
     MULAI LOADING
  ========================= */

  showGlobalLoading(
    "Menghapus project..."
  );


  try {

    await sendMasterProjectRequest({

      action:
        "delete",

      table:
        MASTER_PROJECT_TABLE,

      id:
        id

    });


    /* =========================
       REFRESH DATABASE
    ========================= */

    updateGlobalLoading(
      "Memperbarui data project..."
    );


    await loadMasterProjectDatabase(
      false
    );


    showToast(
      "Project berhasil dihapus.",
      "success"
    );


  } catch (error) {

    console.error(
      "DELETE PROJECT:",
      error
    );


    showToast(
      "Gagal menghapus Project: " +
      error.message,
      "#dc3545"
    );


  } finally {

    /* =========================
       MATIKAN LOADING
    ========================= */

    hideGlobalLoading();

  }

}


function renderMasterProject() {

  const projects =
    getMasterProjects();


  /* SUMMARY */

  const aktif =
    projects.filter(
      item =>
        item.status === "aktif"
    ).length;


  const nonaktif =
    projects.length - aktif;


  const totalEl =
    document.getElementById(
      "projectTotal"
    );

  const aktifEl =
    document.getElementById(
      "projectAktif"
    );

  const nonaktifEl =
    document.getElementById(
      "projectNonaktif"
    );


  if (totalEl) {
    totalEl.textContent =
      projects.length;
  }


  if (aktifEl) {
    aktifEl.textContent =
      aktif;
  }


  if (nonaktifEl) {
    nonaktifEl.textContent =
      nonaktif;
  }


  /* FILTER */

  const search =
    (
      document.getElementById(
        "projectSearch"
      )?.value || ""
    )
      .trim()
      .toLowerCase();


  const status =
    document.getElementById(
      "projectStatusFilter"
    )?.value || "";


  const filtered =
    projects.filter(
      item => {

        if (
          status &&
          item.status !== status
        ) {
          return false;
        }


        if (search) {

          const text =
            [
              item.kode,
              item.nama,
              item.area
            ]
              .join(" ")
              .toLowerCase();


          if (
            !text.includes(search)
          ) {
            return false;
          }

        }


        return true;

      }
    );


  const tbody =
    document.getElementById(
      "masterProjectList"
    );


  if (!tbody) return;


  if (!filtered.length) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="master-project-empty"
        >
          ${
            projects.length
              ? "Project tidak ditemukan."
              : "Belum ada data project."
          }
        </td>

      </tr>

    `;

    return;

  }


  tbody.innerHTML =
    filtered.map(
      project => `

        <tr>

          <td>
            <strong>
              ${escapeProjectHTML(
                project.kode
              )}
            </strong>
          </td>


          <td>
            <strong>
              ${escapeProjectHTML(
                project.nama
              )}
            </strong>
          </td>


          <td>
            ${escapeProjectHTML(
              project.area || "-"
            )}
          </td>


          <td>

            <span
              class="project-status
              ${project.status}"
            >
              ${
                project.status ===
                "aktif"
                  ? "Aktif"
                  : "Nonaktif"
              }
            </span>

          </td>


          <td>

            <button
              class="project-action edit"
              onclick="openProjectModal('${project.id}')"
            >
              Edit
            </button>


            <button
              class="project-action delete"
              onclick="deleteMasterProject('${project.id}')"
            >
              Hapus
            </button>

          </td>

        </tr>

      `
    ).join("");

}


function escapeProjectHTML(value) {

  return String(
    value ?? ""
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* =========================================================
   MASTER PROJECT → FORM BERITA ACARA
========================================================= */

function refreshProjectDropdowns() {

  if (
    typeof getMasterProjects !== "function"
  ) {
    return;
  }


  /*
    Hanya project AKTIF yang boleh
    digunakan untuk BA baru.
  */

  const projects =
    getMasterProjects()
      .filter(
        project =>
          project.status === "aktif"
      )
      .sort(
        (a, b) =>
          String(a.nama || "")
            .localeCompare(
              String(b.nama || ""),
              "id"
            )
      );


  const dropdownIds = [

    "projectBiaya",
    "projectUrugan"

  ];


  dropdownIds.forEach(
    id => {

      const select =
        document.getElementById(id);


      if (!select) {
        return;
      }


      /*
        Simpan value saat ini agar
        tidak hilang ketika refresh.
      */

      const currentValue =
        select.value;


      select.innerHTML = `

        <option value="">
          Pilih Project
        </option>

      `;


      projects.forEach(
        project => {

          const option =
            document.createElement(
              "option"
            );


          /*
            VALUE = nama project.

            Ini sengaja supaya fungsi
            generate BA lama tidak perlu
            kita ubah.

            Contoh:
            value = "RN Sumber"
          */

          option.value =
            project.nama;


          option.textContent =
            `${project.kode} — ${project.nama}`;


          option.dataset.projectId =
            project.id;


          option.dataset.projectKode =
            project.kode;


          option.dataset.projectArea =
            project.area || "";


          select.appendChild(
            option
          );

        }
      );


      /*
        Kembalikan pilihan sebelumnya
        bila masih tersedia.
      */

     if (currentValue) {

  const exists =
    Array.from(
      select.options
    ).some(
      option =>
        option.value ===
        currentValue
    );


  /*
    Project sudah nonaktif / terhapus,
    tetapi pernah digunakan pada BA lama.
  */

      if (!exists) {

        const historicalOption =
          document.createElement(
            "option"
          );


        historicalOption.value =
          currentValue;


        historicalOption.textContent =
          currentValue +
          " (Data Lama)";


        historicalOption.dataset.historical =
          "true";


        select.appendChild(
          historicalOption
        );

      }


      select.value =
        currentValue;

      }

    }
  );

}

/* =========================================================
   MASTER USER
========================================================= */

const MASTER_USER_KEY = "masterUsers";
const CURRENT_USER_KEY = "currentBAUser";

/* =========================================================
   MASTER USER - GOOGLE SHEETS API
========================================================= */

async function fetchMasterUsersFromAPI() {

  const response = await fetch(
    DATABASE_API_URL +
    "?table=" +
    MASTER_USER_TABLE +
    "&t=" +
    Date.now(),
    {
      method: "GET",
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(
      "Gagal terhubung ke database User."
    );
  }

  const result =
    await response.json();

  if (!result.success) {
    throw new Error(
      result.message ||
      "Gagal mengambil Master User."
    );
  }

  return Array.isArray(result.data)
    ? result.data
    : [];
}


async function sendMasterUserRequest(payload) {

  const response = await fetch(
    DATABASE_API_URL,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body:
        JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Database User tidak merespons."
    );
  }

  const result =
    await response.json();

  if (!result.success) {
    throw new Error(
      result.message ||
      "Operasi User gagal."
    );
  }

  return result;
}


/* =========================================================
   LOAD MASTER USER
========================================================= */

async function loadMasterUserDatabase(
  showLoading = true
) {

  const tbody =
    document.getElementById(
      "masterUserList"
    );

  try {

    if (
      showLoading &&
      tbody
    ) {

      tbody.innerHTML = `
        <tr>
          <td
            colspan="6"
            class="master-user-empty"
          >
            Mengambil data user...
          </td>
        </tr>
      `;

    }

    const users =
      await fetchMasterUsersFromAPI();

    /*
      Google Sheets = database utama
      localStorage = cache
    */

    setMasterUsers(users);

    renderMasterUser();

    return users;

  } catch (error) {

    console.error(
      "MASTER USER API:",
      error
    );

    renderMasterUser();

    if (showLoading) {

      showToast(
        "Database User tidak dapat diakses. Menggunakan data terakhir.",
        "warning"
      );

    }

    return getMasterUsers();

  }

}


function getMasterUsers() {

  try {

    const data =
      JSON.parse(
        localStorage.getItem(
          MASTER_USER_KEY
        )
      );

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {

    console.error(
      "Gagal membaca Master User:",
      error
    );

    return [];

  }

}


function setMasterUsers(users) {

  localStorage.setItem(
    MASTER_USER_KEY,
    JSON.stringify(users)
  );

}


/* =========================================================
   SEED USER AWAL
========================================================= */

function initializeMasterUsers() {

  const users =
    getMasterUsers();


  if (users.length) {
    return;
  }


  const now =
    new Date().toISOString();


  const defaultUsers = [

    {
      id: "USR-WAHYU",
      nama: "Wahyu Aji Pangestika",
      username: "wahyu247"
    },

    {
      id: "USR-SITI",
      nama: "Siti Amalia",
      username: "siti583"
    },

    {
      id: "USR-JESY",
      nama: "Jesy Ambarwati",
      username: "jesy316"
    },

    {
      id: "USR-RINI",
      nama: "Rini Purwanti",
      username: "rini742"
    },

    {
      id: "USR-ADYAS",
      nama: "Adyas Adnan Wiguna",
      username: "adyas428"
    },

    {
      id: "USR-MAEDI",
      nama: "Maedi",
      username: "maedi651"
    }

  ].map(
    user => ({

      ...user,

      password: "admin123",

      department:
        "Purchasing",

      role:
        "full_access",

      status:
        "aktif",

      createdAt:
        now,

      updatedAt:
        now

    })
  );


  setMasterUsers(
    defaultUsers
  );

}


function createMasterUserId() {

  return (
    "USR-" +
    Date.now()
      .toString(36)
      .toUpperCase()
  );

}


/* =========================================================
   USERNAME
========================================================= */

function generateRandomUsername(nama) {

  if (!nama) {
    return "";
  }


  const firstName =
    nama
      .trim()
      .toLowerCase()
      .split(/\s+/)[0]
      .replace(
        /[^a-z0-9]/g,
        ""
      );


  if (!firstName) {
    return "";
  }


  const users =
    getMasterUsers();


  let username = "";
  let attempts = 0;


  do {

    const randomNumber =
      Math.floor(
        100 +
        Math.random() * 900
      );


    username =
      firstName +
      randomNumber;


    attempts++;

  } while (

    users.some(
      user =>
        user.username
          .toLowerCase() ===
        username.toLowerCase()
    ) &&

    attempts < 1000

  );


  return username;

}


function autoGenerateUsername() {

  const editId =
    document.getElementById(
      "userEditId"
    )?.value || "";


  /*
    Username existing tidak berubah
    ketika user diedit.
  */

  if (editId) {
    return;
  }


  const nama =
    document.getElementById(
      "userNama"
    )?.value.trim() || "";


  const usernameEl =
    document.getElementById(
      "userUsername"
    );


  if (!usernameEl) {
    return;
  }


  if (!nama) {

    usernameEl.value = "";

    return;

  }


  /*
    Generate setelah nama depan
    sudah mulai terbentuk.
  */

  usernameEl.value =
    generateRandomUsername(
      nama
    );

}


/* =========================================================
   MODAL
========================================================= */

function openUserModal(id = null) {

  const modal =
    document.getElementById(
      "userModal"
    );


  if (!modal) {
    return;
  }


  document.getElementById(
    "userEditId"
  ).value = "";


  document.getElementById(
    "userNama"
  ).value = "";


  document.getElementById(
    "userUsername"
  ).value = "";


  document.getElementById(
    "userPassword"
  ).value =
    "admin123";


  document.getElementById(
    "userStatus"
  ).value =
    "aktif";


  document.getElementById(
    "userModalTitle"
  ).textContent =
    "Tambah User";


  if (id) {

    const user =
      getMasterUsers()
        .find(
          item =>
            item.id === id
        );


    if (user) {

      document.getElementById(
        "userEditId"
      ).value =
        user.id;


      document.getElementById(
        "userNama"
      ).value =
        user.nama || "";


      document.getElementById(
        "userUsername"
      ).value =
        user.username || "";


      document.getElementById(
        "userPassword"
      ).value =
        user.password || "";


      document.getElementById(
        "userStatus"
      ).value =
        user.status || "aktif";


      document.getElementById(
        "userModalTitle"
      ).textContent =
        "Edit User";

    }

  }


  modal.classList.add(
    "show"
  );

}


function closeUserModal() {

  document.getElementById(
    "userModal"
  )?.classList.remove(
    "show"
  );

}


function toggleMasterUserPassword() {

  const input =
    document.getElementById(
      "userPassword"
    );


  if (!input) {
    return;
  }


  input.type =
    input.type === "password"
      ? "text"
      : "password";

}


/* =========================================================
   SAVE
========================================================= */

/* =========================================================
   SAVE MASTER USER
========================================================= */

async function saveMasterUser() {

  const id =
    document.getElementById(
      "userEditId"
    ).value;

  const nama =
    document.getElementById(
      "userNama"
    ).value.trim();

  let username =
    document.getElementById(
      "userUsername"
    ).value.trim();

  const password =
    document.getElementById(
      "userPassword"
    ).value;

  const status =
    document.getElementById(
      "userStatus"
    ).value;


  /* =========================
     VALIDASI
  ========================= */

  if (!nama) {

    alert(
      "Nama Lengkap wajib diisi."
    );

    return;
  }


  if (!username) {

    username =
      generateRandomUsername(
        nama
      );

  }


  if (!password) {

    alert(
      "Password tidak boleh kosong."
    );

    return;
  }


  const users =
    getMasterUsers();


  const usernameDipakai =
    users.some(
      user =>
        String(user.id) !==
          String(id)

        &&

        String(
          user.username || ""
        ).toLowerCase() ===
        username.toLowerCase()
    );


  if (usernameDipakai) {

    alert(
      "Username sudah digunakan."
    );

    return;
  }


  /* =========================
     DATA USER
  ========================= */

  const data = {

    nama:
      nama,

    username:
      username,

    password:
      password,

    department:
      "Purchasing",

    role:
      "full_access",

    status:
      status

  };


  /* =========================
     MULAI LOADING
  ========================= */

  showGlobalLoading(
    id
      ? "Memperbarui user..."
      : "Menyimpan user..."
  );


  try {

    /* =========================
       EDIT USER
    ========================= */

    if (id) {

      await sendMasterUserRequest({

        action:
          "update",

        table:
          MASTER_USER_TABLE,

        id:
          id,

        data:
          data

      });

    }


    /* =========================
       TAMBAH USER
    ========================= */

    else {

      await sendMasterUserRequest({

        action:
          "create",

        table:
          MASTER_USER_TABLE,

        data:
          data

      });

    }


    /* =========================
       REFRESH DATABASE
    ========================= */

    updateGlobalLoading(
      "Memperbarui data user..."
    );


    await loadMasterUserDatabase(
      false
    );


    closeUserModal();


    showToast(

      id
        ? "User berhasil diperbarui."
        : "User berhasil ditambahkan.",

      "success"

    );


  } catch (error) {

    console.error(
      "SAVE USER:",
      error
    );


    showToast(
      "Gagal menyimpan User: " +
      error.message,
      "danger"
    );


  } finally {

    /* =========================
       MATIKAN LOADING
    ========================= */

    hideGlobalLoading();

  }

}


/* =========================================================
   DELETE MASTER USER
========================================================= */

async function deleteMasterUser(id) {

  const users = getMasterUsers();

  const user = users.find(
    item =>
      String(item.id) === String(id)
  );


  /* =========================
     VALIDASI
  ========================= */

  if (!user) {

    showToast(
      "Data User tidak ditemukan.",
      "danger"
    );

    return;
  }


  /* =========================
     KONFIRMASI
  ========================= */

  const yakin = await showConfirm({

    title:
      "Hapus User?",

    message:
      `Yakin ingin menghapus "${user.nama}"?\n\n` +
      `User ini tidak dapat login lagi.`,

    confirmText:
      "Hapus User",

    type:
      "danger"

  });


  if (!yakin) {
    return;
  }


  /* =========================
     LOADING
  ========================= */

  showGlobalLoading(
    "Menghapus user..."
  );


  try {

    /* =========================
       DELETE DATABASE
    ========================= */

    await sendMasterUserRequest({

      action:
        "delete",

      table:
        MASTER_USER_TABLE,

      id:
        id

    });


    /* =========================
       REFRESH DATABASE
    ========================= */

    updateGlobalLoading(
      "Memperbarui data user..."
    );


    await loadMasterUserDatabase(
      false
    );


    /* =========================
       SUCCESS
    ========================= */

    showToast(
      "User berhasil dihapus.",
      "success"
    );


  } catch (error) {

    console.error(
      "DELETE USER:",
      error
    );


    showToast(
      "Gagal menghapus User: " +
      error.message,
      "danger"
    );


  } finally {

    /* =========================
       STOP LOADING
    ========================= */

    hideGlobalLoading();

  }

}

/* =========================================================
   RENDER
========================================================= */

function renderMasterUser() {


  const users =
    getMasterUsers();


  const search =
    (
      document.getElementById(
        "userSearch"
      )?.value || ""
    )
      .trim()
      .toLowerCase();


  const status =
    document.getElementById(
      "userStatusFilter"
    )?.value || "";


  const filtered =
    users.filter(
      user => {

        if (
          status &&
          user.status !== status
        ) {
          return false;
        }


        if (search) {

          const text =
            (
              user.nama +
              " " +
              user.username
            ).toLowerCase();


          if (
            !text.includes(
              search
            )
          ) {
            return false;
          }

        }


        return true;

      }
    );


  const total =
    document.getElementById(
      "userTotal"
    );


  const aktif =
    document.getElementById(
      "userAktif"
    );


  if (total) {
    total.textContent =
      users.length;
  }


  if (aktif) {

    aktif.textContent =
      users.filter(
        user =>
          user.status === "aktif"
      ).length;

  }


  const tbody =
    document.getElementById(
      "masterUserList"
    );


  if (!tbody) {
    return;
  }


  if (!filtered.length) {

    tbody.innerHTML = `

      <tr>

        <td
          colspan="6"
          class="master-user-empty"
        >
          User tidak ditemukan.
        </td>

      </tr>

    `;

    return;

  }


  tbody.innerHTML =
    filtered.map(
      user => `

        <tr>

          <td>
            <strong>
              ${escapeUserHTML(
                user.username
              )}
            </strong>
          </td>


          <td>
            ${escapeUserHTML(
              user.nama
            )}
          </td>


          <td>
            Purchasing
          </td>


          <td>
            Full Access
          </td>


          <td>

            <span
              class="user-status
              ${user.status}"
            >

              ${
                user.status ===
                "aktif"
                  ? "Aktif"
                  : "Nonaktif"
              }

            </span>

          </td>


          <td>

            <button
              class="user-action edit"
              onclick="openUserModal('${user.id}')"
            >
              Edit
            </button>


            <button
              class="user-action delete"
              onclick="deleteMasterUser('${user.id}')"
            >
              Hapus
            </button>

          </td>

        </tr>

      `
    ).join("");

}


function escapeUserHTML(value) {

  return String(
    value ?? ""
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   CURRENT LOGIN USER
========================================================= */

function setCurrentBAUser(user) {

  sessionStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify({

      id:
        user.id || "ADMIN",

      nama:
        user.nama || "Administrator",

      username:
        user.username || "admin",

      department:
        user.department || "Purchasing",

      role:
        user.role || "full_access"

    })
  );

}


function getCurrentBAUser() {

  try {

    const data =
      JSON.parse(
        sessionStorage.getItem(
          CURRENT_USER_KEY
        )
      );


    if (data) {
      return data;
    }

  } catch (error) {}


  return {

    id: "ADMIN",

    nama:
      "Administrator",

    username:
      "admin",

    department:
      "Purchasing",

    role:
      "full_access"

  };

}

/* =========================================================
   UPDATE IDENTITAS USER LOGIN
========================================================= */

function updateLoggedInUserUI() {

  const user = getCurrentBAUser();

  if (!user) {
    return;
  }


  /* =========================
     USERNAME
  ========================= */

  const username =
    user.username || "admin";


  /* =========================
     LABEL / DEPARTMENT
  ========================= */

  const userLabel =
    username === "admin"
      ? "Administrator"
      : (user.department || "Purchasing");


  /* =========================
     INITIAL AVATAR
  ========================= */

  const initial =
    username
      .charAt(0)
      .toUpperCase();


  /* =========================
     DASHBOARD WELCOME
  ========================= */

  const dashboardName =
    document.getElementById(
      "dashboardUserName"
    );

  if (dashboardName) {

    dashboardName.textContent =
      username;

  }


  /* =========================
     TOPBAR USER
  ========================= */

  const topbarName =
    document.querySelector(
      ".topbar-user-text strong"
    );

  const topbarRole =
    document.querySelector(
      ".topbar-user-text span"
    );

  const topbarAvatar =
    document.querySelector(
      ".topbar-avatar"
    );


  if (topbarName) {
    topbarName.textContent =
      username;
  }

  if (topbarRole) {
    topbarRole.textContent =
      userLabel;
  }

  if (topbarAvatar) {
    topbarAvatar.textContent =
      initial;
  }


  /* =========================
     SIDEBAR USER
  ========================= */

  const sidebarName =
    document.querySelector(
      ".sidebar-user-info strong"
    );

  const sidebarRole =
    document.querySelector(
      ".sidebar-user-info span"
    );

  const sidebarAvatar =
    document.querySelector(
      ".sidebar-avatar"
    );


  if (sidebarName) {
    sidebarName.textContent =
      username;
  }

  if (sidebarRole) {
    sidebarRole.textContent =
      userLabel;
  }

  if (sidebarAvatar) {
    sidebarAvatar.textContent =
      initial;
  }

}


/*
   Jalankan seed sejak aplikasi dibuka.
*/

// initializeMasterUsers();

/* =========================================================
   STARTUP DRAFT DATABASE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function() {

    await migrateLocalDraftsToDatabaseOnce();

  }
);

/* =========================================================
   GLOBAL ACTION LOADING
   BA GENERATOR
========================================================= */

let globalLoadingCount = 0;


/* =========================================================
   SHOW LOADING
========================================================= */

function showGlobalLoading(message = "Memproses...") {

    const overlay =
        document.getElementById("loadingOverlay");

    if (!overlay) return;


    globalLoadingCount++;


    /* buat text jika belum ada */

    let text =
        overlay.querySelector(".loading-text");

    if (!text) {

        text =
            document.createElement("div");

        text.className =
            "loading-text";

        overlay.appendChild(text);

    }


    text.textContent =
        message;


    overlay.style.display =
        "flex";

    document.body.classList.add(
        "is-loading"
    );

}


/* =========================================================
   HIDE LOADING
========================================================= */

function hideGlobalLoading(force = false) {

    const overlay =
        document.getElementById("loadingOverlay");

    if (!overlay) return;


    if (force) {

        globalLoadingCount = 0;

    } else {

        globalLoadingCount =
            Math.max(
                0,
                globalLoadingCount - 1
            );

    }


    if (globalLoadingCount > 0) {
        return;
    }


    overlay.style.display =
        "none";

    document.body.classList.remove(
        "is-loading"
    );

}


/* =========================================================
   UPDATE TEXT
========================================================= */

function updateGlobalLoading(message) {

    const overlay =
        document.getElementById(
            "loadingOverlay"
        );

    if (!overlay) return;


    const text =
        overlay.querySelector(
            ".loading-text"
        );


    if (text) {

        text.textContent =
            message || "Memproses...";

    }

}


/* =========================================================
   HELPER ASYNC
========================================================= */

async function withGlobalLoading(
    callback,
    message = "Memproses..."
) {

    showGlobalLoading(message);

    try {

        return await callback();

    }

    finally {

        hideGlobalLoading();

    }

}

/* =========================================================
   GLOBAL CONFIRMATION SYSTEM
========================================================= */

let globalConfirmResolver = null;


function showConfirm(options = {}) {

  const overlay =
    document.getElementById(
      "globalConfirmOverlay"
    );

  const modal =
    overlay?.querySelector(
      ".erp-confirm-modal"
    );

  const titleEl =
    document.getElementById(
      "globalConfirmTitle"
    );

  const messageEl =
    document.getElementById(
      "globalConfirmMessage"
    );

  const actionButton =
    document.getElementById(
      "globalConfirmAction"
    );


  if (
    !overlay ||
    !modal ||
    !titleEl ||
    !messageEl ||
    !actionButton
  ) {

    console.error(
      "Global Confirmation HTML tidak ditemukan."
    );

    return Promise.resolve(false);
  }


  const {

    title = "Konfirmasi",

    message =
      "Apakah Anda yakin ingin melanjutkan?",

    confirmText =
      "Lanjutkan",

    type =
      "danger"

  } = options;


  titleEl.textContent =
    title;

  messageEl.textContent =
    message;

  actionButton.textContent =
    confirmText;


  /* RESET TYPE */

  modal.classList.remove(
    "confirm-danger",
    "confirm-primary"
  );


  modal.classList.add(
    type === "primary"
      ? "confirm-primary"
      : "confirm-danger"
  );


  overlay.classList.add(
    "active"
  );


  document.body.classList.add(
    "confirm-open"
  );


  setTimeout(() => {

    actionButton.focus();

  }, 50);


  return new Promise(resolve => {

    /*
      Jika ada confirmation sebelumnya
      yang belum selesai, tutup dulu.
    */

    if (globalConfirmResolver) {

      globalConfirmResolver(false);

    }


    globalConfirmResolver =
      resolve;

  });

}


/* =========================================================
   CLOSE CONFIRMATION
========================================================= */

function closeGlobalConfirm(result = false) {

  const overlay =
    document.getElementById(
      "globalConfirmOverlay"
    );


  if (overlay) {

    overlay.classList.remove(
      "active"
    );

  }


  document.body.classList.remove(
    "confirm-open"
  );


  if (globalConfirmResolver) {

    const resolve =
      globalConfirmResolver;

    globalConfirmResolver =
      null;

    resolve(result);

  }

}


/* =========================================================
   GLOBAL CONFIRM EVENT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const overlay =
      document.getElementById(
        "globalConfirmOverlay"
      );

    const cancelButton =
      document.getElementById(
        "globalConfirmCancel"
      );

    const actionButton =
      document.getElementById(
        "globalConfirmAction"
      );

    const closeButton =
      document.getElementById(
        "globalConfirmClose"
      );


    cancelButton?.addEventListener(
      "click",
      function () {

        closeGlobalConfirm(false);

      }
    );


    closeButton?.addEventListener(
      "click",
      function () {

        closeGlobalConfirm(false);

      }
    );


    actionButton?.addEventListener(
      "click",
      function () {

        closeGlobalConfirm(true);

      }
    );


    /*
      Klik area gelap = batal
    */

    overlay?.addEventListener(
      "click",
      function (event) {

        if (
          event.target === overlay
        ) {

          closeGlobalConfirm(false);

        }

      }
    );


    /*
      ESC = batal
    */

    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          overlay?.classList.contains(
            "active"
          )
        ) {

          closeGlobalConfirm(false);

        }

      }
    );

  }
);


/* =========================================================
   FORM OPNAME BARU
   ADDITIVE ONLY
========================================================= */

function syncFormOpnameVisibility() {

  const jenis =
    document.getElementById("jenis")?.value ||
    document.getElementById("jenisSelect")?.value ||
    "";

  const box =
    document.getElementById("formOpnameBox");

  if (!box) {
    return;
  }

  box.style.display =
    jenis === "form_opname"
      ? "block"
      : "none";

}


/* =========================================================
   WATCH JENIS BA
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const select =
      document.getElementById(
        "jenisSelect"
      );

    if (select) {

      select.addEventListener(
        "change",
        function () {

          setTimeout(
            syncFormOpnameVisibility,
            20
          );

        }
      );

    }

    syncFormOpnameVisibility();

  }
);

/* =========================================================
   FORM OPNAME — UTILITIES
========================================================= */

function getFormOpnameNumber() {

  const value =
    document.getElementById(
      "formOpnameNilai"
    )?.value || "";

  return (
    Number(
      String(value)
        .replace(/[^\d]/g, "")
    ) || 0
  );

}


function formatRupiahFormOpname(
  value
) {

  return (
    "Rp " +
    Number(value || 0)
      .toLocaleString("id-ID")
  );

}


function formatInputFormOpname(
  input
) {

  const angka =
    String(input.value)
      .replace(/[^\d]/g, "");

  if (!angka) {

    input.value = "";

  } else {

    input.value =
      Number(angka)
        .toLocaleString("id-ID");

  }

  syncFormOpnameBaru();

}


function formatTanggalFormOpnameBaru(
  value
) {

  if (!value) {
    return "-";
  }

  const date =
    new Date(
      value + "T00:00:00"
    );

  if (
    isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  );

}


function escapeFormOpname(
  value
) {

  return String(
    value ?? ""
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* =========================================================
   GET DATA FORM OPNAME BARU
========================================================= */

function getFormOpnameBaruData() {

  const proyek =
    document.getElementById(
      "formOpnameProyek"
    )?.value.trim() || "";

  const pekerjaan =
    document.getElementById(
      "formOpnamePekerjaan"
    )?.value.trim() || "";

  const blok =
    document.getElementById(
      "formOpnameBlok"
    )?.value.trim() || "";

  const pemborong =
    document.getElementById(
      "formOpnamePemborong"
    )?.value.trim() || "";

  const tanggalRaw =
    document.getElementById(
      "formOpnameTanggal"
    )?.value || "";

  const nilai =
    getFormOpnameNumber();


  /* =========================
     PERHITUNGAN
  ========================= */

  const retensi =
    Math.round(
      nilai * 0.05
    );

  const progress =
    nilai - retensi;


  return {

    proyek:
      proyek,

    pekerjaan:
      pekerjaan,

    blok:
      blok,

    pemborong:
      pemborong,

    tanggalRaw:
      tanggalRaw,

    tanggal:
      formatTanggalFormOpnameBaru(
        tanggalRaw
      ),

    nilai:
      nilai,

    retensi:
      retensi,

    progress:
      progress,

    totalPengajuan:
      progress

  };

}


/* =========================================================
   LIVE CALCULATION
========================================================= */

function syncFormOpnameBaru() {

  const data =
    getFormOpnameBaruData();


  const total =
    document.getElementById(
      "formOpnameTotal"
    );

  const retensi =
    document.getElementById(
      "formOpnameRetensi"
    );

  const progress =
    document.getElementById(
      "formOpnameProgress"
    );

  const pengajuan =
    document.getElementById(
      "formOpnamePengajuan"
    );


  if (total) {

    total.textContent =
      formatRupiahFormOpname(
        data.nilai
      );

  }


  if (retensi) {

    retensi.textContent =
      formatRupiahFormOpname(
        data.retensi
      );

  }


  if (progress) {

    progress.textContent =
      formatRupiahFormOpname(
        data.progress
      );

  }


  if (pengajuan) {

    pengajuan.textContent =
      formatRupiahFormOpname(
        data.totalPengajuan
      );

  }

}

/* =========================================================
   BUILD FORM OPNAME BARU
========================================================= */

function buildFormOpnamePages(
  kop,
  foot
) {

  const data =
    getFormOpnameBaruData();


  const proyek =
    escapeFormOpname(
      data.proyek || "-"
    );

  const pekerjaan =
    escapeFormOpname(
      data.pekerjaan || "-"
    );

  const blok =
    escapeFormOpname(
      data.blok || "-"
    );

  const pemborong =
    escapeFormOpname(
      data.pemborong || "-"
    );

  const tanggal =
    escapeFormOpname(
      data.tanggal
    );


  const kopAtas =
    typeof kop === "function"
      ? kop()
      : "";


  /*
    LOGO KEDUA:
    Sementara menggunakan KOP yang sama.
  */

  const kopEaf =
    typeof kop === "function"
      ? kop()
      : "";


  return `

    <div
      class="page page-form-opname-baru"
      id="pageSurat"
    >

      ${kopAtas}


      <div class="fob-title">

        FORM PENCAIRAN OPNAME

      </div>


      <!-- =====================================
           DATA UTAMA / D5-D9
      ====================================== -->

      <table class="fob-identitas">

        <tr>

          <td class="fob-label">
            Nama Proyek
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${proyek}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Nama Pekerjaan
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${pekerjaan}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Blok / Unit
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${blok}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Nama Pemborong
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${pemborong}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Tanggal
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${tanggal}
          </td>

        </tr>

      </table>


      <!-- =====================================
           URAIAN PEMBAYARAN
      ====================================== -->

      <table class="fob-payment">

        <thead>

          <tr>

            <th>
              NO
            </th>

            <th>
              URAIAN PEMBAYARAN
            </th>

            <th>
              NILAI
            </th>

          </tr>

        </thead>


        <tbody>

          <tr>

            <td class="fob-center">
              1
            </td>


            <!-- DATA D5-D9 DUPLIKASI -->

            <td class="fob-green">

              <strong>
                ${proyek}
              </strong>

              <br>

              ${pekerjaan}

              <br>

              ${blok}

              <br>

              Pemborong:
              ${pemborong}

              <br>

              Tanggal:
              ${tanggal}

            </td>


            <!-- INPUT G13 -->

            <td class="fob-money fob-yellow">

              ${formatRupiahFormOpname(
                data.nilai
              )}

            </td>

          </tr>


          <!-- DUPLIKASI I15 -->

          <tr class="fob-bold">

            <td></td>

            <td>
              TOTAL
            </td>

            <td class="fob-money fob-yellow">

              ${formatRupiahFormOpname(
                data.nilai
              )}

            </td>

          </tr>


          <!-- ORANGE = 5% I15 -->

          <tr>

            <td></td>

            <td>
              RETENSI 5%
            </td>

            <td class="fob-money fob-orange">

              ${formatRupiahFormOpname(
                data.retensi
              )}

            </td>

          </tr>


          <!-- BIRU = 95% I15 -->

          <tr>

            <td></td>

            <td>
              PROGRESS 100%
            </td>

            <td class="fob-money fob-blue">

              ${formatRupiahFormOpname(
                data.progress
              )}

            </td>

          </tr>


          <tr class="fob-grand-total">

            <td></td>

            <td>
              TOTAL YANG DIAJUKAN
            </td>

            <td class="fob-money">

              ${formatRupiahFormOpname(
                data.totalPengajuan
              )}

            </td>

          </tr>

        </tbody>

      </table>


      <!-- =====================================
           PIHAK FIXED
      ====================================== -->

      <table class="fob-signatures">

        <tr>

          <td>

            <strong>
              Diperiksa Oleh
            </strong>

            <div class="fob-sign-space">
            </div>

            <strong>
              Kiki
            </strong>

            <br>

            Accounting

          </td>


          <td>

            <strong>
              Mengetahui
            </strong>

            <div class="fob-sign-space">
            </div>

            <strong>
              Teuku Raja Sri Mustika
            </strong>

            <br>

            Purchasing

          </td>


          <td>

            <strong>
              Disetujui Oleh
            </strong>

            <div class="fob-sign-space">
            </div>

            <strong>
              H. Ibnu Riyanto
            </strong>

            <br>

            Direktur

          </td>

        </tr>

      </table>


      <!-- =====================================
           EAF
      ====================================== -->

      <div class="fob-eaf">

        <div class="fob-eaf-kop">

          ${kopEaf}

        </div>


        <div class="fob-eaf-title">

          EXPENSES APPROVAL FORM (EAF)

        </div>


        <table class="fob-eaf-table">

          <thead>

            <tr>

              <th>
                DESCRIPTION
              </th>

              <th>
                AMOUNT
              </th>

            </tr>

          </thead>


          <tbody>

            <tr>

              <!-- D5-D9 DUPLIKASI LAGI -->

              <td class="fob-green">

                ${proyek}

                <br>

                ${pekerjaan}

                <br>

                ${blok}

                <br>

                ${pemborong}

                <br>

                ${tanggal}

              </td>


              <td class="fob-money">

                ${formatRupiahFormOpname(
                  data.totalPengajuan
                )}

              </td>

            </tr>


            <tr class="fob-bold">

              <td>
                TOTAL
              </td>

              <td class="fob-money">

                ${formatRupiahFormOpname(
                  data.totalPengajuan
                )}

              </td>

            </tr>

          </tbody>

        </table>


        <table class="fob-eaf-signatures">

          <tr>

            <td>
              Prepared By
            </td>

            <td>
              Verified By
            </td>

            <td>
              Approved By
            </td>

          </tr>


          <tr>

            <td class="fob-eaf-sign-space">
            </td>

            <td class="fob-eaf-sign-space">
            </td>

            <td class="fob-eaf-sign-space">
            </td>

          </tr>

        </table>

      </div>


      ${
        typeof foot === "function"
          ? foot()
          : ""
      }

    </div>

  `;

}

/* =========================================================
   BUILD FORM OPNAME BARU
========================================================= */

function buildFormOpnamePages(
  kop,
  foot
) {

  const data =
    getFormOpnameBaruData();


  const proyek =
    escapeFormOpname(
      data.proyek || "-"
    );

  const pekerjaan =
    escapeFormOpname(
      data.pekerjaan || "-"
    );

  const blok =
    escapeFormOpname(
      data.blok || "-"
    );

  const pemborong =
    escapeFormOpname(
      data.pemborong || "-"
    );

  const tanggal =
    escapeFormOpname(
      data.tanggal
    );


  const kopAtas =
    typeof kop === "function"
      ? kop()
      : "";


  /*
    LOGO KEDUA:
    Sementara menggunakan KOP yang sama.
  */

  const kopEaf =
    typeof kop === "function"
      ? kop()
      : "";


  return `

    <div
      class="page page-form-opname-baru"
      id="pageSurat"
    >

      ${kopAtas}


      <div class="fob-title">

        FORM PENCAIRAN OPNAME

      </div>


      <!-- =====================================
           DATA UTAMA / D5-D9
      ====================================== -->

      <table class="fob-identitas">

        <tr>

          <td class="fob-label">
            Nama Proyek
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${proyek}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Nama Pekerjaan
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${pekerjaan}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Blok / Unit
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${blok}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Nama Pemborong
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${pemborong}
          </td>

        </tr>


        <tr>

          <td class="fob-label">
            Tanggal
          </td>

          <td class="fob-colon">
            :
          </td>

          <td class="fob-green">
            ${tanggal}
          </td>

        </tr>

      </table>


      <!-- =====================================
           URAIAN PEMBAYARAN
      ====================================== -->

      <table class="fob-payment">

        <thead>

          <tr>

            <th>
              NO
            </th>

            <th>
              URAIAN PEMBAYARAN
            </th>

            <th>
              NILAI
            </th>

          </tr>

        </thead>


        <tbody>

          <tr>

            <td class="fob-center">
              1
            </td>


            <!-- DATA D5-D9 DUPLIKASI -->

            <td class="fob-green">

              <strong>
                ${proyek}
              </strong>

              <br>

              ${pekerjaan}

              <br>

              ${blok}

              <br>

              Pemborong:
              ${pemborong}

              <br>

              Tanggal:
              ${tanggal}

            </td>


            <!-- INPUT G13 -->

            <td class="fob-money fob-yellow">

              ${formatRupiahFormOpname(
                data.nilai
              )}

            </td>

          </tr>


          <!-- DUPLIKASI I15 -->

          <tr class="fob-bold">

            <td></td>

            <td>
              TOTAL
            </td>

            <td class="fob-money fob-yellow">

              ${formatRupiahFormOpname(
                data.nilai
              )}

            </td>

          </tr>


          <!-- ORANGE = 5% I15 -->

          <tr>

            <td></td>

            <td>
              RETENSI 5%
            </td>

            <td class="fob-money fob-orange">

              ${formatRupiahFormOpname(
                data.retensi
              )}

            </td>

          </tr>


          <!-- BIRU = 95% I15 -->

          <tr>

            <td></td>

            <td>
              PROGRESS 100%
            </td>

            <td class="fob-money fob-blue">

              ${formatRupiahFormOpname(
                data.progress
              )}

            </td>

          </tr>


          <tr class="fob-grand-total">

            <td></td>

            <td>
              TOTAL YANG DIAJUKAN
            </td>

            <td class="fob-money">

              ${formatRupiahFormOpname(
                data.totalPengajuan
              )}

            </td>

          </tr>

        </tbody>

      </table>


      <!-- =====================================
           PIHAK FIXED
      ====================================== -->

      <table class="fob-signatures">

        <tr>

          <td>

            <strong>
              Diperiksa Oleh
            </strong>

            <div class="fob-sign-space">
            </div>

            <strong>
              Kiki
            </strong>

            <br>

            Accounting

          </td>


          <td>

            <strong>
              Mengetahui
            </strong>

            <div class="fob-sign-space">
            </div>

            <strong>
              Teuku Raja Sri Mustika
            </strong>

            <br>

            Purchasing

          </td>


          <td>

            <strong>
              Disetujui Oleh
            </strong>

            <div class="fob-sign-space">
            </div>

            <strong>
              H. Ibnu Riyanto
            </strong>

            <br>

            Direktur

          </td>

        </tr>

      </table>


      <!-- =====================================
           EAF
      ====================================== -->

      <div class="fob-eaf">

        <div class="fob-eaf-kop">

          ${kopEaf}

        </div>


        <div class="fob-eaf-title">

          EXPENSES APPROVAL FORM (EAF)

        </div>


        <table class="fob-eaf-table">

          <thead>

            <tr>

              <th>
                DESCRIPTION
              </th>

              <th>
                AMOUNT
              </th>

            </tr>

          </thead>


          <tbody>

            <tr>

              <!-- D5-D9 DUPLIKASI LAGI -->

              <td class="fob-green">

                ${proyek}

                <br>

                ${pekerjaan}

                <br>

                ${blok}

                <br>

                ${pemborong}

                <br>

                ${tanggal}

              </td>


              <td class="fob-money">

                ${formatRupiahFormOpname(
                  data.totalPengajuan
                )}

              </td>

            </tr>


            <tr class="fob-bold">

              <td>
                TOTAL
              </td>

              <td class="fob-money">

                ${formatRupiahFormOpname(
                  data.totalPengajuan
                )}

              </td>

            </tr>

          </tbody>

        </table>


        <table class="fob-eaf-signatures">

          <tr>

            <td>
              Prepared By
            </td>

            <td>
              Verified By
            </td>

            <td>
              Approved By
            </td>

          </tr>


          <tr>

            <td class="fob-eaf-sign-space">
            </td>

            <td class="fob-eaf-sign-space">
            </td>

            <td class="fob-eaf-sign-space">
            </td>

          </tr>

        </table>

      </div>


      ${
        typeof foot === "function"
          ? foot()
          : ""
      }

    </div>

  `;

}

/* =========================================================
   FORM OPNAME — FINAL VISIBILITY WATCHER
========================================================= */

function updateFormOpnameBaruUI() {

  const jenis =
    document.getElementById(
      "jenisSelect"
    )?.value || "";


  const box =
    document.getElementById(
      "formOpnameBox"
    );


  if (box) {

    box.style.display =
      jenis === "form_opname"
        ? "block"
        : "none";

  }


  /*
    Jika Form Opname dipilih,
    pastikan box BA existing tidak muncul.
  */

  if (
    jenis === "form_opname"
  ) {

    const existingBoxes = [

      "materialBox",
      "keteranganBox",
      "adendumBox",
      "biayaBox",
      "uruganBox",
      "opnameBox"

    ];


    existingBoxes.forEach(
      id => {

        const el =
          document.getElementById(
            id
          );

        if (el) {

          el.style.display =
            "none";

        }

      }
    );

  }

}


document.addEventListener(
  "DOMContentLoaded",
  function () {

    const jenisSelect =
      document.getElementById(
        "jenisSelect"
      );


    jenisSelect?.addEventListener(
      "change",
      function () {

        setTimeout(
          updateFormOpnameBaruUI,
          30
        );

      }
    );


    updateFormOpnameBaruUI();

  }
);

/* =========================================================
   FORM OPNAME FINAL OVERRIDE
   - 1 PROSES SAJA
   - TANPA PIHAK TERKAIT
   - TANPA LAMPIRAN
   - PREVIEW KHUSUS FORM OPNAME + EAF
========================================================= */

function getJenisBAAktif() {
  return (
    document.getElementById("jenisSelect")?.value ||
    document.getElementById("jenis")?.value ||
    ""
  );
}


/* =========================================================
   FORMAT ANGKA
========================================================= */

function getAngkaFormOpname(value) {

  return Number(
    String(value || "")
      .replace(/[^\d]/g, "")
  ) || 0;

}


function rupiahFormOpname(value) {

  return "Rp " +
    Number(value || 0)
      .toLocaleString("id-ID");

}


function escapeFormOpname(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   FORMAT TANGGAL
========================================================= */

function tanggalFormOpname(value) {

  if (!value) return "-";

  const parts =
    String(value).split("-");

  if (parts.length !== 3) {
    return value;
  }

  return (
    parts[2] + "-" +
    parts[1] + "-" +
    parts[0]
  );

}


/* =========================================================
   AMBIL DATA
========================================================= */

function getDataFormOpnameFinal() {

  const proyek =
    document.getElementById(
      "formOpnameProyek"
    )?.value.trim() || "";

  const pekerjaan =
    document.getElementById(
      "formOpnamePekerjaan"
    )?.value.trim() || "";

  const blok =
    document.getElementById(
      "formOpnameBlok"
    )?.value.trim() || "";

  const pemborong =
    document.getElementById(
      "formOpnamePemborong"
    )?.value.trim() || "";

  const tanggal =
    document.getElementById(
      "formOpnameTanggal"
    )?.value || "";

  const nilai =
    getAngkaFormOpname(
      document.getElementById(
        "formOpnameNilai"
      )?.value
    );

  const retensi =
    Math.round(nilai * 0.05);

  const pembayaran =
    nilai - retensi;

  return {
    proyek,
    pekerjaan,
    blok,
    pemborong,
    tanggal,
    nilai,
    retensi,
    pembayaran
  };

}


/* =========================================================
   SYNC NILAI DI FORM INPUT
========================================================= */

function syncFormOpnameFinal() {

  if (
    getJenisBAAktif() !==
    "form_opname"
  ) {
    return;
  }

  const data =
    getDataFormOpnameFinal();

  const total =
    document.getElementById(
      "formOpnameTotal"
    );

  const retensi =
    document.getElementById(
      "formOpnameRetensi"
    );

  const progress =
    document.getElementById(
      "formOpnameProgress"
    );

  const pengajuan =
    document.getElementById(
      "formOpnamePengajuan"
    );


  if (total) {
    total.textContent =
      rupiahFormOpname(data.nilai);
  }

  if (retensi) {
    retensi.textContent =
      rupiahFormOpname(data.retensi);
  }

  if (progress) {
    progress.textContent =
      rupiahFormOpname(
        data.pembayaran
      );
  }

  if (pengajuan) {
    pengajuan.textContent =
      rupiahFormOpname(
        data.pembayaran
      );
  }


  renderFormOpnameFinal();

}


/* =========================================================
   FORMAT INPUT NILAI
========================================================= */

function formatInputFormOpname(input) {

  const angka =
    getAngkaFormOpname(
      input.value
    );

  input.value =
    angka
      ? angka.toLocaleString("id-ID")
      : "";

  syncFormOpnameFinal();

}


/* =========================================================
   COMPATIBILITY DENGAN HTML SEKARANG
========================================================= */

function syncFormOpnameBaru() {

  syncFormOpnameFinal();

}

/* =========================================================
   ASSET LOGO FORM OPNAME
========================================================= */

/* =========================================================
   LOGO FORM OPNAME
========================================================= */

const FORM_OPNAME_LOGO_RAJA = "Asset/kop.png";
const FORM_OPNAME_LOGO_TRUSMI = "Asset/tg.png";


function getLogoRajaFormOpname() {

  return `
    <img
      src="${FORM_OPNAME_LOGO_RAJA}"
      class="fo-kop-img fo-kop-raja"
      alt=""
    >
  `;

}


function getLogoTrusmiFormOpname() {

  return `
    <img
      src="${FORM_OPNAME_LOGO_TRUSMI}"
      class="fo-kop-img fo-kop-trusmi"
      alt=""
    >
  `;

}


/* =========================
   LOGO HEADER ATAS
========================= */

function getLogoRajaFormOpname() {

  return `
    <img
      src="${FORM_OPNAME_LOGO_RAJA}"
      class="fo-kop-img fo-kop-raja"
      alt="Raja Sukses Propertindo"
    >
  `;

}


/* =========================
   LOGO EAF BAWAH
========================= */

function getLogoTrusmiFormOpname() {

  return `
    <img
      src="${FORM_OPNAME_LOGO_TRUSMI}"
      class="fo-kop-img fo-kop-trusmi"
      alt="Trusmi Group"
    >
  `;

}


/* =========================================================
   RENDER PREVIEW FINAL
========================================================= */

function renderFormOpnameFinal() {

  if (
    getJenisBAAktif() !==
    "form_opname"
  ) {
    return;
  }


  const output =
    document.getElementById(
      "output"
    );

  if (!output) {
    return;
  }


  const data =
    getDataFormOpnameFinal();


  const proyek =
    escapeFormOpname(
      data.proyek
    );

  const pekerjaan =
    escapeFormOpname(
      data.pekerjaan
    );

  const blok =
    escapeFormOpname(
      data.blok
    );

  const pemborong =
    escapeFormOpname(
      data.pemborong
    );

  const tanggal =
    tanggalFormOpname(
      data.tanggal
    );


  const logoRaja =
  getLogoRajaFormOpname();

const logoTrusmi =
  getLogoTrusmiFormOpname();


  output.innerHTML = `

    <div class="page form-opname-page">

      <div class="fo-document">


        <!-- ==========================================
             HEADER FORM PENCAIRAN OPNAME
        =========================================== -->

        <table class="fo-header-table">

          <tr>

            <td
              class="fo-logo-cell fo-logo-raja-cell"
              rowspan="3"
            >
              ${logoRaja}
            </td>

            <td class="fo-company-title">
              TRUSMI GROUP
            </td>

            <td class="fo-doc-info">
              No. Doc
            </td>

            <td class="fo-doc-value">
              : FM/RK-PRC/TG/001
            </td>

          </tr>


          <tr>

            <td class="fo-company-title">
              RAJA SUKSES PROPERTINDO
            </td>

            <td class="fo-doc-info">
              Tanggal Terbit
            </td>

            <td class="fo-doc-value">
              : 01 September 2016
            </td>

          </tr>


          <tr>

            <td class="fo-main-title">
              FORM PENCAIRAN OPNAME
            </td>

            <td class="fo-doc-info">
              Revisi
            </td>

            <td class="fo-doc-value">
              : 00
            </td>

          </tr>

        </table>



        <!-- ==========================================
             IDENTITAS
        =========================================== -->

        <div class="fo-info-section">

          <div class="fo-info-left">

            <div class="fo-info-row">
              <strong>Nama Proyek</strong>
              <span>:</span>
              <span>${proyek || "-"}</span>
            </div>

            <div class="fo-info-row">
              <strong>Nama Pekerjaan</strong>
              <span>:</span>
              <span>${pekerjaan || "-"}</span>
            </div>

            <div class="fo-info-row fo-info-detail">
              <strong></strong>
              <span></span>
              <span>${blok || "-"}</span>
            </div>

            <div class="fo-info-row">
              <strong>Nama Pemborong</strong>
              <span>:</span>
              <span>${pemborong || "-"}</span>
            </div>

            <div class="fo-info-row">
              <strong>Tanggal</strong>
              <span>:</span>
              <span>${tanggal}</span>
            </div>

          </div>


          <div class="fo-payment-type">

            <label>
              <span class="fo-checkbox"></span>
              Cash/Mingguan
            </label>

            <label>
              <span class="fo-checkbox"></span>
              Tempo
            </label>

          </div>

        </div>



        <!-- ==========================================
             TABEL PEMBAYARAN
        =========================================== -->

        <table class="fo-payment-table">

          <colgroup>
            <col style="width:8%">
            <col style="width:49%">
            <col style="width:17%">
            <col style="width:26%">
          </colgroup>

          <thead>

            <tr>
              <th>No</th>
              <th>Uraian Pembayaran</th>
              <th>Jumlah</th>
              <th>Total</th>
            </tr>

          </thead>


          <tbody>

            <tr class="fo-main-payment-row">

              <td
                rowspan="5"
                class="fo-center"
              >
                1
              </td>

              <td class="fo-description-cell">

                <div>
                  ${proyek || "-"}
                </div>

                <div>
                  ${pekerjaan || "-"}
                </div>

                <div>
                  ${blok || "-"}
                </div>

              </td>

              <td class="fo-money">
                ${rupiahFormOpname(
                  data.nilai
                )}
              </td>

              <td></td>

            </tr>


            <tr class="fo-total-row">

              <td
                colspan="2"
                class="fo-center fo-bold"
              >
                Total
              </td>

              <td class="fo-money fo-bold">
                ${rupiahFormOpname(
                  data.nilai
                )}
              </td>

            </tr>


            <tr>

              <td colspan="2">
                Yang telah dibayarkan:
              </td>

              <td></td>

            </tr>


            <tr>

              <td>
                Pembayaran Retensi
              </td>

              <td class="fo-money">
                ${rupiahFormOpname(
                  data.retensi
                )}
              </td>

              <td></td>

            </tr>


            <tr>

              <td colspan="2">
                <strong>
                  Pembayaran progress 100%
                </strong>
              </td>

              <td class="fo-money fo-bold">
                ${rupiahFormOpname(
                  data.pembayaran
                )}
              </td>

            </tr>


            <tr class="fo-grand-total">

              <td></td>

              <td class="fo-center fo-bold">
                Total Yang Diajukan
              </td>

              <td
                colspan="2"
                class="fo-money fo-bold"
              >
                ${rupiahFormOpname(
                  data.pembayaran
                )}
              </td>

            </tr>

          </tbody>

        </table>



        <!-- ==========================================
             TANDA TANGAN FIX
        =========================================== -->

        <table class="fo-sign-table">

          <tr>

            <td>
              Diperiksa Oleh
            </td>

            <td>
              Mengetahui
            </td>

            <td>
              Disetujui Oleh
            </td>

          </tr>


          <tr>

            <td class="fo-sign-space"></td>
            <td class="fo-sign-space"></td>
            <td class="fo-sign-space"></td>

          </tr>


          <tr>

            <td>
              <strong>
                <u>Kiki</u>
              </strong>
              <br>
              Accounting
            </td>

            <td>
              <strong>
                <u>Teuku Raja Sri Mustika</u>
              </strong>
              <br>
              Purchasing
            </td>

            <td>
              <strong>
                <u>H.Ibnu Riyanto</u>
              </strong>
              <br>
              Direktur
            </td>

          </tr>

        </table>



        <!-- ==========================================
             EAF
        =========================================== -->

        <table class="fo-header-table fo-eaf-header">

          <tr>

            <td
              class="fo-logo-cell fo-logo-trusmi-cell"
              rowspan="3"
            >
              ${logoTrusmi}
            </td>

            <td class="fo-company-title">
              TRUSMI GROUP
            </td>

            <td class="fo-doc-info">
              No. Doc
            </td>

            <td class="fo-doc-value">
              : FM/HO-FAC/TG/001
            </td>

          </tr>


          <tr>

            <td class="fo-company-title">
              FINANCE &amp; ACCOUNTING
            </td>

            <td class="fo-doc-info">
              Tanggal Terbit
            </td>

            <td class="fo-doc-value">
              : 01 September 2016
            </td>

          </tr>


          <tr>

            <td class="fo-main-title">
              EXPENSES APPROVAL FORM (EAF)
            </td>

            <td class="fo-doc-info">
              Rev
            </td>

            <td class="fo-doc-value">
              : 00
            </td>

          </tr>

        </table>



        <div class="fo-eaf-info">

          <div class="fo-eaf-line">
            <span>No</span>
            <span>........................................</span>
          </div>

          <div class="fo-eaf-check">
            <span class="fo-checkbox"></span>
            Receipt Verification
          </div>


          <div class="fo-eaf-line">
            <span>Date</span>
            <span>........................................</span>
          </div>

          <div class="fo-eaf-check">
            <span class="fo-checkbox"></span>
            Cash Advance
          </div>

        </div>



        <div class="fo-payment-method">

          <span>
            <span class="fo-method-box"></span>
            Cash
          </span>

          <span>
            <span class="fo-method-box"></span>
            Bank Transfer
          </span>

          <span>
            <span class="fo-method-box"></span>
            Giro
          </span>

        </div>



        <!-- ==========================================
             EAF DESCRIPTION
        =========================================== -->

        <table class="fo-eaf-table">

          <colgroup>
            <col style="width:7%">
            <col style="width:50%">
            <col style="width:17%">
            <col style="width:26%">
          </colgroup>


          <thead>

            <tr>
              <th>No</th>
              <th>Description</th>
              <th>Total</th>
              <th>Remark</th>
            </tr>

          </thead>


          <tbody>

            <tr>

              <td></td>

              <td class="fo-eaf-description">

                <div>
                  ${proyek || "-"}
                </div>

                <div>
                  ${pekerjaan || "-"}
                </div>

                <div>
                  ${blok || "-"}
                </div>

                <div>
                  ${pemborong || "-"}
                </div>

                <div>
                  ${tanggal}
                </div>

              </td>


              <td class="fo-money">
                ${rupiahFormOpname(
                  data.pembayaran
                )}
              </td>

              <td></td>

            </tr>

          </tbody>

        </table>



        <div class="fo-budget-section">

          <div>
            Budget Total :
            .............................................................
          </div>

          <div>
            Cash Back :
            .............................................................
          </div>

          <div>
            Budget Remain :
            .............................................................
          </div>

          <div>
            Received By :
            .............................................................
          </div>

        </div>



        <table class="fo-eaf-sign-table">

          <tr>

            <td>Prepared By</td>
            <td>Verified By</td>
            <td>Approved By</td>

          </tr>

          <tr>

            <td></td>
            <td></td>
            <td></td>

          </tr>

        </table>


      </div>

    </div>

  `;


  if (
    typeof applyPreviewZoom ===
    "function"
  ) {

    requestAnimationFrame(
      () => {
        applyPreviewZoom();
      }
    );

  }

}


/* =========================================================
   FORM OPNAME = 1 PROSES
========================================================= */

function setupFormOpnameSingleProcess() {

  const jenis =
    getJenisBAAktif();

  const isFormOpname =
    jenis === "form_opname";


  /*
    STEPPER
    Form Opname tidak memakai:
    Informasi / Isi BA / Pihak / Lampiran
  */

  document
    .querySelectorAll(
      ".ba-step"
    )
    .forEach(step => {

      step.style.display =
        isFormOpname
          ? "none"
          : "";

    });


  /*
    HIDE STEP 3 & 4
  */

  document
    .querySelectorAll(
      '[data-step-content="3"], [data-step-content="4"]'
    )
    .forEach(el => {

      if (isFormOpname) {
        el.style.display = "none";
      }

    });


  const pihakCard =
    document.getElementById(
      "pihakCard"
    );

  const standardLampiran =
    document.getElementById(
      "standardTtdLampiranBox"
    );

  const opnameLampiran =
    document.getElementById(
      "opnameLampiranStep"
    );


  if (isFormOpname) {

    if (pihakCard) {
      pihakCard.style.display =
        "none";
    }

    if (standardLampiran) {
      standardLampiran.style.display =
        "none";
    }

    if (opnameLampiran) {
      opnameLampiran.style.display =
        "none";
    }


    /*
      Pastikan Form Opname tampil.
    */

    const formBox =
      document.getElementById(
        "formOpnameBox"
      );

    if (formBox) {
      formBox.style.display =
        "block";
    }


    /*
      Sembunyikan form BA lain.
    */

    [
      "materialBox",
      "keteranganBox",
      "adendumBox",
      "biayaBox",
      "uruganBox",
      "opnameBox"
    ].forEach(id => {

      const el =
        document.getElementById(id);

      if (el) {
        el.style.display =
          "none";
      }

    });


    syncFormOpnameFinal();

  }

}


/* =========================================================
   LISTENER FINAL
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const jenisSelect =
      document.getElementById(
        "jenisSelect"
      );

    const jenis =
      document.getElementById(
        "jenis"
      );


    function handleJenisFormOpname() {

      setTimeout(
        () => {

          setupFormOpnameSingleProcess();

          if (
            getJenisBAAktif() ===
            "form_opname"
          ) {

            syncFormOpnameFinal();

          }

        },
        50
      );

    }


    jenisSelect?.addEventListener(
      "change",
      handleJenisFormOpname
    );

    jenis?.addEventListener(
      "change",
      handleJenisFormOpname
    );


    [
      "formOpnameProyek",
      "formOpnamePekerjaan",
      "formOpnameBlok",
      "formOpnamePemborong",
      "formOpnameTanggal"
    ].forEach(id => {

      const input =
        document.getElementById(id);

      input?.addEventListener(
        "input",
        syncFormOpnameFinal
      );

      input?.addEventListener(
        "change",
        syncFormOpnameFinal
      );

    });


    handleJenisFormOpname();

  }
);


/* =========================================================
   PATCH GENERATE()
   Tangkap Form Opname sebelum generate BA standar
========================================================= */

const generateBAExisting =
  typeof generate === "function"
    ? generate
    : null;


generate = function () {

  if (
    getJenisBAAktif() ===
    "form_opname"
  ) {

    syncFormOpnameFinal();

    return;

  }


  if (generateBAExisting) {

    return generateBAExisting
      .apply(this, arguments);

  }

};


/* =========================================================
   PROFESSIONAL DASHBOARD WORKFLOW
========================================================= */

function openBAFromDashboard(jenis) {

  if (typeof openPage === "function") {
    openPage("buatBA");
  }

  setTimeout(() => {

    const select =
      document.getElementById("jenisSelect") ||
      document.getElementById("jenis");

    if (!select) {
      return;
    }

    select.value = jenis;

    select.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );

    if (
      typeof window.jQuery !== "undefined" &&
      window.jQuery.fn &&
      window.jQuery.fn.select2
    ) {

      try {

        window.jQuery(select)
          .val(jenis)
          .trigger("change");

      } catch (error) {

        console.warn(
          "Dashboard BA select sync:",
          error
        );

      }

    }

    if (
      jenis !== "form_opname" &&
      typeof showBAStep === "function"
    ) {

      showBAStep(1);

    }

    if (
      jenis === "form_opname" &&
      typeof setupFormOpnameSingleProcess ===
      "function"
    ) {

      setupFormOpnameSingleProcess();

    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }, 120);

}


/* =========================================================
   PROCESS ANIMATION CONTROLLER
========================================================= */

function initProfessionalBAWorkflow() {

  const process =
    document.querySelector(
      ".ba-process-canvas"
    );

  if (!process) {
    return;
  }

  const nodes = [
    ...process.querySelectorAll(
      "[data-flow-index]"
    )
  ];

  if (!nodes.length) {
    return;
  }

  nodes.sort(
    (a, b) =>
      Number(a.dataset.flowIndex) -
      Number(b.dataset.flowIndex)
  );


  function resetFlow() {

    nodes.forEach(node => {

      node.classList.remove(
        "process-active",
        "process-done"
      );

    });

  }


  let current = 0;


  function animateFlow() {

    nodes.forEach(
      (node, index) => {

        node.classList.remove(
          "process-active"
        );

        if (index < current) {

          node.classList.add(
            "process-done"
          );

        }

      }
    );


    if (nodes[current]) {

      nodes[current].classList.add(
        "process-active"
      );

    }


    current++;


    if (current >= nodes.length) {

      setTimeout(() => {

        resetFlow();

        current = 0;

      }, 1400);

    }

  }


  resetFlow();

  animateFlow();


  if (
    window.baProfessionalFlowTimer
  ) {

    clearInterval(
      window.baProfessionalFlowTimer
    );

  }


  window.baProfessionalFlowTimer =
    setInterval(
      animateFlow,
      1150
    );

}


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    setTimeout(
      initProfessionalBAWorkflow,
      700
    );

  }
);