import Editor from "@monaco-editor/react"

export default function({ language }) {
  language = language || "javascript"
  console.log("bruh")
  return (
    <Editor
      height='80vh'
      defaultLanguage={language}
      defaultValue="// Test Comment"
    />
  )
}


