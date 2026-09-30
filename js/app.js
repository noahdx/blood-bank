/* ==========================================================================
   Save Life — shared behaviour
   Vanilla JS, no jQuery dependency. Each module bails out early if its mount
   point is absent, so every page can load this single file.

   Every animation is driven by IntersectionObserver rather than scroll
   handlers, and all of them respect prefers-reduced-motion.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(selector)
    );
  }

  /** Arabic-aware number formatting with thousands separators. */
  var numberFormat = new Intl.NumberFormat("ar-EG");

  function formatNumber(value) {
    return numberFormat.format(value);
  }

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */
  function initNav() {
    var toggle = $(".site-nav__toggle");
    var panel = $(".site-nav__panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        open ? "إغلاق قائمة التنقل" : "فتح قائمة التنقل"
      );
    });

    // Close the panel when a link inside it is followed.
    $all("a", panel).forEach(function (link) {
      link.addEventListener("click", function () {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close on Escape.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        panel.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Scroll reveal
     Content is visible unless <html> has .js-reveal-ready, so a JS failure
     can never leave the page blank.
     ------------------------------------------------------------------------ */
  function initReveal() {
    var items = $all(".reveal");
    if (!items.length) return;

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    document.documentElement.classList.add("js-reveal-ready");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Animated statistics
     Replaces index.js's four permanent setInterval timers with a single
     observer that starts counting when the band scrolls into view.
     ------------------------------------------------------------------------ */
  function initCounters() {
    var counters = $all("[data-count-to]");
    if (!counters.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
      var duration = reduceMotion.matches ? 0 : 1400;
      var start = null;

      function frame(timestamp) {
        if (start === null) start = timestamp;
        var progress = duration === 0 ? 1 : Math.min((timestamp - start) / duration, 1);
        // easeOutCubic keeps the number from racing to the end.
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatNumber(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(run);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Back to top
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    var button = $(".back-to-top");
    if (!button) return;

    var threshold = 400;
    var ticking = false;

    function update() {
      button.classList.toggle(
        "is-visible",
        window.pageYOffset > threshold
      );
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    });

    update();
  }

  /* ------------------------------------------------------------------------
     Toasts
     Used for feedback that genuinely happens in the page (filter reset,
     demo-only form submission). Never used to pretend a server responded.
     ------------------------------------------------------------------------ */
  function initToasts() {
    var region = $(".toast-region");

    function toast(message, variant) {
      if (!region) return;

      var icons = {
        success: "fa-check-circle",
        danger: "fa-exclamation-triangle",
        info: "fa-info-circle",
      };
      var icon = icons[variant || "info"] || icons.info;

      var el = document.createElement("div");
      el.className = "toast toast--" + (variant || "info");
      el.setAttribute("role", "status");
      el.innerHTML =
        '<i class="icon fas ' + icon + '" aria-hidden="true"></i>' +
        "<p></p>";
      el.querySelector("p").textContent = message;
      region.appendChild(el);

      window.setTimeout(function () {
        el.style.opacity = "0";
        window.setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 200);
      }, 4200);
    }

    window.showToast = toast;
  }

  /* ------------------------------------------------------------------------
     Form validation
     Honest, dependency-free, accessible. Errors explain what went wrong and
     how to fix it, and are wired to the input via aria-describedby.
     ------------------------------------------------------------------------ */
  var VALIDATORS = {
    required: function (value) {
      return value.trim().length > 0 ? "" : "هذا الحقل مطلوب.";
    },
    email: function (value) {
      if (!value.trim()) return "";
      // Deliberately permissive: enough to catch typos, not to police valid
      // but unusual addresses.
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? ""
        : "أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.";
    },
    tel: function (value) {
      if (!value.trim()) return "";
      var digits = value.replace(/[^\d]/g, "");
      return digits.length >= 10 && digits.length <= 15
        ? ""
        : "أدخل رقم هاتف صحيحًا (10 أرقام على الأقل).";
    },
    password: function (value) {
      if (!value) return "";
      return value.length >= 8
        ? ""
        : "كلمة المرور يجب ألا تقل عن 8 أحرف.";
    },
  };

  function fieldOf(input) {
    return input.closest(".field") || input.parentNode;
  }

  function errorNodeOf(input) {
    var field = fieldOf(input);
    return field ? field.querySelector(".field__error") : null;
  }

  /**
   * Point aria-describedby at the hint and the error together, so a screen
   * reader reads the error message in context rather than replacing the hint.
   */
  function linkDescriptions(input) {
    var field = fieldOf(input);
    if (!field) return;

    var ids = [];
    var hint = field.querySelector(".field__hint");
    var error = field.querySelector(".field__error");

    if (hint && hint.id) ids.push(hint.id);
    if (error && error.id) ids.push(error.id);

    if (ids.length) input.setAttribute("aria-describedby", ids.join(" "));
    else input.removeAttribute("aria-describedby");
  }

  function showError(input, message) {
    var field = fieldOf(input);
    if (!field) return;

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    input.setAttribute("aria-invalid", "true");

    var node = field.querySelector(".field__error");
    if (!node) {
      node = document.createElement("p");
      node.className = "field__error";
      field.appendChild(node);

      // The error node needs a stable id before it can be referenced.
      if (!node.id) node.id = input.id ? input.id + "-error" : "field-error-" + Math.random().toString(36).slice(2, 8);
    }
    node.textContent = message;

    linkDescriptions(input);
  }

  function clearError(input) {
    var field = fieldOf(input);
    if (!field) return;

    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");

    var node = field.querySelector(".field__error");
    if (node) node.remove();

    linkDescriptions(input);
  }

  /** Validate one field. Returns true when it passes. */
  function validateField(input) {
    if (input.disabled || input.type === "hidden") return true;

    // A required checkbox is satisfied by being checked, not by holding a value.
    if (input.type === "checkbox") {
      if (input.required && !input.checked) {
        showError(input, VALIDATORS.required(""));
        return false;
      }
      clearError(input);
      return true;
    }

    var value = input.value;
    var message = "";

    if (input.required) {
      message = VALIDATORS.required(value);
    }
    if (!message && value.trim()) {
      if (input.dataset.validate) {
        var custom = VALIDATORS[input.dataset.validate];
        if (custom) message = custom(value);
      }
      if (!message && input.type === "email") {
        message = VALIDATORS.email(value);
      }
      // Honour the HTML pattern attribute so author-written constraints
      // (national ID length, phone shape) are enforced here too.
      if (!message && input.getAttribute("pattern")) {
        var pattern = new RegExp("^(?:" + input.getAttribute("pattern") + ")$");
        if (!pattern.test(value)) message = "قيمة الحقل غير مطابقة للصيغة المطلوبة.";
      }
    }

    if (message) {
      showError(input, message);
      return false;
    }

    clearError(input);
    if (value.trim()) input.classList.add("is-valid");
    return true;
  }

  /**
   * Wire up a form.
   * onValidSubmit is only called when every field passes. Because this site has
   * no backend, that callback is responsible for being honest with the user.
   */
  function attachValidation(form, onValidSubmit) {
    if (!form) return;

    var fields = $all("input, select, textarea", form).filter(function (el) {
      return el.type !== "hidden" && !el.disabled;
    });

    // Validate on blur, then live once a field has been marked invalid.
    fields.forEach(function (input) {
      input.addEventListener("blur", function () {
        validateField(input);
      });
      input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid")) validateField(input);
      });
      if (input.tagName === "SELECT" || input.type === "checkbox") {
        input.addEventListener("change", function () {
          validateField(input);
        });
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (input) {
        if (!validateField(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (window.showToast) {
          window.showToast("راجع الحقول المميزة بالأحمر قبل الإرسال.", "danger");
        }
        return;
      }

      if (onValidSubmit) onValidSubmit(form);
    });
  }

  window.slValidation = { attach: attachValidation, validate: validateField };

  /* ------------------------------------------------------------------------
     Newsletter (footer)
     ------------------------------------------------------------------------ */
  function initNewsletter() {
    var forms = $all("[data-newsletter]");

    forms.forEach(function (form) {
      var input = $("input[type=email]", form);
      // The status line may sit inside the form or right after it, so look in
      // the form first and then in its parent.
      var status =
        $("[data-newsletter-status]", form) ||
        $("[data-newsletter-status]", form.parentNode);
      var button = $("button[type=submit]", form);

      attachValidation(form, function () {
        // No backend exists. Say so rather than showing a fake success state.
        if (button) {
          button.disabled = true;
          button.textContent = "جارٍ الإرسال…";
        }
        window.setTimeout(function () {
          if (button) {
            button.disabled = false;
            button.textContent = "اشترك";
          }
          if (status) {
            status.textContent =
              "هذا نموذج تجريبي — لا يوجد خادم إرسال رسائل بريدية في الموقع بعد.";
          }
          if (window.showToast) {
            window.showToast(
              "هذا نموذج تجريبي، لم يتم إرسال أي بريد.",
              "info"
            );
          }
          form.reset();
        }, 600);
      });
    });
  }

  /* ------------------------------------------------------------------------
     Confirmation dialog for destructive actions
     ---------------------------------------------------------------------- */
  function initConfirmations() {
    document.addEventListener("submit", function (event) {
      var form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.dataset.confirm === undefined) return;

      var message =
        form.dataset.confirm ||
        "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.";

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (form.dataset.confirmed === "true") return;

      // This prototype has nothing to delete, so prevent the default and be
      // explicit about what actually happened.
      event.preventDefault();
      form.dataset.confirmed = "true";
      if (window.showToast) {
        window.showToast(
          "هذا نموذج تجريبي — لا توجد بيانات فعلية يتم حذفها.",
          "info"
        );
      }
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    initNav();
    initReveal();
    initCounters();
    initBackToTop();
    initToasts();
    initNewsletter();
    initConfirmations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed so page-level renderers can start their own counters.
  window.slApp = { $: $, $all: $all, formatNumber: formatNumber };
  window.slInitCounters = initCounters;
})();