// Google analytics
(function () {
  const ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-118908766-3';
  const gb = document.createElement('script');
  gb.type = 'text/javascript';
  gb.innerHTML =
    "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-118908766-3');";
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
  s.parentNode.insertBefore(gb, s);
})();
