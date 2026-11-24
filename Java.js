
"use strict";

/* =========================================
   VIVIANA ROSA — NAIL STUDIO
   INTERAÇÕES E FUNCIONALIDADES
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const $ = (selector) => document.querySelector(selector);

    const $$ = (selector) => [
        ...document.querySelectorAll(selector)
    ];

    const PHONE = "5514996049750";

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================
       1. ÍCONES
    ===================================== */

    if (window.lucide) {
        window.lucide.createIcons();
    }


    /* =====================================
       2. CABEÇALHO E PROGRESSO DE ROLAGEM
    ===================================== */

    const header = $("#header");
    const scrollProgress = $("#scrollProgress");

    function updateScroll() {

        const scrollTop = window.scrollY;

        const scrollHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = scrollHeight > 0
            ? (scrollTop / scrollHeight) * 100
            : 0;

        scrollProgress.style.width =
            `${Math.min(progress, 100)}%`;

        header.classList.toggle(
            "scrolled",
            scrollTop > 20
        );

    }

    window.addEventListener(
        "scroll",
        updateScroll,
        { passive: true }
    );

    window.addEventListener("resize", updateScroll);

    updateScroll();


    /* =====================================
       3. MENU MOBILE
    ===================================== */

    const menuButton = $("#menuButton");
    const navigation = $("#navigation");

    function closeMenu() {

        navigation.classList.remove("open");
        menuButton.classList.remove("open");

        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menu"
        );

    }

    menuButton.addEventListener("click", () => {

        const isOpen =
            navigation.classList.toggle("open");

        menuButton.classList.toggle("open", isOpen);

        document.body.classList.toggle(
            "menu-open",
            isOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu" : "Abrir menu"
        );

    });

    $$(".navigation a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 800) {
            closeMenu();
        }

    });


    /* =====================================
       4. NAVEGAÇÃO ATIVA
    ===================================== */

    const navLinks = $$(".navigation a");

    const navigationSections = navLinks
        .map(link => {

            const id = link.getAttribute("href");

            return document.querySelector(id);

        })
        .filter(Boolean);

    function updateActiveNavigation() {

        let current = navigationSections[0]?.id;

        navigationSections.forEach(section => {

            const position =
                section.getBoundingClientRect().top;

            if (position <= 150) {
                current = section.id;
            }

        });

        navLinks.forEach(link => {

            const isActive =
                link.getAttribute("href") === `#${current}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );

    updateActiveNavigation();


    /* =====================================
       5. ANIMAÇÕES AO ROLAR
    ===================================== */

    if (
        "IntersectionObserver" in window &&
        !reducedMotion
    ) {

        document.body.classList.add("js-ready");

        const revealObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -15px 0px"
            }
        );

        $$(".reveal").forEach(element => {

            revealObserver.observe(element);

        });

    }


    /* =====================================
       6. TROCA DE COR DO ESMALTE
    ===================================== */

    const colorOptions = $$(".color-option");
    const colorName = $("#colorName");

    colorOptions.forEach(option => {

        option.addEventListener("click", () => {

            const color = option.dataset.color;
            const light = option.dataset.light;
            const dark = option.dataset.dark;
            const name = option.dataset.name;

            document.documentElement.style.setProperty(
                "--polish",
                color
            );

            document.documentElement.style.setProperty(
                "--polish-light",
                light
            );

            document.documentElement.style.setProperty(
                "--polish-dark",
                dark
            );

            colorName.textContent = name;

            colorOptions.forEach(item => {

                item.classList.remove("selected");

                item.setAttribute(
                    "aria-pressed",
                    "false"
                );

            });

            option.classList.add("selected");

            option.setAttribute(
                "aria-pressed",
                "true"
            );

            if (!reducedMotion && colorName.animate) {

                colorName.animate(
                    [
                        {
                            opacity: 0,
                            transform: "translateY(5px)"
                        },
                        {
                            opacity: 1,
                            transform: "translateY(0)"
                        }
                    ],
                    {
                        duration: 350,
                        easing: "ease-out"
                    }
                );

            }

        });

    });


    /* =====================================
       7. ABERTURA DO FRASCO
    ===================================== */

    const polishBottle = $("#polishBottle");
    const productButton = $("#productButton");

    productButton.addEventListener("click", () => {

        const isOpen =
            polishBottle.classList.toggle("open");

        productButton.classList.toggle(
            "open",
            isOpen
        );

        productButton.setAttribute(
            "aria-pressed",
            String(isOpen)
        );

        productButton.setAttribute(
            "aria-label",
            isOpen
                ? "Fechar frasco de esmalte"
                : "Abrir frasco de esmalte"
        );

    });


    /* =====================================
       8. PERSPECTIVA INTERATIVA
    ===================================== */

    const productStage = $("#productStage");

    const productPerspective =
        $("#productPerspective");

    const hasFinePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;

    if (hasFinePointer && !reducedMotion) {

        productStage.addEventListener(
            "pointermove",
            event => {

                const rect =
                    productStage.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const rotateY = (x - 0.5) * 22;
                const rotateX = (0.5 - y) * 16;

                productPerspective.style.transform =
                    `rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)`;

            }
        );

        productStage.addEventListener(
            "pointerleave",
            () => {

                productPerspective.style.transform =
                    "rotateX(0deg) rotateY(0deg)";

            }
        );

    }


    /* =====================================
       9. MENU INTERATIVO DE SERVIÇOS
    ===================================== */

    const serviceItems = $$(".service-item");

    const servicePhotoTitle =
        $("#servicePhotoTitle");

    serviceItems.forEach(item => {

        const trigger =
            item.querySelector(".service-trigger");

        trigger.addEventListener("click", () => {

            const wasActive =
                item.classList.contains("active");

            serviceItems.forEach(service => {

                service.classList.remove("active");

                service
                    .querySelector(".service-trigger")
                    .setAttribute(
                        "aria-expanded",
                        "false"
                    );

            });

            if (!wasActive) {

                item.classList.add("active");

                trigger.setAttribute(
                    "aria-expanded",
                    "true"
                );

                servicePhotoTitle.textContent =
                    item.dataset.service;

            }

        });

    });


    /* =====================================
       10. SELECIONAR SERVIÇO E AGENDAR
    ===================================== */

    const selectedService =
        $("#selectedService");

    $$(".service-book").forEach(button => {

        button.addEventListener("click", () => {

            selectedService.value =
                button.dataset.book;

            $("#agendamento").scrollIntoView({

                behavior: reducedMotion
                    ? "auto"
                    : "smooth"

            });

        });

    });


    /* =====================================
       11. GALERIA AMPLIADA
    ===================================== */

    const lightbox = $("#lightbox");
    const lightboxImage = $("#lightboxImage");
    const lightboxCaption = $("#lightboxCaption");
    const lightboxClose = $("#lightboxClose");

    let lastGalleryButton = null;

    $$(".gallery-card").forEach(card => {

        card.addEventListener("click", () => {

            const image = card.querySelector("img");

            lastGalleryButton = card;

            lightboxImage.src =
                image.currentSrc || image.src;

            lightboxImage.alt = image.alt;

            lightboxCaption.textContent =
                card.dataset.caption;

            if (typeof lightbox.showModal === "function") {

                lightbox.showModal();

            } else {

                window.open(
                    image.currentSrc || image.src,
                    "_blank",
                    "noopener"
                );

            }

        });

    });

    lightboxClose.addEventListener("click", () => {

        lightbox.close();

    });

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {

            const rect =
                lightbox.getBoundingClientRect();

            const inside =
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom;

            if (!inside) {
                lightbox.close();
            }

        }

    });

    lightbox.addEventListener("close", () => {

        lastGalleryButton?.focus();

    });


    /* =====================================
       12. CARROSSEL DE AVALIAÇÕES
    ===================================== */

    const reviews = [

        "Capricho, pontualidade e profissionalismo..",

        "A melhor da região!!!"

    ];

    let currentReview = 0;
    let reviewTimer;

    const reviewText = $("#reviewText");
    const reviewCounter = $("#reviewCounter");

    const testimonialContent =
        $("#testimonialContent");

    function showReview(index) {

        currentReview =
            (index + reviews.length) % reviews.length;

        clearTimeout(reviewTimer);

        function updateReview() {

            reviewText.textContent =
                reviews[currentReview];

            const current = String(
                currentReview + 1
            ).padStart(2, "0");

            const total = String(
                reviews.length
            ).padStart(2, "0");

            reviewCounter.textContent =
                `${current} / ${total}`;

            testimonialContent.classList.remove(
                "changing"
            );

        }

        if (reducedMotion) {

            updateReview();

        } else {

            testimonialContent.classList.add(
                "changing"
            );

            reviewTimer = setTimeout(
                updateReview,
                250
            );

        }

    }

    $("#previousReview").addEventListener(
        "click",
        () => {

            showReview(currentReview - 1);

        }
    );

    $("#nextReview").addEventListener(
        "click",
        () => {

            showReview(currentReview + 1);

        }
    );


    /* =====================================
       13. DATA MÍNIMA DE AGENDAMENTO
    ===================================== */

    const bookingDate = $("#bookingDate");
    const bookingTime = $("#bookingTime");

    function getLocalDate() {

        const now = new Date();

        const year = now.getFullYear();

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    }

    bookingDate.min = getLocalDate();


    /* =====================================
       14. FORMULÁRIO INTEGRADO AO WHATSAPP
    ===================================== */

    const bookingForm = $("#bookingForm");

    bookingForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            bookingDate.min = getLocalDate();

            if (!bookingForm.reportValidity()) {
                return;
            }

            const name =
                $("#clientName").value.trim();

            const service =
                selectedService.value;

            const date =
                bookingDate.value;

            const time =
                bookingTime.value;

            const notes =
                $("#notes").value.trim();

            if (!name) {

                $("#clientName").setCustomValidity(
                    "Por favor, informe seu nome."
                );

                $("#clientName").reportValidity();

                return;

            }

            const preferredDate = new Date(
                `${date}T${time}:00`
            );

            if (preferredDate < new Date()) {

                bookingTime.setCustomValidity(
                    "Escolha uma data e um horário futuros."
                );

                bookingTime.reportValidity();

                return;

            }

            const formattedDate =
                date.split("-").reverse().join("/");

            let message =
                "Olá, Viviana! Tudo bem?\n\n" +
                "Gostaria de solicitar um agendamento " +
                "na Viviana Rosa Esmalteria.\n\n" +

                `Nome: ${name}\n` +
                `Serviço: ${service}\n` +
                `Data de preferência: ${formattedDate}\n` +
                `Horário de preferência: ${time}\n`;

            if (notes) {

                message +=
                    `Observações: ${notes}\n`;

            }

            message +=
                "\nPoderia confirmar a disponibilidade " +
                "e informar o valor do atendimento?";

            const url =
                `https://wa.me/${PHONE}?text=` +
                encodeURIComponent(message);

            window.location.href = url;

        }
    );

    $("#clientName").addEventListener(
        "input",
        event => {

            event.target.setCustomValidity("");

        }
    );

    [bookingDate, bookingTime].forEach(input => {

        input.addEventListener("input", () => {

            bookingTime.setCustomValidity("");

        });

    });


    /* =====================================
       15. PERGUNTAS FREQUENTES
    ===================================== */

    const faqItems = $$(".faq-list details");

    faqItems.forEach(item => {

        item.addEventListener("toggle", () => {

            if (item.open) {

                faqItems.forEach(other => {

                    if (other !== item) {
                        other.open = false;
                    }

                });

            }

        });

    });


    /* =====================================
       16. TRATAMENTO DE IMAGENS
    ===================================== */

    $$("img").forEach(image => {

        if (image.id === "lightboxImage") {
            return;
        }

        function handleImageError() {

            const fallback = `
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="800"
                     height="800"
                     viewBox="0 0 800 800">

                    <rect width="800"
                          height="800"
                          fill="#E7D5CF"/>

                    <text x="400"
                          y="380"
                          text-anchor="middle"
                          font-family="Georgia"
                          font-style="italic"
                          font-size="100"
                          fill="#702638">vr.</text>

                    <text x="400"
                          y="445"
                          text-anchor="middle"
                          font-family="Arial"
                          font-size="16"
                          letter-spacing="5"
                          fill="#702638">
                        VIVIANA ROSA
                    </text>

                </svg>
            `;

            image.src =
                "data:image/svg+xml;charset=utf-8," +
                encodeURIComponent(fallback);

        }

        image.addEventListener(
            "error",
            handleImageError,
            { once: true }
        );

        if (image.complete && image.naturalWidth === 0) {
            handleImageError();
        }

    });


    /* =====================================
       17. ANO AUTOMÁTICO
    ===================================== */

    $("#year").textContent =
        new Date().getFullYear();

});
