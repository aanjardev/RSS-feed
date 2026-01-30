<script>
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
        Tentang Papua.news
      </h1>
      
      <!-- Content -->
      <div class="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 class="text-3xl font-bold mb-4">🌏 Siapa Kami</h2>
          <p class="text-lg leading-relaxed">
            <strong>Papua.news</strong> adalah platform agregator berita yang fokus menghadirkan informasi terkini 
            seputar Papua dan Indonesia Timur. Kami mengumpulkan berita dari berbagai sumber terpercaya 
            dan menyajikannya dalam satu tempat yang mudah diakses.
          </p>
        </section>

        <section>
          <h2 class="text-3xl font-bold mb-4">🎯 Misi Kami</h2>
          <ul class="list-disc list-inside space-y-2 text-lg">
            <li>Menyediakan akses mudah ke berita Papua dan Indonesia Timur</li>
            <li>Menghadirkan perspektif yang beragam dari berbagai sumber media</li>
            <li>Membantu masyarakat Papua tetap terinformasi tentang perkembangan daerah mereka</li>
            <li>Menjadi jembatan informasi antara Papua dan dunia luar</li>
          </ul>
        </section>

        <section>
          <h2 class="text-3xl font-bold mb-4">📰 Konten Kami</h2>
          <p class="text-lg leading-relaxed">
            Kami mengkurasi berita dari berbagai kategori:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-primary/10 p-4 rounded-lg border-2 border-primary">
              <h3 class="font-bold text-xl mb-2">🏛️ Politik & Pemerintahan</h3>
              <p>Otonomi khusus, kebijakan daerah, dan perkembangan politik</p>
            </div>
            <div class="bg-secondary/10 p-4 rounded-lg border-2 border-secondary">
              <h3 class="font-bold text-xl mb-2">💼 Ekonomi & Bisnis</h3>
              <p>Investasi, UMKM, dan perkembangan ekonomi Papua</p>
            </div>
            <div class="bg-accent/10 p-4 rounded-lg border-2 border-accent">
              <h3 class="font-bold text-xl mb-2">🎭 Budaya & Sosial</h3>
              <p>Kearifan lokal, seni, dan kehidupan masyarakat Papua</p>
            </div>
            <div class="bg-info/10 p-4 rounded-lg border-2 border-info">
              <h3 class="font-bold text-xl mb-2">🏥 Kesehatan & Pendidikan</h3>
              <p>Layanan kesehatan, pendidikan, dan kesejahteraan</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-3xl font-bold mb-4">🤝 Kontak & Kerjasama</h2>
          <p class="text-lg leading-relaxed">
            Untuk pertanyaan, saran, atau kerjasama media, silakan hubungi kami:
          </p>
          <div class="bg-base-200 p-6 rounded-lg border-2 border-neutral mt-4">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span class="font-semibold">Email:</span>
                <a href="mailto:info@papua.news" class="text-primary hover:underline">info@papua.news</a>
              </div>
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span class="font-semibold">WhatsApp:</span>
                <a href="https://wa.me/6281234567890" class="text-primary hover:underline" target="_blank">+62 812-3456-7890</a>
              </div>
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary">
                  <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>
                </svg>
                <span class="font-semibold">Location:</span>
                <span>Jayapura, Papua</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-3xl font-bold mb-4">⚖️ Disclaimer</h2>
          <div class="bg-warning/10 p-6 rounded-lg border-2 border-warning">
            <p class="text-lg leading-relaxed">
              Papua.news adalah agregator berita yang mengumpulkan konten dari berbagai sumber eksternal. 
              Kami tidak bertanggung jawab atas akurasi, validitas, atau pandangan yang diungkapkan dalam 
              artikel dari sumber eksternal. Untuk informasi lebih lanjut, silakan kunjungi sumber asli artikel.
            </p>
          </div>
        </section>

        <section class="text-center pt-8 border-t-4 border-neutral">
          <p class="text-2xl font-bold">
            🏔️ Tanah Papua, Tanah Cinta 🏔️
          </p>
          <p class="text-lg mt-2 text-base-content/70">
            Bersama membangun Papua yang lebih baik melalui informasi
          </p>
        </section>
      </div>
    </article>
  </main>
</div>

<style>
  .prose h2 {
    color: var(--color-primary);
  }
  
  .prose h3 {
    margin-bottom: 0.5rem;
  }
  
  .prose p {
    margin-bottom: 1rem;
  }
  
  .prose ul {
    margin-top: 0.5rem;
  }
</style>
