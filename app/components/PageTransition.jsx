"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import Logo from "./logo";

const PageTransition = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef(null);
  const logoOverlayRef = useRef(null);
  const logoRef = useRef(null);
  const blocksRef = useRef([]);
  const isTransitioning = useRef(false);

  useEffect(() => {
    // Correctly initialize blocks
    if (overlayRef.current) {
      overlayRef.current.innerHTML = "";
      blocksRef.current = [];
      for (let i = 0; i < 10; i++) {
        const block = document.createElement("div");
        block.className = "block";
        overlayRef.current.appendChild(block);
        blocksRef.current.push(block);
      }
      gsap.set(blocksRef.current, { scaleX: 0, transformOrigin: "left" });
    }

    if (logoRef.current) {
      const paths = logoRef.current.querySelectorAll("path");
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent",
        });
      });
    }

    revealPage();

    const handleLinkClick = (e) => {
      const href = e.currentTarget.href;
      const url = new URL(href).pathname;

      if (url === pathname) {
        e.preventDefault();
        return;
      }

      if (isTransitioning.current) {
        e.preventDefault();
        return;
      }
      
      e.preventDefault();
      isTransitioning.current = true;
      coverPage(url);
    };

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [router, pathname]);

  const coverPage = (url) => {
    const tl = gsap.timeline({
      onComplete: () => {
        router.push(url);
      },
    });

    const paths = logoRef.current.querySelectorAll("path");

    tl.to(blocksRef.current, {
      scaleX: 1,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "left",
    })
      .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
      .set(
        paths,
        {
          strokeDashoffset: (i, target) => target.getTotalLength(),
          fill: "transparent",
        },
        "-=0.2"
      )
      .to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
        },
        "-=0.5"
      )
      .to(
        paths,
        {
          fill: "#fff",
          duration: 1,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(logoOverlayRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.out",
      });
  };

  const revealPage = () => {
    if (blocksRef.current.length === 0) return; 

    gsap.set(blocksRef.current, { scaleX: 1, transformOrigin: "right" });

    gsap.to(blocksRef.current, {
      scaleX: 0,
      duration: 0.4,
      stagger: 0.02,
      ease: "power2.out",
      transformOrigin: "right",
      onComplete: () => {
        isTransitioning.current = false;
      },
    });
  };

  return (
    <>
      <div ref={overlayRef} className="transition-overlay"></div>
      <div ref={logoOverlayRef} className="logo-overlay">
        <div className="logo-container">
          <Logo ref={logoRef} />
        </div>
      </div>
      {children}
    </>
  );
};

export default PageTransition;