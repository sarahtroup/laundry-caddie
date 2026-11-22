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
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        closeNav();
        toggle.focus();
      }
    });
  }

  // Buttons with data-service preselect the form's service dropdown
  var serviceSelect = document.getElementById("f-service");
  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      if (serviceSelect) serviceSelect.value = link.getAttribute("data-service");
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
