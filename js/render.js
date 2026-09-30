/* ==========================================================================
   Save Life — renderers
   Turns the demo data in data.js into markup. Each renderer only runs if its
   mount point exists on the page, so this file is safe to load everywhere.

   All interpolated values pass through escapeHtml() first.
   ========================================================================== */

(function () {
  "use strict";

  var $ = function (sel, scope) {
    return (scope || document).querySelector(sel);
  };

  /* ------------------------------------------------------------------------
     Blood-group chip
     ------------------------------------------------------------------------ */
  function groupChip(group, extraClass) {
    var family = "group group-" + groupFamily(group);
    return (
      '<span class="group-chip ' + family + (extraClass ? " " + extraClass : "") + '">' +
      escapeHtml(group) +
      "</span>"
    );
  }

  /* ------------------------------------------------------------------------
     Homepage: statistics band
     ------------------------------------------------------------------------ */
  function renderStats() {
    var mount = $("[data-stats-mount]");
    if (!mount) return;

    mount.innerHTML = readStats()
      .map(function (stat) {
        return (
          '<div class="stat">' +
          '<i class="stat__icon fas ' + escapeHtml(stat.icon) + '" aria-hidden="true"></i>' +
          '<dd class="stat__value text-numeric" data-count-to="' + stat.value + '">0</dd>' +
          '<dt class="stat__label">' + escapeHtml(stat.label) + "</dt>" +
          "</div>"
        );
      })
      .join("");

    // The markup above did not exist when app.js ran its initial counter pass,
    // so start the counters now that the elements are in the DOM.
    if (window.slInitCounters) window.slInitCounters();
  }

  /* ------------------------------------------------------------------------
     Homepage: donation camps
     ------------------------------------------------------------------------ */
  function renderCamps() {
    var mount = $("[data-camps-mount]");
    if (!mount) return;

    var camps = readCamps();

    mount.innerHTML = camps
      .map(function (camp) {
        var remaining = camp.capacity - camp.filled;
        var percent = Math.round((camp.filled / camp.capacity) * 100);
        var isFull = remaining <= 0;

        return (
          '<li class="camp">' +
          '<div class="camp__head">' +
          '<h3 class="camp__title">' + escapeHtml(camp.bank) + "</h3>" +
          (isFull
            ? '<span class="badge badge--success"><span class="badge__dot"></span>مكتمل</span>'
            : '<span class="badge badge--info"><span class="badge__dot"></span>مفتوح للتسجيل</span>') +
          "</div>" +
          '<ul class="camp__meta">' +
          '<li><i class="fas fa-calendar-alt" aria-hidden="true"></i>' + formatDate(camp.date) + "</li>" +
          '<li><i class="fas fa-clock" aria-hidden="true"></i>' + escapeHtml(camp.from) + " – " + escapeHtml(camp.to) + "</li>" +
          '<li><i class="fas fa-map-marker-alt" aria-hidden="true"></i>' + escapeHtml(camp.city) + " — " + escapeHtml(camp.venue) + "</li>" +
          "</ul>" +
          '<div class="camp__capacity">' +
          '<div class="camp__capacity-bar">' +
          '<span class="camp__capacity-fill" style="width:' + percent + '%"></span>' +
          "</div>" +
          '<p class="camp__capacity-text">' +
          camp.filled + " من " + camp.capacity + " مقعد" +
          (isFull ? "" : " — باقي " + remaining) +
          "</p>" +
          "</div>" +
          '<button class="btn btn--secondary btn--sm camp__cta" type="button" data-demo-only' +
          (isFull ? " disabled" : "") + ">" +
          (isFull ? "اكتمل العدد" : "سجّل في الحملة") +
          "</button>" +
          "</li>"
        );
      })
      .join("");

    bindDemoOnly(mount);
  }

  /* ------------------------------------------------------------------------
     Homepage: urgent request teaser
     ------------------------------------------------------------------------ */
  function requestCard(request, options) {
    var opts = options || {};
    var urgency = REQUEST_STATUS[request.urgency];
    var state = REQUEST_STATE[request.status];

    return (
      '<li class="request-card request-card--' + escapeHtml(request.urgency) + '">' +
      '<div class="request-card__top">' +
      groupChip(request.group) +
      '<span class="badge ' + urgency.badge + '">' +
      '<i class="fas ' + urgency.icon + '" aria-hidden="true"></i>' +
      escapeHtml(urgency.label) +
      "</span>" +
      (request.status === "fulfilled"
        ? '<span class="badge ' + state.badge + '">' + escapeHtml(state.label) + "</span>"
        : "") +
      "</div>" +
      '<h3 class="request-card__title">' + escapeHtml(request.hospital) + "</h3>" +
      '<ul class="request-card__meta">' +
      "<li><i class=\"fas fa-user\" aria-hidden=\"true\"></i>" + escapeHtml(request.patient) + "</li>" +
      "<li><i class=\"fas fa-map-marker-alt\" aria-hidden=\"true\"></i>" + escapeHtml(request.city) + "</li>" +
      '<li><i class="fas fa-tint" aria-hidden="true"></i>' + request.units + " وحدة مطلوبة</li>" +
      '<li><i class="far fa-clock" aria-hidden="true"></i>' + daysAgoLabel(request.daysAgo) + "</li>" +
      "</ul>" +
      '<p class="request-card__note">' + escapeHtml(request.note) + "</p>" +
      (opts.withAction === false
        ? ""
        : '<a class="btn btn--primary btn--sm request-card__cta" href="profile.html">أريد التبرع</a>') +
      "</li>"
    );
  }

  function renderUrgentTeaser() {
    var mount = $("[data-urgent-mount]");
    if (!mount) return;

    var open = readRequests().filter(function (r) {
      return r.status === "open";
    });

    var featured = open.slice(0, 3);
    var rest = open.slice(3);

    mount.innerHTML = featured
      .map(function (r) {
        return requestCard(r);
      })
      .join("");

    if (rest.length) {
      mount.insertAdjacentHTML(
        "afterend",
        '<div class="notice notice--info request-more">' +
        '<i class="icon fas fa-info-circle" aria-hidden="true"></i>' +
        "<p>هناك " + rest.length + " طلبًا آخر بانتظار التبرع. " +
        '<a href="bloodRequests.html">اعرض كل الطلبات</a>.</p>' +
        "</div>"
      );
    }

    bindDemoOnly(mount);
  }

  /* ------------------------------------------------------------------------
     Testimonials
     ------------------------------------------------------------------------ */
  var STORIES = [
    {
      name: "مها أحمد",
      place: "سيدي بشر، الإسكندرية",
      avatar: "img/testimonial/ed73b7dddcb502d5aa705306177105fc.jpg",
      text: "وصلني إشعار بطلب لفصيلتي في اليوم التالي مباشرة. تبرعت في نفس اليوم، وشعور جميل أن أحدهم ينتظر دمك فعلًا.",
    },
    {
      name: "دينا أحمد",
      place: "الابراهيمية، الإسكندرية",
      avatar: "img/testimonial/images (1).jpg",
      text: "اشتريت وجبة غداء لأمي بعد عملية جراحية، والتبرع كان في نفس اليوم. أنصح أي أحد قادر بالتبرع بدون تردد.",
    },
    {
      name: "محمد الشناوي",
      place: "الدقي، القاهرة",
      avatar: "img/testimonial/images.jpg",
      text: "أول مرة أتبرع، كان عندي خوف من الإبر. الموظفون شرحوا كل خطوة قبل البدء، وخرجت في نصف ساعة.",
    },
    {
      name: "نورهان عادل",
      place: "طنطا",
      avatar: "img/testimonial/m1_2426_bw-500x500.jpg",
      text: "أتبرع كل أربعة أشهر بشكل منتظم. صار جزءًا من روتيني الشهري، وأشعر أنني أفيد غيري فعلًا.",
    },
  ];

  function renderStories() {
    var mount = $("[data-stories-mount]");
    if (!mount) return;

    mount.innerHTML = STORIES.map(function (story) {
      return (
        '<li class="story">' +
        '<div class="story__avatar">' +
        '<img src="' + escapeHtml(story.avatar) + '" alt="" width="56" height="56" loading="lazy">' +
        "</div>" +
        '<blockquote class="story__quote">' +
        "<p>" + escapeHtml(story.text) + "</p>" +
        "</blockquote>" +
        '<div class="story__meta">' +
        '<p class="story__name">' + escapeHtml(story.name) + "</p>" +
        '<p class="story__place"><i class="fas fa-map-marker-alt" aria-hidden="true"></i>' +
        escapeHtml(story.place) + "</p>" +
        "</div>" +
        "</li>"
      );
    }).join("");
  }

  /* ------------------------------------------------------------------------
     Shared: mark prototype-only buttons as such
     ------------------------------------------------------------------------ */
  function bindDemoOnly(scope) {
    $all("[data-demo-only]", scope).forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        if (window.showToast) {
          window.showToast(
            "هذا نموذج واجهة أمامي — لا يوجد خادم لحفظ البيانات بعد.",
            "info"
          );
        }
      });
    });
  }

  function $all(sel, scope) {
    return Array.prototype.slice.call(
      (scope || document).querySelectorAll(sel)
    );
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    renderStats();
    renderCamps();
    renderUrgentTeaser();
    renderStories();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Exposed so list pages can reuse the request card markup.
  window.slRender = {
    groupChip: groupChip,
    requestCard: requestCard,
    bindDemoOnly: bindDemoOnly,
  };
})();