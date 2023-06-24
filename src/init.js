import i18next from 'i18next';
import watch from './view.js';
import initView from './initView.js';
import locales from './locales/ru/ru.js';
import refresh from './refresh.js';

const init = () => {
  const refreshTime = 5000;
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: locales,
  });

  const state = {
    rssForm: {
      state: 'ready',
      error: null,
    },
    dataLoading: {
      state: 'waiting',
      error: null,
    },
    feeds: [],
    posts: [],
    uiState: {
      viewedPostsIds: [],
    },
    modal: {
      active: false,
      postId: null,
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    feedbackElement: document.querySelector('.feedback'),
    containerPosts: document.querySelector('.container-xxl > .row > .posts'),
    containerFeeds: document.querySelector('.container-xxl > .row > .feeds'),
    modalDiv: document.getElementById('modal'),
    closeModal: document.querySelectorAll('#modal button'),
  };
  const watched = watch(state, elements, i18nextInstance);

  initView(watched, elements);

  setTimeout(() => refresh(watched, refreshTime), refreshTime);
};

export default init;
