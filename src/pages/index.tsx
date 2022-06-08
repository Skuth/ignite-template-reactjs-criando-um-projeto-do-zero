import { useState, useCallback } from 'react';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import { getFormattedDate } from '../utils/formatDate';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFormattedPost = (response: any): Post[] => {
  const data: Post[] = (response?.results || []).map(post => ({
    uid: post.uid,
    data: {
      title: post.data.title || '',
      subtitle: post.data.subtitle || '',
      author: post.data.author || '',
    },
    first_publication_date: post.first_publication_date,
  }));

  return data;
};

const Home: NextPage<HomeProps> = ({ postsPagination }) => {
  const [posts, setPosts] = useState<Post[]>(() => postsPagination.results);
  const [hasNextPage, setNextPage] = useState<boolean>(
    () => !!postsPagination.next_page
  );

  const getNextPage = useCallback(() => {
    fetch(String(postsPagination.next_page))
      .then(res => res.json())
      .then(res => {
        setPosts(state => [...state, ...getFormattedPost(res)]);
        setNextPage(!!res?.next_page);
      });
  }, [postsPagination.next_page]);

  return (
    <main className={`${styles.posts__container} ${commonStyles.max__width}`}>
      {posts.map(post => (
        <Link href={`/post/${post.uid}`} passHref key={post.uid}>
          <a>
            <article className={styles.post__card}>
              <h2 className={commonStyles.title}>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div>
                <time className={commonStyles.icon__text}>
                  <FiCalendar />
                  {getFormattedDate(post.first_publication_date)}
                </time>
                <p className={commonStyles.icon__text}>
                  <FiUser />
                  {post.data.author}
                </p>
              </div>
            </article>
          </a>
        </Link>
      ))}

      {hasNextPage ? (
        <button
          type="button"
          className={styles.load__more}
          onClick={() => getNextPage()}
        >
          Carregar mais posts
        </button>
      ) : null}
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient({});

  const response = await client.getByType('posts');

  const posts: Post[] = getFormattedPost(response);

  const postsPagination: PostPagination = {
    results: posts,
    next_page: response.next_page,
  };

  return {
    props: {
      postsPagination,
    },
  };
};

export default Home;
