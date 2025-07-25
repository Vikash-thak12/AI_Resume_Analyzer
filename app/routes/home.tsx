import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants/index";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {

    const { auth} = usePuterStore();
    const navigate = useNavigate(); 

    useEffect(() => {
          const fetchUser = async () => {
      try {
        const user = await window.puter.auth.getUser();
        console.log("Current User:", user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
    },[])


    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/')
    },[auth.isAuthenticated])


  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading">
        <h1>Track Your Applications & Resume Rating</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>

      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume: Resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))
          }
        </div>
      )
      }
    </section>


  </main>
}
