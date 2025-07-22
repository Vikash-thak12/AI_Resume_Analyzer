import React, { useState } from 'react'
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'

const upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    const handleFileSelet = ( file: File | null) => {
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
                                    <FileUploader onFileSelect={handleFileSelet} />
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

export default upload
