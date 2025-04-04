export const css = `
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* Article content */

/* Note that any class names from the original article that we want to match on
 * must be added to CLASSES_TO_PRESERVE in ReaderMode.sys.mjs, so that
 * Readability.js doesn't strip them out */

.page {
  font-size: 1em;
}

.page h1,
.page h2,
.page h3 {
  font-weight: bold;
}

.page h1 {
  font-size: 1.6em;
  margin-bottom: 0.25em;
  margin-top: 0.25em;
}

.page h2 {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 0.51em;
  margin-top: 0.51em;
}

.page h3 {
  font-weight: bold;
  font-size: 1em;
  margin-bottom: 0.66em;
  margin-top: 0.66em;
}

.page a:link {
  text-decoration: underline;
  font-weight: normal;
}

.page * {
  max-width: 100%;
  height: auto;
}

.page p {
  text-indent: 1.2em;
}

.page li {
  margin-bottom: 0;
}

.page p > img:only-child,
.page p > a:only-child > img:only-child,
.page .wp-caption img,
.page figure img {
  display: block;
}

.page img[moz-reader-center] {
  margin-inline: auto;
}

.page .caption,
.page .wp-caption-text
.page figcaption {
  font-size: 0.9em;
  line-height: 1.48em;
  font-style: italic;
}

.page pre {
  white-space: pre-wrap;
}

.page blockquote {
  padding: 0;
  padding-inline-start: 16px;
}

.page ul,
.page ol {
  padding: 0;
}

.page ul {
  padding-inline-start: 30px;
  list-style: disc;
}

.page ol {
  padding-inline-start: 30px;
}

table,
th,
td {
  border: 1px solid currentColor;
  border-collapse: collapse;
  padding: 6px;
  vertical-align: top;
}

table {
  margin: 5px;
}

/* Visually hide (but don't display: none) screen reader elements */
.page .visually-hidden,
.page .visuallyhidden,
.page .sr-only {
  display: inline-block;
  width: 1px;
  height: 1px;
  overflow: hidden;
  padding: 0;
  border-width: 0;
}

/* Hide elements with common "hidden" class names */
.page .hidden,
.page .invisible {
  display: none;
}

/* Enforce wordpress and similar emoji/smileys aren't sized to be full-width,
 * see bug 1399616 for context. */
.page img.wp-smiley,
.page img.emoji {
  display: inline-block;
  border-width: 0;
  /* height: auto is implied from \`.page *\` rule. */
  width: 1em;
  margin: 0 .07em;
  padding: 0;
}

pre code {
  border: 1px solid black;
  display: block;
  overflow: auto;
}`;
