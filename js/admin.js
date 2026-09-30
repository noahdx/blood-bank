/* ==========================================================================
   Save Life — admin dashboard
   Renders the tables from js/data.js and wires the sidebar counters, KPI row,
   and the two search boxes. There is no backend, so nothing here mutates
   anything: the tables are read-only views over demo data.
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

  /* escapeHtml, readDonors, readRequests, readCamps, readBanks, groupChip,
     monthsAgoLabel, formatDate, REQUEST_STATUS and REQUEST_STATE are top-level
     declarations in js/data.js, so they are already in scope here. */

  function rowsFor(kind) {
    if (kind === "donors") {
      return readDonors().map(function (donor) {
        return {
          cells: [
            escapeHtml(donor.name),
            escapeHtml(donor.city),
            '<span class="text-numeric" dir="ltr">' + escapeHtml(donor.phone) + "</span>",
            slRender.groupChip(donor.group),
            '<span class="text-muted">' + escapeHtml(monthsAgoLabel(donor.lastDonationMonths)) + "</span>",
          ],
          search: [donor.name, donor.city, donor.group, donor.phone].join(" "),
        };
      });
    }

    if (kind === "requests") {
      return readRequests().map(function (request) {
        var state = REQUEST_STATE[request.status];
        var urgency = REQUEST_STATUS[request.urgency];

        return {
          cells: [
            escapeHtml(request.patient),
            escapeHtml(request.hospital),
            escapeHtml(request.city),
            slRender.groupChip(request.group),
            '<span class="text-numeric">' + window.slApp.formatNumber(request.units) + "</span>",
            '<span class="badge badge--' + urgency.badge + '">' +
              '<i class="fas fa-' + urgency.icon + '" aria-hidden="true"></i>' +
              escapeHtml(urgency.label) +
            "</span>",
            '<span class="badge badge--' + state.badge + '">' +
              '<span class="badge__dot"></span>' +
              escapeHtml(state.label) +
            "</span>",
          ],
          search: [request.patient, request.hospital, request.city, request.group].join(" "),
        };
      });
    }

    if (kind === "camps") {
      return readCamps().map(function (camp) {
        var remaining = camp.capacity - camp.filled;

        return {
          cells: [
            escapeHtml(camp.bank),
            escapeHtml(camp.city + " — " + camp.venue),
            '<span class="text-numeric">' + escapeHtml(formatDate(camp.date)) + "</span>",
            '<span class="text-numeric" dir="ltr">' +
              escapeHtml(camp.from + " – " + camp.to) + "</span>",
            '<span class="text-numeric">' + window.slApp.formatNumber(camp.filled) +
              " / " + window.slApp.formatNumber(camp.capacity) + "</span>" +
              '<span class="admin-row-note">باقي ' +
              window.slApp.formatNumber(remaining) + " مقعد</span>",
          ],
          search: [camp.bank, camp.city, camp.venue].join(" "),
        };
      });
    }

    return readBanks().map(function (bank) {
      return {
        cells: [
          escapeHtml(bank.name),
          escapeHtml(bank.city),
          '<span class="text-numeric" dir="ltr">' + escapeHtml(bank.phone) + "</span>",
        ],
        search: [bank.name, bank.city].join(" "),
      };
    });
  }

  function renderTable(kind, term) {
    var mount = $('[data-admin-table="' + kind + '"]');
    if (!mount) return;

    var query = (term || "").trim().toLowerCase();
    var rows = rowsFor(kind).filter(function (row) {
      if (!query) return true;
      return row.search.toLowerCase().indexOf(query) !== -1;
    });

    if (!rows.length) {
      var head = mount.closest("table").querySelector("thead tr");
      var columns = head ? head.children.length : 1;

      mount.innerHTML =
        '<tr><td colspan="' + columns + '" class="admin-empty">' +
        "لا توجد نتائج مطابقة للبحث." +
        "</td></tr>";
    } else {
      mount.innerHTML = rows
        .map(function (row) {
          return "<tr>" + row.cells.map(function (cell) {
            return "<td>" + cell + "</td>";
          }).join("") + "</tr>";
        })
        .join("");
    }

    var countNode = $('[data-admin-count="' + kind + '"]');
    if (countNode) {
      countNode.textContent = query
        ? "نتائج البحث: " + window.slApp.formatNumber(rows.length)
        : "إجمالي السجلات: " + window.slApp.formatNumber(rows.length);
    }
  }

  function initSearch(kind) {
    var input = $('[data-search="' + kind + '"]');
    if (!input) return;

    input.addEventListener("input", function () {
      renderTable(kind, input.value);
    });
  }

  function setCount(selector, value) {
    $$(selector).forEach(function (node) {
      node.textContent = window.slApp.formatNumber(value);
    });
  }

  function initCounts() {
    var donors = readDonors().length;
    var requests = readRequests();
    var open = requests.filter(function (request) {
      return request.status === "open";
    }).length;
    var camps = readCamps().length;
    var banks = readBanks().length;

    setCount('[data-count-for="donors"]', donors);
    setCount('[data-count-for="requests"]', requests.length);
    setCount('[data-count-for="camps"]', camps);
    setCount('[data-count-for="banks"]', banks);

    setCount('[data-kpi="donors"]', donors);
    setCount('[data-kpi="open"]', open);
    setCount('[data-kpi="camps"]', camps);
    setCount('[data-kpi="banks"]', banks);
  }

  /* ------------------------------------------------------------------------
     Sidebar: highlight the section currently in view
     ---------------------------------------------------------------------- */
  function initScrollSpy() {
    var links = $$(".admin-side__link");
    var sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || !sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          links.forEach(function (link) {
            var isCurrent = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", isCurrent);
            if (isCurrent) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  function init() {
    renderTable("donors");
    renderTable("requests");
    renderTable("camps");
    renderTable("banks");

    initSearch("donors");
    initSearch("requests");

    initCounts();
    initScrollSpy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();