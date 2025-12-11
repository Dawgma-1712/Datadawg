"use client";

import { useState, useEffect, useRef } from "react";
import { HotTable } from "@handsontable/react";
import "handsontable/styles/handsontable.min.css";         // base styles
import "handsontable/styles/ht-theme-main.css";   

import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";

import { db } from "../firebaseConfig";

// error in columns, data do not match up with csv string

// below contains 27 values
// 1712,67,0,4,5,6,7,1,3,2,1,0,2,3,4,5,8,1,9,0,1,0,1,0,1,1,notes entry here thing,Name  

// below contains 28 columns
const columns = [
  "Team",
  "Match #",
  "Leave",
  "Coral L1",
  "Coral L2",
  "Coral L3",
  "Coral L4",
  "Barge",
  "Processor",
  "De-reef",
  "Defense",
  "Play Defense",
  "Was Defended",
  "Coral L1",
  "Coral L2",
  "Coral L3",
  "Coral L4",
  "Barge",
  "Processor",
  "De-Reef",
  "Shallow",
  "Park",
  "Deep",
  "Penalty",
  "Dead Bot",
  "Alliance",
  "Additional Notes",
  "Scout Name"
];

// Calculate Column Length
const calculateColWidths = (data: string[][]) => {
  return columns.map((col, colIndex) => {
    let maxLength = col.length;  
    data.forEach((row) => {
      const cell = row[colIndex] || "";
      if (cell.length > maxLength) maxLength = cell.length;
    });
    return maxLength * 12 + 2; 
  });
};

export default function Page() {
  const [data, setData] = useState<string[][]>([]);
  const hotRef = useRef<any>(null);

  // Load firebase data 
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "scans"));
      const rows: string[][] = [];
      snapshot.forEach((doc) => {
        const row = columns.map((col) => doc.data()[col] || "");
        rows.push(row);
      });

      rows.push(Array(columns.length).fill("")); // extra empty row
      setData(rows);
    };
    fetchData();
  }, []);

  // Handle data entry
  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (!pasted.includes(",")) return;
    e.preventDefault();

    const rowValues = pasted
      .split(",")
      .map((v) => v.trim()) 
      .filter((v, i, arr) => !(i === arr.length - 1 && v === ""));  

    const hotInstance = hotRef.current?.hotInstance;
    if (!hotInstance) return;

 
    const selected = hotInstance.getSelected();
    let targetRow = 0;
    if (selected && selected.length > 0) targetRow = selected[0][0];

  
    setData((prev) => {
      const newData = [...prev];

      columns.forEach((col, i) => {
        if (i < rowValues.length) newData[targetRow][i] = rowValues[i];
      });

      
      if (targetRow === newData.length - 1) {
        newData.push(Array(columns.length).fill(""));
      }

      return newData;
    });

    try {
      
      const rowDoc = columns.reduce((acc, col, i) => {
        acc[col] = rowValues[i] || "";
        return acc;
      }, {} as Record<string, string>);

      
      const team = rowDoc["Team"] || "unknownTeam";
      const matchNum = rowDoc["Match #"] || "unknownMatch";
      const scoutName = rowDoc["Scout Name"] || "unknownScout";
  
      const now = new Date();
      const timestamp = now.toISOString().replace(/[-:.]/g, "").slice(0, 15);
  
      const customId = `${team}_${matchNum}_${scoutName}_${timestamp}`;
  
      await setDoc(doc(db, "scans", customId), rowDoc);
    } catch (err) {
      console.error("Failed to save row", err);
    }
  
    setTimeout(() => {
      hotInstance.selectCell(targetRow + 1, 0);
    }, 50);
  };


  return (
    <div className="container" onPaste={handlePaste}>
      <HotTable
        ref={hotRef}
        data={data}
        colHeaders={columns}
        rowHeaders
        width="100%"
        height="85vh"
        autoWrapRow
        autoWrapCol
        licenseKey="non-commercial-and-evaluation"
        stretchH="none"
        themeName="ht-theme-main-dark"
        colWidths={calculateColWidths(data)} 
      />
    </div>
  );
}
