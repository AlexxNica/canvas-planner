import _ from 'lodash';
import Velocity from 'velocity-animate';

// Based on this formula:
// element's position in the viewport + the window's scroll position === the element's position in the document
// so if we want the scroll position that will maintain the element in it's current viewport position,
// window scroll position = element's current document position - element's initial viewport position
export function maintainViewportPosition (elt, mocks={document, window}) {
  const elementsInitialPositionInViewport = elt.getBoundingClientRect().top;
  mocks.window.requestAnimationFrame(() => {
    const elementsNewPositionInViewport = elt.getBoundingClientRect().top;
    const documentPositionInViewport = mocks.document.documentElement.getBoundingClientRect().top;
    const elementPositionInDocument = elementsNewPositionInViewport - documentPositionInViewport;
    const newWindowScrollPosition = elementPositionInDocument - elementsInitialPositionInViewport;
    mocks.window.scroll(0, newWindowScrollPosition);
  });
}

export function animateSlideDown (elt) {
  Velocity(elt, "slideDown");
}

function handleScrollUpAttempt (cb, e) {
  e.preventDefault();
  cb();
}

function handleWindowWheel (cb, wind, e) {
  if (wind.pageYOffset === 0 && e.deltaY < 0) {
    handleScrollUpAttempt(cb, e);
  }
}

function handleWindowScrollKey (cb, wind, e) {
  if (wind.pageYOffset === 0 &&
      (e.key === 'PageUp' || e.key === 'ArrowUp' || e.key === 'Up')) {
    handleScrollUpAttempt(cb, e);
  }
}

export function registerScrollEvents (scrollIntoPastCb, wind = window) {
  // do debounce here so tests aren't dependant on global state
  const boundWindowWheel = _.debounce(
    handleWindowWheel.bind(undefined, scrollIntoPastCb, wind),
  500, {leading: true, trailing: false});
  wind.addEventListener('wheel', boundWindowWheel);

  const boundScrollKey = handleWindowScrollKey.bind(undefined, scrollIntoPastCb, wind);
  wind.addEventListener('keydown', boundScrollKey);
}
