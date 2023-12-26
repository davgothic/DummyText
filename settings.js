const load = async () => {
  const options = {
    paragraphCount: 3,
    wordsPerParagraph: 100,
    includeParagraphTags: false,
    autoCopy: false,
    autoCopyDelay: 400,
    theme: 'auto',
  };

  try {
    const data = await chrome.storage.local.get('options');
    Object.assign(options, data.options);
  } catch (err) {
    console.error(`Unable to load options: ${err}`);
  }

  return options;
};

/**
 * @param {Object} options
 */
const save = async (options) => {
  try {
    await chrome.storage.local.set({ options });
  } catch (e) {
    console.error(`Unable to save settings: ${e}`);
  }
};

export { load, save };
