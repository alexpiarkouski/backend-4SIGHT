import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [articleInput, setArticleInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
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
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div >
      <Head>
        <title>4SIGHT Demo</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main} style={{ paddingTop: "0px", marginTop: "0px" }}>
        <img src="/menubar.png" style={{width: "100%"}}/>
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
        {/* <div className={styles.result}>{result}</div> */}
        <textarea value={result} style={{ marginTop: "16px" }} readOnly rows={10} cols={150}></textarea>
      </main>
    </div>
  );
}
