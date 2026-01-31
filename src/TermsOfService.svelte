<script>
  import { navigateTo } from './main.jsx';
</script>

<div class="min-h-screen bg-base-100">
  <!-- Header -->
  <header class="bg-base-200 border-b-2 border-neutral sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <button onclick={() => navigateTo('/')} class="flex items-center gap-2 cursor-pointer">
          <span class="text-2xl font-bold text-primary">Papua.News</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Content -->
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-4xl font-bold mb-8 text-center">Syarat & Ketentuan</h1>
    
    <div class="prose prose-lg max-w-none">
      <div class="bg-base-200 rounded-lg p-6 mb-6">
        <p class="text-lg">
          Dengan mengakses atau menggunakan layanan kami, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan ini.
        </p>
      </div>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">1. Deskripsi Layanan</h2>
        <p class="text-base-content/80 leading-relaxed">
          Papua.News adalah agregator RSS feed yang memungkinkan pengguna membaca dan mengikuti berbagai sumber berita dari hampir seluruh situs berita se-Papua dan beberapa situs berita Nasional, melalui satu antarmuka.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">2. Konten Pihak Ketiga</h2>
        <p class="text-base-content/80 leading-relaxed mb-4">
          Kami tidak meng-host atau membuat ulang konten asli dari sumber pihak ketiga. Semua konten yang ditampilkan melalui layanan kami berasal dari RSS feed publik dan hanya menampilkan judul, ringkasan (jika tersedia), dan tautan ke sumber asli.
        </p>
        <p class="text-base-content/80 leading-relaxed mb-4">
          Kami tidak mengklaim kepemilikan atas konten dari pihak ketiga. Hak cipta sepenuhnya dimiliki oleh pemilik sumber konten.
        </p>
        <p class="text-base-content/80 leading-relaxed">
          Jika Anda adalah pemilik konten dan tidak ingin situs Anda ditampilkan di Papua.News, silakan hubungi kami di <a href="mailto:mail@papua.news" class="text-primary hover:underline">mail@papua.news</a>, atau melalui WhatsApp ke <a href="https://wa.me/6282183730310" class="text-primary hover:underline" target="_blank">082183730310</a> dan kami akan segera menghapus feed Anda dari layanan kami.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">3. Tanggung Jawab</h2>
        <p class="text-base-content/80 leading-relaxed mb-3">
          Kami tidak bertanggung jawab atas:
        </p>
        <ul class="list-disc list-inside space-y-2 text-base-content/80 ml-4">
          <li>Keakuratan atau ketersediaan konten dari sumber pihak ketiga.</li>
          <li>Kerugian atau kerusakan yang timbul dari penggunaan informasi dari situs-situs sumber.</li>
          <li>Layanan kami disediakan "apa adanya" tanpa jaminan dalam bentuk apa pun.</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">4. Perubahan Layanan</h2>
        <p class="text-base-content/80 leading-relaxed">
          Kami berhak untuk menghentikan atau mengubah layanan kami kapan saja tanpa pemberitahuan.
        </p>
      </section>

      <div class="bg-base-200 rounded-lg p-6 mt-8">
        <p class="text-center text-base-content/80">
          Terakhir diperbarui: 31 Januari 2026
        </p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-base-200 border-t-2 border-neutral py-4 mt-12">
    <div class="container mx-auto px-4 text-center">
      <p class="text-sm opacity-80">
        © 2026 papua.news - Portal RSS Feed Berita Papua
      </p>
      <div class="mt-2">
        <button onclick={() => navigateTo('/terms')} class="text-sm text-primary hover:underline">
          Syarat & Ketentuan
        </button>
      </div>
    </div>
  </footer>
</div>
