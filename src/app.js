import * as yup from 'yup';
import i18next from 'i18next';
import translation from './locales/ru/ru.js';
import { uploadChannelFirst, listenChannels } from './upload.js';
import createWatchedState from './renders.js';

const app = (i18n) => {
  const elements = {};
  elements.form = document.getElementById('form-rss');
  elements.input = document.getElementById('url');
  elements.button = document.getElementById('add');
  elements.feedback = document.getElementById('feedback');
  elements.modalTitle = document.getElementById('modal-title');
  elements.modalBody = document.getElementById('modal-body');
  elements.modalLink = document.getElementById('modal-link');
  elements.posts = document.getElementById('posts');
  elements.content = document.getElementById('content');
  elements.feeds = document.getElementById('feeds');

  const state = {
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
