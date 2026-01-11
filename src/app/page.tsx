import Benefits from "@/components/landing/Benefits";
import NavBar from "@/components/landing/NavBar";
import Presentation from "@/components/landing/Presentation";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <NavBar />
      <Presentation />
      <Benefits/>
    </>
  );
}
