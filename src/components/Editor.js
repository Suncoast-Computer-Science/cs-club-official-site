import MonacoEditor from 'react-monaco-editor';
import Editor from "@monaco-editor/react"

export default function({ language, value, setUserCode }) {
  language = language || "python"
  return (
    <MonacoEditor
      width="100%"
      height="600"
      theme="vs-dark"
      language={language}
      value={value}
      onChange={(e) => setUserCode(e)}
    />
  )
}


