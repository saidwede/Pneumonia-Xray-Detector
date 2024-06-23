"use client"
import Image from "next/image";
import { GoChevronDown } from "react-icons/go";
import { FiUploadCloud } from "react-icons/fi";
import { Triangle } from 'react-loader-spinner';
import {useDropzone, FileRejection, DropEvent} from 'react-dropzone'
import { useCallback, useState, FormEvent } from "react";
import axios from "axios";

interface ImageFile extends File {
  preview: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false)
  const [isPneumonia, setIsPneumonia] = useState(false)
  const [image, setImage] = useState<ImageFile>();
  const [model, setModel] = useState("")

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    setSubmitted(false)
    const newImage = Object.assign(acceptedFiles[0], {
      preview: URL.createObjectURL(acceptedFiles[0])
    })
    setImage(newImage);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {'image/png': ['.png'],
'image/jpg': ['.jpg'],
'image/jpeg': ['.jpeg']}
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!image){ return}
    setSubmitted(false)
    setLoading(true)


    // À remplacer par le call API
    const formData = new FormData();
    formData.append('image', image);
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${model}`, formData)
    .then(response => {
        if(response.data.predicted_class == 'NORMAL'){
          setIsPneumonia(false)
        }else{
          setIsPneumonia(true)
        }
        setSubmitted(true)
    })
    .catch(error => {
        console.error('Error:', error);
        setSubmitted(false)
        alert("ERROR")
    }).finally(() => {
      setLoading(false)
    });
  };
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-16">
      <h1 className="text-5xl font-bold mb-6">Zoidberg App</h1>
      <form onSubmit={handleSubmit} className="bg-neutral-100 dark:bg-neutral-700 border dark:border-neutral-500 w-96 rounded-2xl p-4 grid gap-4">
        <div className="relative">
          <GoChevronDown className="absolute top-1/2 -translate-y-1/2 right-2" />
          <select value={model} onChange={handleChange} required name="" className="dark:bg-neutral-600 dark:border-neutral-500 appearance-none outline-none w-full border rounded-lg p-3 text-xs" id="">
            <option value="" disabled>- Select model -</option>
            <option value="predict-with-cnn">CNN</option>
            <option value="predict-with-knn" disabled>KNN</option>
          </select>
        </div>
        
        <label {...getRootProps()} className="dark:border-neutral-500 w-full overflow-hidden border cursor-pointer rounded-lg p-2 text-xs aspect-square relative">
          {!image && 
            <div className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <FiUploadCloud className="text-4xl" />
              <p className="text-center">Drag and drop or click to upload X-ray image.</p>
            </div>
          }
          {image &&
            <img
              src={image.preview}
              onLoad={() => { URL.revokeObjectURL(image.preview) }}
              className="w-full h-full object-cover absolute top-0 left-0"
            />
          }
          {loading &&
            <div className="w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-lg absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-30 bg-white bg-opacity-80 flex justify-center items-center">
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#000000"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          }
          <div className={`w-[350px] absolute ${isPneumonia ? 'bg-red-200' : 'bg-green-200'} text-center p-1 text-xs h-8 right-0 top-0 rotate-45 translate-x-[117px] translate-y-[42px] ${submitted ? 'flex' : 'hidden'} items-center justify-center`}>
            {isPneumonia &&
              <span className="text-red-800 font-bold">Pneumonia</span>
            }
            {!isPneumonia &&
              <span className="text-green-800 font-bold">Normal</span>
            }
          </div>
          <input {...getInputProps()} className=" opacity-0" />
        </label>
        <button type="submit" className="w-full text-sm p-3 bg-black text-white rounded-lg">Submit</button>
        
        
      </form>
    </main>
  );
}
