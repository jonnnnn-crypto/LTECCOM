# Buku Panduan Pengurus (Ketua & Wakil Divisi) LTEC

Selamat datang di Papan Kendali (Dashboard) **Liwa Tech Excellent Community (LTEC)**. Sistem ini adalah urat nadi platform kita. Melalui dashboard ini, Anda memegang kendali penuh atas rekrutmen peserta dan administrasi divisi yang Anda pimpin.

Dokumen ini disusun khusus sebagai **SOP (Standard Operating Procedure)** bagi *Ketua Divisi* dan *Wakil Ketua Divisi* dalam mengelola platform LTEC.

---

## 1. Akses & Login

Dashboard Eksekutif tidak dapat diakses sembarang orang. Sistem dilindungi dengan *Role-Based Access Control* (RBAC).

**Cara Masuk:**
1. Buka halaman utama website LTEC.
2. Geser ke paling bawah (Footer) dan klik tautan **Portal Eksekutif**.
3. Masukkan **Nomor WhatsApp** tanpa angka awalan '0' (contoh: `81234567890`) dan **Password** unik milik Anda.
4. Klik tombol **Login**. Anda akan langsung dibawa ke Halaman Admin Dashboard.

> **PENTING:** Jaga baik-baik Password Anda karena ia memiliki izin eksekusi (*Write Access*) ke dalam Database!

---

## 2. Fitur-Fitur Utama di Dashboard

Dashboard Anda (sebagai Ketua/Wakil Ketua Divisi) memiliki tiga fungsi inti yang difilter secara spesifik hanya untuk fokus terhadap Divisi Anda:

### A. Evaluasi & Seleksi Pelamar (Tab: Data Pelamar)
Ini adalah menu utama Anda. Semua calon pendaftar yang memilih divisi Anda akan otomatis masuk ke sini secara *Real-Time*.
Sistem rekrutmen LTEC terbagi atas 3 tahapan (Lolos Berkas -> Terima / Gugur).

1. **Seleksi Berkas Baru (Status PENDING)**
   Di kolom **"Tindakan Keputusan"**, klik *(Dropdown Menu)* pada pelamar bersangkutan.
   - Pilih **LOLOS BERKAS**: Jika spesifikasi dokumennya bagus. 
     *(Sistem akan OTOMATIS mengirim Bot pesan WhatsApp ke nomor pelamar berisi ucapan selamat dan memerintahkan mereka menghubungi Anda via nomor WA Anda untuk janjian Wawancara).*
   - Pilih **TOLAK BERKAS**: Jika pelamar ditolak seketika.

2. **Tahap Wawancara (Status WAWANCARA)**
   Setelah wawanara selesai dilakukan, klik dropdown sekali lagi untuk penentuan masa depan pelamar.
   - Pilih **TERIMA ANGGOTA**: Pelamar resmi lulus menjadi anggota divisi. 
     *(Data pelamar otomatis dipindahkan ke riwayat "Anggota Resmi Sistem" dengan tanda Tahun Angkatan. Bot WhatsApp otomatis mengirim Tautan Grup WA Divisi Anda ke HP mereka, dan Kuota pendaftar di menu utama publik akan berkurang 1 secara riil).*
   - Pilih **GUGUR WAWANCARA**: Jika mereka gagal saat Anda wawancarai.

### B. Pengaturan Profil & Kuota Divisi (Tab: Info Divisi)
1. Pergi ke Tab **Info Divisi**.
2. Anda akan menemukan kolom Divisi yang Anda pimpin. Klik simbol Bergerigi *(Settings)* untuk mengubah konfigurasi.
3. Di sini Anda bisa mengubah **Batas Kuota Pendaftaran**, **Tautan Grup WhatsApp** *(Sangat Penting: Tautan inilah yang dikirim Bot WA ke peserta yang Lulus!)*, dan Kalimat Deskripsi Visi & Misi Divisi secara bebas.

### C. Manajemen Struktur Anggota Bawah (Tab: Anggota Divisi)
1. Pergi ke Tab **Anggota Divisi**.
2. Anda dapat mengatur struktur keanggotaan/Kepengurusan (Manajer, Mentor, dll) khusus di ruang lingkup divisi Anda. 
3. Pelamar yang Anda **Luluskan** di Tab Data Pelamar akan otomatis masuk ke wilayah arsip ini selamanya. Anda bisa bebas Menghapus, Mengubah Nama, atau Menambahkan Foto Wajah resmi (*Photo_URL*) mereka ke platform website Publik di tab ini.

---

## 3. Trouble-Fixing / Bug Reporting

Jika saat menyeleksi *(LOLOS/TERIMA/TOLAK)* muncul tulisan `"Gagal memproses pelamar: Koneksi Terputus/Timeout"`, periksa dua hal:
1. Pastikan fitur **Tautan Grup WA Divisi** tidak kosong jika Anda ingin memilih 'TERIMA ANGGOTA'.
2. Pastikan Nomor HP Pelamar valid (dimulai dari `8...`).

Sistem akan selamanya mengirim notifikasi hasil test evaluasi yang Anda putuskan kepada layar WA Pendaftar, menjamin interaksi super *Modern* demi profesionalitas tinggi.

*Hormat kami - Admin Pusat Eksekutif LTEC.*
