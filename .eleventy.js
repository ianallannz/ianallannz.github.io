// .eleventy.js
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { DateTime } from "luxon";
import slugify from "slugify";

export default function(eleventyConfig) {
  const md = markdownIt({ html: true, linkify: true })
    .use(markdownItAnchor, { permalink: true, permalinkClass: "direct-link", permalinkSymbol: "#" });

  // Markdown filter
  eleventyConfig.addNunjucksFilter("markdown", value => md.render(String(value || "")));
  eleventyConfig.setLibrary("md", md);

  // Slug filter
  eleventyConfig.addFilter("slug", input => slugify(input, { lower: true, strict: true }));

  // Blog collections
  eleventyConfig.addCollection("blogWithNumbers", collectionApi =>
    collectionApi.getFilteredByTag("blog").map((item, index) => {
      item.data.postNumber = index + 1;
      return item;
    })
  );

  eleventyConfig.addCollection("pinnedPost", collectionApi =>
    collectionApi.getFilteredByTag("blog").find(post => post.data.pinned)
  );

  eleventyConfig.addCollection("tagList", collectionApi => {
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
    return [...tagMap.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
  });

  eleventyConfig.addCollection("relatedPostMap", collectionApi => {
    const posts = collectionApi.getFilteredByTag("blog");
    const map = new Map();
    posts.forEach(post => {
      const thisTags = Array.isArray(post.data.tags) ? post.data.tags : [post.data.tags];
      const filteredThisTags = thisTags.filter(tag => tag !== "blog");

      const related = posts
        .filter(other => other.url !== post.url)
        .map(other => {
          const otherTags = Array.isArray(other.data.tags) ? other.data.tags : [other.data.tags];
          const filteredOtherTags = otherTags.filter(tag => tag !== "blog");
          const shared = filteredThisTags.filter(tag => filteredOtherTags.includes(tag));
          return { post: other, score: shared.length };
        })
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(entry => entry.post);

      map.set(post.url, related);
    });
    return map;
  });

  // Date filter
  eleventyConfig.addFilter("date", (dateObj, format = "dd LLLL yyyy") =>
    DateTime.fromJSDate(dateObj).toFormat(format)
  );


  // Passthrough copies
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

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
}
