/* Only sizing/status is sent to the parent; never form values or personal data. */
(() => {
  let previous = '';
  function report() {
    const data = {
      type: 'stacja:signup-size',
      height: Math.ceil(document.body.getBoundingClientRect().height + 24),
      ready: Boolean(document.querySelector('.activenow-form, .activenow-table-container table, .activenow-table-container form, .activenow-table-container .activenow-signup-table-step')),
    };
    const signature = JSON.stringify(data);
    if (signature !== previous) {
      parent.postMessage(data, location.origin);
      previous = signature;
    }
  }
  new ResizeObserver(report).observe(document.body);
  new MutationObserver(report).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', report);
  report();
})();
