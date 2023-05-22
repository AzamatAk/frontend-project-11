import _ from 'lodash';
import onChange from 'on-change';

const renderModal = (watchedState, elements) => {
  const post = watchedState.posts.find((item) => item.id === watchedState.uiState.postId);
  elements.modalTitle.textContent = post.title;
  elements.modalBody.textContent = post.description;
  elements.modalLink.href = post.link;
};

const renderForm = (watchedState, elements, i18n) => {
  if (watchedState.status === 'invalid') {
    elements.input.classList.add('is-invalid');
    elements.input.focus();
    elements.feedback.className = 'text-danger';
    elements.feedback.textContent = i18n.t(watchedState.error);
  } else if (watchedState.status === 'start') {
    elements.input.readOnly = true;
    elements.button.disabled = true;
  } else if (watchedState.status === 'success') {
    elements.input.value = '';
    elements.input.classList.remove('is-invalid');
    elements.input.readOnly = false;
    elements.input.focus();
    elements.button.disabled = false;
    elements.feedback.className = 'text-success';
    elements.feedback.textContent = i18n.t('success');
  } else if (watchedState.status === 'failure') {
    elements.input.classList.add('is-invalid');
    elements.input.readOnly = false;
    elements.input.focus();
    elements.button.disabled = false;
    elements.feedback.className = 'text-danger';
    elements.feedback.textContent = i18n.t(watchedState.error);
  }
};

const renderFeeds = (watchedState, elements) => {
  elements.content.classList.remove('d-none');
  elements.feeds.innerHTML = '';
  watchedState.channels.forEach((channel) => {
    const titleElem = document.createElement('p');
    titleElem.classList.add('fw-bold', 'mb-0');
    titleElem.textContent = channel.title;

    const descElem = document.createElement('p');
    descElem.textContent = channel.description;

    elements.feeds.append(titleElem, descElem);
  });
};

const renderPosts = (watchedState, elements, i18n) => {
  const sortedPosts = _.reverse(_.sortBy(watchedState.posts, (o) => Date.parse(o.timemark)));
  elements.posts.innerHTML = '';
  sortedPosts.forEach((post) => {
    const link = document.createElement('a');
    if (watchedState.uiState.viewedPosts.has(post.id)) {
      link.classList.add('fw-normal');
    } else {
      link.classList.add('fw-bold');
    }
    link.textContent = post.title;
    link.href = post.link;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18n.t('show');
    button.addEventListener('click', () => {
      watchedState.uiState.viewedPosts.add(post.id);
      watchedState.uiState.postId = post.id;
    });

    const div = document.createElement('div');
    div.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-3');
    div.append(link, button);
    elements.posts.append(div);
  });
};

const createWatchedState = (state, elements, i18n) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'status') renderForm(watchedState, elements, i18n);
    if (path === 'channels') renderFeeds(watchedState, elements);
    if (path === 'uiState.postId') renderModal(watchedState, elements);
    if (path === 'posts' || path === 'uiState.postId') renderPosts(watchedState, elements, i18n);
  });
  return watchedState;
};

export default createWatchedState;
