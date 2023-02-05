import React, { useRef, useMemo, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";
import Compressor from "compressorjs";

function Editor({ setValue, value }) {
  const [display, setDisplay] = useState(false);
  const quillRef = useRef();

  const fileCompress = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        file: "File",
        quality: 0.6,
        maxWidth: 500,
        maxHeight: 500,
        success(file) {
          return resolve({
            sucess: true,
            file: file,
          });
        },
        error(err) {
          return resolve({
            sucess: false,
            error: err.message,
          });
        },
      });
    });
  };

  const imageHandler = async () => {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input && input.files ? input.files[0] : null;
      const compressedFile = await fileCompress(file);
      if (!compressedFile.sucess) {
        console.log(compressedFile.error);
        return;
      }
      const formData = new FormData();
      formData.append("file", compressedFile.file);
      const quillObj = quillRef.current.getEditor();
      try {
        const response = await axios.post(
          "http://localhost:5000/upload" ?? "your custom endpoint",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const range = quillObj.getSelection(true);
        quillObj.insertEmbed(range.index - 1, "image", response.data.filePath);
      } catch (error) {
        console.log(error);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisplay(!display);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["image", "link"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  return (
    <section className="flex flex-col gap-6">
      <form className="flex flex-col gap-6 mt-16" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center">Create a new post</h1>
        <ReactQuill
          theme="snow"
          ref={quillRef}
          modules={modules}
          style={{ height: "300px", marginBottom: "50px", width: "1000px" }}
          value={value}
          onChange={setValue}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md self-end"
        >
          Create Post
        </button>
      </form>
      <div className="h-96 w-[1000px] border-2 border-black overflow-y-auto">
        {display && parse(value)}
      </div>
    </section>
  );
}

export default Editor;
