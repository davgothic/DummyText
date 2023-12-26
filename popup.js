import { load, save } from './settings';

document.addEventListener('DOMContentLoaded', async () => {
  const options = await load();

  document.documentElement.setAttribute('class', `theme-${options.theme}`);

  const response = await fetch('wordlist/lipsum.json');
  const dummyWords = await response.json();
  const punctuation = ['!', '?', '.'];

  const copyButton = document.getElementById('copy-button');
  const lipsumTextArea = document.getElementById('lipsum-textarea');
  const paragraphsInput = document.getElementById('paragraphs-input');
  const wordsInput = document.getElementById('words-input');
  const paragraphTagsCheckbox = document.getElementById('add-tags-checkbox');
  let autoCopyTimeout;

  /**
   * @param {number} max
   * @returns number
   */
  const randomInt = (max) => Math.floor(Math.random() * max);

  /**
   * @param {string[]} words
   * @returns string
   */
  const randomWord = (words) => words[randomInt(words.length)];

  /**
   * @param {number} wordIndex
   * @returns string
   */
  const randomPunctuation = (wordIndex) => {
    if (wordIndex > 1) {
      if (wordIndex % randomInt(30) === 0) {
        return `${randomWord(punctuation)} `;
      }

      if (wordIndex % randomInt(20) === 0) {
        return ', ';
      }
    }
    return ' ';
  };

  /**
   * @param {string} text
   * @returns string
   */
  const capitalizeFirst = (text) => text.replace(/(?:[\n|>|?|!|.]|^)[\s]?([a-z])/g, (s) => s.toUpperCase());

  const generateDummyText = () => {
    clearTimeout(autoCopyTimeout);
    let text = '<p>';

    for (let i = 1; i <= options.paragraphCount; i += 1) {
      for (let j = 1; j <= options.wordsPerParagraph; j += 1) {
        text += randomWord(dummyWords);
        if (j % options.wordsPerParagraph === 0) {
          text += '.</p>\n\n<p>';
        } else if (text.substring(text.length - 3, text.length) !== '<p>') {
          text += randomPunctuation(j);
        }
      }
    }

    text += '</p>';

    if (!options.includeParagraphTags) {
      text = text.replace(/<\/?p>/g, '');
    }

    text = capitalizeFirst(text.substring(0, text.length - (options.includeParagraphTags ? 9 : 2)));

    lipsumTextArea.value = text;
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(lipsumTextArea.value);
      copyButton.value = 'Copied!';
      copyButton.disabled = 'disabled';
      setTimeout(() => {
        copyButton.value = 'Copy';
        copyButton.disabled = false;
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text.', err.message);
    }
  };

  const saveConfig = async () => {
    if (/\d+/.test(paragraphsInput.value)) {
      if (paragraphsInput.value > 999) {
        paragraphsInput.value = 99;
      } else if (paragraphsInput.value < 1) {
        paragraphsInput.value = 1;
      }
    } else {
      paragraphsInput.value = 1;
    }

    if (/\d+/.test(wordsInput.value)) {
      if (wordsInput.value > 999) {
        wordsInput.value = 999;
      } else if (wordsInput.value < 1) {
        wordsInput.value = 1;
      }
    } else {
      wordsInput.value = 1;
    }

    if (paragraphsInput.value * wordsInput.value > 15000) {
      wordsInput.value = 1;
      paragraphsInput.value = 1;
    }

    options.paragraphCount = parseInt(paragraphsInput.value, 10);
    options.wordsPerParagraph = parseInt(wordsInput.value, 10);
    options.includeParagraphTags = paragraphTagsCheckbox.checked;

    save(options);

    generateDummyText();

    if (options.autoCopy) {
      autoCopyTimeout = setTimeout(copyText, options.autoCopyDelay);
    }
  };

  copyButton.addEventListener('click', copyText);

  paragraphsInput.value = options.paragraphCount;
  paragraphsInput.addEventListener('input', saveConfig);
  paragraphsInput.addEventListener('click', () => paragraphsInput.select());

  wordsInput.value = options.wordsPerParagraph;
  wordsInput.addEventListener('input', saveConfig);
  wordsInput.addEventListener('click', () => wordsInput.select());

  paragraphTagsCheckbox.checked = options.includeParagraphTags;
  paragraphTagsCheckbox.addEventListener('click', saveConfig);

  generateDummyText();
});
