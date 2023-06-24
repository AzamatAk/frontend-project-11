import axios from 'axios';
import _ from 'lodash';
import {
  object, string, setLocale,
} from 'yup';
import { v4 as uuidv4 } from 'uuid';
import makeProxy from './makeProxy.js';
import xmlparser from './parse.js';

export default (watchedState, elements) => {
  const {
    rssForm, dataLoading, feeds, posts, uiState, modal,
  } = watchedState;
  const {
    form,
    modalDiv,
    closeModal,
  } = elements;

  const handleErrors = (error) => {
    switch (error.message) {
      case 'Network Error':
        return 'feedback.netWorkError';
      case 'Parsing Error':
        return 'feedback.notRss';
      default:
        return 'feedback.defaultError';
    }
  };

  setLocale({
    mixed: {
      notOneOf: 'feedback.includYet',
    },
    string: {
      url: 'feedback.notUrl',
      notOneOf: 'feedback.includYet',
    },
  });

  const loadPosts = (userUrl) => {
    dataLoading.state = 'processing';
    const url = makeProxy(userUrl);
    axios
      .get(url)
      .then((response) => {
        const { rssFeeds, rssPosts } = xmlparser(response.data.contents);
        const feedId = uuidv4();
        feeds.push({ id: feedId, url: userUrl, ...rssFeeds });
        posts.push(...rssPosts.map(({
          title, link, description, guid,
        }) => {
          const post = {
            id: uuidv4(), feedId, title, link, description, guid,
          };
          return post;
        }));
        dataLoading.state = 'successful';
      })
      .catch((error) => {
        dataLoading.error = handleErrors(error);
        dataLoading.state = 'failed';
      });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    rssForm.state = 'ready';
    const schema = object({
      url: string()
        .url()
        .nullable()
        .notOneOf(feeds.map(({ url }) => url), 'feedback.includYet'),
    });

    const url = new FormData(e.target).get('url');
    schema
      .validate({ url })
      .then(() => {
        rssForm.state = 'valid';
        rssForm.error = null;
        loadPosts(url);
      })
      .catch((error) => {
        rssForm.error = error.message;
        rssForm.state = 'invalid';
      });
  });

  modalDiv.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const id = button.getAttribute('data-bs-id');
    const activePost = _.find(posts, (item) => item.id === id);
    const isViewed = uiState.viewedPostsIds.includes(activePost.id);
    if (!isViewed) {
      uiState.viewedPostsIds.push(activePost.id);
    }
    modal.active = true;
    modal.postId = id;
  });

  closeModal.forEach((button) => {
    button.addEventListener('click', () => {
      modal.active = false;
      modal.postId = null;
    });
  });
};
