(function () {
  if (!window.siteConfig || !window.siteConfig.links) return;

  var links = window.siteConfig.links;
  var inProjectsDir = window.location.pathname.indexOf('/projects/') !== -1;
  var rootPrefix = inProjectsDir ? '..' : '.';

  var withPrefix = function (path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path) || path.indexOf('//') === 0) {
      return path;
    }
    return (rootPrefix + '/' + path).replace(/\/+/g, '/');
  };

  var linkMap = {
    'home': links.home,
    'projects.one': links.projects && links.projects.one,
    'projects.two': links.projects && links.projects.two,
    'projects.three': links.projects && links.projects.three,
    'socials.linkedin': links.socials && links.socials.linkedin,
    'socials.x': links.socials && links.socials.x,
    'socials.instagram': links.socials && links.socials.instagram,
  };

  var anchors = document.querySelectorAll('[data-config-link]');
  anchors.forEach(function (anchor) {
    var key = anchor.getAttribute('data-config-link');
    var path = linkMap[key];
    if (path) {
      anchor.setAttribute('href', withPrefix(path));
      if (key.indexOf('socials.') === 0) {
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('rel', 'noreferrer noopener');
      }
    }
  });
})();
