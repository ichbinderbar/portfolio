const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  // RSS Feed plugin
  eleventyConfig.addPlugin(pluginRss);

  // Prevent memory leaks from watching unnecessary directories
  eleventyConfig.watchIgnores.add("node_modules/**");
  eleventyConfig.watchIgnores.add(".git/**");
  eleventyConfig.watchIgnores.add(".parcel-cache/**");
  eleventyConfig.watchIgnores.add("dist/**");

  // Ignore files that Parcel handles
  eleventyConfig.ignores.add("src/index.html");
  eleventyConfig.ignores.add("src/resume.html");
  eleventyConfig.ignores.add("src/styles.scss");
  eleventyConfig.ignores.add("src/index.js");
  eleventyConfig.ignores.add("src/sass/**");
  eleventyConfig.ignores.add("src/scripts/**");
  eleventyConfig.ignores.add("src/data/**");
  eleventyConfig.ignores.add("src/locales/**");
  eleventyConfig.ignores.add("src/manifest.json");
  eleventyConfig.ignores.add("src/robots.txt");
  eleventyConfig.ignores.add("src/sitemap.xml");

  // Pass through blog CSS
  eleventyConfig.addPassthroughCopy({ "src/blog/blog.css": "blog/blog.css" });

  // Pass through Font Awesome for blog pages
  eleventyConfig.addPassthroughCopy({ "node_modules/font-awesome/css/font-awesome.min.css": "blog/vendor/font-awesome.min.css" });
  eleventyConfig.addPassthroughCopy({ "node_modules/font-awesome/fonts": "blog/fonts" });

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Date filter for various formats
  eleventyConfig.addFilter("date", (value, format) => {
    if (format === "Y") {
      return new Date().getFullYear();
    }
    if (format === "Y-m-d") {
      const d = new Date(value);
      return d.toISOString().split("T")[0];
    }
    return new Date(value).toISOString();
  });

  // Reading time filter
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes === 1 ? "1 min read" : `${minutes} min read`;
  });

  // Create blog posts collection
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/blog/posts/**/*.md")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
