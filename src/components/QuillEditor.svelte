<script>
  import { onMount } from 'svelte';
  
  let { value = '', onChange } = $props();
  let editorContainer;
  let quill;
  
  onMount(async () => {
    // Dynamic import Quill
    const Quill = (await import('quill')).default;
    
    // Initialize Quill
    quill = new Quill(editorContainer, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'indent': '-1'}, { 'indent': '+1' }],
          [{ 'align': [] }],
          ['link', 'image'],
          ['clean']
        ]
      },
      placeholder: 'Tulis konten artikel di sini...'
    });
    
    // Set initial content
    if (value) {
      quill.root.innerHTML = value;
    }
    
    // Listen for changes
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      onChange?.(html);
    });
    
    return () => {
      if (quill) {
        quill = null;
      }
    };
  });
  
  // Update editor when value changes externally
  $effect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.root.innerHTML = value || '';
    }
  });
</script>

<div>
  <div bind:this={editorContainer} class="wysiwyg-editor"></div>
</div>

<style>
  :global(.wysiwyg-editor) {
    min-height: 300px;
    background: white;
  }
  
  :global(.dark .wysiwyg-editor) {
    background: rgb(51, 65, 85);
    color: rgb(241, 245, 249);
  }
  
  :global(.ql-toolbar) {
    background: rgb(249, 250, 251);
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }
  
  :global(.dark .ql-toolbar) {
    background: rgb(30, 41, 59);
    border-color: rgb(71, 85, 105);
  }
  
  :global(.ql-container) {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    font-family: inherit;
  }
  
  :global(.dark .ql-container) {
    border-color: rgb(71, 85, 105);
  }
  
  :global(.dark .ql-stroke) {
    stroke: rgb(241, 245, 249);
  }
  
  :global(.dark .ql-fill) {
    fill: rgb(241, 245, 249);
  }
  
  :global(.dark .ql-picker-label) {
    color: rgb(241, 245, 249);
  }
  
  :global(.ql-editor) {
    min-height: 300px;
    font-size: 1rem;
    line-height: 1.75;
  }
  
  :global(.ql-editor p) {
    margin-bottom: 1rem;
  }
  
  :global(.ql-editor h1) {
    font-size: 2rem;
    font-weight: bold;
    margin: 1.5rem 0 1rem;
  }
  
  :global(.ql-editor h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1.25rem 0 0.75rem;
  }
  
  :global(.ql-editor h3) {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 1rem 0 0.5rem;
  }
  
  :global(.ql-editor ul, .ql-editor ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  :global(.ql-editor blockquote) {
    border-left: 4px solid currentColor;
    padding-left: 1rem;
    margin: 1rem 0;
    font-style: italic;
  }
</style>
