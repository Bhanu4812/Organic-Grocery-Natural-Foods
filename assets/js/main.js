(() => {
    "use strict";

    const root = document.documentElement;
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
    const drawIcons = () => window.lucide?.createIcons({ attrs: { "aria-hidden": "true" } });

    // ========================================
    // Theme and RTL Controls
    // ========================================

    const storedTheme = localStorage.getItem("theme");
    const systemTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.dataset.theme = storedTheme || systemTheme;
    root.dir = localStorage.getItem("layoutDirection") || root.dir || "ltr";

    const refreshUtilityIcons = () => {
        $$(".theme-toggle").forEach((button) => {
            const dark = root.dataset.theme === "dark";
            button.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}"></i>`;
            button.setAttribute(
                "aria-label",
                dark ? "Switch to light mode" : "Switch to dark mode",
            );
            button.title = button.getAttribute("aria-label");
        });
        $$(".direction-toggle").forEach((button) => {
            const rtl = root.dir === "rtl";
            button.innerHTML = '<i data-lucide="languages"></i>';
            button.setAttribute("aria-label", rtl ? "Switch to LTR" : "Switch to RTL");
            button.title = button.getAttribute("aria-label");
        });
        drawIcons();
    };

    $$(".theme-toggle").forEach((button) =>
        button.addEventListener("click", () => {
            root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
            localStorage.setItem("theme", root.dataset.theme);
            refreshUtilityIcons();
        }),
    );
    $$(".direction-toggle").forEach((button) =>
        button.addEventListener("click", () => {
            root.dir = root.dir === "rtl" ? "ltr" : "rtl";
            localStorage.setItem("layoutDirection", root.dir);
            refreshUtilityIcons();
        }),
    );

    // ========================================
    // Mobile Navigation and Home Dropdown
    // ========================================

    const menu = $(".main-nav");
    const menuToggle = $(".menu-toggle");
    const homeItem = $(".has-dropdown");
    const dropdownToggle = $(".dropdown-toggle");
    let menuOverlay;
    if (menu) {
        const drawerHead = document.createElement("div");
        drawerHead.className = "mobile-drawer-head";
        const brand = $(".site-header .logo")?.cloneNode(true);
        if (brand) drawerHead.appendChild(brand);
        const closeButton = document.createElement("button");
        closeButton.className = "icon-btn mobile-drawer-close";
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", "Close menu");
        closeButton.innerHTML = '<i data-lucide="x"></i>';
        drawerHead.appendChild(closeButton);
        menu.prepend(drawerHead);
        menuOverlay = document.createElement("button");
        menuOverlay.className = "mobile-nav-overlay";
        menuOverlay.type = "button";
        menuOverlay.setAttribute("aria-label", "Close menu");
        document.body.appendChild(menuOverlay);

        const menuIcons = {
            "index.html": "house",
            "about.html": "info",
            "shop.html": "shopping-basket",
            "sourcing.html": "sprout",
            "subscriptions.html": "package",
            "blog.html": "notebook-text",
            "contact.html": "mail",
        };
        $$(".nav-list > li:not(.mobile-extra) > .nav-link", menu).forEach((link) => {
            const page = new URL(link.href, location.href).pathname.split("/").pop();
            link.insertAdjacentHTML(
                "afterbegin",
                `<i class="mobile-nav-icon" data-lucide="${menuIcons[page] || "circle"}"></i>`,
            );
        });
        closeButton.addEventListener("click", () => menuToggle?.click());
        menuOverlay.addEventListener("click", () => menuToggle?.click());
    }
    const currentPage = location.pathname.split("/").pop() || "index.html";
    $$(".dropdown a").forEach((link) => {
        const linkPage = new URL(link.href, location.href).pathname.split("/").pop();
        link.classList.toggle("active", linkPage === currentPage);
        if (linkPage === currentPage) link.setAttribute("aria-current", "page");
    });
    menuToggle?.addEventListener("click", () => {
        const open = menu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("mobile-menu-open", open);
        if (open) $(".mobile-drawer-close", menu)?.focus();
    });
    dropdownToggle?.addEventListener("click", (event) => {
        event.preventDefault();
        const open = homeItem.classList.toggle("open");
        dropdownToggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".nav-wrap")) {
            menu?.classList.remove("open");
            homeItem?.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
            document.body.classList.remove("mobile-menu-open");
        }
    });
    $$(".main-nav a").forEach((link) =>
        link.addEventListener("click", () => {
            if (!link.classList.contains("dropdown-toggle")) {
                menu?.classList.remove("open");
                document.body.classList.remove("mobile-menu-open");
                menuToggle?.setAttribute("aria-expanded", "false");
            }
        }),
    );

    // ========================================
    // Search and Utility Navigation
    // ========================================

    const searchPanel = $(".search-panel");
    $("[data-history-back]")?.addEventListener("click", () => {
        if (history.length > 1) history.back();
        else location.href = "index.html";
    });
    $$(".search-toggle").forEach((button) =>
        button.addEventListener("click", () => {
            searchPanel?.classList.add("open");
            searchPanel?.querySelector("input")?.focus();
        }),
    );
    $(".search-close")?.addEventListener("click", () => searchPanel.classList.remove("open"));
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            searchPanel?.classList.remove("open");
            menu?.classList.remove("open");
            homeItem?.classList.remove("open");
            document.body.classList.remove("mobile-menu-open");
            menuToggle?.setAttribute("aria-expanded", "false");
        }
    });

    // ========================================
    // Shopping Cart
    // ========================================

    let cartItems;
    try {
        cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
        if (!Array.isArray(cartItems)) cartItems = [];
    } catch (_) {
        cartItems = [];
    }
    const productId = (button) =>
        (button.dataset.product || "organic-product")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    const updateCartUI = () => {
        const badge = $(".cart-count");
        if (badge) {
            badge.textContent = String(cartItems.length);
            badge.classList.toggle("is-empty", cartItems.length === 0);
        }
        $$(".add-cart").forEach((button) => {
            const added = cartItems.includes(productId(button));
            button.classList.toggle("is-added", added);
            button.setAttribute("aria-pressed", String(added));
            button.innerHTML = added
                ? '<i data-lucide="check"></i><span>Added to Cart</span>'
                : '<i data-lucide="shopping-bag"></i><span>Add to Cart</span>';
        });
        drawIcons();
    };
    const toast = $(".toast");
    $$(".add-cart").forEach((button) =>
        button.addEventListener("click", () => {
            const id = productId(button);
            const existing = cartItems.indexOf(id);
            const adding = existing === -1;
            if (adding) cartItems.push(id);
            else cartItems.splice(existing, 1);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            updateCartUI();
            if (toast) {
                toast.textContent = `${button.dataset.product || "Item"} ${adding ? "added to" : "removed from"} cart`;
                toast.classList.add("show");
                setTimeout(() => toast.classList.remove("show"), 2200);
            }
        }),
    );

    // ========================================
    // Product Quantity
    // ========================================

    $$("[data-qty]").forEach((wrapper) => {
        const input = $("input", wrapper);
        $$("button", wrapper).forEach((button) =>
            button.addEventListener("click", () => {
                input.value = Math.max(
                    1,
                    Number(input.value) + (button.dataset.action === "plus" ? 1 : -1),
                );
            }),
        );
    });
    // ========================================
    // Password Controls and Form Validation
    // ========================================

    $$(".password-toggle").forEach((button) =>
        button.addEventListener("click", () => {
            const input = document.getElementById(button.dataset.target);
            input.type = input.type === "password" ? "text" : "password";
            const hidden = input.type === "password";
            button.innerHTML = `<i data-lucide="${hidden ? "eye" : "eye-off"}"></i>`;
            button.setAttribute("aria-label", hidden ? "Show password" : "Hide password");
            drawIcons();
        }),
    );
    const confirmPassword = $("#confirm-password");
    const validatePasswordMatch = () => {
        if (!confirmPassword) return;
        const password = $("#password")?.value || "";
        confirmPassword.setCustomValidity(
            confirmPassword.value && confirmPassword.value !== password
                ? "Passwords do not match."
                : "",
        );
    };
    confirmPassword?.addEventListener("input", validatePasswordMatch);
    $("#password")?.addEventListener("input", validatePasswordMatch);
    $$("form[data-validate]").forEach((form) =>
        form.addEventListener("submit", (event) => {
            if (confirmPassword && form.contains(confirmPassword)) validatePasswordMatch();
            let valid = true;
            $$("[required]", form).forEach((input) => {
                const field = input.closest(".field") || input.closest(".check");
                const inputValid =
                    input.type === "checkbox" ? input.checked : input.checkValidity();
                field?.classList.toggle("invalid", !inputValid);
                input.setAttribute("aria-invalid", String(!inputValid));
                valid = valid && inputValid;
            });
            if (!valid) event.preventDefault();
            else if (form.dataset.demo !== undefined) {
                event.preventDefault();
                form.reset();
                const contactSuccess = $(".form-success", form);
                if (contactSuccess) contactSuccess.hidden = false;
                if (toast) {
                    toast.textContent =
                        form.dataset.contactForm !== undefined
                            ? "Thanks! Your enquiry has been received."
                            : "Thanks! Your request has been received.";
                    toast.classList.add("show");
                    setTimeout(() => toast.classList.remove("show"), 2500);
                }
            }
        }),
    );
    // ========================================
    // Accordions and Tabs
    // ========================================

    $$(".accordion-button").forEach((button) =>
        button.addEventListener("click", () => {
            const item = button.closest(".accordion-item");
            const accordion = button.closest(".faq-list");
            const willOpen = !item.classList.contains("open");
            if (accordion) {
                $$(".accordion-item", accordion).forEach((otherItem) => {
                    otherItem.classList.remove("open");
                    $(".accordion-button", otherItem)?.setAttribute("aria-expanded", "false");
                });
            }
            const open = accordion ? willOpen : item.classList.toggle("open");
            if (accordion && open) item.classList.add("open");
            button.setAttribute("aria-expanded", String(open));
        }),
    );
    $$("[role=tab]").forEach((tab) =>
        tab.addEventListener("click", () => {
            const tabs = tab.closest(".tabs");
            $$("[role=tab]", tabs).forEach((item) => item.setAttribute("aria-selected", "false"));
            $$("[role=tabpanel]", tabs).forEach((panel) => {
                panel.hidden = true;
            });
            tab.setAttribute("aria-selected", "true");
            document.getElementById(tab.getAttribute("aria-controls")).hidden = false;
        }),
    );
    // ========================================
    // Website-Themed Select Menus
    // ========================================

    const closeCustomSelects = (except = null) => {
        $$(".custom-select.open").forEach((wrapper) => {
            if (wrapper === except) return;
            wrapper.classList.remove("open");
            $(".custom-select-trigger", wrapper)?.setAttribute("aria-expanded", "false");
            const options = $(".custom-select-options", wrapper);
            if (options) options.hidden = true;
        });
    };

    $$("select").forEach((select, selectIndex) => {
        const wrapper = document.createElement("div");
        wrapper.className = "custom-select";
        select.parentNode.insertBefore(wrapper, select);
        wrapper.append(select);
        select.classList.add("custom-select-native");

        const listId = `custom-select-options-${selectIndex}`;
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "custom-select-trigger";
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-controls", listId);
        trigger.setAttribute("aria-expanded", "false");

        const list = document.createElement("div");
        list.id = listId;
        list.className = "custom-select-options";
        list.setAttribute("role", "listbox");
        list.hidden = true;

        const optionButtons = [...select.options].map((option) => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "custom-select-option";
            item.textContent = option.textContent;
            item.disabled = option.disabled;
            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", String(option.selected));
            list.append(item);
            return item;
        });

        const sync = () => {
            trigger.textContent = select.selectedOptions[0]?.textContent || "Choose an option";
            optionButtons.forEach((item, index) =>
                item.setAttribute("aria-selected", String(select.options[index].selected)),
            );
        };
        const close = () => {
            wrapper.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
            list.hidden = true;
        };
        const open = () => {
            closeCustomSelects(wrapper);
            wrapper.classList.add("open");
            trigger.setAttribute("aria-expanded", "true");
            list.hidden = false;
        };

        trigger.addEventListener("click", () => (wrapper.classList.contains("open") ? close() : open()));
        trigger.addEventListener("keydown", (event) => {
            if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            open();
            const enabled = optionButtons.filter((item) => !item.disabled);
            const selected = optionButtons.find((item) => item.getAttribute("aria-selected") === "true");
            (event.key === "End" ? enabled.at(-1) : event.key === "Home" ? enabled[0] : selected || enabled[0])?.focus();
        });
        optionButtons.forEach((item, index) => {
            item.addEventListener("click", () => {
                select.selectedIndex = index;
                select.dispatchEvent(new Event("change", { bubbles: true }));
                sync();
                close();
                trigger.focus();
            });
            item.addEventListener("keydown", (event) => {
                if (event.key === "Escape") {
                    close();
                    trigger.focus();
                    return;
                }
                if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
                event.preventDefault();
                const enabled = optionButtons.filter((button) => !button.disabled);
                const position = enabled.indexOf(item);
                enabled[(position + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length]?.focus();
            });
        });
        select.addEventListener("change", sync);
        select.form?.addEventListener("reset", () => setTimeout(sync));
        wrapper.append(trigger, list);
        sync();
    });
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".custom-select")) closeCustomSelects();
    });
    // ========================================
    // Product and Blog Filters
    // ========================================

    const filter = (selector, attribute) =>
        $$(selector).forEach((control) =>
            control.addEventListener("change", () => {
                const value = control.value.toLowerCase();
                $$(`[data-${attribute}]`).forEach((item) => {
                    item.hidden = Boolean(
                        value &&
                            value !== "all" &&
                            !item.dataset[attribute].toLowerCase().includes(value),
                    );
                });
            }),
        );
    filter(".product-filter", "category");
    filter(".blog-filter", "blogCategory");
    // ========================================
    // Section Reveal Animations
    // ========================================

    const revealSections = $$("main section:not(.hero):not(.page-hero)");
    if (
        "IntersectionObserver" in window &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        const sectionObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -48px" },
        );
        revealSections.forEach((section) => {
            section.classList.add("fade-up-section");
            sectionObserver.observe(section);
        });
    } else {
        revealSections.forEach((section) => section.classList.add("is-visible"));
    }

    refreshUtilityIcons();
    updateCartUI();
})();
