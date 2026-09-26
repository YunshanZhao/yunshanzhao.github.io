// Responsive navigation
(function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navItems = document.querySelector(".nav-items");
    const navLinks = navItems.querySelectorAll("a");
    const mobileMedia = window.matchMedia("(max-width: 48rem)");
    let breakpointDropdown = null;
    let breakpointCleanupTimer = null;

    // 启动导航项目收起动画
    function closeMenu() {
        if (!navItems.classList.contains("is-open") || navItems.classList.contains("is-closing")) {
            return;
        }

        navItems.classList.add("is-closing");
        navItems.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    // 导航项目收起后清理关闭状态
    function finishClosingMenu() {
        navItems.classList.remove("is-open");
        navItems.classList.remove("is-closing");
    }

    // 清理 mobile → desktop 过渡产生的临时菜单和状态
    function finishBreakpointTransition() {
        if (breakpointDropdown) {
            breakpointDropdown.remove();
            breakpointDropdown = null;
        }

        window.clearTimeout(breakpointCleanupTimer);
        breakpointCleanupTimer = null;
        navItems.classList.remove("is-desktop-entering");
        navItems.classList.remove("is-visible");
    }

    // 让旧 dropdown 淡出的同时，使 desktop navigation 渐显
    function transitionToDesktop() {
        finishBreakpointTransition();

        breakpointDropdown = navItems.cloneNode(true);
        breakpointDropdown.className = "nav-items is-breakpoint-dropdown";
        breakpointDropdown.setAttribute("aria-hidden", "true");
        breakpointDropdown.inert = true;
        breakpointDropdown.querySelectorAll("a").forEach(function (link) {
            link.setAttribute("tabindex", "-1");
        });
        navItems.parentElement.appendChild(breakpointDropdown);

        navItems.classList.remove("is-animated");
        finishClosingMenu();
        navItems.classList.add("is-desktop-entering");
        menuToggle.setAttribute("aria-expanded", "false");

        // 先提交两份菜单的初始透明度，再在下一帧交叉淡化
        navItems.getBoundingClientRect();
        window.requestAnimationFrame(function () {
            if (!breakpointDropdown || mobileMedia.matches) {
                return;
            }

            navItems.classList.add("is-visible");
            breakpointDropdown.classList.add("is-fading-out");
        });

        // 按现有关闭过渡的总时长清理；反向 resize 时会提前清理
        breakpointCleanupTimer = window.setTimeout(finishBreakpointTransition, 2100);
    }

    menuToggle.addEventListener("click", function () {

        // 菜单已经打开：正常执行关闭动画
        if (navItems.classList.contains("is-open")) {
            closeMenu();
            return;
        }

        // 打开 mobile dropdown
        navItems.classList.remove("is-closing");
        navItems.classList.add("is-animated");
        navItems.classList.add("is-open");
        menuToggle.setAttribute("aria-expanded", "true");

    });

    navLinks.forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // dropdown 淡出后清理关闭状态
    navItems.addEventListener("transitionend", function (event) {
        if (event.propertyName === "opacity" && event.target === navItems && navItems.classList.contains("is-closing")) {
            finishClosingMenu();
        }
    });

    mobileMedia.addEventListener("change", function (event) {
        const shouldTransitionToDesktop = !event.matches && navItems.classList.contains("is-open");

        if (shouldTransitionToDesktop) {
            transitionToDesktop();
            return;
        }

        finishBreakpointTransition();
        navItems.classList.remove("is-animated");
        finishClosingMenu();
        menuToggle.setAttribute("aria-expanded", "false");
    });
})();
