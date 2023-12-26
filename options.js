import { load, save } from './settings';

document.addEventListener('DOMContentLoaded', async () => {
  const options = await load();

  document.documentElement.setAttribute('class', `theme-${options.theme}`);
  const enableAutoCopyCheckbox = document.getElementById('enable-autocopy-checkbox');
  const autoCopyDelayInput = document.getElementById('autocopy-delay-input');
  const themeSelect = document.getElementById('theme-select');

  enableAutoCopyCheckbox.checked = options.autoCopy;
  autoCopyDelayInput.value = options.autoCopyDelay;
  themeSelect.value = options.theme;

  // Saves options to chrome.storage
  const saveOptions = async () => {
    if (/\d+/.test(autoCopyDelayInput.value)) {
      if (autoCopyDelayInput.value > 2000) {
        autoCopyDelayInput.value = 2000;
      } else if (autoCopyDelayInput.value < 0) {
        autoCopyDelayInput.value = 0;
      }
    } else {
      autoCopyDelayInput.value = 400;
    }

    options.autoCopy = enableAutoCopyCheckbox.checked;
    options.autoCopyDelay = autoCopyDelayInput.value;
    options.theme = themeSelect.value;

    document.documentElement.setAttribute('class', `theme-${options.theme}`);

    await save(options);
  };

  enableAutoCopyCheckbox.addEventListener('click', saveOptions);
  autoCopyDelayInput.addEventListener('input', saveOptions);
  themeSelect.addEventListener('change', saveOptions);
});
