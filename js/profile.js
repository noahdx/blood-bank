/* ==========================================================================
   Save Life — profile page behaviour
   Progressive enhancement for the ARIA tab pattern (arrow-key navigation,
   Home/End) plus the donor's own request list.
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
     Tabs
     ----------------------------------------------------------------------
     Follows the APG pattern: arrow keys move between tabs, Home/End jump to
     the first and last, and only the active tab is in the tab order.
     ---------------------------------------------------------------------- */
  function initTabs(root) {
    var tabs = $$('[role="tab"]', root);
    if (!tabs.length) return;

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var panel = document.getElementById(tab.getAttribute("aria-controls"));
        var isActive = i === index;

        tab.setAttribute("aria-selected", isActive ? "true" : "false");
        tab.tabIndex = isActive ? 0 : -1;

        if (panel) panel.hidden = !isActive;
      });

      if (moveFocus) tabs[index].focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        select(index, false);
      });

      tab.addEventListener("keydown", function (event) {
        var next = null;

        switch (event.key) {
          case "ArrowRight":
          case "ArrowDown":
            next = (index + 1) % tabs.length;
            break;
          case "ArrowLeft":
          case "ArrowUp":
            next = (index - 1 + tabs.length) % tabs.length;
            break;
          case "Home":
            next = 0;
            break;
          case "End":
            next = tabs.length - 1;
            break;
          default:
            return;
        }

        event.preventDefault();
        select(next, true);
      });
    });
  }

  /* ------------------------------------------------------------------------
     The signed-in donor's requests
     ----------------------------------------------------------------------
     There is no backend and no account, so there is nothing genuinely "mine"
     to show. Rather than pass off a stranger's request as the visitor's, the
     panel shows its empty state. A real implementation replaces this one
     function with a fetch and the same card markup.
     ---------------------------------------------------------------------- */
  function initMyRequests() {
    var emptyState = $("[data-request-empty]");
    if (!emptyState) return;

    emptyState.classList.add("is-visible");
  }

  function init() {
    var tabs = $("[data-tabs]");
    if (tabs) initTabs(tabs);

    initMyRequests();

    // js/app.js renders nothing here, so the stat counters still need a nudge
    // once the markup above is in place.
    if (window.slInitCounters) window.slInitCounters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();