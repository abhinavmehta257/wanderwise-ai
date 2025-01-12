import Head from "next/head";
import NavBar from "./components/ui/NavBar";
import { Footer } from "./components/ui/Footer";


export default function Home() {

  return (
    <>
      <Head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9744648621612550"
      crossorigin="anonymous"></script>
      <meta name="google-adsense-account" content="ca-pub-9744648621612550"></meta>
      </Head>
      <NavBar/>
      <div className="px-[24px] bg-[white] h-full">
          
      </div>
      <Footer/>
    </>
  );
}
