import React, { useState, useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer";
import TreeView from "react-treeview";
import { fetchFolderStructure, fetchFileContent } from "./api";
import { FolderStructure } from "./types";
import "react-treeview/react-treeview.css";
import "./index.css";

const App: React.FC = () => {
  const [basePath1, setBasePath1] = useState<string>("/Users/nilesh/nilesh/source_codes/git/java/maven");
  const [basePath2, setBasePath2] = useState<string>("/Users/nilesh/nilesh/research/llm_testing/api_testing/output_dir_k");
  const [folderStructure1, setFolderStructure1] = useState<FolderStructure>({});
  const [folderStructure2, setFolderStructure2] = useState<FolderStructure>({});
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [fileContent1, setFileContent1] = useState<string>("");
  const [fileContent2, setFileContent2] = useState<string>("");

  useEffect(() => {
    fetchFolderStructure(basePath1).then(setFolderStructure1);
    fetchFolderStructure(basePath2).then(setFolderStructure2);
  }, [basePath1, basePath2]);

  const handleFileClick = async (relativePath: string) => {
    setSelectedFile(relativePath);
    try {
      const content1 = await fetchFileContent(`${basePath1}/${relativePath}`);
      const content2 = await fetchFileContent(`${basePath2}/${relativePath}`);
      setFileContent1(content1);
      setFileContent2(content2);
    } catch (error) {
      console.error("Error fetching file contents:", error);
    }
  };

  const renderTree = (node: FolderStructure, parentPath: string = ""): JSX.Element[] => {
    return Object.keys(node).map((key) => {
      const currentPath = `${parentPath}${key}/`;
      if (typeof node[key] === "object") {
        return (
          <TreeView key={currentPath} nodeLabel={key} defaultCollapsed={true}>
            {renderTree(node[key] as FolderStructure, currentPath)}
          </TreeView>
        );
      } else {
        return (
          <div
            key={currentPath}
            className="ml-4 cursor-pointer text-blue-600"
            onClick={() => handleFileClick(currentPath)}
          >
            📄 {key}
          </div>
        );
      }
    });
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-xl font-bold mb-4">Folder Diff Viewer</h1>
      <div className="flex gap-8">
        <div className="w-1/2 border p-4">
          <h2 className="text-lg font-semibold">📁 Base Path 1</h2>
          {renderTree(folderStructure1)}
        </div>
        <div className="w-1/2 border p-4">
          <h2 className="text-lg font-semibold">📁 Base Path 2</h2>
          {renderTree(folderStructure2)}
        </div>
      </div>
      {selectedFile && (
        <div className="mt-6 border p-4">
          <h2 className="text-lg font-semibold">Diff View: {selectedFile}</h2>
          <ReactDiffViewer oldValue={fileContent1} newValue={fileContent2} splitView={true} />
        </div>
      )}
    </div>
  );
};

export default App;