/**
 * is sample code for programmatically uploading an image
 * to a media library, and creating a new post in WordPress
 *
 * Run it with 'node index' command
 */

const path = require("path");
const fs = require("fs");

async function createPost() {
  const username = "wp";
  const password = "DRQW xGN2 EbOS C4Vd hHda MhyM";
  const siteURI = "http://node-testing.local";

  /**
   * Image Request
   */
  // Get image to the variable
  const imagePath = path.join(__dirname, "mouse.jpeg");
  const imageBuffer = fs.readFileSync(imagePath);

  // Set image headers
  const imageRequestHeaders = new Headers();
  imageRequestHeaders.set("Content-Type", "image/jpeg");
  imageRequestHeaders.set("Content-Disposition", "attachment; filename=wp-media-filename.jpeg");
  imageRequestHeaders.set("Authorization", "Basic " + Buffer.from(`${username}:${password}`).toString("base64"));

  // Upload image to the WP Media library
  const imagePromise = await fetch(`${siteURI}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: imageRequestHeaders,
    body: imageBuffer,
  });

  // Get the response object of the uploaded image (to have the image id to set it as featured image in the blog post below)
  const imageResult = await imagePromise.json();

  /**
   * Blog Post Request
   */
  const blogPostHeaders = new Headers();
  blogPostHeaders.set("Content-Type", "application/json");
  blogPostHeaders.set("Authorization", "Basic " + Buffer.from(`${username}:${password}`).toString("base64"));

  // Create the new post with the featured image
  fetch(`${siteURI}/wp-json/wp/v2/posts`, {
    method: "POST",
    headers: blogPostHeaders,
    body: JSON.stringify({
      title: "This is the test post with featured image",
      featured_media: imageResult.id,
      status: "publish",
      content: "<!-- wp:paragraph --><p>This is an example paragraph</p><!-- /wp:paragraph -->",
    }),
  });
}

createPost();
