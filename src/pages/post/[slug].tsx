import { useCallback } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';

import { getFormattedDate } from '../../utils/formatDate';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post: NextPage<PostProps> = ({ post }) => {
  const getReadTime = useCallback(() => {
    const text = RichText.asText(post.data.content.map(data => data.body)[0]);

    return Number(text.length / 200).toFixed(0);
  }, [post]);

  return post ? (
    <>
      <Head>
        <title>spacetraveling | {post.data.title}</title>
      </Head>

      <main>
        <img
          className={styles.banner}
          src={post.data.banner.url}
          alt={post.data.title}
        />

        <header className={`${commonStyles.max__width} ${styles.post__header}`}>
          <h2>{post.data.title}</h2>
          <div className={styles.post__info}>
            <time className={commonStyles.icon__text}>
              <FiCalendar />
              {post.first_publication_date}
            </time>

            <p className={commonStyles.icon__text}>
              <FiUser />
              {post.data.author}
            </p>

            <time className={commonStyles.icon__text}>
              <FiClock />
              {getReadTime()} min
            </time>
          </div>
        </header>

        {post.data.content.map(content => (
          <section
            key={content.heading}
            className={`${commonStyles.max__width} ${styles.post__content}`}
          >
            <h2>{content.heading}</h2>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
          </section>
        ))}
      </main>
    </>
  ) : (
    <main className={commonStyles.max__width}>
      <p>Carregando...</p>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  const slugs = posts.results.map(post => ({ params: { slug: post.uid } }));

  return {
    paths: slugs,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug));

  const post: Post = {
    data: {
      title: response.data.title,
      author: response.data.author,
      banner: response.data.banner,
      content: response.data.content,
    },
    first_publication_date: getFormattedDate(response.first_publication_date),
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 1,
  };
};

export default Post;
