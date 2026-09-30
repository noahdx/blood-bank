/* ==========================================================================
   Save Life — listings page behaviour
   Powers the donor list (volunteers.html) and the request list
   (bloodRequests.html). The filters actually filter: they were previously
   decorative controls wired to nothing.
   ========================================================================== */

(function () {
  "use strict";

  var $ = function (sel, scope) {
    return (scope || document).querySelector(sel);
  };
  var $$ = function (sel, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(sel)
    );
  };

  /* ------------------------------------------------------------------------
     Filter chip markup
     ------------------------------------------------------------------------ */
  function groupChoices(name, values, opts) {
    var options = opts || {};

    var items = [
      '<span class="choice">' +
        '<input type="radio" name="' + name + '" value="" id="' + name + '-all" checked>' +
        '<label class="choice__box" for="' + name + '-all">الكل</label>' +
      "</span>",
    ];

    values.forEach(function (value, index) {
      var id = name + "-" + index;
      var family = "group-" + groupFamily(value);
      items.push(
        '<span class="choice ' + family + '">' +
          '<input type="radio" name="' + name + '" value="' + escapeHtml(value) + '" id="' + id + '">' +
          '<label class="choice__box" for="' + id + '">' + escapeHtml(value) + "</label>" +
        "</span>"
      );
    });

    return items.join("");
  }

  function cityChoices(name, values) {
    var items = [
      '<span class="choice">' +
        '<input type="checkbox" name="' + name + '" value="" id="' + name + '-all" checked>' +
        '<label class="choice__box" for="' + name + '-all">الكل</label>' +
      "</span>",
    ];

    values.forEach(function (value, index) {
      var id = name + "-" + index;
      items.push(
        '<span class="choice">' +
          '<input type="checkbox" name="' + name + '" value="' + escapeHtml(value) + '" id="' + id + '">' +
          '<label class="choice__box" for="' + id + '">' + escapeHtml(value) + "</label>" +
        "</span>"
      );
    });

    return items.join("");
  }

  /* ------------------------------------------------------------------------
     Read the current filter state from the form
     ------------------------------------------------------------------------ */
  function readState(form) {
    var group = form.querySelector('input[name="group"]:checked');
    var cities = $$('input[name="city"]:checked', form).map(function (el) {
      return el.value;
    });
    var eligible = form.querySelector('input[name="eligible"]:checked');

    return {
      group: group ? group.value : "",
      cities: cities.filter(Boolean),
      onlyEligible: Boolean(eligible && eligible.checked),
    };
  }

  /* ------------------------------------------------------------------------
     Donors page
     ------------------------------------------------------------------------ */
  function initDonors() {
    var listMount = $("[data-donor-list]");
    if (!listMount) return;

    var form = $("[data-filters]");
    var emptyState = $("[data-donor-empty]");
    var countNode = $("[data-result-count]");

    var groupMount = $("[data-group-options]");
    if (groupMount) groupMount.innerHTML = groupChoices("group", BLOOD_GROUPS);

    var cityMount = $("[data-city-options]");
    if (cityMount) cityMount.innerHTML = cityChoices("city", CITIES);

    var allDonors = readDonors();

    function matches(donor, state) {
      if (state.group && donor.group !== state.group) return false;
      if (state.cities.length && state.cities.indexOf(donor.city) === -1) return false;
      if (state.onlyEligible && !isEligible(donor)) return false;
      return true;
    }

    function donorCard(donor) {
      var eligible = isEligible(donor);

      return (
        '<li class="donor">' +
        '<div class="donor__top">' +
        '<div>' +
        '<h3 class="donor__name">' +
        '<a href="profile.html">' + escapeHtml(donor.name) + "</a>" +
        "</h3>" +
        '<p class="donor__area">' + escapeHtml(donor.city) + " — " + escapeHtml(donor.area) + "</p>" +
        "</div>" +
        slRender.groupChip(donor.group) +
        "</div>" +
        '<ul class="donor__facts">' +
        '<li><i class="far fa-clock" aria-hidden="true"></i>آخر تبرع: ' +
        monthsAgoLabel(donor.lastDonationMonths) + "</li>" +
        "</ul>" +
        '<div class="donor__status">' +
        (eligible
          ? '<span class="badge badge--success"><span class="badge__dot"></span>متاح للتبرع</span>'
          : '<span class="badge badge--neutral"><span class="badge__dot"></span>غير متاح مؤقتًا</span>') +
        "</div>" +
        '<a class="btn btn--secondary btn--sm donor__cta" href="profile.html">عرض الملف</a>' +
        "</li>"
      );
    }

    function render() {
      var state = readState(form);
      var results = allDonors.filter(function (donor) {
        return matches(donor, state);
      });

      listMount.innerHTML = results.map(donorCard).join("");

      if (emptyState) {
        emptyState.classList.toggle("is-visible", results.length === 0);
      }

      if (countNode) {
        countNode.textContent = results.length
          ? "عدد النتائج: " + window.slApp.formatNumber(results.length) + " من " +
            window.slApp.formatNumber(allDonors.length)
          : "لا توجد نتائج";
      }
    }

    if (form) {
      form.addEventListener("change", render);
    }

    $$("[data-reset-filters]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (!form) return;
        form.reset();
        render();
        if (window.showToast) {
          window.showToast("تمت إعادة تعيين الفلاتر.", "info");
        }
      });
    });

    render();
  }

  /* ------------------------------------------------------------------------
     Requests page
     ------------------------------------------------------------------------ */
  function initRequests() {
    var listMount = $("[data-request-list]");
    if (!listMount) return;

    var form = $("[data-filters]");
    var emptyState = $("[data-request-empty]");
    var countNode = $("[data-result-count]");

    var groupMount = $("[data-group-options]");
    if (groupMount) groupMount.innerHTML = groupChoices("group", BLOOD_GROUPS);

    var citySelect = $("[data-city-select]");
    if (citySelect) {
      citySelect.innerHTML =
        '<option value="">كل المدن</option>' +
        CITIES.map(function (city) {
          return '<option value="' + escapeHtml(city) + '">' + escapeHtml(city) + "</option>";
        }).join("");
    }

    var statusMount = $("[data-status-options]");
    if (statusMount) {
      statusMount.innerHTML = Object.keys(REQUEST_STATE)
        .map(function (key, index) {
          var meta = REQUEST_STATE[key];
          return (
            '<span class="choice">' +
            '<input type="checkbox" name="status" value="' + key + '" id="status-' + index + '">' +
            '<label class="choice__box" for="status-' + index + '">' +
            escapeHtml(meta.label) + "</label>" +
            "</span>"
          );
        })
        .join("");
    }

    var allRequests = readRequests();

    function readRequestState() {
      var group = form.querySelector('input[name="group"]:checked');
      var city = citySelect ? citySelect.value : "";
      var statuses = $$('input[name="status"]:checked', form).map(function (el) {
        return el.value;
      });

      return {
        group: group ? group.value : "",
        city: city,
        statuses: statuses,
      };
    }

    function render() {
      var state = readRequestState();
      var results = allRequests.filter(function (request) {
        if (state.group && request.group !== state.group) return false;
        if (state.city && request.city !== state.city) return false;
        if (state.statuses.length && state.statuses.indexOf(request.status) === -1) {
          return false;
        }
        return true;
      });

      listMount.innerHTML = results
        .map(function (request) {
          return slRender.requestCard(request);
        })
        .join("");

      if (emptyState) {
        emptyState.classList.toggle("is-visible", results.length === 0);
      }

      if (countNode) {
        countNode.textContent = results.length
          ? "عدد النتائج: " + window.slApp.formatNumber(results.length) + " من " +
            window.slApp.formatNumber(allRequests.length)
          : "لا توجد نتائج";
      }
    }

    if (form) form.addEventListener("change", render);
    if (citySelect) citySelect.addEventListener("change", render);

    $$("[data-reset-filters]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (form) form.reset();
        if (citySelect) citySelect.value = "";
        render();
        if (window.showToast) {
          window.showToast("تمت إعادة تعيين الفلاتر.", "info");
        }
      });
    });

    render();
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    initDonors();
    initRequests();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();