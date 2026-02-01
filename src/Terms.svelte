<script>
  import { onMount } from 'svelte';
  import { navigateTo } from './main.jsx';
  
  const API_BASE = import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || window.location.origin)
    : 'http://localhost:3000';
  
  let settings = $state({});
  
  async function loadSettings() {
    try {
      const response = await fetch(`${API_BASE}/api/settings/public`);
      if (response.ok) {
        settings = await response.json();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  onMount(() => {
    loadSettings();
  });
  
  function goBack() {
    window.location.href = '/';
  }
</script>

<div class="min-h-screen bg-base-100">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-base-100 border-b-4 border-neutral shadow-[var(--shadow-1)]">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <button onclick={goBack} class="btn btn-ghost gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali
      </button>
      
      <a href="/" class="text-2xl font-black">papua.news</a>
      
      <div class="w-24"></div>
    </div>
  </header>

  <!-- Content -->
  <main class="container mx-auto px-4 py-12 max-w-4xl">
    <article class="bg-base-100 rounded-xl border-4 border-neutral shadow-[8px_8px_0_rgba(0,0,0,0.1)] p-8 md:p-12">
      <!-- Title -->
      <h1 class="text-5xl font-black leading-tight mb-8 border-l-8 border-primary pl-6">
        Syarat & Ketentuan
      </h1>
      
      <!-- Dynamic Content from Settings -->
      {#if settings.terms_content}
        <div class="prose prose-lg max-w-none space-y-6">
          {@html settings.terms_content}
        </div>
      {:else}
        <!-- Fallback Content -->
        <div class="prose prose-lg max-w-none space-y-6">
          <section>
            <h2 class="text-3xl font-bold mb-4">Syarat dan Ketentuan</h2>
            <p class="text-lg leading-relaxed">
              Dengan mengakses dan menggunakan situs web Papua.News, Anda setuju untuk terikat dengan syarat dan ketentuan berikut:
            </p>
          </section>

          <section>
            <h3 class="text-2xl font-bold mb-3">1. Penggunaan Konten</h3>
            <p class="text-lg leading-relaxed">
              Semua konten yang ditampilkan di situs ini dikumpulkan dari sumber berita publik dan tetap menjadi milik penerbit aslinya. 
              Kami tidak mengklaim kepemilikan atas konten yang dikurasi dari sumber eksternal.
            </p>
          </section>

          <section>
            <h3 class="text-2xl font-bold mb-3">2. Tautan Eksternal</h3>
            <p class="text-lg leading-relaxed">
              Situs ini berisi tautan ke situs web eksternal. Kami tidak bertanggung jawab atas konten atau kebijakan privasi situs tersebut. 
              Pengguna disarankan untuk membaca syarat dan ketentuan setiap situs yang mereka kunjungi.
            </p>
          </section>

          <section>
            <h3 class="text-2xl font-bold mb-3">3. Akurasi Informasi</h3>
            <p class="text-lg leading-relaxed">
              Kami berusaha menyediakan informasi yang akurat dan terkini. Namun, kami tidak menjamin keakuratan, kelengkapan, 
              atau keandalan informasi yang disajikan. Pengguna bertanggung jawab untuk memverifikasi informasi dari sumber aslinya.
            </p>
          </section>

          <section>
            <h3 class="text-2xl font-bold mb-3">4. Hak Cipta</h3>
            <p class="text-lg leading-relaxed">
              Semua hak cipta artikel dan konten tetap dimiliki oleh penerbit aslinya. Papua.News hanya mengagregasi 
              dan menyajikan tautan ke konten tersebut untuk kemudahan akses.
            </p>
          </section>

          <section>
            <h3 class="text-2xl font-bold mb-3">5. Perubahan Ketentuan</h3>
            <p class="text-lg leading-relaxed">
              Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. 
              Penggunaan berkelanjutan terhadap situs ini setelah perubahan dibuat akan dianggap sebagai penerimaan terhadap perubahan tersebut.
            </p>
          </section>

          <section>
            <h3 class="text-2xl font-bold mb-3">6. Kontak</h3>
            <p class="text-lg leading-relaxed">
              Jika Anda memiliki pertanyaan tentang Syarat & Ketentuan ini, silakan hubungi kami melalui email yang tersedia di footer situs.
            </p>
          </section>
        </div>
      {/if}

      <!-- Back Button -->
      <div class="mt-12 pt-8 border-t-2 border-neutral">
        <button 
          onclick={goBack}
          class="btn btn-primary gap-2 shadow-[4px_4px_0_#111] hover:shadow-[2px_2px_0_#111] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Kembali ke Beranda
        </button>
      </div>
    </article>
  </main>

  <!-- Footer -->
  <footer class="bg-base-200 border-t-2 border-neutral py-4 mt-12">
    <div class="container mx-auto px-4 text-right">
      <p class="text-sm opacity-80">
        {settings.footer_text || '© 2026 papua.news - Portal RSS Feed Berita Papua'}
      </p>
      <div class="mt-2">
        <button onclick={() => navigateTo('/about')} class="text-sm text-primary hover:underline">
          Tentang Kami
        </button>
        {#if settings.contact_email}
        <span class="mx-2 opacity-50">•</span>
        <a href="mailto:{settings.contact_email}" class="text-sm text-primary hover:underline">
          Kontak
        </a>
        {/if}
      </div>
    </div>
  </footer>
</div>
