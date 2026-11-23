// Supply test URLs only. Production entry points are on index.html.
(function () {
  "use strict";

  const checkoutLinks = {
    "regular-checkout": "",
    "xl-checkout": ""
  };
  const microsoftFormsEmbedUrl = "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=kU0cOMrbAkasBdUZeNcOgHcLdQAlCHpGpGMbhHqOC01UOElTOTJSUzM5WVFFNllNS1Y5Q0ZESzFITC4u&embed=true";
  const formUrl = /^https:\/\/forms\.(?:office\.com|cloud\.microsoft)\/Pages\/ResponsePage\.aspx\?/i.test(microsoftFormsEmbedUrl)
    ? new URL(microsoftFormsEmbedUrl)
    : null;

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

  if (formUrl?.searchParams.get("id") && formUrl.searchParams.get("embed") === "true") {
    const formLink = document.getElementById("form-link");
    const frame = document.getElementById("intake-form");
    frame.src = formUrl.href;
    formUrl.searchParams.delete("embed");
    formLink.href = formUrl.href;
    formLink.hidden = false;
    frame.hidden = false;
    document.getElementById("form-pending").hidden = true;
  }
})();
