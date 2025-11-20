"use client";
import Image from "next/image";

import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useState } from 'react';


export default function Home() {
  return (
    <>

    <div className="container">
        <div className="flex flex-col text-right">
          <h1>An Intuitive Scouting System</h1>
          <p className="relative right-2">Built by Dawgma, Designed for FRC</p>
        </div> 
    </div>
    
    </>
   
  );
}
