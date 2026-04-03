export function bindImportExport(ctx) {
  const { elements: els, state } = ctx;

  els.exportBtn.addEventListener('click', () => {
    ctx.storage.downloadProgress(state.progress);
  });

  els.importFileInput.addEventListener('change', async e => {
    try {
      const imported = await ctx.storage.readImportedProgress(e.target.files[0]);
      state.progress = imported;
      state.audioEnabled = state.progress.audioEnabled !== false;
      ctx.storage.saveProgress(state.progress);
      ctx.controller.renderAll();
      alert('Progress imported successfully.');
    } catch (err) {
      alert(err.message || 'Import failed.');
    } finally {
      e.target.value = '';
    }
  });
}
