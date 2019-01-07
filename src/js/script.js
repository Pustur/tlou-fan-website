$(() => {
  // Functions
  function countUp() {
    counter = (counter + 1) % $allItems.get(0).length;
    animateScroll($scrollList);
    applyClasses(counter);
  }

  function applyClasses(index) {
    $allItems.each((_, items) => {
      $(items)
        .removeClass('active')
        .eq(index)
        .addClass('active');
    });
  }

  function animateScroll($list) {
    const marginBetweenItems = 10;
    const itemHeight = $list
      .find('li')
      .eq(0)
      .height();

    $list.stop(true, true).animate({
      scrollTop: `${itemHeight * counter + marginBetweenItems * counter}px`,
    });
  }

  // DOM elements
  const $lists = $('.js-awards-list');
  const $scrollList = $lists.filter('.awards__carousel-list');
  const $allItems = $lists.map((_, list) => $(list).find('li'));

  // Variables
  let counter = 0;

  // Body
  setInterval(countUp, 2500);
});
