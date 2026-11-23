// Supply test URLs only. Production entry points are on index.html.
(function () {
  "use strict";

  const checkoutLinks = {
    "regular-checkout": "",
    "xl-checkout": ""
  };
  const formUrl = "".replace(/\\?embedded=true$/, "");

  const plans = Object.entries(checkoutLinks);
  const isTestCheckout = (url) => /^https:\/\/buy\.stripe\.com\/test_[A-Za-z0-9]+$/.test(url);
  if (plans.every(([, url]) => isTestCheckout(url))) {
    for (const [id, url] of plans) {
      const link = document.getElementById(id);
      link.href = url;
      link.hidden = false;
      link.style.removeProperty("display");
    }
    document.getElementById("stripe-status").hidden = true;
  }

  if (/^https:\/\/docs\.google\.com\/forms\/d\/e\/[A-Za-z0-9_-]+\/viewform$/.test(formUrl)) {
    const formLink = document.getElementById("form-link");
    const frame = document.getElementById("intake-form");
    formLink.href = formUrl;
    formLink.hidden = false;
    frame.src = formUrl + "?embedded=true";
    frame.hidden = false;
    document.getElementById("form-pending").hidden = true;
  }
})();
