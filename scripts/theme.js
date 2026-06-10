// 立即执行函数
(function () {
    const toggleBtn = document.getElementById("theme-toggle");
    const root = document.documentElement; // <html>元素。切换主题就是给这个<html>设置data-theme="dark"或"light"。

    function updateIcon(theme) {
        toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        updateIcon(theme);
    }

    // 读取head内联脚本已设置好的主题，初始化按钮图标
    const currentTheme = root.getAttribute("data-theme") || "dark"; // 读不到值就使用dark
    updateIcon(currentTheme);

    // 绑定点击事件，点击时触发函数
    toggleBtn.addEventListener("click", function () {
        const current = root.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        localStorage.setItem("theme", next);
    });

    // 跟随系统主题实时变化。head内敛脚本只能在加载页面时运行一次，不能应对浏览网页时系统主题的切换。
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!localStorage.getItem("theme")) { // 未手动选择过主题时跟随系统
            applyTheme(e.matches ? "dark" : "light");
        }
    });
})();