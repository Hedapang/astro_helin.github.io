(() => {
  'use strict';
  if (!(location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname))) return;
  let editing = false, activeField = null, activeImage = null, savedRange = null, snapshot = null;
  let exportURL = null, exportSource = '', uploadMode = 'insert';
  const bar = document.createElement('aside');
  bar.className = 'page-editor';
  bar.lang = 'zh-CN';
  bar.setAttribute('aria-label', '网页编辑器');
  bar.innerHTML = `<div class="editor-actions"><button type="button" data-editor="start">编辑页面</button><div class="editor-tools" hidden>
    <label>字号 <input data-editor-size type="number" min="8" max="96" step="1" value="15" aria-label="字号，像素" disabled></label>
    <label>粗细 <select data-editor-weight aria-label="文字粗细" disabled><option value="400">常规</option><option value="500">中等</option><option value="600">半粗</option><option value="700">粗体</option></select></label>
    <button type="button" data-editor="link" disabled>修改链接</button><button type="button" data-editor="insert">插入图片</button><button type="button" data-editor="replace" disabled>替换图片</button><button type="button" data-editor="remove" disabled>删除图片</button>
    <button type="button" data-editor="download">下载网页</button><button type="button" data-editor="save-as">另存为</button><button type="button" data-editor="cancel">取消修改</button></div></div>
    <p class="editor-message" role="status">本地编辑：修改后下载网页，替换原来的 index.html。</p>
    <div class="editor-export" hidden><a class="editor-download" download="index.html">点击这里保存 index.html</a><button type="button" data-editor="source">显示／复制网页源码</button><label class="editor-source-label" hidden>若下载不可用，请全选复制以下源码，用纯文本编辑器保存为 index.html。<textarea class="editor-source" readonly aria-label="完整网页源码"></textarea></label></div>
    <input class="editor-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden>`;
  document.body.append(bar);
  document.body.classList.add('has-page-editor');
  const q = (s) => bar.querySelector(s);
  const button = (name) => q(`[data-editor="${name}"]`);
  const message = q('.editor-message');
  const sizeInput = q('[data-editor-size]');
  const weightInput = q('[data-editor-weight]');
  const roots = () => [...document.querySelectorAll('header.site-header, main, footer')];
  function status(text) { message.textContent = text; }
  function invalidateExport() {
    q('.editor-export').hidden = true;
    q('.editor-source-label').hidden = true;
  }
  function wrapText() {
    document.querySelectorAll('[data-editor-placeholder]').forEach((container) => {
      if (container.textContent.trim() || container.querySelector('[data-editor-field]')) return;
      const field = document.createElement('span');
      field.dataset.editorField = '';
      field.setAttribute('contenteditable', 'true');
      field.setAttribute('role', 'textbox');
      field.setAttribute('aria-label', container.dataset.editorPlaceholder);
      container.append(field);
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        return node.textContent.trim() && p && p.closest('main, header.site-header, footer') &&
          !p.closest('[data-editor-field], script, style, svg, button, .skip, .publication-toolbar') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const field = document.createElement('span');
      field.dataset.editorField = '';
      field.contentEditable = 'true';
      field.setAttribute('contenteditable', 'true');
      field.setAttribute('role', 'textbox');
      field.setAttribute('aria-label', '编辑文字');
      field.textContent = node.textContent;
      node.replaceWith(field);
    });
  }
  function clearImage() {
    activeImage?.classList.remove('editor-selected-image');
    activeImage = null;
    button('replace').disabled = button('remove').disabled = true;
  }
  function begin() {
    if (editing) return;
    snapshot = roots().map((node) => ({ node, html: node.innerHTML, className: node.className }));
    editing = true;
    wrapText();
    button('start').hidden = true;
    q('.editor-tools').hidden = false;
    document.body.classList.add('is-editing-page');
    status('点击文字或选中一段文字后调整字号、粗细。点击图片后可替换或删除；下载网页以保存。');
  }
  function cancel() {
    if (!editing) return;
    snapshot.forEach(({node, html, className}) => { node.innerHTML = html; node.className = className; });
    editing = false;
    activeField = savedRange = null;
    clearImage();
    sizeInput.disabled = weightInput.disabled = true;
    button('start').hidden = false;
    q('.editor-tools').hidden = true;
    document.body.classList.remove('is-editing-page');
    invalidateExport();
    window.dispatchEvent(new Event('site-content-restored'));
    status('已取消本次修改。');
  }
  function chooseField(field) {
    activeField = field;
    clearImage();
    const computed = getComputedStyle(field);
    sizeInput.value = Math.round(parseFloat(computed.fontSize)) || 15;
    const weight = parseInt(computed.fontWeight, 10) || 400;
    weightInput.value = String([400,500,600,700].reduce((best, n) => Math.abs(n-weight)<Math.abs(best-weight)?n:best,400));
    sizeInput.disabled = weightInput.disabled = false;
    button('link').disabled = !field.closest('a[href]');
  }
  function rememberSelection() {
    if (!editing || document.activeElement?.closest('.page-editor')) return;
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const el = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;
    if (el?.closest('.page-editor')) return;
    const startElement = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
    const field = el?.closest('[data-editor-field]') || startElement?.closest('[data-editor-field]');
    if (field) { chooseField(field); savedRange = range.cloneRange(); }
  }
  function format(property, value) {
    if (!activeField?.isConnected) return;
    const range = savedRange;
    const block = activeField.closest('p,h1,h2,h3,h4,dt,dd,figcaption,.paper-year') || activeField;
    if (range && !range.collapsed && block.contains(range.commonAncestorContainer)) {
      const mark = document.createElement('span');
      mark.style[property] = value;
      mark.append(range.extractContents());
      range.insertNode(mark);
      range.selectNodeContents(mark);
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      savedRange = range.cloneRange();
      wrapText();
    } else activeField.style[property] = value;
    invalidateExport();
  }
  function exportedHTML() {
    const clone = document.documentElement.cloneNode(true);
    clone.querySelector('.page-editor')?.remove();
    clone.querySelector('body').classList.remove('has-page-editor', 'is-editing-page');
    if (!clone.querySelector('body').className) clone.querySelector('body').removeAttribute('class');
    clone.querySelectorAll('[data-editor-field]').forEach((field) => {
      ['data-editor-field','contenteditable','role','aria-label'].forEach((attr) => field.removeAttribute(attr));
      // Styled spans are retained; transient wrappers are removed.
      if (!field.getAttribute('style')) field.replaceWith(...field.childNodes);
    });
    clone.querySelectorAll('.editor-selected-image').forEach((img) => img.classList.remove('editor-selected-image'));
    clone.querySelectorAll('.paper').forEach((paper) => paper.removeAttribute('hidden'));
    const filters = clone.querySelector('.filters');
    if (filters) { filters.hidden = true; filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed',String(b.dataset.filter==='all'))); }
    const count = clone.querySelector('#paper-count');
    if (count) count.textContent = `${clone.querySelectorAll('.paper').length} works · ${clone.querySelectorAll('.paper[data-kind="first"]').length} first-author`;
    return '<!doctype html>\n' + clone.outerHTML + '\n';
  }
  function prepareExport() {
    exportSource = exportedHTML();
    if (exportURL) URL.revokeObjectURL(exportURL);
    exportURL = URL.createObjectURL(new Blob([exportSource], {type:'text/html;charset=utf-8'}));
    const link = q('.editor-download');
    link.href = exportURL;
    link.hidden = false;
    q('.editor-source').value = exportSource;
    q('.editor-export').hidden = false;
    return link;
  }
  function download() {
    try {
      const link = prepareExport();
      // This link stays inside the editor bar, outside the page-navigation blocker.
      link.click();
      status('下载入口已生成。若未弹出保存，请点下方“点击这里保存”，或显示源码后复制保存。');
    } catch (error) {
      exportSource = exportedHTML();
      q('.editor-download').hidden = true;
      q('.editor-source').value = exportSource;
      q('.editor-export').hidden = q('.editor-source-label').hidden = false;
      status('此环境未能启动下载。请复制下方完整源码，保存为 index.html。');
    }
  }
  async function saveAs() {
    if (!window.showSaveFilePicker) { download(); return; }
    try {
      const handle = await window.showSaveFilePicker({suggestedName:'index.html',types:[{description:'网页 HTML',accept:{'text/html':['.html']}}]});
      const writer = await handle.createWritable();
      await writer.write(exportedHTML());
      await writer.close();
      status('网页已写入你选择的文件。图片和文字样式已一并保存。');
    } catch (error) {
      if (error.name === 'AbortError') { status('已取消另存为，页面中的修改仍保留。'); return; }
      download();
    }
  }
  function selectImage(img) {
    clearImage(); activeImage = img; savedRange = null;
    img.classList.add('editor-selected-image');
    button('replace').disabled = button('remove').disabled = false;
    status('已选中图片。可替换、删除，或插入一张新图片。');
  }
  function upload(mode) { uploadMode = mode; q('.editor-file').value = ''; q('.editor-file').click(); }
  q('.editor-file').addEventListener('change', () => {
    const file = q('.editor-file').files[0];
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)) { status('请选择 PNG、JPEG、WebP 或 GIF 图片。'); return; }
    const selectedImage = activeImage;
    const mode = uploadMode;
    const insertionPoint = selectedImage?.closest('figure') || selectedImage || activeField?.closest('figure') || activeField?.closest('p,h1,h2,h3,h4,dt,dd,li');
    const reader = new FileReader();
    reader.onerror = () => status('图片读取失败，请重新选择文件。');
    reader.onload = () => {
      if (!editing) return;
      if (mode === 'replace' && selectedImage?.isConnected) {
        selectedImage.src = reader.result;
        selectedImage.alt = file.name.replace(/\.[^.]+$/, '');
        selectedImage.removeAttribute('srcset');
        if (selectedImage.id === 'portrait') {
          selectedImage.alt = 'Portrait of Lin He';
          const caption = selectedImage.closest('figure')?.querySelector('figcaption span');
          if (caption) caption.textContent = '';
        }
        selectImage(selectedImage);
      } else {
        const figure = document.createElement('figure');
        figure.className = 'user-image';
        const img = document.createElement('img');
        img.src = reader.result; img.alt = file.name.replace(/\.[^.]+$/, '');
        figure.append(img);
        const caption = document.createElement('figcaption'); caption.textContent = '点击编辑图片说明'; figure.append(caption);
        if (insertionPoint?.isConnected) insertionPoint.after(figure); else document.querySelector('main').append(figure);
        wrapText(); selectImage(img);
      }
      invalidateExport();
      status('图片已加入网页，下载时会一并保存。点击图片说明可修改文字。');
    };
    reader.readAsDataURL(file);
  });
  function removeImage() {
    if (!activeImage) return;
    const target = activeImage.closest('figure') || activeImage;
    target.remove(); clearImage(); invalidateExport();
    status('图片及所属图注已删除。取消修改可恢复。');
  }
  function editLink() {
    const link = activeField?.closest('a[href]'); if (!link) return;
    const value = window.prompt('修改链接地址（邮箱请用 mailto: 开头）',link.getAttribute('href'));
    if (value === null) return;
    const href = value.trim();
    if (!href || /[\u0000-\u0020]/.test(href) || (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^(https?:|mailto:)/i.test(href))) { status('请填写 http、https、mailto、页内锚点或相对文件地址。'); return; }
    link.setAttribute('href',href); invalidateExport(); status('链接地址已修改，下载网页后即可保存。');
  }
  bar.addEventListener('click', (event) => {
    const name = event.target.closest('[data-editor]')?.dataset.editor;
    if (name === 'start') begin(); if (name === 'cancel') cancel();
    if (name === 'download') download(); if (name === 'save-as') saveAs();
    if (name === 'link') editLink(); if (name === 'insert') upload('insert');
    if (name === 'replace') upload('replace'); if (name === 'remove') removeImage();
    if (name === 'source') { q('.editor-source-label').hidden = false; q('.editor-source').focus(); q('.editor-source').select(); status('源码已选中，按 ⌘C（Windows 用 Ctrl+C）复制，再保存为 index.html。'); }
  });
  // Do not cancel downloads or other editor controls, including synthetic clicks.
  document.addEventListener('click',(event) => {
    if (!editing || event.target.closest('.page-editor')) return;
    if (event.target.closest('a')) event.preventDefault();
    const img = event.target.closest('img'); if (img) { event.preventDefault(); selectImage(img); }
  },true);
  document.addEventListener('focusin',(event) => {
    if (!editing || !event.target.matches('[data-editor-field]')) return;
    savedRange = null; chooseField(event.target);
  });
  document.addEventListener('selectionchange',rememberSelection);
  sizeInput.addEventListener('change',() => { const value = Number(sizeInput.value); if (value >= 8 && value <= 96) format('fontSize',value+'px'); });
  weightInput.addEventListener('change',() => format('fontWeight',weightInput.value));
  document.addEventListener('input',(event) => { if (editing && event.target.closest('[data-editor-field]')) invalidateExport(); });
  document.addEventListener('keydown',(event) => {
    if (editing && event.target.closest('[data-editor-field]') && event.key==='Enter') { event.preventDefault(); event.target.blur(); }
  });
  document.addEventListener('paste',(event) => {
    if (!editing || !event.target.closest('[data-editor-field]')) return;
    event.preventDefault();
    const selection = window.getSelection(); if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0); if (!event.target.contains(range.commonAncestorContainer)) return;
    range.deleteContents(); const text = document.createTextNode(event.clipboardData.getData('text/plain').replace(/[\r\n]+/g,' '));
    range.insertNode(text); range.setStartAfter(text); range.collapse(true); selection.removeAllRanges(); selection.addRange(range); invalidateExport();
  });
})();
