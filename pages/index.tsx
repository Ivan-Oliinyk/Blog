import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import client from "../contentful/index";
import {
  IMainPageFields,
  IMainPage,
  IArticleFields,
  IArticle,
} from "../contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  Container,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import Link from "next/link";

const Home = ({
  title,
  home,
  articles,
}: {
  title: String;
  home: IMainPage;
  articles: IArticle[];
}) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div
          className="text-center p-5 text-white"
          style={{
            background: `url("http:${home.fields.background?.fields.file.url}") no-repeat center / cover`,
            minHeight: "300px",
            width: "100%",
          }}
        >
          <h1 className="mt-5">{home.fields.title}</h1>
          <div className="mb-5">
            {documentToReactComponents(home.fields.descriptions!)}
          </div>
        </div>

        <Container className="pt-5">
          <Row>
            {articles.map((article) => (
              <Col sm={4} key={article.fields.slug}>
                <Card
                  className="mb-3"
                  body
                  style={{
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "grey",
                    color: "white",
                  }}
                >
                  <CardTitle tag="h3">{article.fields.title}</CardTitle>
                  <CardText>{article.fields.description}</CardText>
                  <Link href={`/articles/${article.fields.slug}`}>
                    <Button>{article.fields.action}</Button>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const home = await client.getEntries<IMainPageFields>({
    content_type: "mainPage",
    limit: 1,
  });

  const articleEntries = await client.getEntries<IArticleFields>({
    content_type: "article",
    select:
      "fields.title,fields.slug,fields.description,fields.action,fields.content",
  });

  const [homePage] = home.items;

  return {
    props: {
      title: "My blog",
      home: homePage,
      articles: articleEntries.items,
    },

    revalidate: 3600,
  };
};
