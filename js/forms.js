/* ==========================================================================
   Save Life — form page behaviour
   Populates <select> options from js/data.js and hands the registration form
   to the shared validator in js/app.js. Nothing is submitted anywhere: this is
   a front-end prototype with no backend.
   ========================================================================== */

(function () {
  "use strict";

  var $ = function (sel, scope) {
    return (scope || document).querySelector(sel);
  };

  // escapeHtml, BLOOD_GROUPS and CITIES are top-level declarations in
  // js/data.js, so they are already in scope here.
  function fillSelect(select, values, firstLabel) {
    if (!select) return;

    var html = '<option value="">' + firstLabel + "</option>";

    html += values
      .map(function (value) {
        var safe = escapeHtml(value);
        return '<option value="' + safe + '">' + safe + "</option>";
      })
      .join("");

    select.innerHTML = html;
  }

  /* ------------------------------------------------------------------------
     Registration form
     ----------------------------------------------------------------------
     js/app.js already knows how to validate; this page only supplies the
     selects and the honest "there is no backend" outcome. Reaching for
     slValidation directly keeps the submit rules in one place instead of
     adding a second submit listener that would race with the validator.
     ---------------------------------------------------------------------- */
  function initRegistration() {
    var form = $("[data-validate]");
    if (!form || !window.slValidation) return;

    var button = $("button[type=submit]", form);
    var originalLabel = button ? button.innerHTML : "";

    window.slValidation.attach(form, function () {
      if (button) {
        button.disabled = true;
        button.textContent = "جارٍ التحقّق…";
      }

      window.setTimeout(function () {
        if (button) {
          button.disabled = false;
          button.innerHTML = originalLabel;
        }

        if (window.showToast) {
          window.showToast(
            "تم التحقّق من البيانات. هذا نموذج تجريبي — لم يتم إرسال أو حفظ أي شيء.",
            "info"
          );
        }

        form.reset();

        // Clear the validation styling so the form does not look half-submitted.
        form.querySelectorAll(".is-invalid, .is-valid").forEach(function (field) {
          field.classList.remove("is-invalid", "is-valid");
        });
        form.querySelectorAll(".field__error").forEach(function (node) {
          node.remove();
        });
      }, 600);
    });
  }

  function init() {
    fillSelect($("#blood-group"), BLOOD_GROUPS, "اختر الفصيلة");
    fillSelect($("#city"), CITIES, "اختر المدينة");
    initRegistration();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();