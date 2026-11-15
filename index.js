const path = require('path');

module.exports = function themeWaypoint() {
  return {
    name: '@homotechsual/docusaurus-theme-waypoint',
    getThemePath() {
      return path.join(__dirname, 'lib', 'theme');
    },
    getTypeScriptThemePath() {
      return path.join(__dirname, 'theme');
    },
  };
};

module.exports.validateThemeConfig = function validateThemeConfig({validate, themeConfig}) {
  const {Joi} = require('@docusaurus/utils-validation');
  const schema = Joi.object({
    waypoint: Joi.object({
      // Docs with this front matter key set to true get the switch.
      frontMatterKey: Joi.string().default('waypoint'),
      // Which heading levels start a new step.
      headingLevels: Joi.array().items(Joi.number().valid(2, 3, 4, 5, 6)).min(1).default([2, 3]),
      // Prefix for the keys the theme writes to the reader's localStorage.
      storageNamespace: Joi.string().default('waypoint'),
      // Show the dismissible "new" callout to readers who haven't used the switch yet.
      showIntroHint: Joi.boolean().default(true),
      // The element(s) whose children are the guide's content: a CSS selector, a comma-separated list, or an array.
      articleSelector: Joi.alternatives(Joi.string(), Joi.array().items(Joi.string()).min(1)).default('.theme-doc-markdown'),
      // Wrapper elements to look inside, so headings in them still start steps.
      wrapperSelectors: Joi.array().items(Joi.string()).default([]),
    }).default({}),
  });
  return validate(schema, themeConfig);
};
