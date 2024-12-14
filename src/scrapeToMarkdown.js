#!/usr/bin/env node
import axios from 'axios';
import { load } from 'cheerio'; // Correct import for Cheerio
import TurndownService from 'turndown';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { gfm } from 'turndown-plugin-gfm';



export async function scrapeToMarkdown(url) {
    try {
        return await extract_from_url(url);
    }catch (error) {
        console.log('Error scraping the URL:', error);
        return await oldScrapeToMarkdown(url);   
    }
    
}




// Function to scrape URL and convert to markdown
export async function oldScrapeToMarkdown(url) {
    try {
        // Fetch the HTML content from the URL
        let { data: html } = await axios.get(url);

        html = html.trim();
        // test if url returned html or markdown
        // if it is markdown, return it as is
        // it might be best to test if it is html by looking for the fist character to be '<'
        if (html.startsWith('<')) {
            // Load the HTML into Cheerio
            const $ = load(html); // Use 'load' from Cheerio

            // Extract the main content (customize selector based on your needs)
            const content = $('article, .content, #main').html() || $('body').html();

            // Convert HTML to Markdown using Turndown
            const turndownService = new TurndownService();
            const markdown = turndownService.turndown(content);

            // Return the Markdown content
            return markdown;
        } else {
            return html;
        }

    } catch (error) {
        console.log('Error scraping the URL:', error);
        return `Error scraping the URL: ${error.message}`;

    }
}





// async function dataScraperTest() {
//     // const doc = new JSDOM("<body>Look at this cat: <img src='./cat.jpg'></body>", {
//     //     url: "https://www.example.com/the-page-i-got-the-source-from"
//     // });

//     // fetch the URL https://github.com/mmiscool/aiCoder
//     const URLtoConvertToMarkdown = 'https://github.com/mmiscool/aiCoder';

//     const markdown = await extract_from_url(URLtoConvertToMarkdown);
//     console.log(markdown);  

// }

// dataScraperTest();



// Below code was pulled from https://github.com/philschmid/clipper.js/blob/main/src/clipper.ts
// LICENSE https://github.com/philschmid/clipper.js/blob/main/LICENSE
// Converted to normal JS and added to this file


const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

turndownService.use(gfm);

const getExt = (node) => {
  // Simple match where the <pre> has the `highlight-source-js` tags
  const getFirstTag = (node) => node.outerHTML.split('>').shift() + '>';

  const match = node.outerHTML.match(/(highlight-source-|language-)[a-z]+/);

  if (match) return match[0].split('-').pop();

  // Check the parent just in case
  const parent = getFirstTag(node.parentNode).match(
    /(highlight-source-|language-)[a-z]+/
  );

  if (parent) return parent[0].split('-').pop();

  const getInnerTag = (node) => node.innerHTML.split('>').shift() + '>';

  const inner = getInnerTag(node).match(/(highlight-source-|language-)[a-z]+/);

  if (inner) return inner[0].split('-').pop();

  // Nothing was found...
  return '';
};

turndownService.addRule('fenceAllPreformattedText', {
  filter: ['pre'],

  replacement: function (content, node) {
    const ext = getExt(node);

    const code = [...node.childNodes]
      .map((c) => c.textContent)
      .join('');

    return `\n\`\`\`${ext}\n${code}\n\`\`\`\n\n`;
  },
});

turndownService.addRule('strikethrough', {
  filter: ['del', 's'],

  replacement: function (content) {
    return '~' + content + '~';
  },
});

function extract_from_dom(dom) {
  let article = new Readability(dom.window.document, {
    keepClasses: true,
    debug: false,
    charThreshold: 100,
  }).parse();

  if (!article) {
    throw new Error('Failed to parse article');
  }
  // Remove HTML comments
  article.content = article.content.replace(/(\<!--.*?\-->)/g, '');

  // Try to add proper h1 if title is missing
  if (article.title.length > 0) {
    // Check if first h2 is the same as title
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/;
    const match = article.content.match(h2Regex);
    if (match?.[0].includes(article.title)) {
      // Replace first h2 with h1
      article.content = article.content
        .replace('<h2', '<h1')
        .replace('</h2', '</h1');
    } else {
      // Add title as h1
      article.content = `<h1>${article.title}</h1>\n${article.content}`;
    }
  }
  // Convert to markdown
  let res = turndownService.turndown(article.content);

  // Replace weird header refs
  const pattern = /\[\]\(#[^)]*\)/g;
  res = res.replace(pattern, '');
  return res;
}

export async function extract_from_url(page) {
  const dom = await JSDOM.fromURL(page);
  return extract_from_dom(dom);
}

export async function extract_from_html(html) {
  const dom = new JSDOM(html);
  return extract_from_dom(dom);
}
