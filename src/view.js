import _ from 'lodash';
import onChange from 'on-change';

export default (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  const {
    form,
    input,
    feedbackElement,
    containerPosts,
    containerFeeds,
    modalDiv,
  } = elements;

  if (path === 'rssForm.state') {
    switch (value) {
      case 'ready':
        feedbackElement.textContent = '';
        break;
      case 'valid':
        feedbackElement.textContent = '';
        input.classList.remove('is-invalid');
        form.reset();
        break;
      case 'invalid':
        feedbackElement.textContent = i18nextInstance.t(`${state.rssForm.error}`);
        input.classList.add('form-control', 'w-100', 'is-invalid');
        feedbackElement.classList.remove('text-success');
        feedbackElement.classList.add('text-danger');
        form.reset();
        break;
      default:
        throw new Error(`Unexpected state: ${value}`);
    }
  }
  if (path === 'dataLoading.state') {
    feedbackElement.textContent = '';
    switch (value) {
      case 'processing':
        feedbackElement.classList.remove('text-success', 'text-danger');
        feedbackElement.classList.add('text-warning', 'm-0', 'small', 'feedback');
        feedbackElement.textContent = i18nextInstance.t('feedback.loading');
        break;
      case 'failed':
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        feedbackElement.classList.remove('text-success', 'text-warning');
        feedbackElement.classList.add('text-danger', 'm-0', 'small', 'feedback');
        feedbackElement.textContent = i18nextInstance.t(`${state.dataLoading.error}`);
        form.reset();
        break;
      case 'successful':
        feedbackElement.classList.remove('text-danger', 'text-warning');
        feedbackElement.classList.add('text-success');
        feedbackElement.textContent = i18nextInstance.t('feedback.isValid');
        form.reset();
        break;
      default:
        throw new Error(`Unexpected state: ${value}`);
    }
  }

  if (path === 'rssForm.error') {
    feedbackElement.textContent = '';
    if (value) {
      input.classList.add('is-invalid');
      feedbackElement.classList.add('text-danger');
      feedbackElement.textContent = state.rssForm.error;
    } else {
      input.classList.remove('is-invalid');
      feedbackElement.classList.remove('text-success', 'text-danger');
    }
  }

  if (path === 'feeds') {
    containerFeeds.innerHTML = '';
    const cardBorder = document.createElement('div');
    cardBorder.classList.add('card', 'border-0');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBorder.prepend(cardBody);
    const feedsHead = document.createElement('h2');
    feedsHead.classList.add('card-title', 'h4');
    feedsHead.textContent = i18nextInstance.t('feeds.header');
    cardBody.prepend(feedsHead);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    state.feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = feed.title;
      li.prepend(h3);
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = feed.description;
      li.append(p);
      ul.prepend(li);
    });
    cardBorder.append(ul);
    containerFeeds.append(cardBorder);
  }

  if (path === 'posts') {
    containerPosts.innerHTML = '';
    const cardBorder = document.createElement('div');
    cardBorder.classList.add('card', 'border-0');
    containerPosts.prepend(cardBorder);
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBorder.prepend(cardBody);
    const postsHead = document.createElement('h2');
    postsHead.classList.add('cadr-title', 'h4');
    postsHead.textContent = i18nextInstance.t('posts.header');
    cardBody.prepend(postsHead);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounder-0');
    cardBorder.append(ul);
    state.posts.map((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');
      a.setAttribute('href', post.link);
      a.classList.add(state.uiState.viewedPostsIds.includes(post) ? ['fw-normal', 'link-secondary'] : 'fw-bold');
      a.setAttribute('data-id', post.id);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = post.title;
      li.prepend(a);
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('type', 'button');
      button.setAttribute('data-id', post.id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.setAttribute('data-bs-id', post.id);
      button.setAttribute('data-bs-title', post.title);
      button.setAttribute('data-bs-description', post.description);
      button.setAttribute('data-bs-link', post.link);
      button.textContent = i18nextInstance.t('posts.buttonShow');
      li.append(button);
      ul.prepend(li);
      return ul;
    });
  }

  if (path === 'modal.active') {
    if (state.modal.active) {
      modalDiv.classList.add('show');
      modalDiv.setAttribute('aria-modal', 'true');
      modalDiv.setAttribute('style', 'display: block');
    } else {
      modalDiv.setAttribute('aria-hidden', 'true');
    }
  }

  if (path === 'modal.postId') {
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-body');
    const fullArticle = document.querySelector('.full-article');
    const activePost = _.find(state.posts, (p) => p.id === state.modal.postId);
    const activeA = document.querySelectorAll('a');
    const activeEl = _.find(activeA, (a) => a.getAttribute('data-id') === state.modal.postId);
    activeEl.classList.remove('fw-bold');
    activeEl.classList.add('fw-normal');
    activeEl.style.color = 'grey';
    fullArticle.setAttribute('href', activePost?.link ?? '#');
    modalTitle.textContent = activePost?.title ?? '';
    modalDescription.textContent = activePost?.description ?? '';
    return activePost;
  }
  return state;
});
