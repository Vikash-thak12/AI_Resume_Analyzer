import { prepareInstructions } from '../../constants';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';

interface resumeProps {
    companyName: string,
    jobTitle: string,
    jobDescription: string,
    file: File
}

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null)


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        // console.log(file)

        if (!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file })
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: resumeProps) => {
        setIsProcessing(true);
        setStatusText("Uploading the file...");
        const uploadedFile = await fs.upload([file]);

        if (!uploadedFile) return setStatusText("Error: Failed to upload the file..");

        setStatusText("Converting the pdf into image...");
        const imageFile = await convertPdfToImage(file);   // this will return three things: imageUrl,file,error
        if (!imageFile.file) return setStatusText("Failed to convert PDF to Image..");

        // uploading the image 
        setStatusText("Uploading the image...");
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText("Failed to upload the image...");


        setStatusText("Preparing Data...");


        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile?.path,
            imagePath: uploadedImage?.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data)); // stroing in putter in key value pair 
        setStatusText("Analyzing the resume...")

        const feedback = await ai.feedback(uploadedFile.path, prepareInstructions({ jobTitle, jobDescription}));
        // console.log("AI Feedback:", feedback);

        if (!feedback || !feedback.message?.content) {
            setStatusText("Failed to get feedback from AI");
            return;
        }

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;
        console.log("FeedBackText: ", feedbackText)
        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data))
        setStatusText("Completed, redirecting you to another page....")
        console.log("Data", data)
        navigate(`/resume/${uuid}`)
    }

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section">
                <div className='page-heading'>
                    <h1 className="text-2xl bg-green-500">Smart feedback for your dream Job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" alt="Resume" className='w-full' />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS Score and improvent Tips..</h2>
                    )}
                    {
                        !isProcessing && (
                            <form id='upload-form' className='flex flex-col gap-4 mt-4' onSubmit={handleSubmit}>
                                <div className='form-div'>
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name='company-name' placeholder='Company Name' id='company-name' />
                                </div>

                                <div className='form-div'>
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name='job-title' placeholder='Job Title' id='job-title' />
                                </div>

                                <div className='form-div'>
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea rows={4} name='job-description' placeholder='Job Description' id='job-description' />
                                </div>

                                <div className='form-div'>
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <button className='primary-button' type='submit'>
                                    Analyzer Resume
                                </button>
                            </form>
                        )
                    }
                </div>
            </section>
        </main>

    )
}

export default Upload
