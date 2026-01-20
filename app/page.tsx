"use client";
import { useEffect } from "react";
import Home from "./components/Home";
import xitoy from "./jsons/arab.json"

export default function Page() {
  useEffect(() => {
    xitoy.videos.map((oi, index) => {
      console.log(index + " " + "https://sevenedu-bucet.s3.eu-north-1.amazonaws.com/" + encodeURIComponent(oi.key));
      console.log(index);

    })

    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div>
      <Home />
    </div>
  );
}
