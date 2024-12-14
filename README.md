# Scrape to markdown
This project extracts the functionality of fetching a URL and generating a markdown string from [clipper.js](https://github.com/philschmid/clipper.js) and packages it as a library that can be included in to your project using NPM. 


Scraper to Markdown is a lightweight JavaScript library that allows you to scrape articles or web pages and convert their content into Markdown format. This is particularly useful for archiving, content generation, or data processing tasks.

## Features

- Extracts main content from web pages.
- Converts HTML content into Markdown using [Turndown](https://github.com/mixmark-io/turndown).
- Handles GitHub Flavored Markdown (GFM) for better compatibility.
- Fallback mechanism for handling URLs that return raw Markdown.
- Built-in support for readability parsing via [@mozilla/readability](https://github.com/mozilla/readability).

## Installation

Install the library using npm:

```bash
npm install @mmiscool/scrape_to_markdown -s
```

## Usage

### Import the Library

```javascript
import { scrapeToMarkdown } from '@mmiscool/scrape_to_markdown';
```

### Scrape a Web Page to Markdown

```javascript
(async () => {
    const url = 'https://example.com/some-article';
    try {
        const markdown = await scrapeToMarkdown(url);
        console.log(markdown);
    } catch (error) {
        console.error('Error scraping the URL:', error);
    }
})();
```

### Fallback for Raw Markdown URLs

The library can handle cases where the URL directly provides Markdown content. It will return the raw Markdown if no HTML is detected.

## API

### `scrapeToMarkdown(url: string): Promise<string>`

Scrapes the content from the provided URL and converts it to Markdown.

- **Parameters**:
  - `url`: The URL of the web page to scrape.
- **Returns**: A `Promise` resolving to the Markdown content.

### `extract_from_url(page: string): Promise<string>`

Uses [JSDOM](https://github.com/jsdom/jsdom) and [@mozilla/readability](https://github.com/mozilla/readability) to extract and convert the primary content from a web page into Markdown.

### `extract_from_html(html: string): Promise<string>`

Converts raw HTML input into Markdown.

### `oldScrapeToMarkdown(url: string): Promise<string>`

Legacy scraper for handling edge cases or simpler scraping needs.

## Dependencies

This library relies on the following NPM packages:

- [axios](https://www.npmjs.com/package/axios) for HTTP requests.
- [cheerio](https://www.npmjs.com/package/cheerio) for parsing HTML content.
- [turndown](https://www.npmjs.com/package/turndown) for converting HTML to Markdown.
- [turndown-plugin-gfm](https://www.npmjs.com/package/turndown-plugin-gfm) for GitHub Flavored Markdown support.
- [@mozilla/readability](https://www.npmjs.com/package/@mozilla/readability) for extracting readable content from web pages.
- [jsdom](https://www.npmjs.com/package/jsdom) for DOM simulation.

## Examples

### Scraping a Blog Post

```javascript
import { scrapeToMarkdown } from '@mmiscool/scrape_to_markdown';

(async () => {
    const url = 'https://medium.com/some-blog-post';
    const markdown = await scrapeToMarkdown(url);
    console.log(markdown);
})();
```

### Converting Raw HTML to Markdown

```javascript
import { extract_from_html } from '@mmiscool/scrape_to_markdown';

const html = `
    <article>
        <h1>Example Article</h1>
        <p>This is an example paragraph.</p>
    </article>
`;

(async () => {
    const markdown = await extract_from_html(html);
    console.log(markdown);
})();
```



## Credits

Clipper uses the following open source libraries:

- [Mozilla Readability](https://github.com/mozilla/readability) - For parsing article content
- [Turndown](https://github.com/mixmark-io/turndown) - For converting HTML to Markdown  
- [Crawlee](https://crawlee.dev/) - For crawling websites

## License

* Apache 2.0

