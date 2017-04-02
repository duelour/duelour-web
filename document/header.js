import Head from 'next/head';

export default () => (
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
      <meta charSet="utf-8"/>
      <title>Duelour</title>
      <link rel="icon" type="image/png" href="/static/boxing-icon.png"/>
      <link href="https://fonts.googleapis.com/css?family=PT+Sans:400,700" rel="stylesheet"/>
    </Head>
    <style jsx global>{`
      html, body, #__next, #__next > div {
        height: 100%;
        width: 100%;
      }
      body {
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased !important;
        font-family: "PT Sans", Helvetica, Arial, sans-serif !important;
      }
      * {
        box-sizing: border-box;
      }
    `}</style>
  </div>
);
