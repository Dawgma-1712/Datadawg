"use client";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav-logo">
        <Link href="/">Watchdawg</Link>
      </div>

      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <FontAwesomeIcon icon={faBars} />
      </button>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link href="/insights" onClick={closeMenu}>Insights</Link>
        <Link href="/scouting" onClick={closeMenu}>Scouting</Link>
        <Link href="/collecting" onClick={closeMenu}>Collecting</Link>
      </div>

     
    </nav>
  );
};

export default Nav;