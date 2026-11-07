// 从站外或地址栏进入时整页淡入，站内换页交给浏览器的视图过渡。
(function () {
    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation?.type !== "navigate") {
        return;
    }

    function fadeInPage() {
        const fromSameSite = document.referrer && new URL(document.referrer).origin === window.location.origin;
        if (fromSameSite || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const root = document.documentElement;
        root.classList.add("is-site-entry");
        root.addEventListener("animationend", function finishFade(event) {
            if (event.target === document.body && event.animationName === "page-fade-in") {
                root.classList.remove("is-site-entry");
                root.removeEventListener("animationend", finishFade);
            }
        });
    }

    if ("onpagereveal" in window) {
        window.addEventListener("pagereveal", function (event) {
            // 跨页锚点先定位再捕获画面，页内链接仍按 CSS 平滑滚动。
            if (event.viewTransition) {
                const fragment = window.location.hash.slice(1);
                document.getElementById(fragment)?.scrollIntoView({ behavior: "instant" });
                return;
            }

            fadeInPage();
        }, { once: true });
    } else {
        fadeInPage();
    }
})();
