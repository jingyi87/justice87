const video = document.querySelector(".background-video");

window.addEventListener("load", function () {
  video.play().catch(function (error) {
    console.log("视频自动播放被阻止:", error);
  });
});

let isScrollLocked = true;
let totalProgress = 0;

// 监听滚轮事件
window.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();

    const title = document.querySelector(".main-title");
    const navbar = document.querySelector(".navbar");
    const contentSection = document.querySelector(".content-section");
    const body = document.body;

    // 计算总进度
    const delta = e.deltaY > 0 ? 1 : -1;
    totalProgress += delta * 0.1;
    totalProgress = Math.max(0, Math.min(4, totalProgress));

    console.log("Total progress:", totalProgress);

    // 第一阶段：文字放大 (0-1)
    if (totalProgress <= 1) {
      body.classList.add("no-scroll");

      const scale = 1 + totalProgress * 100;
      title.style.transform = `scale(${scale})`;

      if (totalProgress > 0.8) {
        title.classList.add("white-bg");
      } else {
        title.classList.remove("white-bg");
      }

      if (totalProgress > 0.9) {
        navbar.classList.add("hidden");
      } else {
        navbar.classList.remove("hidden");
      }

      contentSection.style.transform = "translateY(100vh)";
    }
    // 第二阶段：内容滚动 (1-4)
    else {
      title.style.transform = "scale(21)";
      title.classList.add("white-bg");
      navbar.classList.add("hidden");

      const contentProgress = totalProgress - 1;

      let translateY;

      if (contentProgress <= 1) {
        translateY = 100 - contentProgress * 100;
      } else if (contentProgress <= 2) {
        const progress = contentProgress - 1;
        translateY = -100 * progress;
      } else if (contentProgress <= 3) {
        const progress = contentProgress - 2;
        translateY = -100 - 100 * progress;
      } else {
        translateY = -200;
      }

      contentSection.style.transform = `translateY(${translateY}vh)`;

      console.log(
        "Content progress:",
        contentProgress,
        "TranslateY:",
        translateY
      );

      if (contentProgress >= 3) {
        body.classList.remove("no-scroll");
      }
    }
  },
  { passive: false }
);

function handleNormalScroll() {
  const navbar = document.querySelector(".navbar");
  const scrolled = window.pageYOffset;

  if (scrolled === 0) {
    navbar.classList.remove("hidden");
  }
}

function resetToTop() {
  const title = document.querySelector(".main-title");
  const navbar = document.querySelector(".navbar");
  const contentSection = document.querySelector(".content-section");
  const body = document.body;

  totalProgress = 0;

  title.style.transform = "scale(1)";
  title.classList.remove("white-bg");
  navbar.classList.remove("hidden");
  contentSection.classList.remove("show");
  contentSection.style.transform = "translateY(100vh)";
  body.classList.add("no-scroll");

  window.scrollTo(0, 0);
  window.removeEventListener("scroll", handleNormalScroll);
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("no-scroll");
});

document.addEventListener("keydown", function (e) {
  if (isScrollLocked) {
    if (e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 100 }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: -100 }));
    }
  }
});
