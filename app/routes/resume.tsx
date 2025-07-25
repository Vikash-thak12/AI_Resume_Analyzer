import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router'
import ATS from '~/components/ATS';
import Details from '~/components/Details';
import Summary from '~/components/Summary';
import { usePuterStore } from '~/lib/puter';

export const meta = () => ([
    { title: "Resume | Review" },
    { name: "description", content: "Detailed overview of the Resume" }
])

const Resume = () => {

    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`)
    }, [isLoading])

    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) return;
            const data = JSON.parse(resume);
            console.log("Data: ", data)

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);


            const imageBlob = await fs.read(data.imagePath)
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({ resumeUrl, imageUrl, feedback })
        }
        loadResume();
    }, [id])

    return (
        <main className='!mt-0'>
            <nav className='resume-nav'>
                <Link to={"/"} className='back-button'>
                    <img src="/icons/back.svg" alt="Back SVG" className='w-4 h-4' />
                    <span className='font-semibold'>Back to Homepage</span>
                </Link>
            </nav>
            <div className='flex flex-row w-full max-lg:flex-col-reverse'>
                <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    {
                        imageUrl && resumeUrl && (
                            <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit'>
                                <a>
                                    <img src={imageUrl} alt="Image" className='w-full h-full object-contain rounded-2xl' />
                                </a>
                            </div>
                        )
                    }
                </section>
                <section className='feedback-section'>
                    <h2 className='text-4xl font-bold !text-black'>Resume Review</h2>
                    {
                        feedback ? (
                            <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                <Details feedback={feedback} />
                            </div>
                        ) : (
                            <img src="/images/resume-scan-2.gif" alt="Resume" className='w-full' />
                        )
                    }
                </section>
            </div>
        </main>
    )
}

export default Resume
