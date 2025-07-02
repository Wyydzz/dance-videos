import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useEffect, useState } from "react";
import PasswordGate from "@/components/passwordgate";

export default function App({ Component, pageProps }: AppProps) {

  // acces mot de passe
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    // accès mot de passe
    const access = localStorage.getItem("accessGranted");
    if (access === "true") {
      setAuthorized(true);
    }
  })

  if (!authorized) {
    return <PasswordGate onAccess={() => setAuthorized(true)} />;
  }

  return <Component {...pageProps} />
  
}
