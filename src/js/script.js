(document => {
  // Functions
  function countUp() {
    counter = (counter + 1) % awardLists[0].childElementCount;
    animateScroll(scrollList);
    applyClasses();
  }

  function applyClasses() {
    awardLists.forEach(list => {
      const activeEl = list.querySelector('.active');
      const nextEl = activeEl.nextElementSibling || list.firstElementChild;

      activeEl.classList.remove('active');
      nextEl.classList.add('active');
    });
  }

  function animateScroll(list) {
    const itemHeight = parseInt(
      getComputedStyle(list.querySelector('li')).height,
      10,
    );

    list.scrollTo({
      top: itemHeight * counter + ITEMS_MARGIN * counter,
      left: 0,
      behavior: 'smooth',
    });
  }

  // DOM elements
  const awardLists = Array.from(document.querySelectorAll('.js-awards-list'));
  const scrollList = awardLists.find(list =>
    list.classList.contains('awards__carousel-list'),
  );

  // Variables
  const ITEMS_MARGIN = 10;
  let counter = 0;

  // Body
  setInterval(countUp, 2500);
})(document);
