module.exports = function(eleventyConfig) {
    const markdownIt = require("markdown-it");
    const markdownItAnchor = require("markdown-it-anchor");

    const md = markdownIt({ html: true, linkify: true })
      .use(markdownItAnchor, { permalink: true, permalinkClass: "direct-link", permalinkSymbol: "#" });

    // make a Nunjucks filter to render Markdown
    eleventyConfig.addNunjucksFilter("markdown", function(value) {
      return md.render(String(value || ""));
    });

    eleventyConfig.setLibrary("md", md);

    // Copy static assets
    eleventyConfig.addPassthroughCopy({"src/images": "images"});
    eleventyConfig.addPassthroughCopy({"src/css": "css"});
    eleventyConfig.addPassthroughCopy({"src/js": "js"});

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