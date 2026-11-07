// Responsive navigation
(function () {
    const menuToggle = document.getElementById("menu-toggle");
    const desktopNav = document.querySelector(".nav-items");
    const mobileMedia = window.matchMedia("(max-width: 48rem)");

    // 复用同一份链接，竖向菜单只在初始化时创建一次。
    const dropdown = desktopNav.cloneNode(true);
    dropdown.className = "nav-dropdown";
    dropdown.id = "nav-dropdown";
    dropdown.inert = true;
    desktopNav.after(dropdown);
    const navLinks = dropdown.querySelectorAll("a");
    menuToggle.setAttribute("aria-controls", dropdown.id);
    menuToggle.setAttribute("aria-expanded", "false");

    // 切换动画前记录各链接的当前画面，反向时从这里接续。
    function captureLinkFrame() {
        let fullyVisible = true;
        navLinks.forEach(function (link) {
            const { opacity, transform } = window.getComputedStyle(link);
            if (Number(opacity) < 1) {
                fullyVisible = false;
            }
            link.style.setProperty("--nav-start-opacity", opacity);
            link.style.setProperty("--nav-start-transform", transform);
        });
        return fullyVisible;
    }

    // 启动导航项目收起动画
    function closeMenu() {
        if (!dropdown.classList.contains("is-open")) {
            return;
        }

        const fullyVisible = captureLinkFrame();
        dropdown.classList.toggle("is-interrupted", !fullyVisible);
        dropdown.classList.add("is-closing");
        dropdown.classList.remove("is-open");
        dropdown.inert = true;
        menuToggle.setAttribute("aria-expanded", "false");
    }

    // 导航项目收起后清理关闭状态
    function finishClosingMenu() {
        dropdown.classList.remove("is-closing");
        dropdown.classList.remove("is-interrupted");
        navLinks.forEach(function (link) {
            link.style.removeProperty("--nav-start-opacity");
            link.style.removeProperty("--nav-start-transform");
        });
    }

    menuToggle.addEventListener("click", function () {

        if (!mobileMedia.matches) {
            return;
        }

        // 菜单已经打开：正常执行关闭动画
        if (dropdown.classList.contains("is-open")) {
            closeMenu();
            return;
        }

        // 收起途中重开时，沿用当前画面并跳过逐项延迟。
        if (dropdown.classList.contains("is-closing")) {
            captureLinkFrame();
            dropdown.classList.remove("is-closing");
            dropdown.classList.add("is-interrupted");
        }

        dropdown.classList.add("is-open");
        dropdown.inert = false;
        menuToggle.setAttribute("aria-expanded", "true");

    });

    navLinks.forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // 等可见性切换完成再清理，避免反向淡出提前结束时截断链接动画。
    dropdown.addEventListener("transitionend", function (event) {
        if (event.propertyName === "visibility" && event.target === dropdown && dropdown.classList.contains("is-closing")) {
            finishClosingMenu();
        }
    });

    // 断点只交接交互权限，已在收起的菜单继续播放原动画。
    function syncNavigationMode() {
        const isMobile = mobileMedia.matches;
        desktopNav.inert = isMobile;
        menuToggle.inert = !isMobile;
        if (!isMobile) {
            closeMenu();
        }
    }

    mobileMedia.addEventListener("change", syncNavigationMode);
    syncNavigationMode();
})();
