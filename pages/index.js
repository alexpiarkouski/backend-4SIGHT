import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [articleInput, setArticleInput] = useState("");
  const [result, setResult] = useState();
  const [showIframe, setShowIframe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ article: articleInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setArticleInput("");
      setShowIframe(true);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClick = () => {
    const file = new Blob([result], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "notes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.body}>
      <Head>
        <title>4SIGHT Demo</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main} style={{ paddingTop: "0px", marginTop: "0px" }}>
        <img src="/menubar.png" style={{ width: "100%" }} />
        <h3 style={{ marginBottom: "16px" }}>Declutter. Visualize. Comprehend.</h3>
        <form onSubmit={onSubmit}>
          <input
            name="article"
            placeholder="Enter an article"
            value={articleInput}
            onChange={(e) => setArticleInput(e.target.value)}
          // style={{width: "500px"}}
          />
          <br />
          <input type="submit" value="Generate summary" />
        </form>
        {isLoading ? (
          <div>Loading...</div>
        ) : showIframe ? (
          <>
            <textarea value={result} style={{ marginTop: "16px" }} readOnly rows={10} cols={150}></textarea>
            <iframe src="http://localhost:5175" style={{ marginTop: "16px" }} width="100%" height="500"></iframe>
            <button
              style={{
                padding: "12px 0",
                color: "#fff",
                backgroundColor: "#10a37f",
                border: "none",
                borderRadius: "4px",
                textAlign: "center",
                cursor: "pointer",
                height: "48px",
                fontSize: "16px",
                width: "200px",
                margin: "16px",
              }}
              onClick={handleClick}
            >
              Export Notes
            </button>
          </>
        ) : null}
      </main>
    </div>
  );
}
