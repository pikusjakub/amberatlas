(() => {
  const $ = (id) => document.getElementById(id);
  const state = { articles: [], faq: [], currentArticle: null, currentFaq: null };
  const api = async (url, options = {}) => {
    const res = await fetch(url, { credentials: 'same-origin', ...options });
    const type = res.headers.get('content-type') || '';
    const data = type.includes('application/json') ? await res.json() : { error: await res.text() };
    if (!res.ok) {
      const err = new Error(data.error || `Błąd ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  };
  const escapeText = (value='') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const slugify = (value='') => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,120);
  const today = () => new Date().toISOString().slice(0,10);
  const setMessage = (el, text='', success=false) => { el.textContent = text; el.classList.toggle('success', success); };
  const showEditor = () => { $('loginView').classList.add('hidden'); $('editorView').classList.remove('hidden'); $('logoutBtn').classList.remove('hidden'); loadAll(); };
  const showLogin = () => { $('loginView').classList.remove('hidden'); $('editorView').classList.add('hidden'); $('logoutBtn').classList.add('hidden'); };

  async function checkSession(){
    try { const data = await api('/api/cms/session'); data.authenticated ? showEditor() : showLogin(); }
    catch { showLogin(); }
  }
  $('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); setMessage($('loginMessage'),'Logowanie...');
    try {
      await api('/api/cms/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:$('loginUser').value.trim(),password:$('loginPassword').value}) });
      $('loginPassword').value=''; setMessage($('loginMessage'),'Zalogowano.',true); showEditor();
    } catch(err) { setMessage($('loginMessage'), err.message); }
  });
  $('logoutBtn').addEventListener('click', async () => { try { await api('/api/cms/logout',{method:'POST'}); } finally { showLogin(); } });

  document.querySelectorAll('.admin-tab').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(x => x.classList.toggle('active', x === btn));
    const tab = btn.dataset.tab;
    $('articlesPanel').classList.toggle('hidden', tab !== 'articles');
    $('faqPanel').classList.toggle('hidden', tab !== 'faq');
  }));

  document.querySelectorAll('.editor-toolbar').forEach(toolbar => toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button'); if (!btn) return;
    const editor = $(toolbar.dataset.editor); editor.focus();
    const command = btn.dataset.command; let value = btn.dataset.value || null;
    if (command === 'createLink') { const url = prompt('Wklej adres linku:'); if (!url) return; value = url; }
    document.execCommand(command, false, value);
  }));

  $('articleTitle').addEventListener('input', () => { if (!$('articleOriginalSlug').value) $('articleSlug').value = slugify($('articleTitle').value); });
  async function loadAll(){
    setMessage($('globalMessage'),'Pobieranie treści...');
    try {
      const [a,f] = await Promise.all([api('/api/cms/content/articles'),api('/api/cms/content/faq')]);
      state.articles = a.items || []; state.faq = f.items || [];
      renderArticleList(); renderFaqList(); resetArticle(); resetFaq();
      setMessage($('globalMessage'),'Treści są aktualne.',true);
    } catch(err) {
      if (err.status === 401) return showLogin();
      setMessage($('globalMessage'),err.message);
    }
  }
  function renderArticleList(){
    const box=$('articleList');
    if(!state.articles.length){box.innerHTML='<div class="list-empty">Brak artykułów. Kliknij „+ Nowy”.</div>';return;}
    box.innerHTML=state.articles.map(x=>`<button class="content-item" data-slug="${escapeText(x.slug)}"><strong>${escapeText(x.title)}</strong><span>${x.status==='published'?'Publié':'Brouillon'} · ${escapeText(x.date||'')}</span></button>`).join('');
    box.querySelectorAll('[data-slug]').forEach(b=>b.addEventListener('click',()=>editArticle(b.dataset.slug)));
  }
  function renderFaqList(){
    const box=$('faqList');
    if(!state.faq.length){box.innerHTML='<div class="list-empty">Brak pytań FAQ. Kliknij „+ Nowe”.</div>';return;}
    box.innerHTML=state.faq.map(x=>`<button class="content-item" data-id="${escapeText(x.id)}"><strong>${escapeText(x.question)}</strong><span>${x.status==='published'?'Publié':'Brouillon'} · kolejność ${Number(x.order||0)}</span></button>`).join('');
    box.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',()=>editFaq(b.dataset.id)));
  }
  function resetArticle(){
    state.currentArticle=null; $('articleForm').reset(); $('articleAuthor').value='Jakub Pikus'; $('articleDate').value=today(); $('articleStatus').value='draft'; $('articleOriginalSlug').value=''; $('articleImageUrl').value=''; $('articleContent').innerHTML=''; $('articleImagePreview').classList.add('hidden'); $('deleteArticleBtn').classList.add('hidden'); $('previewArticleBtn').classList.add('hidden'); setMessage($('articleSaveState'),'');
    document.querySelectorAll('#articleList .content-item').forEach(x=>x.classList.remove('active'));
  }
  function resetFaq(){
    state.currentFaq=null; $('faqForm').reset(); $('faqOrder').value=String(state.faq.length); $('faqStatus').value='published'; $('faqId').value=''; $('faqImageUrl').value=''; $('faqAnswer').innerHTML=''; $('faqImagePreview').classList.add('hidden'); $('deleteFaqBtn').classList.add('hidden'); setMessage($('faqSaveState'),'');
    document.querySelectorAll('#faqList .content-item').forEach(x=>x.classList.remove('active'));
  }
  $('newArticleBtn').addEventListener('click',resetArticle); $('newFaqBtn').addEventListener('click',resetFaq);
  async function editArticle(slug){
    try {
      const data=await api('/api/cms/content/articles/'+encodeURIComponent(slug)); const x=data.item; state.currentArticle=x;
      $('articleOriginalSlug').value=x.slug||''; $('articleTitle').value=x.title||''; $('articleSlug').value=x.slug||''; $('articleExcerpt').value=x.excerpt||''; $('articleAuthor').value=x.author||'Jakub Pikus'; $('articleDate').value=x.date||today(); $('articleStatus').value=x.status||'draft'; $('articleImageUrl').value=x.imageUrl||''; $('articleImageAlt').value=x.imageAlt||''; $('articleContent').innerHTML=x.content||'';
      if(x.imageUrl){$('articleImagePreview').src=x.imageUrl;$('articleImagePreview').classList.remove('hidden')}else{$('articleImagePreview').classList.add('hidden')}
      $('deleteArticleBtn').classList.remove('hidden'); $('previewArticleBtn').href='/conseils/'+encodeURIComponent(x.slug)+'/'; $('previewArticleBtn').classList.toggle('hidden',x.status!=='published');
      document.querySelectorAll('#articleList .content-item').forEach(b=>b.classList.toggle('active',b.dataset.slug===slug));
      window.scrollTo({top:0,behavior:'smooth'});
    } catch(err){setMessage($('globalMessage'),err.message)}
  }
  function editFaq(id){
    const x=state.faq.find(v=>v.id===id); if(!x)return; state.currentFaq=x;
    $('faqId').value=x.id; $('faqQuestion').value=x.question||''; $('faqOrder').value=String(x.order||0); $('faqStatus').value=x.status||'published'; $('faqImageUrl').value=x.imageUrl||''; $('faqImageAlt').value=x.imageAlt||''; $('faqAnswer').innerHTML=x.answer||'';
    if(x.imageUrl){$('faqImagePreview').src=x.imageUrl;$('faqImagePreview').classList.remove('hidden')}else{$('faqImagePreview').classList.add('hidden')}
    $('deleteFaqBtn').classList.remove('hidden'); document.querySelectorAll('#faqList .content-item').forEach(b=>b.classList.toggle('active',b.dataset.id===id)); window.scrollTo({top:0,behavior:'smooth'});
  }
  async function upload(fileInput,urlInput,preview,button){
    const file=fileInput.files[0]; if(!file) throw new Error('Najpierw wybierz grafikę.');
    button.disabled=true; button.textContent='Wysyłanie...';
    try { const form=new FormData();form.append('file',file);const data=await api('/api/cms/upload',{method:'POST',body:form});urlInput.value=data.url;preview.src=data.url;preview.classList.remove('hidden');return data.url; }
    finally {button.disabled=false;button.textContent='Załącz grafikę';}
  }
  $('uploadArticleImageBtn').addEventListener('click',async()=>{try{await upload($('articleImageFile'),$('articleImageUrl'),$('articleImagePreview'),$('uploadArticleImageBtn'));setMessage($('articleSaveState'),'Grafika została przesłana.',true)}catch(e){setMessage($('articleSaveState'),e.message)}});
  $('uploadFaqImageBtn').addEventListener('click',async()=>{try{await upload($('faqImageFile'),$('faqImageUrl'),$('faqImagePreview'),$('uploadFaqImageBtn'));setMessage($('faqSaveState'),'Grafika została przesłana.',true)}catch(e){setMessage($('faqSaveState'),e.message)}});

  $('articleForm').addEventListener('submit',async(e)=>{
    e.preventDefault();setMessage($('articleSaveState'),'Zapisywanie...');
    const payload={originalSlug:$('articleOriginalSlug').value,title:$('articleTitle').value.trim(),slug:$('articleSlug').value.trim(),excerpt:$('articleExcerpt').value.trim(),author:$('articleAuthor').value.trim(),date:$('articleDate').value,status:$('articleStatus').value,imageUrl:$('articleImageUrl').value,imageAlt:$('articleImageAlt').value.trim(),content:$('articleContent').innerHTML};
    try{const data=await api('/api/cms/content/articles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});setMessage($('articleSaveState'),'Zapisano.',true);await loadAll();await editArticle(data.item.slug)}catch(err){setMessage($('articleSaveState'),err.message)}
  });
  $('faqForm').addEventListener('submit',async(e)=>{
    e.preventDefault();setMessage($('faqSaveState'),'Zapisywanie...');
    const payload={id:$('faqId').value,question:$('faqQuestion').value.trim(),answer:$('faqAnswer').innerHTML,order:Number($('faqOrder').value||0),status:$('faqStatus').value,imageUrl:$('faqImageUrl').value,imageAlt:$('faqImageAlt').value.trim()};
    try{const data=await api('/api/cms/content/faq',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});setMessage($('faqSaveState'),'Zapisano.',true);await loadAll();editFaq(data.item.id)}catch(err){setMessage($('faqSaveState'),err.message)}
  });
  $('deleteArticleBtn').addEventListener('click',async()=>{const slug=$('articleOriginalSlug').value;if(!slug||!confirm('Usunąć ten artykuł?'))return;try{await api('/api/cms/content/articles/'+encodeURIComponent(slug),{method:'DELETE'});await loadAll();setMessage($('globalMessage'),'Artykuł usunięty.',true)}catch(e){setMessage($('globalMessage'),e.message)}});
  $('deleteFaqBtn').addEventListener('click',async()=>{const id=$('faqId').value;if(!id||!confirm('Usunąć to pytanie FAQ?'))return;try{await api('/api/cms/content/faq/'+encodeURIComponent(id),{method:'DELETE'});await loadAll();setMessage($('globalMessage'),'FAQ usunięte.',true)}catch(e){setMessage($('globalMessage'),e.message)}});
  checkSession();
})();
