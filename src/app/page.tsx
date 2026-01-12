import Benefits from "@/components/landing/Benefits";
import NavBar from "@/components/landing/NavBar";
import Presentation from "@/components/landing/Presentation";
import { Pricing } from "@/components/landing/Pricing";
import { Role } from "@/components/landing/Role";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <NavBar />
      <Presentation />
      <Benefits />
      <Role />
      <Pricing/>
    </>
  );
}
