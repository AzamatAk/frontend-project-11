import * as yup from 'yup';
import i18next from 'i18next';
import translation from './locales/ru/ru.js';
import { uploadChannelFirst, listenChannels } from './upload.js';
import createWatchedState from './renders.js';

const app = (i18n) => {
  const elements = {
    form: document.getElementById('form-rss'),
    input: document.getElementById('url'),
    button: document.getElementById('add'),
    feedback: document.getElementById('feedback'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    modalLink: document.getElementById('modal-link'),
    posts: document.getElementById('posts'),
    content: document.getElementById('content'),
    feeds: document.getElementById('feeds'),
  };

  const state = {
    form: {
      valid: true,
      processState: 'filling',
      processStateError: null,
      feedback: null,
    },
    loadingProcess: {
      status: null,
      loadingProcessError: null,
    },
    status: 'initial',
    channels: [],
    posts: [],
    error: '',
    uiState: {
      viewedPosts: new Set(),
      postId: null,
    },
  };
  const watchedState = createWatchedState(state, elements, i18n);

  yup.setLocale({
    mixed: {
      required: () => 'required',
      notOneOf: () => 'notOneOf',
    },
    string: {
      url: () => 'url',
    },
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.status = 'initial';
    const val = elements.input.value;
    const urls = watchedState.channels.map((channel) => channel.url);
    const schema = yup.string().required().url().notOneOf(urls);
    schema
      .validate(val)
      .then((value) => {
        uploadChannelFirst(value, watchedState);
      })
      .catch((err) => {
        const { errors } = err;
        [watchedState.error] = errors;
        watchedState.status = 'invalid';
      });
  });

  listenChannels(watchedState);
};

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      resources: {
        ru: {
          translation,
        },
      },
    })
    .then(() => {
      app(i18nextInstance);
    });
};

export default runApp;
