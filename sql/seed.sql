-- ============================================================
--  seed.sql — Data lengkap API Rekapan Narsum TSI
--  Sumber: data.txt + public/data.json (101 baris)
--  Idempotent: baris yang sudah ada tidak akan diduplikasi
--  (UNIQUE: nama + topik + tanggal_mulai).
--  Regenerate: bun run util/migrate.ts --seed --fresh
-- ============================================================

INSERT INTO rekapan_narsum
  (nama, instansi, topik, tanggal_mulai, tanggal_selesai, lokasi, mode_pelaksanaan)
VALUES
  (
    'Mundhi Saptono Widigdo',
    'Kepala Bagian Keuangan Direktorat Jenderal Perhubungan Laut, Kementerian Perhubungan',
    'Knowledge Sharing Tata Kelola Penghapusan Barang Milik Negara',
    DATE '2026-01-08',
    DATE '2026-01-10',
    'Grand Mercure Jakarta Kemayoran, Jl. H. Benyamin Sueb Kav. B6, Kemayoran',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Kepala Biro Keuangan, Sekretariat Jenderal, Kementerian Perindustrian',
    'Penyusunan Laporan Wasdal BMN Semester II dan Tahunan TA 2025',
    DATE '2026-01-12',
    DATE '2026-01-12',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pengelolaan BMN, Sekretariat Jenderal, Kementerian ESDM',
    'Penyusunan Laporan Wasdal BMN Semester II dan Tahunan TA 2025',
    DATE '2026-01-09',
    DATE '2026-01-10',
    'Ruang Rapat Pangrango, KPKNL Bogor, Jl. Veteran No.45, Kota Bogor, Jawa Barat',
    'Offline'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Kepala Balai Pendidikan dan Pelatihan Keuangan Cimahi',
    'Pengajar Pelatihan Jarak Jauh Pengelolaan Barang Milik Negara bagi Pengguna Barang Angkatan II BDK Cimahi',
    DATE '2026-02-26',
    DATE '2026-02-27',
    'Daring',
    'Online'
  ),
  (
    'Wigas Angga Kalifi',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (User Management dan Master Aset)',
    DATE '2026-03-03',
    DATE '2026-03-04',
    'Daring',
    'Online'
  ),
  (
    'Wigas Angga Kalifi',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (SBSN dan Inventarisasi Aset)',
    DATE '2026-03-10',
    DATE '2026-03-11',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (User Management dan Master Aset)',
    DATE '2026-03-03',
    DATE '2026-03-04',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (SBSN dan Inventarisasi Aset)',
    DATE '2026-03-10',
    DATE '2026-03-11',
    'Daring',
    'Online'
  ),
  (
    'Andy Haholongan',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (RKBMN)',
    DATE '2026-03-04',
    DATE '2026-03-05',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (RKBMN)',
    DATE '2026-03-04',
    DATE '2026-03-05',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BMN Idle dan Asuransi)',
    DATE '2026-03-05',
    DATE '2026-03-06',
    'Daring',
    'Online'
  ),
  (
    'Nurrahman Toyib',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BMN Idle dan Asuransi)',
    DATE '2026-03-05',
    DATE '2026-03-06',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (Pengelolaan)',
    DATE '2026-03-09',
    DATE '2026-03-10',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (Wasdal)',
    DATE '2026-03-11',
    DATE '2026-03-12',
    'Daring',
    'Online'
  ),
  (
    'Yues Tandrik Hafiyan',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (Pengelolaan)',
    DATE '2026-03-09',
    DATE '2026-03-10',
    'Daring',
    'Online'
  ),
  (
    'Ade Fikri Fauzi',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (Wasdal)',
    DATE '2026-03-11',
    DATE '2026-03-12',
    'Daring',
    'Online'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Kepala Balai Pendidikan dan Pelatihan Keuangan Cimahi',
    'Pengajar Pelatihan Jarak Jauh Pengelolaan Barang Milik Negara bagi Pengguna Barang Angkatan II BDK Cimahi',
    DATE '2026-03-12',
    DATE '2026-03-13',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Sekretaris Direktorat Jenderal Mineral dan Batubara Kementerian ESDM',
    'Sosialisasi Penginputan Data Tanah BMN PKP2B Aplikasi SIMAN V2 dan Penginputan Data Tanah pada Aplikasi SIMAN V2',
    DATE '2026-04-22',
    DATE '2026-04-23',
    'Ruang Rapat Wastek I Gedung M. Sadli II Kantor Ditjen Mineral dan Batubara',
    'Offline'
  ),
  (
    'Suratno',
    'Kepala Biro Layanan Pengadaan dan Pengelolaan BMN Kementerian Perhubungan',
    'Pembahasan Terhadap Permasalahan Usulan Perubahan RKBMN TA 2026 di Lingkungan Kementerian Perhubungan pada Aplikasi SIMAN terkait Aset Non Aktif/ Kondisi Rusak Berat',
    DATE '2026-04-17',
    DATE '2026-04-17',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Biro Umum Kementerian Perencanaan Pembangunan Nasional/ Bappenas',
    'Bimbingan Teknis Penyusunan RKBMN Kementerian PPN/Bappenas TA 2028 pada Aplikasi SIMAN V2',
    DATE '2026-05-12',
    DATE '2026-05-12',
    'Ruang Rapat Lombok Lt.15 Gedung Menara Bappenas, Kuningan, Jakarta',
    'Offline'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Kepala Biro Umum Kementerian Perencanaan Pembangunan Nasional/ Bappenas',
    'Bimbingan Teknis Penyusunan RKBMN Kementerian PPN/Bappenas TA 2028 pada Aplikasi SIMAN V3',
    DATE '2026-05-12',
    DATE '2026-05-12',
    'Ruang Rapat Lombok Lt.15 Gedung Menara Bappenas, Kuningan, Jakarta',
    'Offline'
  ),
  (
    'Wigas Angga Kalifi',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (User Management dan Master Aset)',
    DATE '2026-05-18',
    DATE '2026-05-18',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (User Management dan Master Aset)',
    DATE '2026-05-18',
    DATE '2026-05-18',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (Pengelolaan)',
    DATE '2026-05-19',
    DATE '2026-05-19',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (Pengawas Ujian)',
    DATE '2026-05-22',
    DATE '2026-05-22',
    'Daring',
    'Online'
  ),
  (
    'Ade Fikri Fauzi',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (Pengelolaan)',
    DATE '2026-05-19',
    DATE '2026-05-19',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (RKBMN)',
    DATE '2026-05-20',
    DATE '2026-05-20',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (Inventarisasi Aset dan Wasdal)',
    DATE '2026-05-21',
    DATE '2026-05-21',
    'Daring',
    'Online'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengguna Barang (Pusdiklat Keuangan Publik) (Inventarisasi Aset dan Wasdal)',
    DATE '2026-05-21',
    DATE '2026-05-21',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (User Management dan Master Aset)',
    DATE '2026-05-19',
    DATE '2026-05-20',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (SBSN dan Inventarisasi Aset)',
    DATE '2026-05-29',
    DATE '2026-05-29',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (SBSN dan Inventarisasi Aset)',
    DATE '2026-06-02',
    DATE '2026-06-02',
    'Daring',
    'Online'
  ),
  (
    'Andy Haholongan',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (User Management dan Master Aset)',
    DATE '2026-05-19',
    DATE '2026-05-20',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (Wasdal)',
    DATE '2026-05-20',
    DATE '2026-05-21',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (Pengelolaan)',
    DATE '2026-05-21',
    DATE '2026-05-22',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (Pengawas Ujian)',
    DATE '2026-06-03',
    DATE '2026-06-03',
    'Daring',
    'Online'
  ),
  (
    'Ade Fikri Fauzi',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (Wasdal)',
    DATE '2026-05-20',
    DATE '2026-05-21',
    'Daring',
    'Online'
  ),
  (
    'Ade Fikri Fauzi',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (SBSN dan Inventarisasi Aset)',
    DATE '2026-05-29',
    DATE '2026-05-29',
    'Daring',
    'Online'
  ),
  (
    'Ade Fikri Fauzi',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (SBSN dan Inventarisasi Aset)',
    DATE '2026-06-02',
    DATE '2026-06-02',
    'Daring',
    'Online'
  ),
  (
    'Wigas Angga Kalifi',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (Pengelolaan)',
    DATE '2026-05-21',
    DATE '2026-05-22',
    'Daring',
    'Online'
  ),
  (
    'Wigas Angga Kalifi',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (RKBMN)',
    DATE '2026-05-25',
    DATE '2026-05-26',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (RKBMN)',
    DATE '2026-05-25',
    DATE '2026-05-26',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (BMN Idle dan Asuransi)',
    DATE '2026-05-26',
    DATE '2026-05-26',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Balai Diklat Keuangan Yogyakarta',
    'Pelatihan Jarak Jauh (PJJ) Aplikasi SIMAN Pengelola Barang (BDK Yogyakarta) (BMN Idle dan Asuransi)',
    DATE '2026-05-29',
    DATE '2026-05-29',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Biro Umum dan Layanan Pengadaan Kementerian Perdagangan',
    'Bimbingan Teknis Penyusunan Usulan RKBMN Kementerian Perdagangan TA 2028',
    DATE '2026-06-08',
    DATE '2026-06-09',
    'Daring',
    'Online'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Kepala Biro Umum dan Layanan Pengadaan Kementerian Perdagangan',
    'Bimbingan Teknis Penyusunan Usulan RKBMN Kementerian Perdagangan TA 2028',
    DATE '2026-06-08',
    DATE '2026-06-09',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Asisten Kapolri Bidang Logistik Mabes Polri',
    'Sosialisasi dan Pelatihan Aplikasi SIMAN V2 T.A. 2026',
    DATE '2026-06-10',
    DATE '2026-06-11',
    'Hotel Ibis Style Bekasi Jatibening',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Asisten Kapolri Bidang Logistik Mabes Polri',
    'Sosialisasi dan Pelatihan Aplikasi SIMAN V2 T.A. 2026',
    DATE '2026-06-10',
    DATE '2026-06-10',
    'Hotel Ibis Style Bekasi Jatibening',
    'Offline'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Balai Pendidikan dan Pelatihan Keuangan Malang',
    'Pelatihan Jarak Jauh Perencanaan Kebutuhan Barang Milik Negara Bagi Pengguna Barang Tahun Anggaran 2026',
    DATE '2026-06-11',
    DATE '2026-06-12',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Pengajar PJJ Pengelolaan BMN Bagi Pengelola Barang',
    DATE '2026-06-15',
    DATE '2026-06-17',
    'Daring',
    'Online'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Biro Keuangan dan Barang Milik Negara Kementerian Komunikasi dan Digital RI',
    'Rapat Pembahasan Penyesuaian Pedoman Inventarisasi BMN di lingkungan Kementerian Komunikasi dan Digital dengan Aplikasi SIMAN',
    DATE '2026-06-23',
    DATE '2026-06-23',
    'Ruang Rapat Kepala Biro Keuangan dan BMN Komdigi Gedung Utama Lt.5, Jl. Medan Merdeka Barat No.9, Jakarta Pusat',
    'Offline'
  ),
  (
    'Ervan Dedi Purwanto',
    'Kepala Biro Keuangan dan BMN Kementerian Hak Asasi Manusia',
    'Penyusunan Laporan Pengawasan dan Pengendalian Barang Milik Negara Periode Semester I TA 2026',
    DATE '2026-06-29',
    DATE '2026-06-29',
    'Hotel Gran Melia Jakarta Jl. H.R. Rasuna Said Kav. X0, RT.5/RW.4, Setia Budi, Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12950',
    'Offline'
  ),
  (
    'Annisa Dyah Palupi',
    'Kepala Biro Keuangan dan BMN Kementerian Hak Asasi Manusia',
    'Penyusunan Laporan Pengawasan dan Pengendalian Barang Milik Negara Periode Semester I TA 2026',
    DATE '2026-06-29',
    DATE '2026-06-29',
    'Hotel Gran Melia Jakarta Jl. H.R. Rasuna Said Kav. X0, RT.5/RW.4, Setia Budi, Setiabudi, Kota Jakarta Selatan, DKI Jakarta 12950',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Kepala Biro Keuangan dan Barang Milik Negara Kementerian Komunikasi dan Digital RI',
    'Rapat Koordinasi Persiapan Penyusunan Laporan Pengawasan dan Pengendalian Barang Milik Negara Semester I di Lingkungan Kementerian Komunikasi dan Digital',
    DATE '2026-06-30',
    DATE '2026-06-30',
    'Hotel Savero Depok Jl. Margonda No. 230a, Kemiri Muka, Kecamatan Beji Kota Depok, Jawa Barat 16423',
    'Offline'
  ),
  (
    'Suratno',
    'Kepala Biro Umum Badan Pemeriksa Keuangan',
    'Pendampingan dan Praktik Penyusunan Laporan Pengawasan dan Pengendalian Tahun 2026',
    DATE '2026-07-01',
    DATE '2026-07-01',
    'Ruang Rapat Lantai 5, Gedung Arsip Badan Pemeriksa Keuangan',
    'Offline'
  ),
  (
    'Fajar Dwi Atmoko',
    'Pusat Pengelolaan BMN Kementerian ESDM',
    'Rekonsiliasi Data Pengawasan dan Pengendalian BMN Semester I Tahun 2026 pada satuan kerja di lingkungan Kementerian ESDM',
    DATE '2026-07-01',
    DATE '2026-07-02',
    'Ruang Rapat 1, Lantai 6 Gedung Slamet Bratanata Jl. Pegangsaan Timur No.1, Kota Jakarta Pusat',
    'Offline'
  ),
  (
    'Wigas Angga Kalifi',
    'Badan Riset dan Inovasi Nasional',
    'Workshop Modul Master Aset pada Aplikasi SIMAN V2',
    DATE '2026-05-20',
    DATE '2026-05-20',
    'Ruang Rapat Iptek Lt. 3, Gd. B.J. Habibie Thamrin– Jakarta Pusat',
    'Offline'
  ),
  (
    'Fajar Dwi Atmoko',
    'Sekretariat Badan Pengembangan dan Pembinaan Bahasa Kemendikdasmen',
    'Koordinasi Pelaksanaan Inventarisasi Barang Milik Negara',
    DATE '2026-06-04',
    DATE '2026-06-04',
    'Pusat Prestasi Nasional Jl. Gardu, RT. 8/2, Srengseng Sawah, Jakarta Selatan',
    'Offline'
  ),
  (
    'Hermanu Joko Nugroho',
    'Pusat Pendidikan dan Pelatihan Keuangan Publik',
    'Perkembangan Terkini terkait Aplikasi SIMAN',
    DATE '2026-06-08',
    DATE '2026-06-08',
    'Daring',
    'Online'
  ),
  (
    'Hermanu Joko Nugroho',
    'Pusat Pendidikan dan Pelatihan Keuangan Publik',
    'Advokasi Kebijakan Penggunaan Aplikasi SIMAN untuk Pengelola Barang',
    DATE '2026-06-09',
    DATE '2026-06-09',
    'Daring',
    'Online'
  ),
  (
    'Andy Haholongan',
    'Pusat Pendidikan dan Pelatihan Keuangan Publik',
    'Pengambilan Keputusan dan/atau Persetujuan Pengelolaan BMN dengan Aplikasi SIMAN',
    DATE '2026-06-10',
    DATE '2026-06-10',
    'Daring',
    'Online'
  ),
  (
    'Andika Bangun Patria',
    'Pusat Pendidikan dan Pelatihan Keuangan Publik',
    'Due Diligence Penggunaan Aplikasi SIMAN',
    DATE '2026-06-11',
    DATE '2026-06-11',
    'Daring',
    'Online'
  ),
  (
    'Ervan Dedi Purwanto',
    'Sekretaris Direktorat Jenderal Planologi Kehutanan Kementerian Kehutanan',
    'Bimbingan Teknis Penyusunan Rencana Kebutuhan BMN T.A 2028',
    DATE '2026-09-02',
    DATE '2026-09-02',
    'Aston Bogor Hotel & Resort, Kompleks Bogor Nirwana Residence, Jl. Dreded Pahlawan, Mulyaharja, Kec. Bogor Selatan, Kota Bogor',
    'Offline'
  ),
  (
    'Andika Bangun Patria',
    'Deputi Bidang Administrasi Badan Pengawas Pemilihan Umum',
    'Rekonsiliasi Data Keuangan dan Barang Milik Negara di Lingkungan Badan Pengawas Pemilihan Umum',
    DATE '2026-09-02',
    DATE '2026-09-02',
    'Novotel Jakarta Mangga Dua Square Jalan Gunung Sahari Raya No. 1, Kel. Ancol, Kec. Pademangan, Jakarta Utara, DKI Jakarta, 14420',
    'Offline'
  ),
  (
    'Suratno',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Permohonan Bantuan Pengajar PJJ Perencanaan Kebutuhan Barang Milik Negara bagi Pengguna Barang',
    DATE '2026-09-10',
    DATE '2026-09-11',
    'Daring',
    'Online'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Sekretaris Direktorat Jenderal Perhubungan Darat Kementerian Perhubungan',
    'Penyusunan Usulan Rencana Kebutuhan Barang Milik Negara (RKBMN) TA. 2028 di Lingkungan Direktorat Jenderal Perhubungan Darat',
    DATE '2026-09-08',
    DATE '2026-09-08',
    'Mercure Tangerang BSD City CBD 55, Jl. Edutown Kavling Lot Ii No.8, Pagedangan, Tangerang Regency, Banten 15339',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Kepala Biro Manajemen Barang Milik Negara dan Pengadaan BRIN',
    'Pendampingan Penyusunan RKBMN dan RP3BMN KPB DIRI dan KPB Sekretariat Utama pada Modul Perencanaan SIMAN V2',
    DATE '2026-09-08',
    DATE '2026-09-08',
    'Ruang Rapat 08, Gedung ICC (International Convention Center) KST Soekarno BRIN Cibinong',
    'Offline'
  ),
  (
    'Eko Sulistiawan',
    'Inspektur Utama BRIN',
    'Bimbingan Teknis Reviu RKBMN Tahun 2028 dengan menggunakan Aplikasi SIMAN Versi 2 di lingkungan Inspektorat Utama BRIN',
    DATE '2026-09-14',
    DATE '2026-09-14',
    'Auditorium Soemitro Djojohadikusumo, Lantai 3, Ged. B.J. Habibie Jl. M.H. Thamrin Nomor 8 Jakarta',
    'Offline'
  ),
  (
    'Yuzuardi Haban',
    'Inspektur Utama BRIN',
    'Bimbingan Teknis Reviu RKBMN Tahun 2028 dengan menggunakan Aplikasi SIMAN Versi 2 di lingkungan Inspektorat Utama BRIN',
    DATE '2026-09-14',
    DATE '2026-09-14',
    'Auditorium Soemitro Djojohadikusumo, Lantai 3, Ged. B.J. Habibie Jl. M.H. Thamrin Nomor 8 Jakarta',
    'Offline'
  ),
  (
    'Ade Fikri Fauzi',
    'Plt. Kepala Biro Umum dan Pengadaan Sekretariat Jenderal Kementerian Luar Negeri',
    'Bimbingan Teknis (Bimtek) Penyusunan Rencana Kebutuhan Barang Milik Negara (RKBMN) Tahun Anggaran 2028 pada Satuan Kerja Kementerian Luar Negeri',
    DATE '2026-09-14',
    DATE '2026-09-14',
    'Ruang 218, Pusat Studi Jepang Universitas Indonesia Jl. Prof. DR. Selo Soemardjan, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424',
    'Offline'
  ),
  (
    'Suratno',
    'Asisten Kapolri Bidang Logistik Karojianstra Mabes Polri',
    'Penelaahan dan Penyusunan Rencana Kebutuhan Milik Negara Barang Milik Negara (RKBMN) dalam rangka Penyusunan RKA/KL 2028',
    DATE '2026-09-16',
    DATE '2026-09-17',
    'Hotel Mercure Batavia Jl. Kali Besar Barat No. 44-46, Roa Malaka, Tambora, Jakarta Barat',
    'Offline'
  ),
  (
    'Wigas Angga Kalifi',
    'Sekretaris Direktorat Jenderal Konservasi Sumber Daya Alam dan Ekosistem Kementerian Kehutanan',
    'Penyusunan Rencana Kebutuhan Barang Milik Negara (RKBMN) Lingkup Direktorat Jenderal KSDAE Tahun Anggaran 2028',
    DATE '2026-09-17',
    DATE '2026-09-17',
    'The Margo Hotel JL. Margonda No. 358, Kemiri Muka, Beji, Kota Depok',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Permohonan Bantuan Pengajar PJJ Pembinaan, Pengawasan, dan Pengendalian BMN bagi Pengelola Barang',
    DATE '2026-09-18',
    DATE '2026-09-22',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Direktur Pemeriksaan I.B Badan Pemeriksa Keuangan',
    'Focus Group Discussion (FGD) Pengelolaan Alat Material Khusus pada Polri',
    DATE '2026-09-17',
    DATE '2026-09-17',
    'Hotel Shangri-La Jakarta Jalan Jenderal Sudirman No. Kav 1, RT.10/RW.9, Karet Tengsin, Kecamatan Tanah Abang, Jakarta Pusat',
    'Offline'
  ),
  (
    'Andika Bangun Patria',
    'Sekretaris Direktorat Jenderal Imigrasi Kementerian Imigrasi dan Pemasyarakatan RI',
    'Konsinyering Penelitian Rencana Kebutuhan Barang Milik Negara (RKBMN) Tahun Anggaran 2028 Tingkat Wilayah',
    DATE '2026-09-22',
    DATE '2026-09-23',
    'The Trans Luxury Hotel Surabaya Jl. Ahmad Yani No.260, Menanggal, Kec. Gayungan, Surabaya, Jawa Timur',
    'Offline'
  ),
  (
    'Ervan Dedi Purwanto',
    'Sekretaris Direktorat Jenderal Imigrasi Kementerian Imigrasi dan Pemasyarakatan RI',
    'Konsinyering Penelitian Rencana Kebutuhan Barang Milik Negara (RKBMN) Tahun Anggaran 2028 Tingkat Wilayah',
    DATE '2026-09-22',
    DATE '2026-09-23',
    'The Trans Luxury Hotel Surabaya Jl. Ahmad Yani No.260, Menanggal, Kec. Gayungan, Surabaya, Jawa Timur',
    'Offline'
  ),
  (
    'Fajar Dwi Atmoko',
    'Kepala Pusat Kebijakan Lalu Lintas dan Angkutan Transportasi',
    'Knowledge Sharing Tata Kelola Penghapusan Barang Milik Negara',
    DATE '2026-09-23',
    DATE '2026-09-23',
    'Ruang Rapat Lt.3 Pusat Kebijakan Lalu Lintas dan Angkutan Transportasi, Badan Kebijakan Transportasi Jl. Medan Merdeka Timur No. 5, Gambir, Jakarta Pusat',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Kepala Biro Manajemen Barang Milik Negara dan Pengadaan Kementerian Keuangan',
    'Sharing Session Penyusunan Laporan Pengawasan dan Pengendalian Barang Milik Negara Semester I Tahun 2026 pada Modul Wasdal Aplikasi SIMAN V2 di Lingkungan Kementerian Keuangan',
    DATE '2026-06-29',
    DATE '2026-06-29',
    'Daring',
    'Online'
  ),
  (
    'Ade Fikri Fauzi',
    'Direktur Sumber Daya dan Administrasi Kementerian Komdigi',
    'Penyusunan Laporan Pengawasan dan Pengendalian Barang Milik Negara Semester I Tahun 2026',
    DATE '2026-07-03',
    DATE '2026-07-03',
    'Daring',
    'Online'
  ),
  (
    'Andika Bangun Patria',
    'Sekretariat Jenderal Kementerian Kehutanan',
    'Penyusunan LK Sekretariat Jenderal Kementerian Kehutanan Semester I Tahun Anggaran 2026',
    DATE '2026-07-07',
    DATE '2026-07-07',
    'Ruang Rapat Balai Besar KSDA Jawa Barat Jl. Gedebage Selatan No.117, Rancabolang, Kec. Gedebage, Bandung Jawa Barat',
    'Offline'
  ),
  (
    'Suratno',
    'Kepala Biro Keuangan dan Barang Milik Negara Kementerian Komunikasi dan Digital RI',
    'Rapat Persiapan Penyusunan Rencana Kebutuhan Barang Milik Negara Tahun Anggaran 2028',
    DATE '2026-07-20',
    DATE '2026-07-20',
    'Hotel Santika Mega City BekasiJl. Ahmad Yani No.1 Lantai 5, RT.004/RW.001, Marga Jaya, Kec. Bekasi Selatan, Kota Bekasi, Jawa Barat 17141',
    'Offline'
  ),
  (
    'Suratno',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Permohonan Bantuan Tenaga Pengajar PJJ Perencanaan Kebutuhan Barang Milik Negara bagi Pengelola',
    DATE '2026-08-05',
    DATE '2026-08-06',
    'Daring',
    'Online'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Permohonan Bantuan Tenaga Pengajar PJJ Perencanaan Kebutuhan Barang Milik Negara bagi Pengelola',
    DATE '2026-08-05',
    DATE '2026-08-06',
    'Daring',
    'Online'
  ),
  (
    'Emil Agusta',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Direktorat TSI agar dapat menunjuk atau menugaskan pejabat/pegawai yang berkompeten untuk menjadi pengajar aplikasi SIMAN V2',
    DATE '2026-08-05',
    DATE '2026-08-05',
    'Daring',
    'Online'
  ),
  (
    'Ade Fikri Fauzi',
    'Kepala Biro SDM, Organisasi, dan Hukum Majelis Permusyawaratan Rakyat',
    'peningkatan pemahaman dan kompetensi dalam pengelolaan Barang Milik Negara melalui Implementasi Sistem Informasi dan Manajemen Aset Negara (SIMAN) Versi 2 bagi pengelola Barang Milik Negara di lingkungan Sekretariat Jenderal MPR RI',
    DATE '2026-08-19',
    DATE '2026-08-20',
    'Hotel Best Western SenayanJl. Asia Afrika No. 1 Tanah Abang, Jakarta Pusat',
    'Offline'
  ),
  (
    'Suratno',
    'Sekretaris Badan Penyuluhan dan Pengembangan Sumber Daya Manusia Kementerian Kehutanan',
    'Bimbingan Teknis dan Rapat Penyusunan RKBMN Tahun 2028 Lingkup Badan Penyuluhan dan Pengembangan SDM',
    DATE '2026-08-26',
    DATE '2026-08-27',
    'Ruang Rapat Eboni Pusat Pendidikan dan Pelatihan SDMJl. Mayjend Ishak Djuarsa, Gunung Batu, Bogor, Jawa Barat',
    'Offline'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Sekretaris Ditjen Perhutanan Sosial Kementerian Kehutanan',
    'Penelaahan Usulan RKBMN TA 2028 lingkup Direktorat Jenderal Perhutanan Sosial',
    DATE '2026-08-26',
    DATE '2026-08-27',
    'Ruang Rapat Balai Perhutanan Sosial Bogor Jl. Pakuan Utara No.38-40, RT.05/RW.08, Tegallega, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16129',
    'Offline'
  ),
  (
    'Yues Tandrik Hafiyan',
    'Sekretaris Ditjen Perhutanan Sosial Kementerian Kehutanan',
    'Penelaahan Usulan RKBMN TA 2028 lingkup Direktorat Jenderal Perhutanan Sosial',
    DATE '2026-08-26',
    DATE '2026-08-27',
    'Ruang Rapat Balai Perhutanan Sosial Bogor Jl. Pakuan Utara No.38-40, RT.05/RW.08, Tegallega, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16129',
    'Offline'
  ),
  (
    'Fajar Dwi Atmoko',
    'Direktur Jenderal Penataan Ruang Laut Sekretaris Direktorat Jenderal Penataan Ruang Laut Kementerian Kelautan dan Perikanan',
    'Penyusunan RKBMN TA. 2028 DJPRL',
    DATE '2026-09-01',
    DATE '2026-09-02',
    'Ruang Rapat Loka Penataan Ruang Laut Serang Jln. Raya Carita, KM 4.5 Desa Caringin, Labuan, Pandeglang Labuan, Banten',
    'Offline'
  ),
  (
    'Wahyu Abriyanto Widodo',
    'Direktur Jenderal Penataan Ruang Laut Sekretaris Direktorat Jenderal Penataan Ruang Laut Kementerian Kelautan dan Perikanan',
    'Penyusunan RKBMN TA. 2028 DJPRL',
    DATE '2026-09-01',
    DATE '2026-09-02',
    'Ruang Rapat Loka Penataan Ruang Laut Serang Jln. Raya Carita, KM 4.5 Desa Caringin, Labuan, Pandeglang Labuan, Banten',
    'Offline'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Sekretaris Badan Pengembangan dan Pembinaan Bahasa Kemendikdasmen',
    'Koordinasi Pengawasan dan Pengendalian BMN',
    DATE '2026-07-08',
    DATE '2026-07-08',
    'Ibis Style Jakarta SimatupangJalan Cilandak Tengah Raya Nomor 23, Jakarta',
    'Offline'
  ),
  (
    'Wigas Angga Kalifi',
    'Sekretariat Jenderal Kementerian Kesehatan',
    'Penyusunan Laporan Pengawasan dan Pengendalian Barang Milik Negara Semester I Tahun 2026',
    DATE '2026-07-02',
    DATE '2026-07-02',
    'Ruang Rapat Gedung Prof. Dr. Adhyatma Lantai 5Jl. HR. Rasuna Said Blok X-5 Kav 4-9, Jakarta Selatan',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Sekretaris Direktorat Jenderal Mineral dan Batubara Kementerian ESDM',
    'Aplikasi SAKTI dan SIMAN atas Pengelolaan Barang Milik Negara yang berasal dari PKP2B (BMN PKP2B)',
    DATE '2026-09-29',
    DATE '2026-09-30',
    'Ruang Rapat Balai Besar Pengujian Mineral dan Batubara (BBPMB) tekMira Jl. Jend. Sudirman No.623, Wr. Muncang, Kec. Bandung Kulon, Kota Bandung, Jawa Barat 40211',
    'Offline'
  ),
  (
    'Wahyu Abriyanto Widodo',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Permohonan Bantuan Pengajaran PJJ Penatausahaan BMN bagi Pengelola Barang',
    DATE '2026-09-30',
    DATE '2026-10-01',
    'Daring',
    'Online'
  ),
  (
    'Puthut Hari Murtti',
    'Kepala Pusat Pendidikan dan Pelatihan Keuangan Publik (Pusdiklat KP)',
    'Permohonan Bantuan Pengajaran PJJ Penatausahaan BMN bagi Pengelola Barang',
    DATE '2026-09-30',
    DATE '2026-10-01',
    'Daring',
    'Online'
  ),
  (
    'Suratno',
    'Kepala Biro Umum Sekretariat Jenderal Kementerian Keuangan',
    'Kegiatan Peningkatan Kualitas Pengelolaan Barang Milik Negara dan Dukungan Manajemen pada Satuan Kerja Lingkup Unit Eselon I Sekretariat Jenderal Tahun 2026',
    DATE '2026-10-15',
    DATE '2026-10-16',
    'Aula Gedung Keuangan Negara Bandung',
    'Offline'
  ),
  (
    'Emil Agusta',
    'Kepala Biro Umum Sekretariat Jenderal Kementerian Keuangan',
    'Kegiatan Peningkatan Kualitas Pengelolaan Barang Milik Negara dan Dukungan Manajemen pada Satuan Kerja Lingkup Unit Eselon I Sekretariat Jenderal Tahun 2027',
    DATE '2026-10-15',
    DATE '2026-10-16',
    'Aula Gedung Keuangan Negara Bandung',
    'Offline'
  ),
  (
    'Wahyu Abriyanto Widodo',
    'Kepala Biro Umum Badan Pengawas Obat dan Makanan',
    'Bimbingan Teknis Penyusunan Usulan RKBMN Tahun 2026 untuk RKAKL Tahun Anggaran 2028',
    DATE '2026-10-12',
    DATE '2026-10-12',
    'Daring',
    'Online'
  ),
  (
    'Bayu Saputra Surya Wardhana',
    'Sekretaris Jenderal Kepala Biro Keuangan dan BMN Kementrian Kelautan dan Perikanan',
    'Penyusunan RKBMN Tahun Anggaran 2028',
    DATE '2026-10-05',
    DATE '2026-10-05',
    'AONE Hotel Jalan K.H. Wahid Hasyim No.80, RT.15/RW.3, Gondangdia, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10340',
    'Offline'
  ),
  (
    'Ikhsan A. Fattah',
    'Kepala Biro Umum Kementerian Sosial Republik Indonesia',
    'Penguatan Kapasitas Aplikator SIMAN',
    DATE '2026-09-16',
    DATE '2026-09-16',
    'Hotel Grand Travello Bekasi Jl. Grand Kota Bintang, RT.006/RW.017, Jakasampurna, Bekasi, Jawa Barat',
    'Offline'
  ),
  (
    'Mundhi Saptono Widigdo',
    'Kepala Biro Umum Kementerian Sosial Republik Indonesia',
    'Penguatan Kapasitas Aplikator SIMAN',
    DATE '2026-09-16',
    DATE '2026-09-16',
    'Hotel Grand Travello Bekasi Jl. Grand Kota Bintang, RT.006/RW.017, Jakasampurna, Bekasi, Jawa Barat',
    'Offline'
  )
ON CONFLICT ON CONSTRAINT rekapan_narsum_unique_row DO NOTHING;
