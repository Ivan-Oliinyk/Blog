import Head from "next/head";
import React, { Fragment } from "react";
import { Container } from "reactstrap";
import { IArticle, IArticleFields } from "../../contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { GetStaticPaths, GetStaticProps } from "next";
import client from "../../contentful/index";

const Article = ({ article }: { article: IArticle }) => {
  console.log("article ===>", article);

  return (
    <Fragment>
      <Head>
        <title>{article.fields.title}</title>
      </Head>
      <Container>
        <h1 className="py-3">{article.fields.title}</h1>
        <div className="py-2">
          {documentToReactComponents(article.fields.content!)}
        </div>
      </Container>
    </Fragment>
  );
};

export default Article;

export const getStaticPaths: GetStaticPaths = async (params) => {
  const articleEntries = await client.getEntries<IArticleFields>({
    content_type: "article",
    select: "fields.slug",
  });

  return {
    paths: articleEntries.items.map((item) => {
      return {
        params: {
          article: item.fields.slug,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params!.article;

  const articleEntries = await client.getEntries<IArticleFields>({
    content_type: "article",
    select: "fields.slug,fields.content",
    limit: 1,
    "fields.slug": slug,
  });

  const [article] = articleEntries.items;

  return {
    props: {
      article,
    },
  };
};
