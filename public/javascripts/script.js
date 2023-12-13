const searchSection = $(".search-section");

$(".loc-button").click(() => {
  searchSection.fadeIn(200);
  searchSection.removeClass("hide").addClass("visible");
});

$(".bx-arrow-back").click(() => {
  searchSection.fadeOut(200);
  searchSection.removeClass("visible").addClass("hide");
});
