import Head from "next/head";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import bootflat from "bootflat/bootflat/css/bootflat.min.css";
import app from "./styles.css";

export default () => (
  <div>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <meta charSet="utf-8" />
      <title>Duelour</title>
      <link rel="icon" type="image/png" href="/static/boxing-icon.png" />
      <link
        href="https://fonts.googleapis.com/css?family=PT+Sans:400,700"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
    </Head>
    <style dangerouslySetInnerHTML={{ __html: bootstrap }} />
    <style dangerouslySetInnerHTML={{ __html: bootflat }} />
    <style dangerouslySetInnerHTML={{ __html: app }} />
  </div>
);
