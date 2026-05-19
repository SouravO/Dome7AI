import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "../../ProfileDropdown";
import { LanguageSwitcher } from "../../GoogleTranslate";
import { KUJIALE_ACCOUNT_ADMIN_URL } from "../../../constants/kujialeLinks";
import { useAuth } from "../../../context/useAuth";
import { scrollToTarget } from "../../../lib/lenis";

export const StaggeredMenu = ({
  position = "right",
  colors = ["#B19EEF", "#5227FF"],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = "/logo.svg",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#fff",
  changeMenuColorOnOpen = true,
  isFixed = false,
  accentColor = "#5227FF",
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const iconRef = useRef(null);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef(null);

  const offscreenValue = position === "left" ? -100 : 100;


  const { user, signOut } = useAuth();
  const isLoggedIn = Boolean(user);
  const navigate = useNavigate();

  const AUTH_MENU_LINKS = [
    { label: "My Projects", link: "/my-projects", ariaLabel: "My projects" },
    { label: "My Account", link: "/my-account", ariaLabel: "My account" },
    {
      label: "Account management",
      href: KUJIALE_ACCOUNT_ADMIN_URL,
      external: true,
      ariaLabel: "Open Kujiale account management in a new tab",
    },
  ];

  // Handle scroll to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const icon = iconRef.current;

      if (!panel || !icon) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll(".sm-prelayer"));
      }
      preLayerElsRef.current = preLayers;

      gsap.set([panel, ...preLayers], { xPercent: offscreenValue });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });

      if (toggleBtnRef.current)
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position, offscreenValue]);

  const resetPanelElements = useCallback((panel) => {
    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ["--sm-num-opacity"]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
  }, []);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    );
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = layers.map((el) => ({
      el,
      start: Number(gsap.getProperty(el, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    resetPanelElements(panel);

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        i * 0.07
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            ["--sm-num-opacity"]: 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: 0.5, ease: "power2.out" },
          socialsStart
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => gsap.set(socialLinks, { clearProps: "opacity" }),
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [resetPanelElements]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreenValue,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        resetPanelElements(panel);
        busyRef.current = false;
      },
    });
  }, [offscreenValue, resetPanelElements]);

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power3.inOut" } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      // Don't animate color on mobile - let CSS handle it
      if (changeMenuColorOnOpen && window.innerWidth >= 768) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current && window.innerWidth >= 768) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current
          ? openMenuButtonColor
          : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;

    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [
    playOpen,
    playClose,
    animateIcon,
    animateColor,
    animateText,
    onMenuOpen,
    onMenuClose,
  ]);

  const handleSignOut = async () => {
    await signOut();
    if (openRef.current) {
      toggleMenu();
    }
    navigate("/login");
  };

  const processedColors = React.useMemo(() => {
    const raw = colors?.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"];
    let arr = [...raw];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }
    return arr;
  }, [colors]);

  return (
    <div
      className={`z-40 ${
        isFixed
          ? open
            ? "fixed inset-0 w-screen h-screen overflow-hidden pointer-events-auto"
            : "fixed top-0 left-0 right-0 pointer-events-none"
          : "w-full h-full"
      }`}
    >
      <div
        className={`${className || ""} relative w-full h-full`}
        style={accentColor ? { ["--sm-accent"]: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className={`absolute top-0 ${
            position === "left" ? "left-0" : "right-0"
          } bottom-0 pointer-events-none z-5`}
          aria-hidden="true"
        >
          {processedColors.map((c, i) => (
            <div
              key={i}
              className="sm-prelayer absolute top-0 right-0 h-full w-full"
              style={{ background: c }}
            />
          ))}
        </div>

        <header
          className={`absolute top-0 left-0 w-full flex items-center justify-between p-3 sm:p-4 md:p-5 pointer-events-none z-20 bg-black transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
          aria-label="Main navigation header"
        >
          {/* Left - Logo */}
          <div
            className="flex items-center select-none pointer-events-auto "
            aria-label="Logo"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="block h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain cursor-pointer"
                draggable={false}
                onClick={() => {
                  const homeElement = document.getElementById("home");
                  if (homeElement) {
                    scrollToTarget(homeElement);
                  } else {
                    navigate('/');
                  }
                }}
              />
            ) : (
              <h1 className="text-black text-lg sm:text-xl md:text-2xl font-bold">
                Dome7Ai
              </h1>
            )}
          </div>

          {/* Right - Language, Profile Dropdown and Menu Button */}
          <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto">
            <LanguageSwitcher />
            {/* Desktop Navigation - Shown on lg and above */}
            <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
              {items?.length ? (
                items.filter(it => !(isLoggedIn && it.label === 'Login')).map((it, idx) => (
                  <a
                    key={it.label + idx}
                    className="text-white font-medium text-sm sm:text-base hover:text-gray-300 transition-colors border-b border-transparent hover:border-white"
                    href={it.link}
                    aria-label={it.ariaLabel}
                    onClick={(e) => {
                      e.preventDefault();
                      if (it.link.startsWith("#")) {
                        const element = document.getElementById(it.link.substring(1));
                        if (element) scrollToTarget(element);
                      } else {
                        navigate(it.link);
                      }
                      // Close the menu if it's open (though it shouldn't be visible on desktop)
                      if (open) {
                        toggleMenu();
                      }
                    }}
                  >
                    {it.label}
                  </a>
                ))
              ) : null}
            </nav>

            {isLoggedIn && (
              <div className="hidden lg:block">
                <ProfileDropdown variant="header" />
              </div>
            )}

            {/* Mobile Menu Button - Hidden on large screens only */}
            <button
              ref={toggleBtnRef}
              className={`relative inline-flex items-center justify-center w-10 h-10 bg-transparent border-0 cursor-pointer pointer-events-auto focus-visible:outline-2 focus-visible:outline-offset-4 rounded lg:hidden z-50 ${
                open ? 'text-black focus-visible:outline-black' : 'text-white focus-visible:outline-white/70'
              }`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="staggered-menu-panel"
              onClick={toggleMenu}
              type="button"
            >
              <span
                ref={iconRef}
                className="relative w-6 h-5 flex flex-col justify-between"
                aria-hidden="true"
              >
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                    open ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                    open ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                    open ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'
                  }`}
                />
              </span>
            </button>

            {/* Desktop Menu Button - Shown on lg and above */}
            <button
              className="hidden lg:block bg-gradient-to-r from-[#f516ff] to-[#31b5f9] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
              onClick={() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) scrollToTarget(contactSection);
              }}
            >
              Contact Us
            </button>
          </div>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className={`absolute top-0 ${
            position === "left" ? "left-0" : "right-0"
          } h-full bg-white flex flex-col pt-24 pb-8 px-8 sm:px-12 md:px-16 overflow-y-auto z-10 backdrop-blur-xl w-full sm:w-[420px] lg:w-[clamp(260px,38vw,420px)]`}
          aria-hidden={!open}
        >
          <div className="flex-1 flex flex-col gap-5">
            <ul
              className="list-none m-0 p-0 flex flex-col gap-2"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items?.length ? (
                items.filter(it => !(isLoggedIn && it.label === 'Login')).map((it, idx) => (
                  <li
                    className="relative overflow-hidden leading-none mb-2 border-b border-gray-300 pb-2"
                    key={it.label + idx}
                  >
                    <a
                      className="sm-panel-item relative text-black font-semibold text-2xl sm:text-3xl md:text-[2rem] cursor-pointer leading-none tracking-tight uppercase transition-colors duration-150 inline-block no-underline pr-[1.4em] hover:text-gray-700"
                      href={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      onClick={(e) => {
                        if (it.link.startsWith("#")) {
                          e.preventDefault();
                          const element = document.getElementById(
                            it.link.substring(1)
                          );
                          if (element) scrollToTarget(element);
                        } else if (it.isRoute || it.link.startsWith("/")) {
                          e.preventDefault();
                          navigate(it.link);
                        }
                        toggleMenu();
                      }}
                    >
                      <span className="sm-panel-itemLabel inline-block origin-[50%_100%]">
                        {it.label}
                      </span>
                    </a>
                  </li>
                ))
              ) : (
                <li
                  className="relative overflow-hidden leading-none"
                  aria-hidden="true"
                >
                  <span className="relative text-black font-semibold text-4xl cursor-pointer leading-none tracking-tighter uppercase inline-block no-underline">
                    <span className="inline-block origin-[50%_100%]">
                      No items
                    </span>
                  </span>
                </li>
              )}
            </ul>

            {isLoggedIn && (
              <div
                className="flex flex-col gap-2 mb-4 pb-6 border-b border-gray-300"
                aria-label="Account"
              >
                <p className="text-sm text-gray-500 m-0">Logged in as</p>
                <p className="text-base font-semibold text-black truncate m-0 mb-2">
                  {user?.email}
                </p>
                {AUTH_MENU_LINKS.map((item) => (
                  <button
                    key={item.link || item.href}
                    type="button"
                    className="text-left text-black font-semibold text-xl sm:text-2xl uppercase tracking-tight hover:text-gray-700 transition-colors py-1"
                    onClick={() => {
                      if (item.external && item.href) {
                        window.open(item.href, "_blank", "noopener,noreferrer");
                      } else if (item.link) {
                        navigate(item.link);
                      }
                      toggleMenu();
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-left text-red-600 font-semibold text-xl sm:text-2xl uppercase tracking-tight hover:text-red-800 transition-colors py-1 mt-1"
                >
                  Sign Out
                </button>
              </div>
            )}

            {displaySocials && socialItems?.length > 0 && (
              <div
                className="mt-auto pt-8 flex flex-col gap-3"
                aria-label="Social links"
              >
                <h3
                  className="m-0 text-base font-medium"
                  style={{ color: "var(--sm-accent, #ff0000)" }}
                >
                  Socials
                </h3>
                <ul
                  className="list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                  role="list"
                >
                  {socialItems.map((s, i) => (
                    <li key={s.label + i}>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link text-lg sm:text-xl font-medium text-[#111] no-underline relative inline-block py-0.5 transition-all duration-300 hover:text-black focus-visible:outline-2 focus-visible:outline-[var(--sm-accent,#ff0000)] focus-visible:outline-offset-3"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
.sm-prelayer { transform: translateX(0); }
.sm-panel-item { will-change: transform; }
.sm-panel-itemLabel { will-change: transform; }
.sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-panel-list[data-numbering] .sm-panel-item::after { 
  counter-increment: smItem; 
  content: counter(smItem, decimal-leading-zero); 
  position: absolute; 
  top: 0.1em; 
  right: 3.2em; 
  font-size: 18px; 
  font-weight: 400; 
  color: var(--sm-accent, #ff0000); 
  letter-spacing: 0; 
  pointer-events: none; 
  user-select: none; 
  opacity: var(--sm-num-opacity, 0); 
}
.sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
