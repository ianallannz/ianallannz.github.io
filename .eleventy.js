

module.exports = function (eleventyConfig) {
  const markdownIt = require("markdown-it");
  const markdownItAnchor = require("markdown-it-anchor");
  const { DateTime } = require("luxon");

  const md = markdownIt({ html: true, linkify: true })
    .use(markdownItAnchor, { permalink: true, permalinkClass: "direct-link", permalinkSymbol: "#" });

  // make a Nunjucks filter to render Markdown
  eleventyConfig.addNunjucksFilter("markdown", function (value) {
    return md.render(String(value || ""));
  });

  eleventyConfig.setLibrary("md", md);

  // Set fixed blog number counts to posts
  eleventyConfig.addCollection("blogWithNumbers", function (collectionApi) {
    return collectionApi.getFilteredByTag("blog").map((item, index) => {
      item.data.postNumber = index + 1;
      return item;
    });
  });

  // Get pinned post
  eleventyConfig.addCollection("pinnedPost", function (collectionApi) {
    return collectionApi.getFilteredByTag("blog").find(post => post.data.pinned);
  });

  // Build tag list without blog
eleventyConfig.addCollection("tagList", function (collectionApi) {
  const tagMap = new Map();

  collectionApi.getAll().forEach(item => {
    let tags = item.data.tags;
    if (Array.isArray(tags)) {
      tags.forEach(tag => {
        if (!["blog"].includes(tag)) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        }
      });
    }
  });

  // Convert to array and sort by post count descending
  return [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1]) // sort by count
    .map(entry => entry[0]);     // return just the tag names
});



  // Date filter

  eleventyConfig.addFilter("date", (dateObj, format = "dd LLLL yyyy") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });


  // Copy static assets
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // Default layout settings
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};