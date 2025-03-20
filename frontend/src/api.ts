import axios from "axios";
import { FolderStructure } from "./types";

const API_BASE = "http://localhost:6000"; // Backend URL

export const fetchFolderStructure = async (path: string): Promise<FolderStructure> => {
  const response = await axios.get(`${API_BASE}/folders`, { params: { path } });
  return response.data;
};

export const fetchFileContent = async (path: string): Promise<string> => {
  const response = await axios.get(`${API_BASE}/file`, { params: { path } });
  return response.data;
};
