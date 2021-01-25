import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
          <script
            type="module"
            src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js"
          ></script>
          <script
            noModule
            src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
