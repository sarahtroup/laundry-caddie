// Laundry Caddie: mobile nav, service preselect, booking form.
(function () {
  "use strict";

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    // Close the menu when keyboard focus leaves the header, so the open
    // menu never covers the element that now has focus.
    var header = toggle.closest("header");
    header.addEventListener("focusout", function (e) {
      if (nav.classList.contains("open") && !header.contains(e.relatedTarget)) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  // Subscribe page: plan picker, summary and care-standards check
  var PLANS = { regular: { name: "Regular Bag", price: "$155" }, large: { name: "Large Bag", price: "$185" } };
  var params = new URLSearchParams(window.location.search);
  var subForm = document.getElementById("subscribe-form");
  if (subForm) {
    var wanted = params.get("plan");
    if (PLANS[wanted]) subForm.querySelector('input[value="' + wanted + '"]').checked = true;
    var sumPlan = document.getElementById("sum-plan");
    var sumPrice = document.getElementById("sum-price");
    var wfPlan = document.querySelector(".wf-plan strong");
    var wfPrice = document.querySelector(".wf-price");
    var syncPlan = function () {
      var p = PLANS[subForm.querySelector('input[name="plan"]:checked').value];
      sumPlan.textContent = p.name;
      sumPrice.textContent = p.price;
      if (wfPlan) wfPlan.textContent = p.name;
      if (wfPrice) wfPrice.firstChild.textContent = p.price + ".00 ";
    };
    subForm.addEventListener("change", syncPlan);
    syncPlan();

    var care = document.getElementById("care-ok");
    var subStatus = document.getElementById("sub-status");
    subForm.addEventListener("submit", function (e) {
      if (!care.checked) {
        e.preventDefault();
        care.setAttribute("aria-invalid", "true");
        subStatus.className = "form-status err";
        subStatus.textContent = "Please confirm you've read how we care for your laundry.";
        care.focus();
      }
      // TODO (launch): instead of submitting to thanks.html, send the visitor to the
      // Stripe Payment Link for the chosen plan, e.g.
      // window.location.href = STRIPE_LINKS[plan];
    });
    care.addEventListener("change", function () {
      if (care.checked) { care.removeAttribute("aria-invalid"); subStatus.textContent = ""; }
    });
  }

  // Checkout mockup page: reflect the chosen plan and carry it forward/back
  var simulate = document.getElementById("simulate-pay");
  if (simulate) {
    var key = PLANS[params.get("plan")] ? params.get("plan") : "large";
    var plan = PLANS[key];
    document.querySelector(".wf-plan strong").textContent = plan.name;
    document.querySelector(".wf-price").firstChild.textContent = plan.price + ".00 ";
    document.querySelectorAll(".sc-amount").forEach(function (el) { el.textContent = plan.price + ".00"; });
    document.querySelectorAll(".sc-plan-name").forEach(function (el) { el.textContent = plan.name; });
    var cap = document.querySelector(".wf-cap-plan");
    if (cap) cap.textContent = plan.name + ", " + plan.price;
    simulate.href = "thanks.html?plan=" + key;
    var back = document.getElementById("back-to-plan");
    if (back) back.href = "subscribe.html?plan=" + key;
  }

  // Thank-you page: show the plan name
  var thanksPlan = document.getElementById("thanks-plan");
  if (thanksPlan && PLANS[params.get("plan")]) thanksPlan.textContent = PLANS[params.get("plan")].name;

  // Buttons with data-service preselect the form's service dropdown
  var serviceSelect = document.getElementById("f-service");
  var thursday = document.getElementById("pickup-thursday");
  function syncPickupDays() {
    thursday.disabled = serviceSelect.value !== "Pay as You Go";
    if (thursday.disabled && thursday.checked) {
      thursday.form.querySelector('input[name="day"][value="Monday"]').checked = true;
    }
  }
  if (serviceSelect && thursday) {
    serviceSelect.addEventListener("change", syncPickupDays);
    window.addEventListener("pageshow", syncPickupDays);
    syncPickupDays();
  }
  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (serviceSelect) {
        serviceSelect.value = link.getAttribute("data-service");
        if (thursday) syncPickupDays();
      }
    });
  });

  // Booking form
  var form = document.getElementById("booking-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function setError(input, message) {
    var id = input.id + "-error";
    var existing = document.getElementById(id);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", id);
      if (!existing) {
        existing = document.createElement("p");
        existing.id = id;
        existing.className = "field-error";
        input.insertAdjacentElement("afterend", existing);
      }
      existing.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      if (existing) existing.remove();
    }
  }

  function validate() {
    var firstBad = null;
    form.querySelectorAll("[required]").forEach(function (input) {
      var msg = "";
      if (!input.value.trim()) msg = "Please fill in this field.";
      else if (input.type === "email" && !input.checkValidity()) msg = "Please enter a valid email address.";
      setError(input, msg);
      if (msg && !firstBad) firstBad = input;
    });
    return firstBad;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    var bad = validate();
    if (bad) {
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("err");
      bad.focus();
      return;
    }

    var data = new FormData(form);
    var endpoint = form.getAttribute("data-endpoint");

    if (endpoint) {
      // Formspree (or any endpoint that accepts form posts and returns JSON)
      status.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("Bad response");
          form.reset();
          status.textContent = "Thanks! We'll email you with a pickup time soon.";
          status.classList.add("ok");
        })
        .catch(function () {
          status.textContent = "Sorry, that didn't send. Please call 904-779-3136 or email us.";
          status.classList.add("err");
        });
      return;
    }

    // Fallback: open the visitor's email app with the request filled in
    var labels = { name: "Name", email: "Email", phone: "Phone", address: "Pickup address",
      neighborhood: "Neighborhood", service: "Service", day: "Preferred pickup day", notes: "Notes" };
    var lines = [];
    data.forEach(function (value, key) {
      if (String(value).trim()) lines.push((labels[key] || key) + ": " + value);
    });
    var subject = "Pickup request: " + (data.get("service") || "Laundry Caddie");
    window.location.href = "mailto:" + form.getAttribute("data-mailto") +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
    status.textContent = "Your email app should open with your request filled in. Just press send.";
    status.classList.add("ok");
  });

  form.addEventListener("input", function (e) {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) setError(e.target, "");
  });
})();
